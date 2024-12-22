import React, {  useState } from 'react';
import '../Dasbord.css';
//import ListeDemandesParStatus from './ListeDemandeParStatus';
import ListeDemandesParStatusG from './ListeDemandeStatusG';
import { CCardHeader } from '@coreui/react';
//const user = JSON.parse(localStorage.getItem('user')); 
//const matricule = user ? user.matricule : '';


const CongeListD = () => {
  return (
    
    <div className="dashboard">
     
      <ListeDemandesParStatusG status={"Autorisée"} /> 
 
    </div>
   
  );
  
};

export default CongeListD;