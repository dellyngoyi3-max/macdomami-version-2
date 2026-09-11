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

/* ---------- Initialisation (toutes pages) ---------- */
document.addEventListener("DOMContentLoaded", () => {
  updateBadge();

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
