
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid" // Vue en semaine avec les heures
import interactionPlugin from "@fullcalendar/interaction"
import {  fetchDemandesByStatusAutoriser} from './../../services/apiConge';
import  "./calendar.css"


const FCalendar=()=>{
  const currentYear = new Date().getFullYear(); // Récupère l'année actuelle
  const [conges, setConges] = useState([]);

  const fetchConges = async () => {
    try {
      const response = await fetchDemandesByStatusAutoriser();
      console.log(response);
  
      const conges = response.map(conge => ({
        title: `${conge.nom}  ${conge.prenom} en ${conge.type_de_conge}`,
        start: conge.date_debut.split("T")[0], 
        end: new Date(new Date(conge.date_de_fin).setDate(new Date(conge.date_de_fin).getDate() + 1)).toISOString().split("T")[0],
        color: "transparent",
        borderColor: 'blue',
        textColor: 'blue',
      }));
  
      const currentYear = new Date().getFullYear(); // Récupérer l'année actuelle
      const holidays = [
        { title: "Jour de l'An", date: `${currentYear}-01-01`, color: "blue "},
        { title: "Fête du Vodun", start: `${currentYear}-01-10`, end: `${currentYear}-01-12`, color: "blue" },
        { title: "Pâques", date: `${currentYear}-03-31`, color: "blue" },
        { title: "Lundi de Pâques", date: `${currentYear}-04-01`, color: "blue" },
        { title: "Ascension", date: `${currentYear}-05-09`, color: "blue" },
        { title: "Pentecôte", date: `${currentYear}-05-19`, color: "blue" },
        { title: "Lundi de Pentecôte", date: `${currentYear}-05-20`, color: "blue" },
        { title: "Assomption", date: `${currentYear}-08-15`, color: "blue" },
        { title: "Toussaint", date: `${currentYear}-11-01`, color: "blue" },
        { title: "Noël", date: `${currentYear}-12-25`, color: "blue" }
      ];
  
      const allEvents = conges.concat(holidays); // Fusionner congés et jours fériés
  
      setConges(allEvents);
    } catch (error) {
      console.error("Erreur lors de la récupération des congés :", error);
    }
  };
  


      useEffect(() => {
    
        fetchConges();
      }, []);

 
    return(
        <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
         themeSystem="bootstrap5" // Utiliser un thème Bootstrap
        contentHeight="auto"
        initialView="dayGridMonth" // Vue par défaut (mois)
        events={conges} // Jours fériés affichés dans le calendrier
      />
    )
}
;
export default FCalendar;
