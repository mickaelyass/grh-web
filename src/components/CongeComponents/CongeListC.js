import React, { useEffect, useState } from 'react';
import Footer from '../Footer';
import Head from '../Head';
import MenuUserC from '../MenuUserC';
import '../Dasbord.css';
import ListeDemandesParService from './ListeDemandeService';
import { getDoc } from '../../services/api';
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
  
  const [isMenuOpen, setIsMenuOpen] = useState(true);
 
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  

  return (
    
    <div className="dashboard">
      <Head toggleMenu={toggleMenu} />
      <MenuUserC isMenuOpen={isMenuOpen} />
      <main className={`content ${isMenuOpen ? 'content-expanded slide-enter' : 'content-collapsed'}`}>
      <div className='row'>
      
      <div className="col-md-3 col-lg-2 bg-light sidebar">
    
        </div>
      <div className='col-md-9 col-lg-10 main-content'>
      <div className="container py-3">
      <ListeDemandesParService service={service} />
    </div>
      </div>
        
    </div>
      </main>
      <Footer/>
    </div>
   
  );
  
};

export default CongeListC;