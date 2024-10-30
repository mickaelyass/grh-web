import React from 'react';
import { FaBars } from 'react-icons/fa'; // Icône de basculement
//import CanvasLogo from '../logo/CanvasLogo'; // Assurez-vous que ce chemin est correct
import "./head.css"
import Notification from './Notification';
import { useNavigate } from 'react-router-dom';
const Head = ({ toggleMenu }) => {
  const navigate = useNavigate();
  const handleNavigation = (path, data) => {
    navigate(path, { state: data });
  };
  const logout = () => {
    // Demander confirmation avant de déconnecter
    const confirmation = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
  
    if (confirmation) {
      // Si l'utilisateur confirme, suppression du token ou des informations de session
      localStorage.removeItem('token'); 
      localStorage.removeItem('user');
      
      // Redirection vers la page de connexion
      handleNavigation('/login');
    }
  };
  return (
    <header className="header  d-flex align-items-center bg-clair justify-content-between  text-light px-3">
      <div className="d-flex ms-4 align-items-center">
        <button className="btn btn-light  mx-5 " onClick={toggleMenu}>
          <FaBars />
        </button>
        <h3 className="mx-5 ps-5">Personnel Management</h3>
      </div>
      <button className="btn btn-dark position absolute position-fixed top-0 m-3 end-0 p-3">
            <a className="nav-link  text-light "  onClick={logout} >
              <i className="bi bi-box-arrow-right  text-danger me-1 ps-2"></i> Deconnexion
            </a>
          </button>
      <Notification />
    </header>
  );
};
export default Head;