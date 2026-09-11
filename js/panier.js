/* ============================================================
   MacDo Mami — page Panier : quantités, totaux, livraison, GPS,
   confirmation et envoi WhatsApp
   ============================================================ */
let activePromo = null;
let currentOrder = null;
let orderGeo = null; // { lat, lng } si le client partage sa position

const $ = (id) => document.getElementById(id);

function currentZone() {
  const sel = $("zoneSelect");
  return CONFIG.zones.find((z) => String(z.fee) === sel.value) || CONFIG.zones[0];
}

function currentDeliveryFee() {
  return $("orderMode").value === "delivery" ? currentZone().fee : 0;
}

function promoInfo() {
  if (!activePromo) return null;
  const p = CONFIG.promo[activePromo];
  return p ? { code: activePromo, ...p } : null;
}

function getTotals() {
  const subtotal = round2(cartSubtotal());
  const fee = currentDeliveryFee();
  const promo = promoInfo();
  const discount = promo ? round2((subtotal * promo.pct) / 100) : 0;
  const total = round2(subtotal + fee - discount);
  return { subtotal, fee, discount, total, promo };
}

function renderCart() {
  const entries = cartEntries();
  const qty = cartQty();
  updateBadge();

  const itemsEl = $("cartItems");
  const emptyEl = $("cartEmpty");
  const footerEl = $("cartFooter");

  if (entries.length === 0) {
    itemsEl.innerHTML = "";
    emptyEl.hidden = false;
    footerEl.hidden = true;
    return;
  }
  emptyEl.hidden = true;
  footerEl.hidden = false;

  itemsEl.innerHTML = entries
    .map(
      ({ dish, qty }) => `
      <div class="cart-item">
        <img src="${dish.img}" alt="${dish.nom}" width="64" height="64" />
        <div class="cart-item__info">
          <div class="cart-item__name">${dish.nom}</div>
          <div class="cart-item__price">${mainMoney(dish.price, getCur())} × ${qty} = <strong>${mainMoney(round2(dish.price * qty), getCur())}</strong></div>
        </div>
        <div class="cart-item__right">
          <div class="cart-item__controls">
            <button class="qty-btn" data-action="minus" data-id="${dish.id}" aria-label="Réduire">−</button>
            <span class="qty-num">${qty}</span>
            <button class="qty-btn" data-action="plus" data-id="${dish.id}" aria-label="Augmenter">＋</button>
          </div>
          <button class="cart-item__remove" data-action="remove" data-id="${dish.id}">Retirer</button>
        </div>
      </div>`
    )
    .join("");

  const totals = getTotals();
  const sec = (n) => ` <small>≈ ${secondMoney(n, getCur())}</small>`;
  $("subtotal").innerHTML = mainMoney(totals.subtotal, getCur()) + sec(totals.subtotal);

  if ($("orderMode").value === "delivery") {
    $("deliveryRow").style.display = "flex";
    $("deliveryFee").innerHTML = mainMoney(totals.fee, getCur()) + sec(totals.fee);
    $("cartEta").hidden = false;
    $("etaText").textContent = currentZone().eta;
  } else {
    $("deliveryRow").style.display = "none";
    $("cartEta").hidden = true;
  }

  if (totals.discount > 0) {
    $("discountRow").hidden = false;
    $("discountLabel").textContent = "Code " + totals.promo.code;
    $("discount").textContent = "-" + mainMoney(totals.discount, getCur());
  } else {
    $("discountRow").hidden = true;
  }
  $("total").innerHTML = mainMoney(totals.total, getCur()) + sec(totals.total);
}

function modeText(mode) {
  if (mode === "delivery") return "Livraison à domicile";
  if (mode === "dinein") return "Sur place";
  return "À emporter (retrait)";
}

function setDeliveryFieldsVisible(isDelivery) {
  ["communeLabel", "addressLabel", "landmarkLabel", "precisionLabel", "contact2Label", "timeLabel"].forEach((id) => {
    $(id).style.display = isDelivery ? "grid" : "none";
  });
  $("geoBox").style.display = isDelivery ? "grid" : "none";
  $("checkoutForm").elements.commune.required = isDelivery;
}

