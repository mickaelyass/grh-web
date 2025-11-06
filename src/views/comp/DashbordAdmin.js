import React, { useEffect, useState } from 'react';
import { getDossiers } from './../../services/api';
import { useNavigate } from 'react-router-dom';
import Statistique from './Statistique';
import LineChart from './LineChart';
import HorlogeCalendrier from './UtilisateurComponents/Calendar';
import { FaTachometerAlt } from 'react-icons/fa';
import './Dasbord.css'
import FCalendar from './Fullcalendar';

const DashboardAdmin = () => {
  const [employees, setEmployees] = useState([]);
  const [result, setResult] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);


  useEffect(() => {
    fetchDossiers();
    console.log(employees);
    retraite(employees);
  
  }, []);


  const navigate = useNavigate();
  const getTodayBirthdayEmployees = (employees) => {
    const today = new Date();
    const todayMonth = today.getMonth() + 1; // Les mois sont de 0 à 11
    const todayDate = today.getDate();

    return employees.filter(employee => {
      if (!employee.InfoIdent.dat_nat) return false;
      const [year, month, day] = employee.InfoIdent.dat_nat.split('-');
      return parseInt(month) === todayMonth && parseInt(day) === todayDate;
    });
  };

  const todaybirth = getTodayBirthdayEmployees(employees);

  const retraite = (employees) => {
    const today = new Date();
    const liste = [...employees];
    const result = liste.filter(e => {
      // Vérifier si dat_de_depart_retraite existe et est valide
      if (e.InfoPro.dat_de_depart_retraite) {
        const dateDepartRetraite = new Date(e.InfoPro.dat_de_depart_retraite); // Convertir en objet Date
        return dateDepartRetraite.getFullYear() === today.getFullYear();
      }
      return false;
    });
    setResult(result);
  };


  const fetchDossiers = async () => {
    try {
      const response = await getDossiers();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching dossiers', error);
    }
  };


  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }

    return age;
  };

  // Préparer les données pour le graphique en ligne
  const statisticsData = employees.map(employee => ({
    label: employee.InfoIdent.nom,
    value: calculateAge(employee.InfoIdent.dat_nat), // Remplacez par la valeur statistique appropriée
  }));
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };


  return (
 <div className="dashboard px-3 py-4">
  <div className="d-flex justify-content-between align-items-center mb-4">
    <h2 className="dashboard-title text-primary d-flex align-items-center">
      <FaTachometerAlt className="me-2" /> Tableau de bord
    </h2>
    <button onClick={toggleCalendar} className="btn btn-outline-primary">
      {showCalendar ? 'Cacher le Calendrier' : 'Afficher le Calendrier'}
    </button>
  </div>

  {/* Horloge ou calendrier */}
  {!showCalendar ? (
    <div className="mb-4">
      <HorlogeCalendrier />
    </div>
  ) : (
    <div className="mb-4 bg-white p-3 rounded shadow-sm">
      <FCalendar />
    </div>
  )}

{
  !showCalendar && <div className="row g-4">
    {/* Statistiques RH - pleine largeur */}
    <div className="col-12">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white text-center fw-bold">
          Statistiques RH
        </div>
        <div className="card-body">
          <Statistique />
        </div>
      </div>
    </div>

    {/* Anniversaires */}
    <div className="col-md-6">
      <div className="card shadow-sm h-100">
        <div className="card-header bg-info text-white text-center fw-bold">
          🎂 Anniversaires du jour
        </div>
        <div className="card-body">
          {todaybirth.length > 0 ? (
            <ul className="list-unstyled mb-0">
              {todaybirth.map((emp, i) => (
                <li key={i}>🎉 {emp.InfoIdent.nom} {emp.InfoIdent.prenom}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">Aucun employé n'a son anniversaire aujourd'hui.</p>
          )}
        </div>
      </div>
    </div>

    {/* Retraites */}
    <div className="col-md-6">
      <div className="card shadow-sm h-100">
        <div className="card-header bg-secondary text-white text-center fw-bold">
          🎖️ Départs à la retraite
        </div>
        <div className="card-body">
          {result.length > 0 ? (
            <ul className="list-unstyled mb-0">
              {result.map((emp, i) => (
                <li key={i}>🎉 {emp.InfoIdent.nom} {emp.InfoIdent.prenom}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">Aucun départ à la retraite aujourd'hui.</p>
          )}
        </div>
      </div>
    </div>
  </div>
}
  
</div>

  );
};

export default DashboardAdmin;
