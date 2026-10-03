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
npm start        # serveur de développement Vite (port 3000)
npm run build    # build de production → build/
npm run serve    # prévisualisation du build
npm run lint     # ESLint
```

### Configuration

Créer un fichier **`.env`** local (non versionné) pour pointer vers l'API :

```env
VITE_API_BASE_URL=http://localhost:3003/api
```
