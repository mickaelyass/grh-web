import axios from 'axios';
const API_URL = "https://app-backend-011q.onrender.com/api";


//const API_URL = import.meta.env.VITE_API_BASE_URL;; // Update this with your backend API URL
//const API_URL="http://localhost:3003/api"
// Fonction pour créer une demande de congés avec pièces jointes
export const createDemandeConges = async (formData) => {
  console.log(formData);
  try {
    const response = await axios.post(`${API_URL}/demande-conges/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la demande de congés:', error);
    throw error;
  }
};

export const fetchDemandeConges = async () => {
  try {
    const response = await axios.get(`${API_URL}/demande-conges`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes de congés:', error);
    throw error;
  }
};

export const fetchDemandesParService = async (service) => {
  try {
    const response = await axios.get(`${API_URL}/demandes/service/${service}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes de congés:', error);
    throw error;
  }
};

export const fetchDemandesByStatus = async (status) => {
  try {
    const response = await axios.get(`${API_URL}/demande-conges/status/${status}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes de congés:', error);
    throw error;
  }
};

export const fetchDemandeCongesById = async (id_cong) => {
  try {
    const response = await axios.get(`${API_URL}/demande-conges/${id_cong}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la demande de congés:', error);
    throw error;
  }
};


// Function to fetch a specific leave request by matricule
export const fetchDemandeCongesByMatricule = async (matricule) => {
  try {
    const response = await axios.get(`${API_URL}/demande-conges/${matricule}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la demande de congés:', error);
    throw error;
  }
};

// Function to update the decision by the chef de service
 export const updateDecisionChefService = async (id, decision) => {
  try {
    const response = await axios.put(`${API_URL}/demande-conges/${id}/decision-chef-service`, { decision_chef_service: decision });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la décision du chef de service:', error);
    throw error;
  }
};

// Function to update the decision by the directrice
export const updateDecisionDirectrice = async (id, decision) => {
  try {
    const response = await axios.put(`${API_URL}/demande-conges/${id}/decision-directrice`, { decision_directrice: decision });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la décision de la directrice:', error);
    throw error;
  }
};

// Function to delete a leave request
export const deleteDemandeConges = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/demande-conges/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de la demande de congés:', error);
    throw error;
  }
}; 