function refreshFormSummary() {
  const totals = getTotals();
  let html = cartEntries()
    .map(({ dish, qty }) => `<div>${qty}× ${dish.nom} — <strong>${mainMoney(round2(dish.price * qty), getCur())}</strong></div>`)
    .join("");
  html += `<div style="margin-top:8px">Sous-total : <strong>${fmtBoth(totals.subtotal)}</strong></div>`;
  html +=
    $("orderMode").value === "delivery"
      ? `<div>Livraison (${currentZone().label}) : <strong>${fmtBoth(totals.fee)}</strong></div>`
      : `<div>${modeText($("orderMode").value)} : <strong>gratuit</strong></div>`;
  if (totals.discount > 0) html += `<div>Code ${totals.promo.code} : <strong>-${fmtBoth(totals.discount)}</strong></div>`;
  html += `<div style="margin-top:6px;font-size:1.05rem">TOTAL : <strong>${fmtBoth(totals.total)}</strong></div>`;
  $("formSummary").innerHTML = html;
}

function openCheckout() {
  if (cartQty() === 0) {
    showToast("Votre panier est vide !");
    return;
  }
  $("formView").hidden = false;
  $("confirmView").hidden = true;
  setDeliveryFieldsVisible($("orderMode").value === "delivery");
  refreshFormSummary();
  $("checkoutModal").classList.add("is-open");
  $("checkoutModal").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCheckout() {
  $("checkoutModal").classList.remove("is-open");
  $("checkoutModal").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function makeOrderId(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `MM-${y}${m}${day}-${hh}${mm}`;
}

function gpsLink(g) {
  return `https://www.google.com/maps?q=${g.lat},${g.lng}`;
}

function submitOrder(e) {
  e.preventDefault();
  const f = $("checkoutForm").elements;
  const name = f.name.value.trim();
  const phone = f.phone.value.trim();
  const isDelivery = $("orderMode").value === "delivery";
  const address = f.address.value.trim();
  const landmark = f.landmark.value.trim();

  if (!name) { f.name.focus(); showToast("Merci d'indiquer votre nom."); return; }
  if (!phone) { f.phone.focus(); showToast("Merci d'indiquer votre téléphone."); return; }
  if (isDelivery && !f.commune.value) { f.commune.focus(); showToast("Choisissez votre commune."); return; }
  if (isDelivery && !address && !landmark && !orderGeo) {
    showToast("Ajoutez une adresse, un point de repère ou votre position.");
    return;
  }

  const now = new Date();
  const totals = getTotals();
  const payment = f.payment.value;

  currentOrder = {
    id: makeOrderId(now),
    date: now.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }),
    time: now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    name, phone,
    commune: f.commune.value,
    address, landmark,
    precision: f.precision.value.trim(),
    geo: orderGeo,
    gps: orderGeo ? gpsLink(orderGeo) : "",
    contact2: f.contact2.value.trim(),
    timeReq: f.time.value,
    payment,
    note: f.note.value.trim(),
    mode: $("orderMode").value,
    zoneLabel: currentZone().label,
    eta: currentZone().eta,
    fee: totals.fee,
    subtotal: totals.subtotal,
    discount: totals.discount,
    promo: totals.promo ? totals.promo.code : "",
    total: totals.total,
    items: cartEntries().map(({ dish, qty }) => ({ nom: dish.nom, qty, line: round2(dish.price * qty) })),
  };

  renderConfirm(currentOrder);
  $("formView").hidden = true;
  $("confirmView").hidden = false;
  $("checkoutModal").querySelector(".modal__box").scrollTop = 0;
}

