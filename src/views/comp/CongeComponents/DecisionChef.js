import React, { useState, useEffect } from 'react';
import { fetchDemandeCongesById, updateDecisionChefService} from '../../../services/apiConge';
import { getDoc } from '../../../services/api';
import { useParams } from 'react-router-dom';
import '../Dasbord.css';
import { useLocation } from 'react-router-dom';


const DecisionChef = () => {
  const { id_cong } = useParams();
  const [demande, setDemande] = useState(null);
  const [decision, setDecision] = useState('');
  const [isMenuOpen, setIsMenuOpen] = React.useState(true);
  const location = useLocation();
 // const { matricule } = location.state || {};

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const [dossier, setDossier] = useState(null);

 /*  const [doc, setDoc] = useState('');
     const getDossier=async()=>{
      try{
        const reponse =await getDoc(demande.matricule);
        setDoc(reponse);
        console.log(reponse.data);
      }catch (error) {
        console.error('Erreur lors de la récupération du dossier:', error);
      }
     }; */
  useEffect(() => {
    const fetchDemande = async () => {
      try {
        const result = await fetchDemandeCongesById(id_cong); 
        
        setDemande(result);
       console.log(result);

         // Extraction du matricule de la demande
      const matricule = result?.matricule; // Assurez-vous que le champ 'matricule' existe dans la demande

      if (matricule) {
        // Récupération du dossier associé au matricule
        const dossier = await getDoc(matricule);
        setDossier(dossier.data);
        console.log(dossier.data);
      } else {
        console.error('Matricule non trouvé dans la demande');
      }
      } catch (error) {
        console.error('Erreur lors de la récupération de la demande:', error);
      }
    };
    fetchDemande();
    
  }, [id_cong]);

   const handleDecision = async () => {
    try {

        await updateDecisionChefService(id_cong, decision);
     
      // Optionally, refresh the state or redirect
      alert('Décision enregistrée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la décision:', error);
    }
  }; 

  if (!demande) return <div>Chargement...</div>;

  return (
    <div className="dashboard">
      <div className='row'>
        <div className="col-md-3 col-lg-2 bg-light sidebar"></div>
        <div className='col-md-9 col-lg-10 main-content'>
          <div className='container'>
        <h2 className="text-center my-2 rounded bg-clair py-2 text-light">Consulter la Demande de Congés</h2>

        <div className="card mb-3">
       <div className="card-header">
          Détails de la Demande
        </div>
        <div className="card-body">
          {dossier && (<p><strong>Nom et prenom:</strong>  {dossier.InfoIdent.nom} {dossier.InfoIdent.prenom}</p>)}
        <p><strong>Matricule:</strong> {demande.matricule}</p>
        <p><strong>Date de Début:</strong> {demande.date_debut}</p>
        <p><strong>Année de Jouissance:</strong> {demande.annee_jouissance}</p>
        <p><strong>Raison:</strong> {demande.raison}</p>


      {demande.Piece_jointe && (
          <div>
            {demande.Piece_jointe.url_certificat_non_jouissance && (
              <div>
                <p><strong>Certificat:</strong></p>
                <iframe
                  src={demande.Piece_jointe.url_certificat_non_jouissance}
                  width="600"
                  height="400"
                  title="Certificat"
                  frameBorder="0"
                >
                  <p>Votre navigateur ne prend pas en charge les iframes.</p>
                </iframe>
              </div>
            )}
            {demande.Piece_jointe.url_derniere_autorisation_conges && (
              <div>
                <p><strong>Attestation:</strong></p>
                <iframe
                  src={demande.Piece_jointe.url_derniere_autorisation_conges}
                  width="600"
                  height="400"
                  title="Attestation"
                  frameBorder="0"
                >
                  <p>Votre navigateur ne prend pas en charge les iframes.</p>
                </iframe>
              </div>
            )}
          </div>
        )}
        </div>
      </div>

       <div className="card">
       <div className="card-header">
          Décision
        </div>
        <div className="card-body">
           <button  className="btn btn-success" onClick={() => setDecision('Autorisée')}>Autoriser</button>
        <button className="btn btn-danger" onClick={() => setDecision('Rejetée')}>Rejeter</button>
        {decision && (
          <div>
            <p>Vous avez choisi : {decision}</p>
            <button className="btn btn-primary" onClick={handleDecision}>Enregistrer la Décision</button>
          </div>
        )}
        </div>
       
      </div> 
    </div>
          </div>
      </div>
  </div>
   
  );
};

export default DecisionChef;
