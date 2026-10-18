# GestiPerso — Frontend (Gestion du personnel)

Interface **React** de l'application **GestiPerso (Gestion du personnel)** :
tableaux de bord, dossiers du personnel, congés avec circuit de validation,
présences, évaluations et notifications temps réel.

> **Stack** : React 18 · Vite · CSS pur (SCSS maison, sans CoreUI/Bootstrap/
> Tailwind) · Redux · React Router · FullCalendar · Chart.js ·
> react-hook-form / zod · Axios · Socket.IO client.

> ℹ️ Ce dépôt ne contient que le **frontend**. L'API REST correspondante est
> dans le dépôt **`grh-api`** (Node.js · Express · Sequelize · PostgreSQL).

## Fonctionnalités

- **Authentification & rôles** : `admin`, `chef_service`, `directrice`,
  `securite`, `user` — guard unique `RequireRole` + registre `src/config/roles.js`.
- **Dossiers du personnel** : identité, informations professionnelles, bancaires
  et complémentaires ; diplômes, distinctions, sanctions, postes antérieurs,
  mutations, pièces jointes.
- **Congés** : demande, circuit de validation (Chef → Directrice), suivi par statut.
- **Présences**, **évaluations**, **notifications** temps réel (Socket.IO).
- **Tableaux de bord** (Chart.js) et **calendrier** (FullCalendar).

## Design system (CSS pur)

Plus aucune dépendance à CoreUI, Bootstrap, react-bootstrap, simplebar, popper
ni core-js. Tokens light/dark via `data-theme` sur `<html>` (persisté en
`localStorage`) :

```text
src/
├── theme/ThemeContext.jsx      # light / dark / auto
├── ui/                         # Button, Card, Form, Table, Modal, Sidebar…
├── components/ui/              # PageHeader, StatCard, StatusBadge…
├── config/roles.js · navigation.js · routes.js · theme.js
├── layout/DefaultLayout.js     # shell sidebar + header + contenu
└── scss/                       # _tokens, _base, _layout, _components…
```

## Prérequis

- **Node.js** ≥ 20 (< 23, voir `engines`)
- L'API **`grh-api`** démarrée (par défaut sur `http://localhost:3003`)

## Installation & exécution

```bash
npm install
npm start        # serveur de dev Vite (3000, puis 3001+ si 3000 est pris)
npm run build    # build de production → build/
npm run serve    # prévisualisation du build
npm run lint     # ESLint
```

### Configuration

**Aucune configuration nécessaire en développement** : le fichier versionné
`.env.development` fait appeler l'API par la propre origine du front
(`VITE_API_BASE_URL=/api`) et `vite.config.mjs` relaie `/api` et
`/socket.io` vers `API_PROXY_TARGET` (par défaut `http://localhost:3003`).
Aucun blocage CORS, même si le port de dev change.

Le fichier `.env` (local, non versionné — modèle `.env.example`) ne sert qu'à
pointer vers un autre backend ou à configurer le build de production :

```env
VITE_API_BASE_URL=http://localhost:3003/api
```

## Déploiement

Le build produit un site statique dans `build/`, servi par `serve` (fallback
SPA via `-s`). `package-lock.json` doit rester versionné (requis par `npm ci`).

| Réglage hébergeur | Valeur |
| --- | --- |
| Type | Web Service (runtime Node) |
| Build Command | `npm ci && npm run build` |
| Start Command | `npm run start:prod` |
| Node | déduit de `engines` (Node 22) |

### Variables d'environnement de production

```env
# URL de l'API. Elle est figée dans le bundle AU MOMENT DU BUILD :
# toute modification impose un nouveau build + redéploiement.
VITE_API_BASE_URL=https://<nom-du-service-api>.onrender.com/api
```

`API_PROXY_TARGET` n'est utile qu'en développement (proxy Vite) ; en
production le front appelle l'API directement, en cross-origin.

### Côté API (`grh-api`, service séparé)

```env
# Origine exacte du front déployé (obligatoire : CORS)
FRONTEND_URL=https://<nom-du-front>.onrender.com
```

Sans cette variable, l'API n'autorise que `http://localhost:3000` et toutes
les requêtes du front déployé sont bloquées par le navigateur.
