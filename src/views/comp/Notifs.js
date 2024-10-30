import React, { useState, useEffect } from "react";
import { getNotification, markNotificationAsRead } from "../../services/api";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CRow,
  CCol,
} from '@coreui/react';
import './Dasbord.css';

const Notifs = () => {
  const [notifs, setNotifs] = useState([]);
  const [visibleNotifications, setVisibleNotifications] = useState({});

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      console.log('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
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
    <div className="dashboard">
      <div className="container-fluid mt-2">
        <h2 className="text-light py-2 ps-2 mb-3">Notifications</h2>
        <CRow>
          {notifs.map((notif) => (
            <CCol md="4" className="mb-3" key={notif.id}>
              <CCard className="bg-dark">
                <CCardHeader className="d-flex justify-content-between align-items-center">
                  <span>ID Utilisateur : {notif.user_id}</span>
                  <CButton
                    color="primary"
                    size="sm"
                    onClick={() => handleToggleVisibility(notif.id)}
                  >
                    {visibleNotifications[notif.id] ? 'Moins' : 'Plus'}
                  </CButton>
                </CCardHeader>
                <CCardBody>
                  {visibleNotifications[notif.id] && (
                    <>
                      <p><strong>Message :</strong> {notif.message} 👀👀</p>
                      <p><strong>Date :</strong> {notif.create_dat}</p>
                    </>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
      </div>
    </div>
  );
};

export default Notifs;
