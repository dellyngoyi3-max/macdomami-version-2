/* ============================================================
   MacDo Mami — CONTENU CENTRAL (tout se modifie ICI)
   Règle : rien d'inventé. Les valeurs inconnues sont marquées
   [À RENSEIGNER] et regroupées ici.
   Les prix sont INDICATIFS, basés sur les prix du marché de
   Kinshasa (recherche web 2026) — à confirmer par le restaurant.
   ============================================================ */

const CONFIG = {
  nom: "MacDo Mami",
  baseline: "Le fast-food congolais moderne",
  slogan: "Burgers, grillades, pizzas et saveurs de chez nous.",

  /* ---------- Contact ---------- */
  whatsapp: "243999076878",        // ← Numéro WhatsApp SANS "+" (fourni : 099 907 6878)
  telephone: "+243 999 076 878",
  email: "[EMAIL À RENSEIGNER]",
  adresse: "Avenue du Commerce, Gombe — Kinshasa, RDC",
  adresseNote: "numéro de parcelle à confirmer",
  gmaps: "https://www.google.com/maps/search/?api=1&query=Avenue+du+Commerce+Gombe+Kinshasa",
  horaires: "Lundi – Dimanche : 10h00 – 21h00",
  url: "https://dellyngoyi3-max.github.io/macdomami-version-2",
  reseaux: {
    facebook: "[À RENSEIGNER]",
    instagram: "[À RENSEIGNER]",
    tiktok: "[À RENSEIGNER]",
  },

  /* ---------- Prix & devise ---------- */
  tauxUSD: 2800,                   // ← 1 USD = 2 800 FC (À CONFIRMER, taux du jour)
  deviseDefaut: "USD",             // "USD" ou "FC"

  /* ---------- Paiements ---------- */
  paiements: ["Cash à la livraison", "M-Pesa", "Orange Money", "Airtel Money"],

  /* ---------- Zones de livraison (frais et délais : À CONFIRMER) ---------- */
  zones: [
    { fee: 3,  label: "Zone 1 — Centre",            communes: ["Gombe", "Lingwala", "Kinshasa"], eta: "20–35 min", statut: "livre" },
    { fee: 5,  label: "Zone 2 — Proche centre",     communes: ["Bandalungwa", "Kalamu", "Kasa-Vubu", "Ngiri-Ngiri", "Limete", "Ngaliema"], eta: "30–45 min", statut: "livre" },
    { fee: 7,  label: "Zone 3 — Est",               communes: ["Matete", "Lemba", "Kisenso"], eta: "40–60 min", statut: "livre" },
    { fee: 10, label: "Zone 4 — Grande périphérie", communes: ["Masina", "Ndjili", "Selembao", "Kimbanseke", "Nsele", "Mont-Ngafula"], eta: "60–90 min", statut: "sur-demande" },
  ],

  /* ---------- Codes promo ---------- */
  promo: {
    "BIENVENUE10": { pct: 10, label: "-10 % première commande" },
  },
};

/* ---------- Catégories du menu ---------- */
const CATEGORIES = [
  { id: "burgers",         label: "Burgers & sandwichs" },
  { id: "poulet",          label: "Poulet & grillades" },
  { id: "tradition",       label: "Spécialités congolaises" },
  { id: "pizzas",          label: "Pizzas" },
  { id: "accompagnements", label: "Accompagnements" },
  { id: "boissons",        label: "Boissons" },
  { id: "desserts",        label: "Desserts" },
  { id: "formules",        label: "Formules & menus" },
];

/* ---------- Menu ----------
   Prix INDICATIFS en USD (basés sur les prix de Kinshasa, à confirmer).
   price = null  →  le plat s'affiche « [PRIX À RENSEIGNER] »
   ---------- */
