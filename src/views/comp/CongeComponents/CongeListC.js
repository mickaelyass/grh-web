import React, { useEffect, useState } from 'react';
import '../Dasbord.css';
import ListeDemandesParService from './ListeDemandeService';
import { getDoc } from '../../../services/api';
const user = JSON.parse(localStorage.getItem('user')); 
const matricule = user ? user.matricule : '';


const CongeListC = () => {
    const [dossier, setDossier] = useState([]);  
    const [service, setService] = useState(''); 
    useEffect(() => {
        fetchDossiers();
        console.log(dossier);
      }, [matricule]);
    
      const fetchDossiers = async () => {
        try {
          const response = await getDoc(matricule);
          setDossier(response.data);
        setService(response.data.InfoPro.poste_actuel_service);
        } catch (error) {
          console.error('Error fetching dossiers', error);
        }
      };

  return (
    
    <div className="dashboard">
      <div className='row'>
      
      <div className="col-md-3 col-lg-2 bg-light sidebar">
    
        </div>
      <div className='col-md-9 col-lg-10 main-content'>
      <div className="container py-3">
      <ListeDemandesParService service={service} />
    </div>
      </div>
        
    </div>
    </div>
   
  );
  
};

export default CongeListC;