import axios from 'axios';


//const API_URL = "https://app-backend-011q.onrender.com/api";
const API_URL = import.meta.env.VITE_API_BASE_URL; // Update this with your backend API URL

//const API_URL="http://localhost:3003/api"

export const createDossier = (dossierData) => {
  return axios.post(`${API_URL}/dossiers`, dossierData);
};

export const updateMutation = (matricule, mutationData) => {
  return axios.post(`${API_URL}/dossiers/mutations/${matricule}`, mutationData);
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
  console.log(API_URL);
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

export const createEvaluation = async (evaluationData) => {
  try {
    const response = await axios.post(`${API_URL}/evaluations/create-evaluation`, evaluationData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getEvaluations = async () => {
  try {
    const response = await axios.get(`${API_URL}/evaluations`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getEvaluationByService = async (service) => {
  try {
    const response = await axios.get(`${API_URL}/evaluations/service/${service}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getEvalByID = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/evaluations/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const editEvaluation = async (id,evaluationData) => {
  try {
    const response = await axios.put(`${API_URL}/evaluations/${id}`, evaluationData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};