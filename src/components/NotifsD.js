import React,{useState,useEffect} from "react";
import { getNotification,markNotificationAsRead } from "../services/api";
import Head from "./Head";
import MenuAdminD from "./MenuAdminD";
import './Dasbord.css'
import Footer from "./Footer";

const NotifsD=()=>{
 const [notifs,setNotifs]=useState([]);
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
      const response = await getNotification();
      setNotifs(response.data);
    };
    fetchNotif();
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  

  return (
    
    <div className="dashboard">
      <Head toggleMenu={toggleMenu} />
      <MenuAdminD isMenuOpen={isMenuOpen} />
      <main className={`content ${isMenuOpen ? 'content-expanded slide-enter' : 'content-collapsed'}`}>
      <div className="container-fluid mt-4">
      <h2 className="card-title text-light bg-clair  py-2 ps-2 mb-3">Notifications  </h2>
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
      <Footer/>
    </div>
   
  );
};

export default NotifsD;