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
                setDemandes(data);
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
        <div className='row'>
        <div className='col'>
        <div className="container ">
        <div>
        <h2 className="card-title text-light rounded  py-2 ps-2 mb-3">Liste des demandes de congés </h2>
        <div className="card-deck">
          {demandes.map((demande) => (
            <div key={demande.id_cong} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{demande.matricule}</h5>
                <p className="card-text">
                  <strong>Date de début :</strong>{formatDate( demande.date_debut)}
                </p>
                <p className="card-text">
                  <strong>Année de jouissance :</strong> {demande.annee_jouissance}
                </p>
                <p className="card-text">
                  <strong>Raison :</strong> {demande.raison}<br />
                </p>
                
                <p className="card-text">
                  <strong>Décision du chef service:</strong> {demande.decision_chef_service}
                </p>
                <p className="card-text">
                  <strong>Décision de la directrice :</strong> {demande.decision_directrice}
                </p>
                <p className="card-text">
                  <strong>Status :</strong> {demande.status}
                </p>
                <button onClick={() => handleDelete(demande.id_cong)} className="  btn btn-danger me-2">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
        </div>
      </div>
      </div>



       
    );
};

export default ListeDemandes;
