import Icon from '../ui/Icon'
import {
  Alarm,
  Bell,
  CalendarCheck,
  ChartBar,
  Fingerprint,
  Folder,
  FolderOpen,
  Gauge,
  ListIcon,
  Notes,
  Plus,
  User,
  UserPlus,
  Users,
} from '../ui/icons'

// ---------------------------------------------------------------------------
//  GestiPerso — Sidebar information architecture
// ---------------------------------------------------------------------------
//  One menu per role, described as plain data so it can be read (and tested)
//  without rendering anything:
//
//    { type: 'title', name }              → section label
//    { type: 'item',  name, to, icon }    → single screen
//    { type: 'group', name, icon, items } → collapsible section
//
//  Every `to` is an absolute path, so the menu can be read without the router.
// ---------------------------------------------------------------------------

const icon = (Glyph) => <Icon icon={Glyph} />

const DASHBOARD = 'Tableau de bord'

const ADMIN_NAV = [
  { type: 'item', name: DASHBOARD, to: '/admin/dashboard', icon: icon(Gauge) },
  { type: 'title', name: 'Personnel' },
  { type: 'item', name: 'Dossiers des agents', to: '/admin/dossier-list', icon: icon(Folder) },
  { type: 'item', name: 'Nouveau dossier', to: '/admin/create-dossier', icon: icon(FolderOpen) },
  { type: 'title', name: 'Vie administrative' },
  { type: 'item', name: 'Demandes de congés', to: '/admin/conge-liste', icon: icon(Alarm) },
  { type: 'item', name: 'Suivi des présences', to: '/admin/liste-presence', icon: icon(CalendarCheck) },
  { type: 'item', name: "Fiches d'évaluation", to: '/admin/liste-evaluation', icon: icon(ChartBar) },
  { type: 'title', name: 'Administration' },
  { type: 'item', name: 'Comptes utilisateurs', to: '/admin/utilisateur-list', icon: icon(Users) },
  { type: 'item', name: 'Créer un compte', to: '/admin/register', icon: icon(UserPlus) },
  { type: 'item', name: 'Notifications', to: '/admin/notifs-admin', icon: icon(Bell) },
  { type: 'item', name: 'Mon profil', to: '/admin/mon-profile', icon: icon(User) },
]

const DIRECTRICE_NAV = [
  { type: 'item', name: DASHBOARD, to: '/directrice/dashboard', icon: icon(Gauge) },
  { type: 'title', name: 'Dossiers' },
  { type: 'item', name: 'Dossiers des agents', to: '/directrice/dossier-list-directrice', icon: icon(Folder) },
  { type: 'item', name: 'Comptes utilisateurs', to: '/directrice/utilisateur-list-directrice', icon: icon(Users) },
  { type: 'title', name: 'Validation' },
  {
    type: 'group',
    name: 'Demandes de congés',
    icon: icon(Alarm),
    items: [
      { type: 'item', name: 'En attente', to: '/directrice/gestion-conges/en-attente' },
      { type: 'item', name: 'Déjà traitées', to: '/directrice/gestion-conges/deja-gerer' },
    ],
  },
  {
    type: 'group',
    name: "Fiches d'évaluation",
    icon: icon(ChartBar),
    items: [
      { type: 'item', name: 'En attente', to: '/directrice/liste-evaluationd/en-attente' },
      { type: 'item', name: 'Déjà appréciées', to: '/directrice/liste-evaluationd/deja-gerer' },
    ],
  },
  { type: 'title', name: 'Mon espace' },
  { type: 'item', name: 'Notifications', to: '/directrice/notifs-directrice', icon: icon(Bell) },
  { type: 'item', name: 'Mon profil', to: '/directrice/profileD/me', icon: icon(User) },
]

const CHEF_NAV = [
  { type: 'item', name: DASHBOARD, to: '/chef-service/dashboard', icon: icon(Gauge) },
  { type: 'title', name: 'Mon espace' },
  { type: 'item', name: 'Mon profil', to: '/chef-service/mon-profile-chef', icon: icon(User) },
  { type: 'item', name: "Ma fiche d'évaluation", to: '/chef-service/evaluation', icon: icon(Notes) },
  { type: 'item', name: 'Soumettre un congé', to: '/chef-service/create-conge-chef', icon: icon(Plus) },
  { type: 'title', name: 'Mon service' },
  { type: 'item', name: 'Demandes de congés', to: '/chef-service/conge-list-chef', icon: icon(ListIcon) },
  { type: 'item', name: 'Évaluations des agents', to: '/chef-service/liste-evaluations', icon: icon(ChartBar) },
  { type: 'item', name: 'Notifications', to: '/chef-service/notifs-chef', icon: icon(Bell) },
]

const SECURITE_NAV = [
  { type: 'item', name: DASHBOARD, to: '/securite/dashboard', icon: icon(Gauge) },
  { type: 'title', name: 'Mon espace' },
  { type: 'item', name: 'Mon profil', to: '/securite/mon-profile', icon: icon(User) },
  { type: 'item', name: 'Soumettre un congé', to: '/securite/create-conge', icon: icon(Plus) },
  { type: 'title', name: 'Présences' },
  { type: 'item', name: 'Pointage du jour', to: '/securite/create-presence', icon: icon(Fingerprint) },
  { type: 'item', name: 'Historique des présences', to: '/securite/liste-presence', icon: icon(CalendarCheck) },
  { type: 'item', name: 'Notifications', to: '/securite/notifs', icon: icon(Bell) },
]

const USER_NAV = [
  { type: 'item', name: DASHBOARD, to: '/user/dashboard', icon: icon(Gauge) },
  { type: 'title', name: 'Mon espace' },
  { type: 'item', name: 'Mon profil', to: '/user/mon-profile', icon: icon(User) },
  { type: 'item', name: "Ma fiche d'évaluation", to: '/user/evaluation', icon: icon(Notes) },
  { type: 'item', name: 'Soumettre un congé', to: '/user/create-conge', icon: icon(Plus) },
  { type: 'item', name: 'Notifications', to: '/user/notifs', icon: icon(Bell) },
]

export const NAV_BY_ROLE = {
  admin: ADMIN_NAV,
  directrice: DIRECTRICE_NAV,
  chef_service: CHEF_NAV,
  securite: SECURITE_NAV,
  user: USER_NAV,
}

/** Menu of a role, with a safe fallback on the agent menu. */
export const navForRole = (role) => NAV_BY_ROLE[role] || USER_NAV

export default NAV_BY_ROLE
