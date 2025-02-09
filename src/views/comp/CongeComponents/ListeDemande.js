// components/ListeDemandesParService.js
import React, { useEffect, useState } from 'react';
import { fetchDemandeConges ,deleteDemandeConges} from '../../../services/apiConge';
import '../Dasbord.css'


const ListeDemandes = () => {
    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    const handleDelete = async (id) => {
      try {
        if(window.confirm(`le dossier ${id} sera supprimer `)){
          await deleteDemandeConges(id);
          fetchDemandeConges()
        }
      else{
        fetchDemandeConges()
      }
       ;
      } catch (error) {
        console.error('Error deleting demandes', error);
      }
    };
  
    useEffect(() => {
        const fetchDemandes = async () => {
            try {
                const data = await fetchDemandeConges();
                const filteredData = data.filter(demande => demande.status !== 'En attente');
                setDemandes(filteredData);
            } catch (error) {
                console.error('Error fetching leave requests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDemandes();
    });
    if (loading) return <p>Loading...</p>;

    return (

      <div className="dashboard">
      {demandes.length === 0 && (
        <div className="text-center my-5"> {/* Centrer le message */}
          <h3 className="text-warning">Aucune demande de congé disponible pour ce service.</h3>
          <p className="text-muted">Veuillez vérifier plus tard.</p>
        </div>
      )}
      {demandes.length > 0 &&  (
        <div className="container">
          <h2 className="card-title rounded ps-2 mb-3">Liste des demandes de congés</h2>
          <table className="table table-bordered table-striped">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Matricule</th>
                <th>Date de Début</th>  
                 <th>Date de Fin</th>
                <th>Année de Jouissance</th>
                <th>Type de congé</th>
                <th>Décision Chef Service</th>
                <th>Décision Directrice</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {demandes.map((demande, index) => (
                <tr key={demande.id_cong}>
                  <td>{index + 1}</td>
                  <td>{demande.matricule}</td>
                  <td>{formatDate(demande.date_debut)}</td>
                   <td>{formatDate(demande.date_de_fin)}</td>
                  <td>{demande.annee_jouissance}</td>
                  <td>{demande?.type_de_conge}</td>
                  <td>{demande.decision_chef_service}</td>
                  <td>{demande.decision_directrice}</td>
                  {demande.status=="Rejetée"&&<td className='text-danger'>{demande.status}</td>}
                  {demande.status=="En attente"&&<td>{demande.status}</td>}
                  {demande.status=="Autorisée"&&<td className='text-success'>{demande.status}</td>}
                  <td>
                    <button
                      onClick={() => handleDelete(demande.id_cong)}
                      className="btn btn-danger btn-sm"
                    >
                      Supprimer
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

export default ListeDemandes;
