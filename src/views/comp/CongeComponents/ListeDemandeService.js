import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDemandesParService } from '../../../services/apiConge';

const ListeDemandesParService = ({ service }) => {
    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

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
        console.log(demandes);
    }, [service]);

    const handleManageDemande = (id_cong) => {
        // Navigate to another page with the demande ID as a parameter
        navigate(`/chef-service/chef-demande/${id_cong}`);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            {demandes.length > 0 ? (  // Afficher le titre seulement si des demandes existent
                <h2 className="card-title  rounded py-2 ps-2 mb-3">
                    Liste des demandes de congés pour le service: {service}
                </h2>
            ) : null} 
            
            {demandes.length === 0 ? (  // Vérification si la liste est vide
                <div className="text-center my-5">  {/* Centrer le message */}
                    <h3 className="text-warning">Aucune demande de congé disponible pour ce service.</h3>
                    <p className="text-muted">Veuillez vérifier plus tard.</p>
                </div>
            ) : (
                <div className="card-deck">
                    {demandes.map((demande) => (
                        <div key={demande.id_cong} className="card mb-3">
                            <div className="card-body">
                                <h5 className="card-title">{demande.matricule}</h5>
                                <p className="card-text">
                                    <strong>Date de début :</strong> {formatDate(demande.date_debut)}<br />
                                    <strong>Raison :</strong> {demande.raison}<br />
                                    <strong>Statut :</strong> {demande.status}
                                </p>
                                 {/* Afficher les pièces jointes */}
          {demande.piecesJointes && (
            <div className="mt-2">
              <h6>Pièces jointes :</h6>
              <ul>
                {demande.piecesJointes.url_certificat_non_jouissance && (
                  <li>
                    <a 
                      href={demande.piecesJointes.url_certificat_non_jouissance} 
                      target="_blank" 
                      rel="noopener noreferrer">
                      Certificat de non-jouissance
                    </a>
                  </li>
                )}
                {demande.piecesJointes.url_derniere_autorisation_conges && (
                  <li>
                    <a 
                      href={demande.piecesJointes.url_derniere_autorisation_conges} 
                      target="_blank" 
                      rel="noopener noreferrer">
                      Dernière autorisation de congés
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
                                <button className="btn btn-primary" onClick={() => handleManageDemande(demande.id_cong)}>Gérer</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ListeDemandesParService;
