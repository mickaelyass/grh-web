import React, { useEffect, useState } from 'react';
import { getUtilisateurs } from '../../services/apiUser';
import { Link } from 'react-router-dom';
import Footer from '../Footer';
import Head from '../Head';
import MenuAdminD from '../MenuAdminD';
import '../Dasbord.css'

const UtilisateurListD = () => {
  const [Utilisateurs, setUtilisateurs] = useState([]);

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const fetchUtilisateurs = async () => {
    try {
      const response = await getUtilisateurs();
      setUtilisateurs(response.data);
    } catch (error) {
      console.error('Error fetching Utilisateurs', error);
    }
  };


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
      <div className='col'>
      <div className="container py-5">
      <h1 className="card-title text-light bg-clair  py-2 ps-2 mb-3">Utililisateurs</h1>
      <Link to="/register" className=" d-none btn btn-primary mb-3">Create New Utilisateur</Link>
      <table className="table table-hover table-striped">
        <thead >
          <tr >
            <th className='bg-primary'>Matricule</th>
            <th className='bg-primary' >Role</th>
          </tr>
        </thead>
        <tbody>
          {Utilisateurs.map(Utilisateur => (
            <tr key={Utilisateur.id_user}>
              <td>{Utilisateur.matricule}</td>
              <td>{Utilisateur.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      </div>
        
    </div>
      </main>
      <Footer/>
    </div>
   
  );
};

export default UtilisateurListD;