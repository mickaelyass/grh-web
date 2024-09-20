import axios from 'axios';

const API_URL = 'http://localhost:3003/api'; // Update this with your backend API URL

export const createDossier = (dossierData) => {
  return axios.post(`${API_URL}/dossiers`, dossierData);
};

export const updateMutation = (matricule, mutationData) => {
  return axios.put(`${API_URL}/mutations/${matricule}`, mutationData);
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
export const getDossierSearch = async (nom, service) => {
  try {
      const response = await axios.get(`${API_URL}/dossiers/search`, {
          params: { nom, service }
      });
      return response.data;
  } catch (error) {
      console.error('Error fetching dossiers:', error);
      throw error;
  }
};

export const updateDossierEtat = async (id_dossier, etat_depart) => {
  const response = await axios.put(`${API_URL}/dossiers/${id_dossier}/etat`, {etat_depart:etat_depart});
  return response.data;
};


export const markNotificationAsRead = (id) => {
  return axios.patch(`${API_URL}/notifications/${id}/read`);
}