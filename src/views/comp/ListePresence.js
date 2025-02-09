import React, { useEffect, useState } from "react";
import { getAllPresences } from "../../services/presenceService";

const ListePresences = () => {
  const [presencesByDate, setPresencesByDate] = useState({});

  useEffect(() => {
    const fetchPresences = async () => {
      try {
        const response = await getAllPresences();
        if (!response.data || !Array.isArray(response.data)) {
          console.error("Format de données inattendu :", response.data);
          return;
        }

        // Trier les présences par date (desc) puis par matricule (asc)
        const sortedPresences = response.data.sort((a, b) => {
          const dateA = new Date(a.date_presence).getTime();
          const dateB = new Date(b.date_presence).getTime();
          const matriculeA = a.matricule || "";
          const matriculeB = b.matricule || "";

          if (dateA !== dateB) {
            return dateB - dateA; // Dates en ordre décroissant
          }
          return matriculeA.localeCompare(matriculeB); // Matricule en ordre croissant
        });

        // Regrouper les présences par date
        const groupedByDate = sortedPresences.reduce((acc, presence) => {
          const date = new Date(presence.date_presence).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(presence);
          return acc;
        }, {});

        setPresencesByDate(groupedByDate);
      } catch (error) {
        console.error("Erreur lors de la récupération des présences :", error);
      }
    };

    fetchPresences();
  }, []);

  return (
    <div className="container mt-4">
      <h4 className="mb-3">📅 Liste des Présences</h4>

      {Object.keys(presencesByDate).length > 0 ? (
        Object.keys(presencesByDate).map((date, index) => (
          <div key={index} className="mb-4">
            <h5 className="bg-dark text-white p-2 rounded">📌 {date}</h5>
            <table className="table table-striped table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>#</th>
                  <th>Nom et prénoms</th>
                  <th>Heure d'Arrivée</th>
                  <th>Heure de Départ</th>
                  <th>Statut</th>
                  <th>Observations</th>
                </tr>
              </thead>
              <tbody>
                {presencesByDate[date].map((presence, idx) => (
                  <tr key={presence.id}>
                    <td>{idx + 1}</td>
                    <td>{presence.nom} {presence.prenom}</td>
                    <td>{presence.heure_arrivee || "--:--"}</td>
                    <td>{presence.heure_depart || "--:--"}</td>
                    <td>{presence.statut}</td>
                    <td>{presence.observations || "Aucune"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p className="text-center">Aucune fiche de présence disponible.</p>
      )}
    </div>
  );
};

export default ListePresences;