const MENU = [
  /* BURGERS & SANDWICHS — réf. burger+frites+soda ≈ 10 $ à Kinshasa */
  { id: "burger-mami", nom: "Burger Mami", cat: "burgers",
    desc: "Pain moelleux, steak haché, fromage, salade, tomate, oignon et sauce maison.",
    serves: "1 pers.", piment: 0, allergenes: "Gluten, œufs, lait", prep: "10–15 min",
    price: 5, img: "images/burger.webp", tag: "Signature" },
  { id: "burger-poulet-braise", nom: "Burger Poulet Braisé", cat: "burgers",
    desc: "Poulet braisé effiloché, fromage, crudités et sauce légèrement fumée.",
    serves: "1 pers.", piment: 1, allergenes: "Gluten, lait", prep: "10–15 min",
    price: 5.5, img: "images/burger.webp" },
  { id: "burger-royal", nom: "Burger Royal Congolais", cat: "burgers",
    desc: "Steak haché, fromage, œuf, oignons caramélisés, banane plantain et sauce maison.",
    serves: "1 pers.", piment: 1, allergenes: "Gluten, œufs, lait", prep: "15–20 min",
    price: 6.5, img: "images/burger.webp", tag: "Très demandé" },
  { id: "burger-double", nom: "Burger Double Mami", cat: "burgers",
    desc: "Deux steaks, double fromage, salade, oignons et sauce spéciale.",
    serves: "1 pers.", piment: 1, allergenes: "Gluten, lait", prep: "15–20 min",
    price: 7.5, img: "images/burger.webp" },

  /* POULET & GRILLADES */
  { id: "poulet-entier", nom: "Poulet braisé entier", cat: "poulet",
    desc: "Mariné 12 h puis braisé lentement à la braise, servi avec oignons caramélisés.",
    serves: "2–3 pers.", piment: 2, allergenes: "", prep: "30–40 min",
    price: 13, img: "images/poulet-braise.webp" },
  { id: "demi-poulet", nom: "Demi-poulet braisé", cat: "poulet",
    desc: "Doré à souhait, avec sa sauce pili-pili maison.",
    serves: "1–2 pers.", piment: 2, allergenes: "", prep: "25–35 min",
    price: 7.5, img: "images/poulet-braise.webp" },
  { id: "poulet-mayo", nom: "Poulet Mayo Mami", cat: "poulet",
    desc: "Poulet frit croustillant, frites maison dorées et sauce mayo secrète.",
    serves: "1 pers.", piment: 1, allergenes: "Œufs, gluten", prep: "15–20 min",
    price: 5.5, img: "images/poulet-frites.webp", tag: "Populaire" },
  { id: "steak-grille", nom: "Steak grillé", cat: "poulet",
    desc: "Steak de bœuf grillé, accompagnement au choix.",
    serves: "1 pers.", piment: 0, allergenes: "", prep: "15–20 min",
    price: 8, img: "images/steak.webp" },
  { id: "brochettes", nom: "Brochettes de bœuf (x3)", cat: "poulet",
    desc: "Marinées et grillées, servies avec oignons et pili-pili.",
    serves: "1 pers.", piment: 2, allergenes: "", prep: "15–20 min",
    price: 5, img: "images/grillades.webp" },

  /* SPÉCIALITÉS CONGOLAISES — réf. repas trad. ≈ 20 000–35 000 FC */
  { id: "assiette-poulet", nom: "Assiette Poulet Braisé", cat: "tradition",
    desc: "Poulet braisé accompagné de frites, banane plantain ou chikwangue.",
    serves: "1 pers.", piment: 2, allergenes: "", prep: "25–35 min",
    price: 7, img: "images/poulet-braise.webp" },
  { id: "assiette-steak", nom: "Assiette Steak & Chikwangue", cat: "tradition",
    desc: "Steak grillé, chikwangue, salade et sauce maison.",
    serves: "1 pers.", piment: 1, allergenes: "", prep: "20–30 min",
    price: 7.5, img: "images/chikwangue.webp" },
  { id: "chikwangue-grillee", nom: "Chikwangue Grillée", cat: "tradition",
    desc: "Chikwangue légèrement grillée, servie avec une sauce au choix.",
    serves: "1 pers.", piment: 1, allergenes: "", prep: "10–15 min",
    price: 3, img: "images/chikwangue.webp" },
  { id: "liboke-poisson", nom: "Liboke de Poisson", cat: "tradition",
    desc: "Poisson assaisonné, cuit avec des aromates, accompagné de plantain ou de chikwangue.",
    serves: "1–2 pers.", piment: 1, allergenes: "Poisson", prep: "25–35 min",
    price: 8.5, img: "images/liboke.webp", tag: "Tradition" },

  /* PIZZAS — réf. Pizza Inn : moyenne ≈ 29 000 FC (~10 $), grande ≈ 39 000 FC (~14 $) */
  { id: "pizza-mami", nom: "Pizza Mami", cat: "pizzas",
    desc: "Poulet braisé, oignons, poivrons, fromage et sauce maison.",
    serves: "2 pers.", piment: 1, allergenes: "Gluten, lait", prep: "20–30 min",
    price: 10, img: "images/pizza.webp", tag: "Signature" },
  { id: "pizza-poulet", nom: "Pizza Poulet Braisé", cat: "pizzas",
    desc: "Poulet braisé, fromage, oignons et poivrons.",
    serves: "2 pers.", piment: 1, allergenes: "Gluten, lait", prep: "20–30 min",
    price: 10, img: "images/pizza.webp" },
  { id: "pizza-plantain", nom: "Pizza Plantain", cat: "pizzas",
    desc: "Banane plantain, poulet, fromage et oignons caramélisés.",
    serves: "2 pers.", piment: 0, allergenes: "Gluten, lait", prep: "20–30 min",
    price: 10, img: "images/pizza.webp" },
  { id: "pizza-veggie", nom: "Pizza Végétarienne", cat: "pizzas",
    desc: "Poivrons, champignons, maïs, oignons, tomates et fromage.",
    serves: "2 pers.", piment: 0, allergenes: "Gluten, lait", prep: "20–30 min",
    price: 9, img: "images/pizza.webp" },

  /* ACCOMPAGNEMENTS */
  { id: "frites", nom: "Frites classiques", cat: "accompagnements",
    desc: "Frites de pommes de terre fraîches, croustillantes.",
    serves: "1 pers.", piment: 0, allergenes: "", prep: "10–15 min",
    price: 2.5, img: "images/poulet-frites.webp" },
  { id: "plantain-frit", nom: "Banane plantain frite", cat: "accompagnements",
    desc: "Plantains bien mûrs, frits et dorés.",
    serves: "2 pers.", piment: 0, allergenes: "", prep: "10–15 min",
    price: 2.5, img: "images/plantain.webp" },
  { id: "chikwangue", nom: "Chikwangue", cat: "accompagnements",
    desc: "Bâton de manioc, nature ou grillé.",
    serves: "1 pers.", piment: 0, allergenes: "", prep: "5 min",
    price: 1.5, img: "images/chikwangue.webp" },
  { id: "salade", nom: "Salade fraîche", cat: "accompagnements",
    desc: "Crudités croquantes, vinaigrette maison.",
    serves: "1 pers.", piment: 0, allergenes: "", prep: "5 min",
    price: 2.5, img: "images/sides.webp" },
  { id: "mais-grille", nom: "Maïs grillé", cat: "accompagnements",
    desc: "Épi de maïs grillé au beurre.",
    serves: "1 pers.", piment: 0, allergenes: "", prep: "10 min",
    price: 1.5, img: "images/sides.webp" },

  /* BOISSONS */
  { id: "jus-gingembre", nom: "Jus de gingembre", cat: "boissons",
    desc: "Gingembre frais pressé, légèrement épicé.",
    serves: "1 pers.", piment: 1, allergenes: "", prep: "5 min",
    price: 1.5, img: "images/jus.webp" },
  { id: "bissap", nom: "Jus de bissap", cat: "boissons",
    desc: "Infusion d'hibiscus rouge, fraîche et désaltérante.",
    serves: "1 pers.", piment: 0, allergenes: "", prep: "5 min",
    price: 1.5, img: "images/jus.webp" },
  { id: "jus-ananas", nom: "Jus d'ananas", cat: "boissons",
    desc: "Ananas frais pressé le matin même.",
    serves: "1 pers.", piment: 0, allergenes: "", prep: "5 min",
    price: 2, img: "images/jus.webp" },
  { id: "milkshake", nom: "Milkshake", cat: "boissons",
    desc: "Vanille, chocolat ou fraise, avec chantilly.",
    serves: "1 pers.", piment: 0, allergenes: "Lait", prep: "5 min",
    price: 3.5, img: "images/milkshake.webp" },
  { id: "eau-sodas", nom: "Eau & sodas", cat: "boissons",
    desc: "Eau minérale, Coca, Fanta ou Sprite.",
    serves: "1 pers.", piment: 0, allergenes: "", prep: "immédiat",
    price: 1, img: "images/jus.webp" },

  /* DESSERTS */
  { id: "mikate", nom: "Beignets congolais (Mikate)", cat: "desserts",
    desc: "Moelleux et dorés, saupoudrés de sucre.",
    serves: "2–3 pers.", piment: 0, allergenes: "Gluten", prep: "15 min",
    price: 2, img: "images/dessert.webp" },
  { id: "plantain-caramel", nom: "Banane plantain caramélisée", cat: "desserts",
    desc: "Plantain doré au caramel, douceur de fin de repas.",
    serves: "1 pers.", piment: 0, allergenes: "", prep: "10 min",
    price: 3, img: "images/dessert.webp" },
  { id: "crepes-choco", nom: "Crêpes au chocolat", cat: "desserts",
    desc: "Crêpes fines, chocolat fondu.",
    serves: "1 pers.", piment: 0, allergenes: "Gluten, œufs, lait", prep: "15 min",
    price: 3.5, img: "images/dessert.webp" },
  { id: "salade-fruits", nom: "Salade de fruits", cat: "desserts",
    desc: "Fruits frais de saison.",
    serves: "1 pers.", piment: 0, allergenes: "", prep: "5 min",
    price: 3, img: "images/dessert.webp" },

  /* FORMULES & MENUS — réf. menu burger+frites+boisson ≈ 10 $ */
  { id: "formule-classique", nom: "Formule Mami Classique", cat: "formules",
    desc: "Burger, frites et boisson.",
    serves: "1 pers.", piment: 1, allergenes: "Gluten, lait", prep: "15 min",
    price: 7.5, img: "images/burger.webp" },
  { id: "formule-congolaise", nom: "Formule Congolaise", cat: "formules",
    desc: "Poulet braisé, plantain ou chikwangue et boisson.",
    serves: "1 pers.", piment: 2, allergenes: "", prep: "25 min",
    price: 8, img: "images/poulet-braise.webp" },
  { id: "formule-famille", nom: "Formule Famille", cat: "formules",
    desc: "Plusieurs morceaux de poulet, frites, plantain, sauces et boissons.",
    serves: "4 pers.", piment: 1, allergenes: "", prep: "40 min",
    price: 24, img: "images/poulet-braise.webp", tag: "Famille" },
  { id: "formule-enfant", nom: "Formule Enfant", cat: "formules",
    desc: "Petit burger ou poulet, frites, jus naturel et dessert.",
    serves: "1 enfant", piment: 0, allergenes: "Gluten, lait", prep: "15 min",
    price: 5, img: "images/burger.webp" },
];
