import React from 'react'
import { basePathForRole, roleFromPathname } from './roles'

// ============================================================================
//  GestiPerso — Route registry
//  ---------------------------------------------------------------------------
//  Replaces the five per-role route files (AdminRoute / UserRoute / …) which
//  duplicated each other, kept dead demo routes and could not be read as a
//  whole.
//
//  Paths are RELATIVE to the role workspace: `dossier-list` is served at
//  `/admin/dossier-list`. Components stay lazily imported so every screen keeps
//  its own chunk.
// ============================================================================

const view = (loader) => React.lazy(loader)

const TableauDeBord = view(() => import('../views/dashboard/TableauDeBord'))

/* ------------------------------------------------------------------ ADMIN */
const ADMIN_ROUTES = [
  { path: 'dashboard', name: 'Tableau de bord', element: TableauDeBord },
  {
    path: 'dossier-list',
    name: 'Dossiers des agents',
    element: view(() => import('../views/comp/DossierComponents/DossierList')),
  },
  {
    path: 'create-dossier',
    name: 'Nouveau dossier',
    element: view(() => import('../views/comp/DossierComponents/CreateDossier')),
  },
  {
    path: 'edit-dossier/:id_dossier',
    name: 'Modifier le dossier',
    element: view(() => import('../views/comp/DossierComponents/EditDossier')),
  },
  {
    path: 'profile/:id',
    name: "Détail de l'agent",
    element: view(() => import('../views/comp/DossierComponents/Profile')),
  },
  {
    path: 'profile/gerer-etat/:id_dossier',
    name: 'Changer l’état',
    element: view(() => import('../views/comp/DossierComponents/GererEtat')),
  },
  {
    path: 'mutation-form/:matricule',
    name: 'Mutation',
    element: view(() => import('../views/comp/DossierComponents/MutationForm')),
  },
  {
    path: 'detachement-form/:matricule',
    name: 'Détachement',
    element: view(() => import('../views/comp/DossierComponents/DetachementForm')),
  },
  {
    path: 'mise-en-disponibilite-form/:matricule',
    name: 'Mise en disponibilité',
    element: view(() => import('../views/comp/DossierComponents/MiseEnDisponibilité')),
  },
  {
    path: 'mise-a-disposition-form/:matricule',
    name: 'Mise à disposition',
    element: view(() => import('../views/comp/DossierComponents/MiseADisposition')),
  },
  {
    path: 'utilisateur-list',
    name: 'Comptes utilisateurs',
    element: view(() => import('../views/comp/UtilisateurComponents/UtilisateurList')),
  },
  {
    path: 'edit-utilisateur/:id',
    name: 'Modifier le compte',
    element: view(() => import('../views/comp/UtilisateurComponents/EditUtilisateur')),
  },
  {
    path: 'register',
    name: 'Créer un compte',
    element: view(() => import('../views/pages/register/Register')),
  },
  {
    path: 'register-admin',
    name: 'Créer un compte administrateur',
    element: view(() => import('../views/pages/register/RegisterA')),
  },
  {
    path: 'conge-liste',
    name: 'Demandes de congés',
    element: view(() => import('../views/comp/CongeComponents/ListeDemande')),
  },
  {
    path: 'liste-presence',
    name: 'Suivi des présences',
    element: view(() => import('../views/comp/ListePresence')),
  },
  {
    path: 'liste-evaluation',
    name: "Fiches d'évaluation",
    element: view(() => import('../views/comp/ListeEvaluationA')),
  },
  {
    path: 'notifs-admin',
    name: 'Notifications',
    element: view(() => import('../views/comp/Notifs')),
  },
  {
    path: 'mon-profile',
    name: 'Mon profil',
    element: view(() => import('../views/comp/Monprofile')),
  },
]

