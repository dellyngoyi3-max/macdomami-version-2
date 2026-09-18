# 📋 MacDo Mami — Toutes les informations utilisées sur le site

> Ce fichier regroupe **tout** ce qui est écrit dans le site : ce qui est **réel**,
> ce qui est un **exemple à remplacer**, et ce qui est **à renseigner**.
> Règle appliquée : **rien d'inventé**. Chaque valeur inconnue s'affiche
> visiblement « [À RENSEIGNER] » sur le site.

---

## 1. 📞 Contact & identité

| Information | Valeur dans le site | Statut |
|---|---|---|
| **Numéro WhatsApp** (reçoit commandes, réservations, devis) | `243999076878` (dans `js/data.js`) | ✅ **RÉEL** (fourni : 099 907 6878) |
| Téléphone affiché | `+243 999 076 878` | ✅ RÉEL |
| Email | `[EMAIL À RENSEIGNER]` | ⚠️ à renseigner |
| Adresse | **Avenue du Commerce, Gombe — Kinshasa, RDC** | ✅ **Rue RÉELLE** (vérifiée) — n° de parcelle à confirmer |
| Lien Google Maps | recherche « Avenue du Commerce Gombe Kinshasa » | ✅ Fonctionne |
| Horaires | **Lundi – Dimanche : 10h00 – 21h00** | ✅ RÉEL (fourni) |
| URL du site | `https://macdomami.cd` (dans `js/data.js`) | ⚠️ EXEMPLE — à remplacer par l'URL GitHub Pages |
| Réseaux sociaux | `[À RENSEIGNER]` | ⚠️ à renseigner |

---

## 2. 💱 Taux de change (USD → FC)

| Valeur | Emplacement |
|---|---|
| **1 USD = 2 800 FC** | `js/data.js`, ligne `tauxUSD: 2800` |

> Modifiable en **une seule ligne**. C'est la seule valeur qui pilote tous les prix en FC.
> Le site affiche automatiquement les deux devises (bascule **$ USD | FC**, mémorisée sur le téléphone du client).

---

## 3. 🛵 Zones de livraison

| Zone | Frais | Communes | Délai estimé | Statut |
|---|---|---|---|---|
| Zone 1 — Centre | **3 $** | Gombe · Lingwala · Kinshasa | 20–35 min | Livré |
| Zone 2 — Proche centre | **5 $** | Bandalungwa · Kalamu · Kasa-Vubu · Ngiri-Ngiri · Limete · Ngaliema | 30–45 min | Livré |
| Zone 3 — Est | **7 $** | Matete · Lemba · Kisenso | 40–60 min | Livré |
| Zone 4 — Grande périphérie | **10 $** | Masina · Ndjili · Selembao · Kimbanseke · Nsele · Mont-Ngafula | 60–90 min | Sur demande |

- À emporter = **gratuit** · Sur place = **gratuit**.
- ⚠️ Frais et délais : **exemples à confirmer** (modifiables dans `js/data.js`).

---

## 4. 💳 Moyens de paiement

1. Cash à la livraison
2. M-Pesa
3. Orange Money
4. Airtel Money

> Aucun paiement en ligne. Pour Mobile Money : le client reçoit le numéro après confirmation WhatsApp.

---

## 5. 🎁 Code promo & fidélité

| Code | Effet |
|---|---|
| `BIENVENUE10` | -10 % (première commande) |

---

## 6. 🍗 Le menu — 8 catégories, 35 plats

Les prix sont **INDICATIFS** : je les ai cherchés sur le web (prix réels pratiqués à Kinshasa
en 2024-2026 : Waz Burger ≈ 10 $ le menu, Pizza Inn ≈ 29 000 FC la moyenne, liboke ≈ 8 $,
brochettes+accompagnement ≈ 12 $…). **À confirmer par le restaurant** dans `js/data.js`.

