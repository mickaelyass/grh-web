import React,{useState,useEffect} from "react";
import { getUserNotif, markNotificationAsRead} from "../services/api";
import { useLocation } from "react-router-dom";
import Head from "./Head";
import MenuUserC from "./MenuUserC";
import Footer from "./Footer";

const NotifC=()=>{
 const [notifs,setNotifs]=useState([]);
 const location = useLocation();
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const { matricule } = location.state || {}; 
 const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  // Créer un état pour gérer la visibilité de chaque notification
  const [visibleNotifications, setVisibleNotifications] = useState({});

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      console.log('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  // Fonction pour gérer l'affichage ou le masquage d'une notification spécifique
  const handleToggleVisibility = (id) => {
    setVisibleNotifications(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
     handleMarkAsRead(id);
  };
 useEffect(() => {


    const fetchNotif = async () => {
      try {
        console.log(matricule);
        const response = await getUserNotif(matricule);
        console.log(response.data); 
        setNotifs(response.data);
      } catch (error) {
        setError('Failed to fetch notifs');
      } finally {
        setLoading(false);
      }
    };
    if (matricule) {
      fetchNotif();
    }
  }, [matricule]);

 
  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

  if (notifs.length === 0) {
    return <div className="text-center mt-5">Aucun notification trouvé.</div>;
  }
  

  return (
    <div className="dashboard">
      <Head toggleMenu={toggleMenu} />
      <MenuUserC isMenuOpen={isMenuOpen} />
      <main
      className={`content ${
        isMenuOpen ? "content-expanded slide-enter" : "content-collapsed"
      }`}
    >
      <div className="container-fluid mt-4">
        <h2 className="card-title text-light bg-clair  py-2 ps-2 mb-3">Notifications</h2>
        <div className="row">
          {notifs.map(notif => (
            <div key={notif.id} className="col-md-4 mb-3">
              <div className="card bg-light">
                <div className="card-body">
                  <p><strong>ID Utilisateur :</strong> {notif.user_id}</p>
                  {visibleNotifications[notif.id] && (
                    <section>
                      <p><strong>Message :</strong> {notif.message}👀 👀</p>
                      <p><strong>Date :</strong> {notif.create_dat}</p>
                    </section>
                  )}
                  <button
                    className="btn btn-primary mt-1"
                    onClick={() => handleToggleVisibility(notif.id)}
                  >
                    {visibleNotifications[notif.id] ? 'Moins' : 'Plus'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
      <Footer />
    </div>
  );
};

export default NotifC;