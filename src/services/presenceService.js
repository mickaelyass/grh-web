import axios from "axios";

const API_URL = "http://localhost:3003/api"; 

// 📌 Récupérer toutes les fiches de présence
export const getAllPresences = async () => {
  try {
    const response = await axios.get(`${API_URL}/presences`);
    return response;
  } catch (error) {
    console.error("Erreur récupération présences:", error.response?.data || error.message);
    return [];
  }
};

// 📌 Récupérer les présences d'un jour donné
export const getPresencesByDate = async (date) => {
  try {
    const response = await axios.get(`${API_URL}/presences/${date}`);
    return response;
  } catch (error) {
    console.error("Erreur récupération présence par date:", error.response?.data || error.message);
    return [];
  }
};

// 📌 Ajouter une nouvelle présence ou mettre à jour (upsert)
export const savePresence = async ({ data }) => {
    try {
        console.log("Données des fiches :", data);

        // Vérifiez si le tableau n'est pas vide
        if (!data || data.length === 0) {
          throw new Error("Aucune fiche de présence à enregistrer");
        }
    
      const response = await axios.post(`${API_URL}/presences`, { fiches: data });
      return response;
    } catch (error) {
      console.error("Erreur d'enregistrement de la présence :", error.response?.data || error.message);
      throw error;  // Je vais relancer l'erreur pour être géré dans le formulaire
    }
  };