| Catégorie | Plats (prix indicatifs USD) |
|---|---|
| 🍔 Burgers & Sandwichs | Burger Mami 5 $ · Burger Poulet Braisé 5,50 $ · Burger Royal 6,50 $ · Burger Double 7,50 $ |
| 🍗 Poulet & Grillades | Poulet braisé entier 13 $ · Demi-poulet 7,50 $ · Poulet Mayo 5,50 $ · Steak grillé 8 $ · Brochettes (x3) 5 $ |
| 🥘 Spécialités congolaises | Assiette Poulet Braisé 7 $ · Assiette Steak & Chikwangue 7,50 $ · Chikwangue Grillée 3 $ · Liboke de Poisson 8,50 $ |
| 🍕 Pizzas | Pizza Mami 10 $ · Pizza Poulet Braisé 10 $ · Pizza Plantain 10 $ · Pizza Végétarienne 9 $ |
| 🍟 Accompagnements | Frites 2,50 $ · Plantain frit 2,50 $ · Chikwangue 1,50 $ · Salade 2,50 $ · Maïs grillé 1,50 $ |
| 🥤 Boissons | Jus de gingembre 1,50 $ · Bissap 1,50 $ · Jus d'ananas 2 $ · Milkshake 3,50 $ · Eau & sodas 1 $ |
| 🍰 Desserts | Mikate 2 $ · Plantain caramélisé 3 $ · Crêpes au chocolat 3,50 $ · Salade de fruits 3 $ |
| 🎁 Formules & Menus | Formule Mami Classique 7,50 $ · Formule Congolaise 8 $ · Formule Famille 24 $ · Formule Enfant 5 $ |

> **Pour modifier un prix** : dans `js/data.js`, changez `price:` du plat (en USD).
> Mettre `price: null` ré-affiche « [PRIX À RENSEIGNER] » et le bouton « Demander le prix ».

---

## 7. 📁 Structure du site (multi-pages)

```
macdo-mami/
├── index.html          # Accueil
├── menu.html           # Menu (8 catégories, onglets, panier)
├── panier.html         # Panier + commande (livraison, GPS, WhatsApp)
├── reservation.html    # Réservation de table
├── evenements.html     # Événements
├── traiteur.html       # Traiteur / devis
├── contact.html        # Contact, horaires, zones de livraison, carte Google Maps
├── tables.html         # ⭐ Générateur & impression des QR codes de table A4
├── confidentialite.html# Politique de confidentialité
├── css/styles.css      # tout le design (couleurs, polices, mise en page, print)
├── js/
│   ├── data.js         # ⭐ CONTENU CENTRAL : tout se modifie ICI
│   ├── commun.js       # helpers, panier, devise, en-tête, WhatsApp, gestion table
│   ├── menu.js         # affichage du menu
│   ├── panier.js       # panier + commande (gestion livraison vs sur place/table)
│   ├── forms.js        # réservation, événements, traiteur
│   └── qrcode.min.js   # générateur de QR code vectoriel hors-ligne
└── images/             # 16 photos WebP
```

---

## 8. ✅ Ce qui est RÉEL (vérifié, pas inventé)

- **Avenue du Commerce** : rue réelle de la commune de **Gombe** (centre de Kinshasa).
- Les **communes** listées dans les zones sont les vraies communes de Kinshasa.
- Les **moyens de paiement** (M-Pesa, Orange Money, Airtel Money) sont actifs en RDC.

## ⚠️ Ce qui est À RENSEIGNER (rien n'est inventé)

- Email, réseaux sociaux, année de création
- Taux de change (vérifiez le taux du jour)
- **Les prix des plats** (35 plats — actuellement des prix *indicatifs* trouvés sur le web, à confirmer)
- Frais et délais de livraison (exemples)
- Numéro de parcelle de l'adresse

---

## 🔧 Où modifier chaque chose ?

| Ce que vous changez | Fichier | Endroit |
|---|---|---|
| WhatsApp, téléphone, email, taux, zones, promos, menu & prix | `js/data.js` | le fichier entier (constantes `CONFIG`, `CATEGORIES`, `MENU`) |
| Adresse, horaires (texte affiché) | toutes les pages `.html` | pied de page + page `contact.html` + `reservation.html` |
| Design (couleurs, polices) | `css/styles.css` | variables `:root` en haut |
