/* ============================================================
   MacDo Mami — fonctions communes à toutes les pages
   (helpers, panier, devise, en-tête, pied de page, WhatsApp)
   ============================================================ */

/* ---------- Helpers ---------- */
const round2 = (n) => Math.round(n * 100) / 100;
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtUSD = (n) => n.toFixed(2).replace(".", ",") + " $";
const fmtCDF = (n) => Math.round(n * CONFIG.tauxUSD).toLocaleString("fr-FR") + " FC";
const fmtBoth = (n) => fmtUSD(n) + " / " + fmtCDF(n);
const spiceLabel = (n) => (n >= 3 ? "Très pimenté" : n === 2 ? "Pimenté" : n === 1 ? "Peu pimenté" : "");

/* ---------- Devise (USD / FC) ---------- */
const CUR_KEY = "macdomami_currency";
function getCur() {
  return localStorage.getItem(CUR_KEY) === "FC" ? "FC" : CONFIG.deviseDefaut;
}
function setCur(c) {
  localStorage.setItem(CUR_KEY, c);
}
function mainMoney(n, cur) { return cur === "FC" ? fmtCDF(n) : fmtUSD(n); }
function secondMoney(n, cur) { return cur === "FC" ? fmtUSD(n) : fmtCDF(n); }

/* ---------- Panier (localStorage) ---------- */
const CART_KEY = "macdomami_cart";
let cart = loadCart();

function loadCart() {
  try {
    const r = JSON.parse(localStorage.getItem(CART_KEY));
    if (r && typeof r === "object" && !Array.isArray(r)) {
      const clean = {};
      for (const [k, v] of Object.entries(r)) {
        if (k === "_t") continue;
        const n = Math.floor(Number(v));
        if (MENU.some((d) => d.id === k) && Number.isFinite(n) && n > 0) clean[k] = Math.min(n, 99);
      }
      return clean;
    }
  } catch (e) {}
  return {};
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify({ ...cart, _t: Date.now() }));
}

function cartQty() {
  return Object.values(cart).reduce((a, b) => a + b, 0);
}

function cartEntries() {
  return Object.entries(cart)
    .map(([id, qty]) => ({ dish: MENU.find((d) => d.id === id), qty }))
    .filter((e) => e.dish);
}

function cartSubtotal() {
  return cartEntries().reduce((s, e) => s + (typeof e.dish.price === "number" ? e.dish.price * e.qty : 0), 0);
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  updateBadge();
}

function updateBadge() {
  const qty = cartQty();
  document.querySelectorAll("#cartCount").forEach((el) => (el.textContent = qty));
  const sc = document.getElementById("stickyCount");
  if (sc) sc.textContent = qty;
}

/* ---------- WhatsApp ---------- */
function waLink(texte) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texte)}`;
}
function ouvrirWhatsApp(texte) {
  window.open(waLink(texte), "_blank");
}

/* ---------- Toast ---------- */
let toastTimer;
function showToast(t) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = t;
  el.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2800);
}

function bindWaLinks() {
  document.querySelectorAll("a[data-wa]").forEach((a) => {
    a.setAttribute("href", waLink(a.getAttribute("data-wa")));
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener");
  });
}

/* ---------- Gestion des tables (QR code en salle) ---------- */
const TABLE_KEY = "macdomami_table";
function getActiveTable() {
  try {
    const p = new URLSearchParams(window.location.search);
    const fromUrl = p.get("table");
    if (fromUrl && /^[a-zA-Z0-9_-]{1,10}$/.test(fromUrl)) {
      sessionStorage.setItem(TABLE_KEY, fromUrl);
      return fromUrl;
    }
    const saved = sessionStorage.getItem(TABLE_KEY);
    return saved && /^[a-zA-Z0-9_-]{1,10}$/.test(saved) ? saved : null;
  } catch (e) {
    return null;
  }
}
function clearActiveTable() {
  try {
    sessionStorage.removeItem(TABLE_KEY);
  } catch (e) {}
}

function renderTableBanner() {
  const table = getActiveTable();
  if (!table) return;
  // Ne pas afficher sur la page d'impression tables.html
  if (window.location.pathname.endsWith("tables.html")) return;

  let bar = document.getElementById("tableBar");
  if (!bar) {
    bar = document.createElement("aside");
    bar.id = "tableBar";
    bar.className = "table-bar";
    const header = document.getElementById("header");
    if (header && header.parentNode) {
      header.parentNode.insertBefore(bar, header.nextSibling);
    }
  }
  bar.innerHTML = `
    <div class="container table-bar__inner">
      <div class="table-bar__info">
        <span class="table-bar__dot"></span>
        <span>Service à table — <strong>Table n° ${esc(table)}</strong></span>
      </div>
      <button type="button" class="table-bar__btn" id="leaveTableBtn" title="Passer en commande à emporter ou livraison">Quitter la table</button>
    </div>
  `;
  const btn = document.getElementById("leaveTableBtn");
  if (btn) {
    btn.addEventListener("click", () => {
      clearActiveTable();
      bar.remove();
      showToast("Mode sur place désactivé.");
      // Nettoyer l'URL si elle contenait ?table=
      if (window.location.search.includes("table=")) {
        const u = new URL(window.location);
        u.searchParams.delete("table");
        window.history.replaceState({}, "", u.pathname + (u.search || ""));
      }
      if (window.onTableChange) window.onTableChange(null);
    });
  }
}

/* ---------- Initialisation (toutes pages) ---------- */
document.addEventListener("DOMContentLoaded", () => {
  updateBadge();
  renderTableBanner();

  // Année du pied de page
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Liens WhatsApp pilotés par CONFIG (une seule source de vérité)
  bindWaLinks();

  // Menu mobile
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  if (burger && nav) {
    burger.addEventListener("click", () => nav.classList.toggle("is-open"));
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("is-open")));
  }

  // En-tête au scroll
  const header = document.getElementById("header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    onScroll();
  }

  // Bascule de devise (boutons [data-cur])
  document.querySelectorAll("[data-cur]").forEach((b) =>
    b.addEventListener("click", () => {
      setCur(b.dataset.cur);
      document.querySelectorAll("[data-cur]").forEach((x) => x.classList.toggle("is-active", x.dataset.cur === getCur()));
      if (window.onCurrencyChange) window.onCurrencyChange();
    })
  );
  document.querySelectorAll("[data-cur]").forEach((x) => x.classList.toggle("is-active", x.dataset.cur === getCur()));
});
