# GRH — Frontend (Interface d'administration)

Interface d'administration **React** de l'application **GRH (Gestion des
Ressources Humaines)** : tableaux de bord, dossiers du personnel, congés avec
circuit de validation, présences, évaluations et notifications temps réel.

> **Stack** : React 18 · Vite · CoreUI Free React Admin · Redux · React Router ·
> FullCalendar · Chart.js · Formik / Yup · Axios · Socket.IO client.

> ℹ️ Ce dépôt ne contient que le **frontend**. L'API REST correspondante est dans
> le dépôt **`grh-api`** (Node.js · Express · Sequelize · PostgreSQL).
> Les deux dépôts proviennent de la scission de l'ancien dépôt `repository_2`
> (historique préservé via `git subtree split`).

---

## 1. Fonctionnalités

- **Authentification & rôles** : `Admin`, `Chef`, `Directrice`, `Gardien`,
  `Utilisateur` — guards de routes dédiés (`AdminRoute`, `ChefRoute`,
  `DirectriceRoute`, `SecuriteRoute`, `UserRoute`).
- **Dossiers du personnel** : identité, informations professionnelles, bancaires
  et complémentaires ; diplômes, distinctions, sanctions, postes antérieurs,
  mutations, pièces jointes.
- **Congés** : demande, circuit de validation (Chef → Directrice), suivi par
  statut.
- **Présences** et **évaluations**.
- **Notifications** temps réel via **Socket.IO**.
- **Tableaux de bord** (graphiques Chart.js) et **calendrier** (FullCalendar).

---

## 2. Structure

```text
src/
├── App.js · routes.js
├── AdminRoute.js · ChefRoute.js · DirectriceRoute.js
│   · SecuriteRoute.js · UserRoute.js     # guards par rôle
├── layout/                                # DefaultLayout, DirectriceLayout,
│                                          # GardienLayout, ...
├── components/                            # header, sidebar, breadcrumb, footer
├── views/
│   ├── comp/
│   │   ├── CongeComponents/               # CongeForm, CongeList, DecisionChef,
│   │   │                                  # DecisionDirectrice, ListeDemande...
│   │   ├── DossierComponents/             # DossierForm, DiplomeForm,
│   │   │                                  # DistinctionForm, DetachementForm...
│   │   ├── DashbordAdmin.js · CreatePresence.js · Documents.js
│   └── base/ · buttons/ · charts/ · ...   # pages de démonstration CoreUI
├── _nav*.js                               # menus de navigation par rôle
└── assets/
```

---

## 3. Prérequis

- **Node.js** ≥ 18 et npm
- L'API **`grh-api`** démarrée (par défaut sur `http://localhost:3003`)

---

## 4. Installation & exécution

```bash
npm install
npm start        # serveur de développement Vite
npm run build    # build de production
npm run serve    # prévisualisation du build
npm run lint     # ESLint
```

### Configuration

Créer un fichier **`.env`** local (non versionné) pour pointer vers l'API :

```env
VITE_API_URL=http://localhost:3003
```

> Le fichier `.env` est ignoré par Git (voir `.gitignore`). Ne jamais y committer
> de secrets.

---

## 5. Points d'attention

- Le dossier `views/base`, `views/buttons`, `views/charts`… provient du template
  **CoreUI** et sert de vitrine de composants : il peut être supprimé si inutile.
- Vérifier l'URL de l'API dans le code (rechercher `localhost:3003` /
  `app-backend`) et la déplacer vers `import.meta.env.VITE_API_URL`.
- Le fichier `vite.config.mjs.timestamp-*.mjs` est un artefact de build à
  supprimer.