/* ------------------------------------------------------------- DIRECTRICE */
const DIRECTRICE_ROUTES = [
  { path: 'dashboard', name: 'Tableau de bord', element: TableauDeBord },
  {
    path: 'dossier-list-directrice',
    name: 'Dossiers des agents',
    element: view(() => import('../views/comp/DossierComponents/DossierListD')),
  },
  {
    path: 'utilisateur-list-directrice',
    name: 'Comptes utilisateurs',
    element: view(() => import('../views/comp/UtilisateurComponents/UtilisateurListD')),
  },
  {
    path: 'gestion-conges/en-attente',
    name: 'Congés en attente',
    element: view(() => import('../views/comp/CongeComponents/CongesListDt')),
  },
  {
    path: 'gestion-conges/deja-gerer',
    name: 'Congés déjà traités',
    element: view(() => import('../views/comp/CongeComponents/CongeListD')),
  },
  {
    path: 'directrice-demande/:id_cong',
    name: 'Décision sur la demande',
    element: view(() => import('../views/comp/CongeComponents/DecisionDirectrice')),
  },
  {
    path: 'liste-evaluationd/en-attente',
    name: 'Évaluations en attente',
    element: view(() => import('../views/comp/ListeEvaluation')),
  },
  {
    path: 'liste-evaluationd/deja-gerer',
    name: 'Évaluations déjà appréciées',
    element: view(() => import('../views/comp/ListeEvaluationA')),
  },
  {
    path: 'evaluations/editCommitte/:id',
    name: 'Appréciation du comité',
    element: view(() => import('../views/comp/FicheEvaluationComitte')),
  },
  {
    path: 'create-dossier',
    name: 'Nouveau dossier',
    element: view(() => import('../views/comp/DossierComponents/CreateDossier')),
  },
  {
    path: 'edit-dossier/:id_dossier',
    name: 'Modifier le dossier',
    element: view(() => import('../views/comp/DossierComponents/EditDossier')),
  },
  {
    path: 'profile/gerer-etat/:id_dossier',
    name: 'Changer l’état',
    element: view(() => import('../views/comp/DossierComponents/GererEtat')),
  },
  {
    path: 'mutation-form/:matricule',
    name: 'Mutation',
    element: view(() => import('../views/comp/DossierComponents/MutationForm')),
  },
  {
    path: 'detachement-form/:matricule',
    name: 'Détachement',
    element: view(() => import('../views/comp/DossierComponents/DetachementForm')),
  },
  {
    path: 'mise-en-disponibilite-form/:matricule',
    name: 'Mise en disponibilité',
    element: view(() => import('../views/comp/DossierComponents/MiseEnDisponibilité')),
  },
  {
    path: 'mise-a-disposition-form/:matricule',
    name: 'Mise à disposition',
    element: view(() => import('../views/comp/DossierComponents/MiseADisposition')),
  },
  {
    path: 'profileD/:matricule',
    name: 'Mon profil',
    element: view(() => import('../views/comp/DossierComponents/ProfileD')),
  },
  {
    path: 'notifs-directrice',
    name: 'Notifications',
    element: view(() => import('../views/comp/NotifsD')),
  },
]

/* ------------------------------------------------------------- CHEF DE SERVICE */
const CHEF_ROUTES = [
  { path: 'dashboard', name: 'Tableau de bord', element: TableauDeBord },
  { path: 'mon-profile-chef', name: 'Mon profil', element: view(() => import('../views/comp/MonprofileC')) },
  {
    path: 'evaluation',
    name: "Ma fiche d'évaluation",
    element: view(() => import('../views/comp/FicheEvaluation')),
  },
  {
    path: 'evaluations/edit/:id',
    name: "Appréciation d'un agent",
    element: view(() => import('../views/comp/FicheEvaluationSup')),
  },
  {
    path: 'liste-evaluations',
    name: 'Évaluations des agents',
    element: view(() => import('../views/comp/ListeEvaluationS')),
  },
  {
    path: 'create-conge-chef',
    name: 'Soumettre un congé',
    element: view(() => import('../views/comp/CongeComponents/CreateCongeC')),
  },
  {
    path: 'conge-list-chef',
    name: 'Demandes de congés',
    element: view(() => import('../views/comp/CongeComponents/CongeListC')),
  },
  {
    path: 'chef-demande/:id_cong',
    name: 'Décision sur la demande',
    element: view(() => import('../views/comp/CongeComponents/DecisionChef')),
  },
  {
    path: 'notifs-chef',
    name: 'Notifications',
    element: view(() => import('../views/comp/NotifsC')),
  },
]

