// ============================================================================
//  GestiPerso — Session helpers
//  ---------------------------------------------------------------------------
//  The API returns `{ token, role, id_user, matricule }`; the login screen
//  enriches it with the agent identity (`nom`, `prenom`) so the shell can greet
//  the user. Everything goes through this module, so a corrupted entry can
//  never crash a screen.
// ============================================================================

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

export const getCurrentRole = () => getStoredUser()?.role

export const getCurrentMatricule = () => getStoredUser()?.matricule || ''

export const isAuthenticated = () => Boolean(getToken() && getStoredUser())

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
