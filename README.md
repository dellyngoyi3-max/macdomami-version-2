# 🍗 Restaurant MacDo Mami — Version 2

Site officiel GitHub Pages du restaurant MacDo Mami.

Site vitrine + commande + réservation pour **MacDo Mami**, fast-food congolais moderne à Kinshasa (RDC).
Burgers congolais, poulet braisé, chikwangue, pizzas, grillades et jus naturels, livrés dans les communes de Kinshasa.

> **100 % statique et sans backend** : les commandes, réservations et devis arrivent
> directement sur le **WhatsApp** du restaurant. Aucune base de données, aucune dépendance.

---

## ✨ Fonctionnalités

- **8 pages** : Accueil, Menu, Panier & commande, Réservation, Événements, Traiteur/devis, Contact, Politique de confidentialité.
- **Menu filtrable** (8 catégories, 35 plats) : photo, description, portions, piment, allergènes, temps de préparation.
- **Règle anti-invention** : aucun prix/horaire/numéro inventé → les valeurs inconnues affichent « [À RENSEIGNER] ». Tout se complète dans un seul fichier : `js/data.js`.
- **Double devise** : USD + FC automatiques, taux unique modifiable en 1 ligne, bascule **$ USD | FC** mémorisée.
- **Livraison par zones** (4 zones de Kinshasa) : frais + délai estimé calculés automatiquement ; « sur place » et « à emporter » gratuits.
- **Localisation souple** : commune + adresse partielle + point de repère + position GPS facultative (sur action de l'utilisateur uniquement).
- **Récapitulatif avant envoi** : numéro de commande unique (`MM-YYYYMMDD-HHMM`), totaux USD/FC, confirmation sur WhatsApp.
- **Réservation, événements et traiteur** : formulaires → messages WhatsApp formatés (« Merci de confirmer la disponibilité »).
- **Mobile-first**, panier persistant (localStorage), barre panier fixe sur mobile.
- **Vie privée** : aucun cookie de suivi, aucun traceur, GPS jamais stocké, politique de confidentialité fournie.
- **Performance** : images WebP légères (~936 Ko pour 16 photos), `loading="lazy"`.

---

## 📁 Structure

```
macdo-mami/
├── index.html          # Accueil
├── menu.html           # Menu
├── panier.html         # Panier & commande
├── reservation.html    # Réservation de table
├── evenements.html     # Événements
├── traiteur.html       # Traiteur / devis
├── contact.html        # Contact & zones de livraison
├── confidentialite.html# Politique de confidentialité
├── INFOS-RESTAURANT.md # ⭐ récapitulatif de toutes les infos utilisées
├── css/styles.css      # tout le design
├── js/
│   ├── data.js         # ⭐ CONTENU CENTRAL (coordonnées, taux, zones, menu, prix)
│   ├── commun.js       # helpers, panier, devise, en-tête, WhatsApp
│   ├── menu.js         # affichage du menu
│   ├── panier.js       # panier + commande
│   └── forms.js        # réservation, événements, traiteur
└── images/             # 16 photos WebP
```

---

## 🔧 Personnalisation avant mise en ligne

**Tout est centralisé dans `js/data.js`** :

| Constante | Valeur actuelle | À faire |
|---|---|---|
| `CONFIG.whatsapp` | `"243999907678"` | ✅ réel (fourni) |
| `CONFIG.telephone` | `"+243 999 907 678"` | ✅ réel |
| `CONFIG.horaires` | `"Lundi – Dimanche : 10h00 – 21h00"` | ✅ réel |
| `CONFIG.email` | `[À RENSEIGNER]` | à renseigner |
| `CONFIG.adresse` | Avenue du Commerce, Gombe | ✅ rue réelle — n° de parcelle à confirmer |
| `CONFIG.tauxUSD` | `2800` | taux du jour (1 USD = ? FC) |
| `MENU[].price` | prix indicatifs (USD) | à confirmer avec vos vrais prix |

Les textes d'adresse et d'horaires apparaissent aussi dans le pied de page de chaque page
et sur `contact.html` / `reservation.html` (textes en `[À RENSEIGNER]`).

---

## ▶️ Tester en local

```bash
cd macdo-mami
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

---

## 🌐 Publication GitHub Pages

Cette version 2 est publiée sur GitHub Pages à l’adresse :
`https://dellyngoyi3-max.github.io/macdomami-version-2/`

## 🌐 Déployer sur GitHub Pages

1. Créer un dépôt GitHub (ex. `macdo-mami`).
2. Pousser le projet :

```bash
cd macdo-mami
git init
git add .
git commit -m "Site MacDo Mami"
git branch -M main
git remote add origin https://github.com/VOTRE_COMPTE/macdo-mami.git
git push -u origin main
```

3. GitHub → **Settings → Pages → Source = `main` / racine → Save**.
4. Site en ligne sur `https://VOTRE_COMPTE.github.io/macdo-mami/`.
   ➡️ Mettre à jour `CONFIG.url` avec cette URL.

---

## 🗺️ Feuille de route (suggestions)

- [ ] **Tableau de suivi des commandes** (reçue → confirmée → préparation → livraison → terminée).
- [ ] Fiche **Google Business Profile** pour le référencement local.
- [ ] Photos réelles des plats (remplacer les photos générées).

## ⚖️ Note sur le nom

« MacDo Mami » peut évoquer la marque **McDonald's**. Avant toute communication officielle,
vérifier la disponibilité juridique/commerciale du nom (registre de commerce, recherche de marques).
