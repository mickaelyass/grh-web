import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { fetchDemandesByStatusAutoriser } from './../../services/apiConge';
import { Modal, Button } from 'react-bootstrap'; // 🟦 Utilise react-bootstrap
import "./calendar.css";

const FCalendar = () => {
  const [conges, setConges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchConges = async () => {
    try {
      const response = await fetchDemandesByStatusAutoriser();

      const authorizedLeaves = response.map(conge => ({
        title: `${conge.nom} ${conge.prenom} en ${conge.type_de_conge}`,
        start: conge.date_debut.split("T")[0],
        end: new Date(new Date(conge.date_de_fin).setDate(new Date(conge.date_de_fin).getDate() + 1)).toISOString().split("T")[0],
        color: "#e6f2ff",
        borderColor: '#0d6efd',
        textColor: '#0d6efd',
        extendedProps: {
          nom: conge.nom,
          prenom: conge.prenom,
          type: conge.type_de_conge,
          service: conge.service || "N/A"
        }
      }));

      const currentYear = new Date().getFullYear();
      const holidays = [
        { title: "Jour de l'An", date: `${currentYear}-01-01` },
        { title: "Fête du Vodun", start: `${currentYear}-01-10`, end: `${currentYear}-01-12` },
        { title: "Journée de la Femme", date: `${currentYear}-03-08` },
        { title: "Vendredi Saint", date: `${currentYear}-03-29` },
        { title: "Pâques", date: `${currentYear}-03-31` },
        { title: "Lundi de Pâques", date: `${currentYear}-04-01` },
        { title: "Fête du Travail", date: `${currentYear}-05-01` },
        { title: "Ascension", date: `${currentYear}-05-09` },
        { title: "Pentecôte", date: `${currentYear}-05-19` },
        { title: "Lundi de Pentecôte", date: `${currentYear}-05-20` },
        { title: "Korité", date: `${currentYear}-04-10` },
        { title: "Tabaski", date: `${currentYear}-06-17` },
        { title: "Indépendance du Bénin", date: `${currentYear}-08-01` },
        { title: "Assomption", date: `${currentYear}-08-15` },
        { title: "Maouloud", date: `${currentYear}-09-15` },
        { title: "Toussaint", date: `${currentYear}-11-01` },
        { title: "Noël", date: `${currentYear}-12-25` },
      ].map(event => ({
        ...event,
        color: "#ffe6e6",
        borderColor: "#dc3545",
        textColor: "#dc3545",
        extendedProps: {
          isHoliday: true
        }
      }));

      setConges([...authorizedLeaves, ...holidays]);
    } catch (error) {
      console.error("Erreur lors de la récupération des congés :", error);
    }
  };

  useEffect(() => {
    fetchConges();
  }, []);

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setShowModal(true);
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        themeSystem="bootstrap5"
        contentHeight="auto"
        initialView="dayGridMonth"
        events={conges}
        eventClick={handleEventClick}
        locale="fr"
      />

      {/* Modal affiché au clic sur un événement */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Détail de l'événement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent ? (
            selectedEvent.extendedProps?.isHoliday ? (
              <>
                <p><strong>Jour férié :</strong> {selectedEvent.title}</p>
                <p><strong>Date :</strong> {selectedEvent.startStr}</p>
              </>
            ) : (
              <>
                <p><strong>Employé :</strong> {selectedEvent.extendedProps.nom} {selectedEvent.extendedProps.prenom}</p>
                <p><strong>Type de congé :</strong> {selectedEvent.extendedProps.type}</p>
                <p><strong>Service :</strong> {selectedEvent.extendedProps.service}</p>
                <p><strong>Début :</strong> {selectedEvent.startStr}</p>
                <p><strong>Fin :</strong> {selectedEvent.endStr}</p>
              </>
            )
          ) : (
            <p>Aucun événement sélectionné.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FCalendar;
