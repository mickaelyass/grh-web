import React, {  useState } from 'react';
import '../Dasbord.css';
import ListeDemandesParStatus from './ListeDemandeParStatus';
import ListeDemandes from './ListeDemande';
import { CardHeader } from '../../../ui/Card'

const user = JSON.parse(localStorage.getItem('user')); 
const matricule = user ? user.matricule : '';

const CongeListDt = () => {
    
  
  const [isMenuOpen, setIsMenuOpen] = useState(true);
 
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  

  return (
    
    <div className="dashboard">
      <ListeDemandesParStatus status={"Autorisée"} />
    </div>
   
  );
  
};

export default CongeListDt;