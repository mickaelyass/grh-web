import React,{useState,useEffect} from "react";
import { getNotification,markNotificationAsRead } from "../../services/api";
import './Dasbord.css'


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


  return (
    
    <div className="dashboard">
      <div className="container-fluid mt-4">
      
      <div className="row">
      {notifs.map(notif => (


            <div key={notif.id} className="col-md-4 mb-3">
              <h2 className="card-title text-light   py-2 ps-2 mb-3">Notifications  </h2>
              <div className="card bg-dark">
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

    </div>
   
  );
};

export default NotifsD;