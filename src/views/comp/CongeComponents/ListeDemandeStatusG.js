import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDemandesByStatus } from '../../../services/apiConge';

const ListeDemandesParStatusG = ({ status }) => {
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
        const data = await fetchDemandesByStatus(status);
        const dataAu = data.filter((item) => item.decision_directrice !== "En attente");
        setDemandes(dataAu);
      } catch (error) {
        console.error('Erreur lors du chargement des demandes :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDemandes();
  }, [status]);

  const getStatusBadge = (status) => {
  switch (status) {
    case 'Validé':
    case 'Autorisée':
      return <span className="badge bg-success p-2">{status}</span>;
    case 'Invalidé':
    case 'Rejetée':
      return <span className="badge bg-danger p-2">{status}</span>;
    default:
      return <span className="badge bg-secondary p-2">{status}</span>;
  }
};


  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      {demandes.length === 0 ? (
        <div className="text-center my-5">
          <h3 className="text-warning">Aucune demande de congé gérée.</h3>
          <p className="text-muted">Veuillez vérifier plus tard.</p>
        </div>
      ) : (
        <>
          <h2 className="card-title py-2 ps-2">
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
                <th>Statut</th>
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
                  <td className='text-center'>{getStatusBadge(demande.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ListeDemandesParStatusG;
