// ============================================================================
//  GestiPerso — Session helpers
//  ---------------------------------------------------------------------------
//  The API returns `{ token, role, id_user, matricule }`; the login screen
//  enriches it with the agent identity (`nom`, `prenom`) so the shell can greet
//  the user. Everything goes through this module, so a corrupted entry can
//  never crash a screen.
// ============================================================================

import { normalizeRole } from '../config/roles'

export const TOKEN_KEY = 'token'
export const USER_KEY = 'user'

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

/** @returns {object|null} the signed-in user, or null when absent/corrupted. */
export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/** Best available label for the signed-in user (never empty). */
export const getDisplayName = (user = getStoredUser()) => {
  if (!user) return 'Utilisateur'
  const name = [user.prenom, user.nom].filter(Boolean).join(' ').trim()
  return name || user.matricule || 'Utilisateur'
}

/**
 * Role as the frontend understands it: the API calls an agent `employe`, this
 * app calls him `user`, so the two spellings are reconciled here once and for
 * all instead of in every screen that compares a role.
 */
export const getCurrentRole = () => normalizeRole(getStoredUser()?.role)

export const getCurrentMatricule = () => getStoredUser()?.matricule || ''

export const isAuthenticated = () => Boolean(getToken() && getStoredUser())

/**
 * Vrai si le JWT stocké est présent mais DÉJÀ expiré (champ `exp`, en secondes).
 * On décode sans vérifier la signature — le backend, lui, la vérifie toujours ;
 * ici on veut seulement éviter d'afficher une coquille vide au refresh quand la
 * session a expiré (le token reste dans localStorage jusqu'à son nettoyage).
 * Un token illisible n'est PAS considéré comme expiré : on le laisse au backend
 * trancher, plutôt que de déconnecter sur un simple problème de décodage.
 * @returns {boolean}
 */
export const isTokenExpired = () => {
  const token = getToken()
  if (!token) return true
  try {
    const payload = token.split('.')[1]
    if (!payload) return false
    // base64url -> JSON (les JWT n'ont pas toujours de padding).
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    if (!json.exp) return false
    return json.exp * 1000 <= Date.now()
  } catch {
    return false
  }
}

/** Stores the API response, merging the previously known identity. */
export const saveSession = (session) => {
  if (!session) return
  const previous = getStoredUser() || {}
  if (session.token) localStorage.setItem(TOKEN_KEY, session.token)
  localStorage.setItem(USER_KEY, JSON.stringify({ ...previous, ...session }))
}

/** Adds `nom` / `prenom` coming from the agent dossier to the session. */
export const mergeSessionIdentity = (identity) => {
  const previous = getStoredUser()
  if (!previous) return
  localStorage.setItem(USER_KEY, JSON.stringify({ ...previous, ...identity }))
}

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

/** Clears the session then sends the visitor back to the login screen. */
export const logout = (navigate) => {
  clearSession()
  if (typeof navigate === 'function') {
    navigate('/login', { replace: true })
    return
  }
  window.location.assign('/login')
}
