import axios from 'axios';

const API_URL = 'http://localhost:3003/api'; // Update this with your backend API URL



export const register = (userData) => {
  return axios.post(`${API_URL}/users/register`, userData);
};

export const createUtilisateur = (UtilisateurData) => {
  return axios.post(`${API_URL}/users`, UtilisateurData);
};

export const updateUtilisateur = (id, UtilisateurData) => {
  return axios.put(`${API_URL}/users/${id}`, UtilisateurData);
};

export const deleteUtilisateur = (id) => {
  return axios.delete(`${API_URL}/users/${id}`);
};

export const getUtilisateurs = () => {
  return axios.get(`${API_URL}/users`);
};

export const getUtilisateur = (id) => {
  return axios.get(`${API_URL}/users/${id}`);
};


export const login = (credentials) => {
  return axios.post(`${API_URL}/users/login`, credentials);
};

export const requestPasswordReset = ({ email, matricule }) => {
  return axios.post(`${API_URL}/users/request-reset`, { email, matricule });
};

export const resetPassword = (resetToken , data) => {
  return axios.post(`${API_URL}/users/reset-password/${resetToken }`, data);
};
