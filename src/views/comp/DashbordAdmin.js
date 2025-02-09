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
    <div className="dashboard">

  
      <h2 className="" style={{ fontFamily: 'Lobster, cursive' }}>
        <FaTachometerAlt className=" text-primary" />
        Tableau de bord
      </h2>
      <button onClick={toggleCalendar} className="btn btn-info text-white ms-auto ms-2 mb-0">
        {showCalendar ? 'Cacher le Calendrier' : 'Afficher le Calendrier'}
        </button>
      <div className="container-fluid">

                {/* Horloge et calendrier */}
                <div className="row mt-3 ms-1">
                {!showCalendar &&
                  <HorlogeCalendrier />}
         </div>

         

                <div className="row mt-3">

      <div className='px-2  my-2 rounded'>
      {showCalendar &&
        <FCalendar></FCalendar>}
      </div>
     

      <div className="row mt-3   ms-1">
                {showCalendar &&
                  <>  
                  <div className="col-12 col-md-12 mb-2 bg-secondary py-1">
                  
                   </div>
                   <div className="col-12 col-md-12 mb-2 bg-dark py-1">
                  
                   </div>
                 
                 </>}
         </div>
  {/* Statistiques */}
  <div className="col-12 col-md-6 mb-3 d-flex">
    <div className="card shadow rounded h-100 w-100">
      <div className="card-header bg-primary text-white text-center">
        Statistiques
      </div>
      <div className="card-body">
        <p className="card-text">
          <Statistique />
        </p>
      </div>
    </div>
  </div>

  {/* Diagramme de ligne */}
  <div className="col-12 col-md-6 mb-3 d-flex">
    <div className="card shadow rounded h-100 w-100">
      <div className="card-header bg-success text-white text-center">
        Diagramme de Ligne
      </div>
      <div className="card-body">
        <LineChart data={statisticsData} />
      </div>
    </div>
  </div>
</div>

        
        <div className="row mt-3">
          {/* Anniversaires d'aujourd'hui */}
          <div className="col-12 col-md-6 mb-3">
            <div className="card shadow rounded">
              <div className="card-header bg-info text-white text-center">
                Anniversaires d'aujourd'hui
              </div>
              <div className="card-body">
                <p className="card-text">
                  {todaybirth.length > 0 ? (
                    <ul>
                      {todaybirth.map(employee => (
                        <li>🎉 Joyeux anniversaire {employee.InfoIdent.nom} {employee.InfoIdent.prenom} !</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Aucun employé n'a son anniversaire aujourd'hui.</p>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Agents allant en retraite */}
          <div className="col-12 col-md-6 mb-3">
            <div className="card shadow rounded">
              <div className="card-header bg-secondary text-white text-center">
                Agent allant en retraite aujourd'hui
              </div>
              <div className="card-body">
                {result.length > 0 ? (
                  <ul>
                    {result.map(employee => (
                      <li>🎉 Félicitations à {employee.InfoIdent.nom} {employee.InfoIdent.prenom} pour sa retraite !</li>
                    ))}
                  </ul>
                ) : (
                  <p>Aucun départ en retraite aujourd'hui.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
