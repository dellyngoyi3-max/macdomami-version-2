/* ============================================================
   MacDo Mami — page Menu : onglets, cartes, ajout au panier
   ============================================================ */
let currentFilter = "all";

function cartePlat(d) {
  const cur = getCur();
  const priced = typeof d.price === "number" && isFinite(d.price);
  const prix = priced
    ? `<span class="dish__price--main">${mainMoney(d.price, cur)}</span><span class="dish__price--sec">≈ ${secondMoney(d.price, cur)}</span>`
    : `<span class="dish__price--main dish__price--tbd">[PRIX À RENSEIGNER]</span>`;
  const action = priced
    ? `<button class="dish__add" data-id="${d.id}" aria-label="Ajouter ${d.nom} au panier">＋ Ajouter</button>`
    : `<a class="dish__ask" data-wa="Bonjour MacDo Mami ! Je souhaite connaître le prix de : ${d.nom}">Demander le prix</a>`;

  return `
    <article class="dish">
      <div class="dish__media">
        <img src="${d.img}" alt="${d.nom}" loading="lazy" width="900" height="506" />
        ${d.tag ? `<span class="dish__tag">${d.tag}</span>` : ""}
      </div>
      <div class="dish__body">
        <h3 class="dish__name">${d.nom}</h3>
        <p class="dish__desc">${d.desc}</p>
        <div class="dish__meta">
          <span class="chip">Prêt en ${d.prep}</span>
          <span class="chip">${d.serves}</span>
          ${spiceLabel(d.piment) ? `<span class="chip">${spiceLabel(d.piment)}</span>` : ""}
          ${d.allergenes ? `<span class="chip chip--allergen">Allergènes : ${d.allergenes}</span>` : ""}
        </div>
        <div class="dish__footer">
          <span class="dish__price">${prix}</span>
          ${action}
        </div>
      </div>
    </article>`;
}

function renderMenu(filter = "all") {
  const grid = document.getElementById("menuGrid");
  if (!grid) return;
  const items = filter === "all" ? MENU : MENU.filter((d) => d.cat === filter);
  grid.innerHTML = items.map(cartePlat).join("");
  bindWaLinks();
}

function renderTabs() {
  const tabs = document.getElementById("menuTabs");
  if (!tabs) return;
  tabs.innerHTML =
    `<button class="tab is-active" data-filter="all">Tout</button>` +
    CATEGORIES.map((c) => `<button class="tab" data-filter="${c.id}">${c.label}</button>`).join("");
}

function updateSticky() {
  const bar = document.getElementById("stickyCart");
  if (!bar) return;
  const qty = cartQty();
  bar.classList.toggle("is-hidden", qty === 0);
  document.body.classList.toggle("cart-bar", qty > 0);
  const totalEl = document.getElementById("stickyTotal");
  if (totalEl) totalEl.textContent = mainMoney(round2(cartSubtotal()), getCur());
}

document.addEventListener("DOMContentLoaded", () => {
  renderTabs();
  renderMenu();

  const tabs = document.getElementById("menuTabs");
  tabs.addEventListener("click", (e) => {
    const tab = e.target.closest(".tab");
    if (!tab) return;
    tabs.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
    currentFilter = tab.dataset.filter;
    renderMenu(currentFilter);
  });

  const grid = document.getElementById("menuGrid");
  grid.addEventListener("click", (e) => {
    const b = e.target.closest(".dish__add");
    if (!b) return;
    const d = MENU.find((x) => x.id === b.dataset.id);
    addToCart(b.dataset.id);
    if (d) showToast("✓ " + d.nom + " ajouté au panier");
    updateSticky();
  });

  window.onCurrencyChange = () => renderMenu(currentFilter);
  updateSticky();
});
