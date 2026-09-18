/* ============================================================
   MacDo Mami — formulaires réservation, événements, traiteur
   Chaque formulaire génère un message WhatsApp formaté.
   ============================================================ */

function fmtDateFR(iso) {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function fmtTimeFR(t) {
  if (!t) return "";
  const [h, m] = t.split(":");
  return `${h} h ${m}`;
}

/* ---------- Réservation de table ---------- */
function setupReservation() {
  const f = document.getElementById("reserveForm");
  if (!f) return;
  const today = new Date().toISOString().slice(0, 10);
  const d = f.elements.rdate;
  if (d) { d.min = today; if (!d.value) d.value = today; }

  f.addEventListener("submit", (e) => {
    e.preventDefault();
    const el = f.elements;
    const nom = el.rname.value.trim();
    const tel = el.rphone.value.trim();
    if (!nom) { el.rname.focus(); showToast("Indiquez votre nom."); return; }
    if (!tel) { el.rphone.focus(); showToast("Indiquez votre téléphone."); return; }
    if (!el.rdate.value) { showToast("Choisissez une date."); return; }
    if (!el.rtime.value) { showToast("Choisissez une heure."); return; }
    if (!el.rpeople.value) { showToast("Indiquez le nombre de personnes."); return; }

    const m = [
      "*NOUVELLE DEMANDE DE RÉSERVATION — MacDo Mami*",
      "",
      `*Nom :* ${nom}`,
      `*Téléphone :* ${tel}`,
      `*Date :* ${fmtDateFR(el.rdate.value)}`,
      `*Heure :* ${fmtTimeFR(el.rtime.value)}`,
      `*Personnes :* ${el.rpeople.value}`,
    ];
    if (el.rspace.value) m.push(`*Espace :* ${el.rspace.value}`);
    if (el.rnote.value.trim()) m.push(`*Demande :* ${el.rnote.value.trim()}`);
    m.push("", "Merci de confirmer la disponibilité.", CONFIG.url);
    ouvrirWhatsApp(m.join("\n"));
    f.reset();
    showToast("Demande envoyée. Mami vous confirme sur WhatsApp.");
  });
}

/* ---------- Événements ---------- */
function setupEvenements() {
  const f = document.getElementById("eventForm");
  if (!f) return;
  const today = new Date().toISOString().slice(0, 10);
  const d = f.elements.edate;
  if (d) { d.min = today; }

  f.addEventListener("submit", (e) => {
    e.preventDefault();
    const el = f.elements;
    const nom = el.enom.value.trim();
    const tel = el.etel.value.trim();
    if (!nom) { el.enom.focus(); showToast("Indiquez votre nom."); return; }
    if (!tel) { el.etel.focus(); showToast("Indiquez votre téléphone."); return; }
    if (!el.etype.value) { showToast("Choisissez le type d'événement."); return; }

    const m = [
      "*DEMANDE D'ÉVÉNEMENT — MacDo Mami*",
      "",
      `*Type :* ${el.etype.value}`,
    ];
    if (el.edate.value) m.push(`*Date :* ${fmtDateFR(el.edate.value)}`);
    if (el.einvites.value) m.push(`*Invités :* ${el.einvites.value}`);
    m.push(`*Nom :* ${nom}`, `*Téléphone :* ${tel}`);
    if (el.enote.value.trim()) m.push(`*Message :* ${el.enote.value.trim()}`);
    m.push("", "Merci de confirmer la disponibilité.", CONFIG.url);
    ouvrirWhatsApp(m.join("\n"));
    f.reset();
    showToast("Demande envoyée sur WhatsApp.");
  });
}

/* ---------- Traiteur / Devis ---------- */
function setupTraiteur() {
  const f = document.getElementById("traiteurForm");
  if (!f) return;
  const today = new Date().toISOString().slice(0, 10);
  const d = f.elements.tdate;
  if (d) { d.min = today; }

  f.addEventListener("submit", (e) => {
    e.preventDefault();
    const el = f.elements;
    const nom = el.tnom.value.trim();
    const tel = el.ttel.value.trim();
    if (!nom) { el.tnom.focus(); showToast("Indiquez votre nom."); return; }
    if (!tel) { el.ttel.focus(); showToast("Indiquez votre téléphone."); return; }
    if (!el.ttype.value) { showToast("Choisissez le type d'événement."); return; }

    const m = [
      "*DEMANDE DE DEVIS TRAITEUR — MacDo Mami*",
      "",
      `*Type d'événement :* ${el.ttype.value}`,
    ];
    if (el.tinvites.value) m.push(`*Nombre d'invités :* ${el.tinvites.value}`);
    if (el.tdate.value) m.push(`*Date :* ${fmtDateFR(el.tdate.value)}`);
    if (el.tbudget.value.trim()) m.push(`*Budget :* ${el.tbudget.value.trim()}`);
    if (el.tplats.value.trim()) m.push(`*Plats souhaités :* ${el.tplats.value.trim()}`);
    m.push(`*Nom :* ${nom}`, `*Téléphone :* ${tel}`);
    if (el.tnote.value.trim()) m.push(`*Remarques :* ${el.tnote.value.trim()}`);
    m.push("", "Merci de nous envoyer votre devis.", CONFIG.url);
    ouvrirWhatsApp(m.join("\n"));
    f.reset();
    showToast("Demande de devis envoyée sur WhatsApp.");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupReservation();
  setupEvenements();
  setupTraiteur();
});
