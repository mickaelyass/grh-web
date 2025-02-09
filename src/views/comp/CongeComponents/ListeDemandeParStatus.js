import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDemandesByStatus } from '../../../services/apiConge'; // Assuming this service fetches by status

const ListeDemandesParStatus = ({ status  }) => {
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
        const data = await fetchDemandesByStatus(status); // Pass status as parameter
        const dataAu=data.filter(data=>
          data.decision_directrice ==="En attente");
        
    
      console.log(data);
      console.log(dataAu);
      setDemandes(dataAu);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDemandes();
  }, [status]); // Re-fetch on status change

  const handleManageDemande = (id_cong) => {
    navigate(`/directrice/directrice-demande/${id_cong}`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
    {demandes.length === 0 && (
      <div className="text-center my-5">
        {/* Centrer le message */}
        <h3 className="text-warning">Aucune demande de congé en attente.</h3>
        <p className="text-muted">Veuillez vérifier plus tard.</p>
      </div>
    )}
  
    {demandes.length > 0 && (
      <>
        <h2 className="card-title rounded py-2 ps-2">
          Liste des demandes de congés {status} par le chef Service
        </h2>
        <table className="table table-bordered table-striped">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Matricule</th>
              <th>Date de Début</th>
              <th>Date de Fin</th>
              <th>Type de congé</th>
              <th>Status</th>
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
                <td>{formatDate(demande.date_de_fin)}</td>
                <td>{demande.type_de_conge}</td>
                <td>{demande.status}</td>
                <td>
                  {demande.piecesJointes ? (
                    <ul>
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
                            href={demande.piecesJointes.url_derniere_autorisation_conges}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Dernière autorisation de congés
                          </a>
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-muted">Aucune pièce jointe</p>
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
      </>
    )}
  </div>
  
  );
};

export default ListeDemandesParStatus;