import React, { useState, useEffect } from "react";
import { getUserNotif, markNotificationAsRead } from "../../services/api";
import { CCard, CCardBody, CCardHeader, CButton, CSpinner, CAlert } from '@coreui/react';

const Notif = () => {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const matricule = user ? user.matricule : '';

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
    return <div className="text-center mt-5"><CSpinner color="primary" /></div>;
  }

  if (error) {
    return <div className="text-center mt-5"><CAlert color="danger">{error}</CAlert></div>;
  }

  if (notifs.length === 0) {
    return <div className="text-center mt-5"><CAlert color="info">Aucune notification trouvé.</CAlert></div>;
  }

  return (
    <div className="dashboard">
      <div className="container-fluid mt-4">
        <h2 className="mb-4 text-light">Notifications</h2>
        <div className="row">
          {notifs.map(notif => (
            <div key={notif.id} className="col-md-4 mb-4">
              <CCard className="bg-dark text-light">
                <CCardHeader>
                  ID Utilisateur : {notif.user_id}
                </CCardHeader>
                <CCardBody>
                  {visibleNotifications[notif.id] && (
                    <section>
                      <p><strong>Message :</strong> {notif.message}</p>
                      <p><strong>Date :</strong> {notif.create_dat}</p>
                    </section>
                  )}
                  <CButton
                    color="primary"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleToggleVisibility(notif.id)}
                  >
                    {visibleNotifications[notif.id] ? 'Moins' : 'Plus'}
                  </CButton>
                </CCardBody>
              </CCard>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notif;
