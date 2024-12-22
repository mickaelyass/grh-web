import React,{useState,useEffect} from "react";
import { getNotification,markNotificationAsRead } from "../../services/api";
import './Dasbord.css'


const NotifsD=()=>{
 const [notifs,setNotifs]=useState([]);
 const [visibleNotifications, setVisibleNotifications] = useState({});

   const handleMarkAsRead = async (notificationId) => {
     try {
     await markNotificationAsRead(notificationId); 
      
       setNotifs((prevNotifs) =>
         prevNotifs.map((notif) =>
           notif.id_notif === notificationId ? { ...notif, is_read: true } : notif
         )
       ); 
     } catch (error) {
       console.error("Erreur lors de la mise à jour de la notification :", error);
     }
   };
 
   const handleToggleVisibility = (id) => {
     setVisibleNotifications((prevState) => ({
       ...prevState,
       [id]: !prevState[id],
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
    
    <div className="">
      <div className="container-fluid mt-4">
      
      <div className="row">
      <h2 className="card-title   py-2 ps-2 mb-3">Notifications  </h2>
      {notifs.map(notif => (


            <div key={notif.id_notif} className="col-md-4 mb-3">
             
              <div className="card ">
                <div className="card-body">
                  <p><strong>ID Utilisateur :</strong> {notif.user_id}</p>
                  {visibleNotifications[notif.id_notif] && (
                    <section>
                      <p><strong>Message :</strong> {notif.message}👀 👀</p>
                      <p><strong>Date :</strong> {notif.create_dat}</p>
                    </section>
                  )}
                  <button
                    className="btn btn-primary mt-1"
                    onClick={() => handleToggleVisibility(notif.id_notif)}
                  >
                    {visibleNotifications[notif.id_notif] ? 'Moins' : 'Plus'}
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