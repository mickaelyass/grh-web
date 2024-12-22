// components/Notification.js
import React, { useEffect, useState } from 'react';
import socket from '../../services/socketService';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Écoute des événements de notification
    socket.on('receiveNotification', (notification) => {
      console.log('Notification reçue:', notification); // Log pour vérifier la réception

      // Ajoute la notification et supprime-la après 5 secondes
      setNotifications((prevNotifications) => [...prevNotifications, notification]);

      // Supprime la notification après 5 secondes
      setTimeout(() => {
        setNotifications((prevNotifications) =>
          prevNotifications.filter((n) => n !== notification)
        );
      }, 5000);
    });

    return () => {
      // Nettoyage des écouteurs d'événements à la fin du composant
      socket.off('receiveNotification');
    };
  }, []);
  return (
    
    <li className="nav-item">
    <div className="position-fixed top-0 mt-5 end-0 p-3" style={{ zIndex: 1050 }}>
      {notifications.map((notification, index) => (
        <div key={index} className="alert alert-warning">
          {notification.message}
        </div>
      ))}
    </div>
  </li>
    
  );
};

export default Notification;
