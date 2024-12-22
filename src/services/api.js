import axios from 'axios';

const API_URL = 'http://localhost:3003/api'; // Update this with your backend API URL

export const createDossier = (dossierData) => {
  return axios.post(`${API_URL}/dossiers`, dossierData);
};

export const updateMutation = (matricule, mutationData) => {
  return axios.post(`${API_URL}/mutations/${matricule}`, mutationData);
};

export const updateDossier = (id, dossierData) => {
  return axios.put(`${API_URL}/dossiers/${id}`, dossierData);
};

export const deleteDossier = (id) => {
  return axios.delete(`${API_URL}/dossiers/${id}`);
};

export const getDossiers = () => {
  return axios.get(`${API_URL}/dossiers`);
};
export const getNotification = () => {
  return axios.get(`${API_URL}/notifications`);
};
export const getUserNotif = (matricule) => {
  return axios.get(`${API_URL}/notifications/${matricule}`);
};

export const getDossier = (id) => {
  return axios.get(`${API_URL}/dossiers/${id}`);
};

export const getDoc = (matricule) => {
  return axios.get(`${API_URL}/dossiers/user/${matricule}`);
};

// Service pour effectuer la recherche des dossiers
export const getDossierSearch = (nom, service) => {
  return axios.get(`${API_URL}/dossiers/search`, {
    params: {
      nom,     // Paramètre pour le nom de l'utilisateur
      service  // Paramètre pour le service
    }
  });
};


export const updateDossierEtat = async (id_dossier, etat) => {
  const response = await axios.put(`${API_URL}/dossiers/${id_dossier}/etat`, {etat:etat});
  return response.data;
};


export const markNotificationAsRead = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/notifications/read/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la notification :", error);
    throw error;
  }
};