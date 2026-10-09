import api from './http';


//const API_URL = "https://app-backend-011q.onrender.com/api";
const API_URL = import.meta.env.VITE_API_BASE_URL; // Update this with your backend API URL

//const API_URL="http://localhost:3003/api"

export const createDossier = (dossierData) => {
  return api.post(`/dossiers`, dossierData);
};

export const updateMutation = (matricule, mutationData) => {
  return api.post(`/dossiers/mutations/${matricule}`, mutationData);
};

export const updateDossier = (id, dossierData) => {
  return api.put(`/dossiers/${id}`, dossierData);
};

export const deleteDossier = (id) => {
  return api.delete(`/dossiers/${id}`);
};

export const getDossiers = () => {
  return api.get(`/dossiers`);
};
export const getNotification = () => {
  console.log(API_URL);
  return api.get(`/notifications`);
};
export const getUserNotif = (matricule) => {
  return api.get(`/notifications/${matricule}`);
};

export const getDossier = (id) => {
  return api.get(`/dossiers/${id}`);
};

export const getDoc = (matricule) => {
  return api.get(`/dossiers/user/${matricule}`);
};

// Service pour effectuer la recherche des dossiers
export const getDossierSearch = (nom, service) => {
  return api.get(`/dossiers/search`, {
    params: {
      nom,     // Paramètre pour le nom de l'utilisateur
      service  // Paramètre pour le service
    }
  });
};


export const updateDossierEtat = async (id_dossier, etat) => {
  const response = await api.put(`/dossiers/${id_dossier}/etat`, {etat:etat});
  return response.data;
};


export const markNotificationAsRead = async (id) => {
  try {
    const response = await api.put(`/notifications/read/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la notification :", error);
    throw error;
  }
};

export const createEvaluation = async (evaluationData) => {
  try {
    const response = await api.post(`/evaluations/create-evaluation`, evaluationData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getEvaluations = async () => {
  try {
    const response = await api.get(`/evaluations`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getEvaluationByService = async (service) => {
  try {
    const response = await api.get(`/evaluations/service/${service}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getEvalByID = async (id) => {
  try {
    const response = await api.get(`/evaluations/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const editEvaluation = async (id,evaluationData) => {
  try {
    const response = await api.put(`/evaluations/${id}`, evaluationData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};