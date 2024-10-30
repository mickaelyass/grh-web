import React, {  useState } from 'react';
import '../Dasbord.css';
import ListeDemandesParStatus from './ListeDemandeParStatus';
import ListeDemandes from './ListeDemande';

const user = JSON.parse(localStorage.getItem('user')); 
const matricule = user ? user.matricule : '';


const CongeListDt = () => {
    
  
  const [isMenuOpen, setIsMenuOpen] = useState(true);
 
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  

  return (
    
    <div className="dashboard">
      <div className='row'>
      
      <div className="col-md-3 col-lg-2 bg-light sidebar">
    
        </div>
      <div className='col-md-9 col-lg-10 main-content'>
      <div className="container py-3">
      <ListeDemandesParStatus status={"Autorisée"} />
    </div>
      </div> 
    </div>
    </div>
   
  );
  
};

export default CongeListDt;