/* -------------------------------------------------------------- SÉCURITÉ */
const SECURITE_ROUTES = [
  { path: 'dashboard', name: 'Tableau de bord', element: TableauDeBord },
  { path: 'mon-profile', name: 'Mon profil', element: view(() => import('../views/comp/Monprofile')) },
  {
    path: 'create-conge',
    name: 'Soumettre un congé',
    element: view(() => import('../views/comp/CongeComponents/CreateCongeG')),
  },
  {
    path: 'create-presence',
    name: 'Pointage du jour',
    element: view(() => import('../views/comp/CreatePresence')),
  },
  {
    path: 'liste-presence',
    name: 'Historique des présences',
    element: view(() => import('../views/comp/ListePresence')),
  },
  { path: 'notifs', name: 'Notifications', element: view(() => import('../views/comp/Notif')) },
]

/* ------------------------------------------------------------------ AGENT */
const USER_ROUTES = [
  { path: 'dashboard', name: 'Tableau de bord', element: TableauDeBord },
  { path: 'mon-profile', name: 'Mon profil', element: view(() => import('../views/comp/Monprofile')) },
  {
    path: 'evaluation',
    name: "Ma fiche d'évaluation",
    element: view(() => import('../views/comp/FicheEvaluation')),
  },
  {
    path: 'create-conge',
    name: 'Soumettre un congé',
    element: view(() => import('../views/comp/CongeComponents/CreateConge')),
  },
  { path: 'notifs', name: 'Notifications', element: view(() => import('../views/comp/Notif')) },
]

export const ROUTE_TABLES = {
  admin: ADMIN_ROUTES,
  directrice: DIRECTRICE_ROUTES,
  chef_service: CHEF_ROUTES,
  securite: SECURITE_ROUTES,
  user: USER_ROUTES,
}

export const routesForRole = (role) => ROUTE_TABLES[role] || USER_ROUTES

/* -------------------------------------------------------------- Matching */

/** Compares a route pattern (`profile/:id`) with a concrete path. */
const segmentsMatch = (routePath, targetPath) => {
  const routeSegments = routePath.split('/').filter(Boolean)
  const targetSegments = targetPath.split('/').filter(Boolean)
  if (routeSegments.length !== targetSegments.length) return false
  return routeSegments.every(
    (segment, index) => segment.startsWith(':') || segment === targetSegments[index],
  )
}

const humanize = (path) => {
  const last = path.split('/').filter(Boolean).pop() || ''
  const label = last.replace(/[-_]/g, ' ').replace(/\bid\b/gi, '').trim()
  return label ? label.charAt(0).toUpperCase() + label.slice(1) : 'Page'
}

/**
 * Resolves the label and the role workspace of a URL — used by the breadcrumb
 * without pulling `path-to-regexp`.
 * @returns {{ role: string, name: string, path?: string }|null}
 */
export const findRouteMeta = (pathname) => {
  const role = roleFromPathname(pathname)
  if (!role) return null

  const relative = pathname.slice(basePathForRole(role).length).replace(/^\//, '')
  if (!relative) return { role, name: 'Tableau de bord' }

  const routes = routesForRole(role)
  const exact = routes.find((route) => route.path === relative)
  if (exact) return { role, name: exact.name, path: exact.path }

  const partial = routes.find((route) => segmentsMatch(route.path, relative))
  if (partial) return { role, name: partial.name, path: partial.path }

  return { role, name: humanize(relative) }
}

export default ROUTE_TABLES
