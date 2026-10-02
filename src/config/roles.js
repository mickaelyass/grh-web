// ============================================================================
//  GestiPerso — Role registry
//  ---------------------------------------------------------------------------
//  Single source of truth for everything that changes from one profile to
//  another: labels, colours, landing page, notification inbox and self profile.
//  Keeping it here means the shell (sidebar, header, guards, breadcrumb) never
//  has to hard-code a role again.
// ============================================================================

export const DEFAULT_ROLE = 'user'

export const ROLES = {
  admin: {
    id: 'admin',
    label: 'Administrateur',
    shortLabel: 'Admin',
    badgeColor: 'primary',
    basePath: '/admin',
    homePath: '/admin/dashboard',
    notificationsPath: '/admin/notifs-admin',
    profilePath: '/admin/mon-profile',
    description:
      "Pilotage complet de l'application : dossiers du personnel, comptes utilisateurs et paramétrage.",
  },
  directrice: {
    id: 'directrice',
    label: 'Directrice générale',
    shortLabel: 'DG',
    badgeColor: 'info',
    basePath: '/directrice',
    homePath: '/directrice/dashboard',
    notificationsPath: '/directrice/notifs-directrice',
    profilePath: '/directrice/profileD/me',
    description:
      'Validation finale des congés, appréciation des évaluations et consultation des dossiers.',
  },
  chef_service: {
    id: 'chef_service',
    label: 'Chef de service',
    shortLabel: 'Chef',
    badgeColor: 'success',
    basePath: '/chef-service',
    homePath: '/chef-service/dashboard',
    notificationsPath: '/chef-service/notifs-chef',
    profilePath: '/chef-service/mon-profile-chef',
    description:
      'Encadrement de votre service : demandes de congés, évaluations des agents et suivi des présences.',
  },
  securite: {
    id: 'securite',
    label: 'Agent de sécurité',
    shortLabel: 'Sécurité',
    badgeColor: 'warning',
    basePath: '/securite',
    homePath: '/securite/dashboard',
    notificationsPath: '/securite/notifs',
    profilePath: '/securite/mon-profile',
    description: 'Contrôle des présences et pointage quotidien du personnel.',
  },
  user: {
    id: 'user',
    label: 'Agent',
    shortLabel: 'Agent',
    badgeColor: 'secondary',
    basePath: '/user',
    homePath: '/user/dashboard',
    notificationsPath: '/user/notifs',
    profilePath: '/user/mon-profile',
    description: 'Votre espace personnel : dossier, congés, évaluations et notifications.',
  },
}

export const ROLE_IDS = Object.keys(ROLES)

/** Human readable label, safe for unknown roles. */
export const roleLabel = (role) => (ROLES[role] ? ROLES[role].label : 'Utilisateur')

/** Short label used by compact badges (sidebar, tables). */
export const roleShortLabel = (role) => (ROLES[role] ? ROLES[role].shortLabel : '—')

/** Config of a role with a graceful fallback on `DEFAULT_ROLE`. */
export const getRoleConfig = (role) => ROLES[role] || ROLES[DEFAULT_ROLE]

/** Root path of the role workspace (`/admin`, `/user`, …). */
export const basePathForRole = (role) => getRoleConfig(role).basePath

/** Landing page after login, also used by the breadcrumb "Accueil" link. */
export const homePathForRole = (role) => getRoleConfig(role).homePath

/** Page listing every notification of the signed-in user. */
export const notificationsPathForRole = (role) => getRoleConfig(role).notificationsPath

/** Self profile page of the signed-in user (may be `null`). */
export const profilePathForRole = (role) => getRoleConfig(role).profilePath

/**
 * Detects the role workspace a URL belongs to.
 * @param {string} pathname location.pathname
 * @returns {string|undefined} role id when the path is inside a workspace
 */
export const roleFromPathname = (pathname = '') =>
  ROLE_IDS.find((roleId) => pathname === ROLES[roleId].basePath || pathname.startsWith(`${ROLES[roleId].basePath}/`))
