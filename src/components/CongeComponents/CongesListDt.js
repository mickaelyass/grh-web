import React, {  useState } from 'react';
import Footer from '../Footer';
import Head from '../Head';
import '../Dasbord.css';
import ListeDemandesParStatus from './ListeDemandeParStatus';
import MenuAdminD from '../MenuAdminD';
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
      <Head toggleMenu={toggleMenu} />
      <MenuAdminD isMenuOpen={isMenuOpen} />
      <main className={`content ${isMenuOpen ? 'content-expanded slide-enter' : 'content-collapsed'}`}>
      <div className='row'>
      
      <div className="col-md-3 col-lg-2 bg-light sidebar">
    
        </div>
      <div className='col-md-9 col-lg-10 main-content'>
      <div className="container py-3">
      <ListeDemandesParStatus status={"Autorisée"} />
    </div>
      </div>
        
    </div>
      </main>
      <Footer/>
    </div>
   
  );
  
};

export default CongeListDt;