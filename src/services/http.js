// ============================================================================
//  GestiPerso — instance axios partagée
//  ---------------------------------------------------------------------------
//  Toutes les routes de l'API (sauf login / mot de passe oublié) exigent le
//  JWT : sans header `Authorization`, le backend renvoie 401. On centralise
//  ici l'attachement du jeton et la gestion de la session expirée, afin
//  qu'aucun service n'oublie plus jamais le header.
// ============================================================================

import axios from 'axios'
import { getToken } from '../utils/auth'

const api = axios.create({
  // Base commune : ex. https://app-backend-011q.onrender.com/api
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

// Requête sortante → porte le JWT de la session (s'il existe).
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Réponse en erreur :
//  - 401 hors login → jeton absent/expiré ou compte désactivé : on nettoie la
//    session et on renvoie à la connexion (une seule fois, pas de boucle).
//  - Le 401 du login lui-même (mauvais mot de passe) est laissé à l'écran.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url || ''
    const estAppelAuth = url.includes('/users/login')
    if (status === 401 && !estAppelAuth && typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)

export default api

