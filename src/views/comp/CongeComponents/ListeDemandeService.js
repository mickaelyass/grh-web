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
        {demandes.length > 0 && (
          <h2 className="card-title rounded py-2 ps-2 mb-3">
            Liste des demandes de congés pour le service : {service}
          </h2>
        )}
      
        {demandes.length === 0 ? (
          <div className="text-center my-5">
            {/* Message centré pour les listes vides */}
            <h3 className="text-warning">
              Aucune demande de congé disponible pour ce service.
            </h3>
            <p className="text-muted">Veuillez vérifier plus tard.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Matricule</th>
                  <th>Date de début</th>
                  <th>Raison</th>
                  <th>Statut</th>
                  <th>Pièces Jointes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {demandes.map((demande, index) => (
                  <tr key={demande.id_cong}>
                    <td>{index + 1}</td>
                    <td>{demande.matricule}</td>
                    <td>{formatDate(demande.date_debut)}</td>
                    <td>{demande.raison}</td>
                    <td>{demande.status}</td>
                    <td>
                      {demande.piecesJointes ? (
                        <ul className="list-unstyled mb-0">
                          {demande.piecesJointes.url_certificat_non_jouissance && (
                            <li>
                            <a
                         href={demande.piecesJointes.url_certificat_non_jouissance}
                         target="_blank"
                         rel="noopener noreferrer"
                       >
                                  {demande.type_de_conge === "Congé administratif"
                            ? "Certificat de non-jouissance"
                            : demande.type_de_conge ==="Congé maladie"
                            ? "Certificat médical"
                            : demande.type_de_conge ==="Congé maternité"
                            ? "Certificat de grossesse"
                            : `Certificat `}
                       </a>
                            </li>
                          )}
                          {demande.piecesJointes.url_derniere_autorisation_conges && (
                            <li>
                              <a
                                href={
                                  demande.piecesJointes.url_derniere_autorisation_conges
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Dernière autorisation de congés
                              </a>
                            </li>
                          )}
                        </ul>
                      ) : (
                        <span className="text-muted">Aucune pièce jointe</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleManageDemande(demande.id_cong)}
                      >
                        Gérer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
    );
};

export default ListeDemandesParService;