function renderConfirm(order) {
  const loc = [];
  if (order.mode === "delivery") {
    loc.push(`<div class="confirm__line"><span>Commune</span><strong>${esc(order.commune)}</strong></div>`);
    if (order.address) loc.push(`<div class="confirm__line"><span>Adresse</span><strong>${esc(order.address)}</strong></div>`);
    if (order.landmark) loc.push(`<div class="confirm__line"><span>Point de repère</span><strong>${esc(order.landmark)}</strong></div>`);
    if (order.precision) loc.push(`<div class="confirm__line"><span>Précision</span><strong>${esc(order.precision)}</strong></div>`);
    if (order.gps) loc.push(`<div class="confirm__line"><span>Localisation</span><strong><a href="${order.gps}" target="_blank" rel="noopener">Google Maps</a></strong></div>`);
  } else {
    loc.push(`<div class="confirm__line"><span>Mode</span><strong>${esc(modeText(order.mode))}</strong></div>`);
  }

  $("confirmBody").innerHTML = `
    <div class="confirm__id">Commande n° ${esc(order.id)}</div>
    <div class="confirm__block">
      <div class="confirm__line"><span>Date et heure</span><strong>${esc(order.date)} à ${esc(order.time)}</strong></div>
      ${order.items.map((it) => `<div class="confirm__line"><span>${it.qty}× ${esc(it.nom)}</span><strong>${mainMoney(it.line, getCur())}</strong></div>`).join("")}
      <div class="confirm__line"><span>Sous-total</span><strong>${fmtBoth(order.subtotal)}</strong></div>
      ${
        order.mode === "delivery"
          ? `<div class="confirm__line"><span>Livraison (${esc(order.zoneLabel)})</span><strong>${fmtBoth(order.fee)}</strong></div>
             <div class="confirm__line"><span>Délai estimé</span><strong>${esc(order.eta)}</strong></div>`
          : ""
      }
      ${order.discount > 0 ? `<div class="confirm__line"><span>Code ${esc(order.promo)}</span><strong>-${fmtBoth(order.discount)}</strong></div>` : ""}
      <div class="confirm__line confirm__line--total"><span>Total</span><strong>${fmtBoth(order.total)}</strong></div>
    </div>
    <div class="confirm__block">
      <div class="confirm__line"><span>Client</span><strong>${esc(order.name)}</strong></div>
      <div class="confirm__line"><span>Téléphone</span><strong>${esc(order.phone)}</strong></div>
      ${loc.join("")}
      ${order.contact2 ? `<div class="confirm__line"><span>Contact 2</span><strong>${esc(order.contact2)}</strong></div>` : ""}
      ${order.timeReq ? `<div class="confirm__line"><span>Heure souhaitée</span><strong>${esc(order.timeReq)}</strong></div>` : ""}
      <div class="confirm__line"><span>Paiement</span><strong>${esc(order.payment)}</strong></div>
      ${order.note ? `<div class="confirm__line"><span>Note</span><strong>${esc(order.note)}</strong></div>` : ""}
    </div>
    <div class="pay-hint">${order.payment.includes("Cash") ? "Payez le livreur en espèces à la réception." : "Aucun paiement en ligne : après confirmation, Mami vous enverra le numéro Mobile Money pour régler."}</div>
    <div class="confirm__block confirm__block--center">
      Restaurant : ${esc(CONFIG.telephone)}<br />
      Vous recevrez une <strong>confirmation WhatsApp</strong> avant préparation. Merci de patienter.
    </div>`;
}

function buildWhatsAppMessage(order) {
  const m = [];
  m.push("*NOUVELLE COMMANDE — MacDo Mami*");
  m.push("");
  m.push(`*Réf : ${order.id}*`);
  m.push(`${order.date} à ${order.time}`);
  m.push("");
  m.push("*Commande :*");
  order.items.forEach((it) => m.push(`• ${it.qty}× ${it.nom} — ${fmtBoth(it.line)}`));
  m.push("");
  m.push(`Sous-total : ${fmtBoth(order.subtotal)}`);
  if (order.mode === "delivery") {
    m.push(`Livraison (${order.zoneLabel}) : ${fmtBoth(order.fee)}`);
    m.push(`Délai estimé : ${order.eta}`);
  } else {
    m.push(`Mode : ${modeText(order.mode)}`);
  }
  if (order.discount > 0) m.push(`Code ${order.promo} : -${fmtBoth(order.discount)}`);
  m.push(`*TOTAL : ${fmtBoth(order.total)}*`);
  m.push("");
  m.push(`*Client :* ${order.name}`);
  m.push(`*Téléphone :* ${order.phone}`);
  if (order.mode === "delivery") {
    m.push(`*Commune :* ${order.commune}`);
    if (order.address) m.push(`*Adresse :* ${order.address}`);
    if (order.landmark) m.push(`*Point de repère :* ${order.landmark}`);
    if (order.precision) m.push(`*Précision :* ${order.precision}`);
    if (order.gps) m.push(`*Localisation GPS :* ${order.gps}`);
  }
  if (order.contact2) m.push(`*Contact 2 :* ${order.contact2}`);
  if (order.timeReq) m.push(`*Heure souhaitée :* ${order.timeReq}`);
  m.push(`*Paiement :* ${order.payment}`);
  if (order.note) m.push(`*Note :* ${order.note}`);
  m.push("");
  m.push("_Merci de patienter : Mami confirme chaque commande sur WhatsApp avant préparation._");
  m.push(CONFIG.url);
  return m.join("\n");
}

