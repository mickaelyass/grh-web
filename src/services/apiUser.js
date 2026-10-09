// ============================================================================
//  GestiPerso — comptes utilisateurs (login, register admin, gestion)
//  ---------------------------------------------------------------------------
//  Toutes les routes /users sauf login / request-reset / reset-password sont
//  protégées côté backend : le header `Authorization: Bearer <token>` est
//  ajouté automatiquement par `services/http.js` (intercepteur).
// ============================================================================

import api from './http';

export const register = (userData) => {
  return api.post(`/users/register`, userData);
};

export const createUtilisateur = (UtilisateurData) => {
  return api.post(`/users`, UtilisateurData);
};

export const updateUtilisateur = (id, UtilisateurData) => {
  return api.put(`/users/${id}`, UtilisateurData);
};

export const deleteUtilisateur = (id) => {
  return api.delete(`/users/${id}`);
};

export const getUtilisateurs = () => {
  return api.get(`/users`);
};

export const getUtilisateur = (id) => {
  return api.get(`/users/${id}`);
};


export const login = (credentials) => {
  return api.post(`/users/login`, credentials);
};

export const requestPasswordReset = ({ email, matricule }) => {
  return api.post(`/users/request-reset`, { email, matricule });
};

export const resetPassword = (resetToken , data) => {
  return api.post(`/users/reset-password/${resetToken }`, data);
};
