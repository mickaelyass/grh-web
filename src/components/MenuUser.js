import React ,{useEffect,useState}from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
import 'bootstrap/dist/css/bootstrap.min.css'; // Assurez-vous que Bootstrap est bien importé
import './MenuAdmin.css'; // Assurez-vous que le fichier CSS existe pour les styles personnalisés
import { getUserNotif } from '../services/api';

const MenuUser = ({ isMenuOpen }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')); // Récupérer l'utilisateur depuis le localStorage
    const matricule = user ? user.matricule : ''; // Extraire le matricule de l'utilisateur
    
  const [notifications, setNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getUserNotif(matricule);
        const allNotifications = response.data;

        // Filtrer les notifications lues
        const readNotifs = allNotifications.filter(notification => notification.is_read);
        setReadNotifications(readNotifs);

        // Filtrer les notifications non lues
        const unreadNotifs = allNotifications.filter(notification => !notification.is_read);
        setUnreadNotifications(unreadNotifs);

        setNotifications(allNotifications); // Si vous avez besoin de toutes les notifications
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [matricule]);

    const handleNavigation = (path, data) => {
      navigate(path, { state: data });
    };
  
    const logout = () => {
      // Suppression du token ou des informations de session
      localStorage.removeItem('token'); 
      localStorage.removeItem('user');
      // Redirection vers la page de connexion
      handleNavigation('/login');
    };

  return (
    <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div >
            {/* Première barre blanche */}
            <div className="top-bar bg-success py-1 shadow-sm"></div>

{/* Deuxième barre blanche */}
<div className="top-bar mx-3 bg-white py-1 shadow-sm mt-1"></div>
      
      </div>
      <h3 className=" my-4  text-light">Menu</h3>
      <ul className="navbar-nav ms-auto">
          <li className="nav-item mb-3">
            <a className="nav-link"  onClick={() => handleNavigation('/user-dashbord', null)}>
              <i className="bi bi-house-door me-1"></i> Tableau de bord
            </a>
          </li>
          <li className="nav-item mb-3">
            <a className="nav-link " onClick={() => handleNavigation('/mon-profile', { matricule })}>
              <i className="bi bi-person me-1"></i> Mon profile
            </a>
          </li>
          <li className="nav-item mb-3">
            <a className="nav-link" onClick={() => handleNavigation('/create-conge', {matricule})}>
              <i className="bi bi-calendar-plus me-1"></i> Soumettre une nouvelle demande de congé
            </a>
          </li>

          <a className="nav-link mb-4" onClick={() => handleNavigation('/notifs', { matricule })} >
          <i className="bi bi-bell me-1"></i>  Notifications <span class="badge bg-danger">{unreadNotifications.length}</span>
         </a>

          {/* <li className="nav-item mb-3">
            <a className="nav-link bg-danger text-light"  onClick={logout} >
              <i className="bi bi-box-arrow-right me-1 ps-2"></i> Deconnexion
            </a>
          </li> */}
        </ul>
    </div>
  );
};

export default MenuUser;
