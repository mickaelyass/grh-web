import React, { useEffect, useState } from 'react';
import { getUtilisateurs, deleteUtilisateur } from '../../services/apiUser';
import { Link } from 'react-router-dom';
import Footer from '../Footer';
import Head from '../Head';
import MenuAdmin from '../MenuAdmin';
import '../Dasbord.css'

const UtilisateurList = () => {
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

  const handleDelete = async (id) => {
    try {
      await deleteUtilisateur(id);
      fetchUtilisateurs();
    } catch (error) {
      console.error('Error deleting Utilisateur', error);
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  

  return (
    
    <div className="dashboard">
      <Head toggleMenu={toggleMenu} />
      <MenuAdmin isMenuOpen={isMenuOpen} />
      <main className={`content ${isMenuOpen ? 'content-expanded slide-enter' : 'content-collapsed'}`}>
      <div className='row'>
      <div className='col'>
      <div className="container py-5">
      <h1 className="card-title text-light bg-clair  py-2 ps-2 mb-3">Utililisateurs</h1>
      <Link to="/register" className="btn btn-primary mb-3">Create New Utilisateur</Link>
      <table className="table table-hover table-striped">
        <thead>
          <tr>
            <th>Matricule</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {Utilisateurs.map(Utilisateur => (
            <tr key={Utilisateur.id_user}>
              <td>{Utilisateur.matricule}</td>
              <td>{Utilisateur.role}</td>
              <td>
                <Link to={`/edit-utilisateur/${Utilisateur.id_user}`} className="btn btn-warning mr-2 me-2">Editer</Link>
                <button onClick={() => handleDelete(Utilisateur.id_user)} className="btn btn-danger">Supprimer</button>
              </td>
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
export default UtilisateurList;