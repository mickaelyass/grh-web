// components/ListeDemandesParService.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDemandesParService } from '../../services/apiConge';

const ListeDemandesParService = ({ service }) => {
    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDemandes = async () => {
            try {
                const data = await fetchDemandesParService(service);
                setDemandes(data);
            } catch (error) {
                console.error('Error fetching leave requests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDemandes();
    }, [service]);

    const handleManageDemande = (id_cong) => {
        // Navigate to another page with the demande ID as a parameter
        navigate(`/manage-demande/${id_cong}`);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
        <h2 className="card-title text-light bg-clair  py-2 ps-2 mb-3">Liste des demandes de congés pour le service: {service}</h2>
        <div className="card-deck">
          {demandes.map((demande) => (
            <div key={demande.id_cong} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{demande.matricule}</h5>
                <p className="card-text">
                  <strong>Date de début :</strong> {demande.date_debut}<br />
                  <strong>Raison :</strong> {demande.raison}<br />
                  <strong>Statut :</strong> {demande.status}
                </p>
                <button className="btn btn-primary" onClick={() => handleManageDemande(demande.id_cong)}>Gérer</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
};

export default ListeDemandesParService;