function sendOrder() {
  if (!currentOrder) return;
  ouvrirWhatsApp(buildWhatsAppMessage(currentOrder));
  cart = {};
  saveCart();
  renderCart();
  orderGeo = null;
  $("geoStatus").innerHTML = "";
  closeCheckout();
  showToast("Commande envoyée. Mami vous confirme sur WhatsApp.");
}

function onPromoChange() {
  const code = $("promoInput").value.trim().toUpperCase();
  const msg = $("promoMsg");
  if (!code) {
    activePromo = null; msg.textContent = ""; msg.className = "promo-msg";
  } else if (CONFIG.promo[code]) {
    activePromo = code;
    msg.textContent = "✓ Code valide : " + CONFIG.promo[code].label;
    msg.className = "promo-msg is-ok";
  } else {
    activePromo = null;
    msg.textContent = "✗ Code invalide.";
    msg.className = "promo-msg is-err";
  }
  renderCart();
}

document.addEventListener("DOMContentLoaded", () => {
  // Sélecteur de zone
  const zoneSelect = $("zoneSelect");
  zoneSelect.innerHTML = CONFIG.zones
    .map((z) => `<option value="${z.fee}">${z.label} — ${z.communes.join(", ")} (${fmtUSD(z.fee)})</option>`)
    .join("");

  const communeSel = $("commune");
  if (communeSel) {
    communeSel.innerHTML =
      `<option value="">— Choisissez votre commune —</option>` +
      CONFIG.zones
        .map((z) => `<optgroup label="${z.label} (${fmtUSD(z.fee)})">${z.communes.map((c) => `<option>${c}</option>`).join("")}</optgroup>`)
        .join("");
  }

  const paySel = $("payment");
  if (paySel) {
    paySel.innerHTML = CONFIG.paiements
      .map((p) => `<option>${p}</option>`)
      .join("");
  }

  renderCart();

  $("cartItems").addEventListener("click", (e) => {
    const b = e.target.closest("[data-action]");
    if (!b) return;
    const { action, id } = b.dataset;
    if (action === "plus") cart[id] = (cart[id] || 0) + 1;
    if (action === "minus") { cart[id] = (cart[id] || 0) - 1; if (cart[id] <= 0) delete cart[id]; }
    if (action === "remove") delete cart[id];
    saveCart();
    renderCart();
  });

  $("orderMode").addEventListener("change", () => {
    $("zoneField").style.display = $("orderMode").value === "delivery" ? "grid" : "none";
    renderCart();
  });
  zoneSelect.addEventListener("change", renderCart);

  $("checkoutBtn").addEventListener("click", openCheckout);
  $("modalClose").addEventListener("click", closeCheckout);
  $("checkoutModal").addEventListener("click", (e) => { if (e.target === $("checkoutModal")) closeCheckout(); });
  $("checkoutForm").addEventListener("submit", submitOrder);
  $("backToForm").addEventListener("click", () => { $("formView").hidden = false; $("confirmView").hidden = true; });
  $("sendWhatsApp").addEventListener("click", sendOrder);
  $("promoInput").addEventListener("change", onPromoChange);

  // Position GPS (facultative, sur action de l'utilisateur uniquement)
  $("geoBtn").addEventListener("click", () => {
    if (!("geolocation" in navigator)) { showToast("Localisation indisponible sur cet appareil."); return; }
    showToast("Recherche de votre position…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        orderGeo = { lat: +pos.coords.latitude.toFixed(6), lng: +pos.coords.longitude.toFixed(6) };
        $("geoStatus").innerHTML = `Position enregistrée — <a href="${gpsLink(orderGeo)}" target="_blank" rel="noopener">voir sur Google Maps</a>`;
        showToast("Position enregistrée");
      },
      () => showToast("Localisation impossible. Ajoutez plutôt un point de repère."),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  });

  window.onCurrencyChange = renderCart;

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCheckout(); });
});
