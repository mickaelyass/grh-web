import React,{useState,useEffect} from "react";
import { getNotification,markNotificationAsRead } from "../../services/api";
import './Dasbord.css'

import { CCard, CCardBody,
  CButton,
  CRow,
  CCol, CSpinner, CAlert } from '@coreui/react';

const NotifsD=()=>{
 const [notifs,setNotifs]=useState([]);
 const [visibleNotifications, setVisibleNotifications] = useState({});
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState(null);
 

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
    const fetchNotif = async () => { setIsLoading(true);
        try {
          const response = await getNotification();
          setNotifs(response.data);
        } catch (err) {
          setError("Une erreur est survenue lors de la récupération des notifications.");
        } finally {
          setIsLoading(false);
        }
      
    };
    fetchNotif();
  }, []);


  return (
    
   <div className="dashboard">
         <div className="container-fluid mt-2">
           <h2 className="py-2 ps-2 mb-3">Notifications</h2>
   
           {isLoading && (
             <div className="text-center my-4">
               <CSpinner color="primary" />
               <p>Chargement des notifications...</p>
             </div>
           )}
   
           {error && (
             <div className="alert alert-danger" role="alert">
               {error}
             </div>
           )}
   
           {!isLoading && !error && notifs.length === 0 && (
             <div className="text-center text-muted">Aucune notification disponible.</div>
           )}
   
           <CRow>
             {notifs.map((notif) => (
               <CCol md="12" className="mb-3 d-flex" key={notif.id_notif}>
                 <CCard
                   className={`notification-card d-flex justify-content-between align-items-center w-100 p-3 ${
                     notif.is_read ? "notification-read" : ""
                   }`}
                 >
                   <div className="d-flex w-100">
                     <div className="flex-grow-1">
                       <span>Notification : {notif.id_notif}</span>
                     </div>
                     <div className="d-flex flex-column">
                       <CButton
                         size="sm"
                         onClick={() => handleToggleVisibility(notif.id_notif)}
                       >
                         {visibleNotifications[notif.id_notif] ? "Moins" : "Plus"}
                       </CButton>
                     </div>
                   </div>
   
                   {visibleNotifications[notif.id_notif] && (
                     <div className="w-100 mt-2">
                       <p>
                         <strong>Message :</strong> {notif.message}
                       </p>
                       <p>
                         <strong>Date :</strong>{" "}
                         {new Date(notif.create_dat).toLocaleDateString("fr-FR")}
                       </p>
                     </div>
                   )}
                 </CCard>
               </CCol>
             ))}
           </CRow>
         </div>
       </div>
  );
};

export default NotifsD;