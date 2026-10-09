# GestiPerso — Frontend (Gestion du personnel)

Interface **React** de l'application **GestiPerso (Gestion du personnel)** :
tableaux de bord, dossiers du personnel, congés avec circuit de validation,
présences, évaluations et notifications temps réel.

> **Stack** : React 18 · Vite · **CSS pur (SCSS maison, sans CoreUI, sans Bootstrap, sans Tailwind)** · Redux · React Router ·
> FullCalendar · Chart.js · Formik / Yup · Axios · Socket.IO client.

> ℹ️ Ce dépôt ne contient que le **frontend**. L'API REST correspondante est dans
> le dépôt **`grh-api`** (Node.js · Express · Sequelize · PostgreSQL).

---

## 1. Fonctionnalités

- **Authentification & rôles** : `admin`, `chef_service`, `directrice`,
  `securite`, `user` — guard unique `RequireRole` + registre `src/config/roles.js`.
- **Dossiers du personnel** : identité, informations professionnelles, bancaires
  et complémentaires ; diplômes, distinctions, sanctions, postes antérieurs,
  mutations, pièces jointes.
- **Congés** : demande, circuit de validation (Chef → Directrice), suivi par
  statut.
- **Présences** et **évaluations**.
- **Notifications** temps réel via **Socket.IO**.
- **Tableaux de bord** (graphiques Chart.js) et **calendrier** (FullCalendar).

---

## 2. Design system (CSS pur, sans CoreUI)

Plus aucune dépendance à **CoreUI**, **Bootstrap**, **react-bootstrap**,
**simplebar**, **popper** ni **core-js** :

```text
src/
├── App.js · index.js (ThemeProvider + store)
├── theme/ThemeContext.jsx            # light / dark / auto → <html data-theme>
├── ui/                               # Button, Card, Form, Table, Modal,
│                                     # Dropdown, Sidebar, Header, Grid…
├── components/ui/                    # PageHeader, StatCard, SectionCard,
│                                     # TableCard, StatusBadge, Pagination…
├── config/roles.js · navigation.js · routes.js · theme.js
├── layout/DefaultLayout.js           # shell sidebar + header + content
├── scss/
│   ├── _tokens.scss                  # variables CSS light/dark
│   ├── _base.scss                    # reset + typographie
│   ├── _layout.scss                  # grille 12 colonnes + shell
│   ├── _components.scss              # boutons, cartes, formulaires…
│   ├── _utilities.scss               # utilitaires maison (d-flex, m-3…)
│   ├── _app.scss                     # header, sidebar, dashboard…
│   └── style.scss                    # point d'entrée
```

Thème clair/sombre via `data-theme` sur `<html>`, persisté en `localStorage`.

---

## 3. Prérequis

- **Node.js** ≥ 18 et npm
- L'API **`grh-api`** démarrée (par défaut sur `http://localhost:3003`)

---

## 4. Installation & exécution

```bash
npm install
npm start        # serveur de développement Vite (3000, puis 3001+ si 3000 est pris)
npm run build    # build de production → build/
npm run serve    # prévisualisation du build
npm run lint     # ESLint
```

### Configuration

**Aucune configuration n'est nécessaire en développement.** Le fichier versionné
**`.env.development`** fait appeler l'API par la **propre origine du front**
(`VITE_API_BASE_URL=/api`) et `vite.config.mjs` relaie `/api` et `/socket.io`
vers `API_PROXY_TARGET` (par défaut `http://localhost:3003`).

```env
# .env.development
VITE_API_BASE_URL=/api
API_PROXY_TARGET=http://localhost:3003
```

Ce proxy supprime toute requête cross-origin : **plus aucun blocage CORS**, même
si le serveur de dev change de port (3000 occupé par une autre application,
`npm start` bascule sur 3001, 3002…), et sans rien modifier côté `grh-api`.

Le fichier **`.env`** (local, non versionné) ne sert qu'à pointer vers un autre
backend ou à configurer le build de production — voir **`.env.example`** :

```env
VITE_API_BASE_URL=http://localhost:3003/api
```

---

## 5. Déploiement sur Render

Le build produit un site statique dans `build/`, servi par `serve` (fallback
SPA activé via `-s`, donc les routes React fonctionnent en direct).

| Réglage Render | Valeur |
| --- | --- |
| Type | **Web Service** (runtime **Node**) |
| Branche | `main` |
| **Build Command** | `npm ci && npm run build` |
| **Start Command** | `npm run start:prod` |
| Node | déduit de `engines` (`>=20 <23` → Node 22) |

`package-lock.json` **doit être versionné**, sinon `npm ci` échoue au build.

### Variables d'environnement (onglet *Environment* du service)

```env
# Obligatoire : URL de l'API. Vite la fige dans le bundle AU MOMENT DU BUILD,
# donc elle doit être présente AVANT le build — une modification de cette
# variable impose un nouveau déploiement (pas seulement un restart).
VITE_API_BASE_URL=https://app-backend-011q.onrender.com/api
```

`API_PROXY_TARGET` n'est **pas** utile sur Render : le proxy Vite n'existe qu'en
développement. En production le front appelle l'API directement, en cross-origin.

### Côté API (`grh-api`, service Render séparé)

```env
# Origine exacte du front deploie (obligatoire : CORS)
FRONTEND_URL=https://<nom-du-front>.onrender.com
```

Sans cette variable, l'API renvoie
`Access-Control-Allow-Origin: http://localhost:3000` et **toutes** les requêtes
du front déployé sont bloquées par le navigateur.
