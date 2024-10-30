// DashboardUser.js
import React, { useEffect, useState } from 'react';
import { getDossiers } from './../services/api';
import { useLocation} from 'react-router-dom';
import Footer from './Footer';
import Statistique from './Statistique';
import LineChart from './LineChart';
import HorlogeCalendrier from './UtilisateurComponents/Calendar';
import { FaTachometerAlt } from 'react-icons/fa';
import MenuUserC from './MenuUserC';
import Head from './Head';
import './Dasbord.css';


const DashboardChefService = () => {
  const [employees, setEmployees] = useState([]);
  const [result, setResult] = useState([]);
  const location = useLocation();
 // const navigate = useNavigate();
  const { user } = location.state || {};
  const { matricule } = user || {};

  useEffect(() => {
    if (matricule) {
      fetchDossiers();
      console.log(user);
      console.log(matricule);
      retraite(employees);
    }
  }, [matricule]);

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
  console.log(employees);
  console.log(todaybirth);

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

  
  
  const retraite=(employees)=>{
  const today=new Date();
  const liste=[...employees];
  const result=liste.filter(e=>{
    if(e.InfoPro.dat_de_depart_retraite.getFullYear() === today.getFullYear())
    return e;
  } )
  setResult(result); 
 
  } 
  console.log(result);


 // Préparer les données pour le graphique en ligne
  const statisticsData = employees.map(employee => ({
    label: employee.InfoIdent.nom,
    value:calculateAge(employee.dat_nat) , // Remplacez par la valeur statistique appropriée
  }));

  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  

  return (
    
    <div className="dashboard">
      <Head toggleMenu={toggleMenu} />
      
      <MenuUserC isMenuOpen={isMenuOpen} />
      <main className={`content ${isMenuOpen ? 'content-expanded slide-enter' : 'content-collapsed'}`}>
      <h2 className="p-3" style={{ fontFamily: 'Lobster, cursive' }}>
              <FaTachometerAlt className="px-2 text-primary" />
              Tableau de bord
            </h2>
        <div className='container'>
        <div className="row mt-3">

           <div className="col mb-3 ">

           <div className="card shadow rounded  ">
           <div className="card-header bg-primary  text-white text-center">
                 Statistiques
               </div>
               <div className="card-body ">
                 <p className="card-text">
                  <Statistique />
                 </p>
             </div>
              </div>

                {/* <div className="col-md-12 mb-3" >
                <div className="card">
               <div className="card-header text-primary">
                Title
               </div>
               <div className="card-body">
                 <p className="card-text">
                 
                 </p>
               </div>
             </div>
                </div> */}
           </div>




           <div className="col mb-3">
           <div className="card shadow rounded pb-4">
            <div className="card-header bg-success text-white text-center">
                  Diagramme de Ligne
                </div>
                <div className="card-body">
                  <LineChart data={statisticsData} />
                </div>
              </div>
           </div>  



           <div className="col">
        <HorlogeCalendrier/>    
          </div>


    
         </div>




         <div className="row mt-3">
           <div className="col-md-6 mb-3">
           <div className="card shadow rounded">
           <div className="card-header bg-info text-white text-center">
               Anniversaires d'aujourd'hui
               </div>
               <div className="card-body">
                 <p className="card-text">
                  
                 {todaybirth.length > 0 ? (
                <ul>
                  {todaybirth.map(employee => (
                    <li>  🎉 Joyeux anniversaire {employee.InfoIdent.nom} {employee.InfoIdent.prenom} !</li>
                  ))}
                </ul>
              ) : (
                <p>Aucun employé n'a son anniversaire aujourd'hui.</p>
              )}
              </p>
               </div>
             </div>
           </div>
          
           <div className="col-md-6 mb-3">
           <div className="card shadow rounded">
           <div className="card-header bg-secondary text-white text-center">
             Agent allant en retraite aujourd'hui
               </div>
               <div className="card-body">
               {result.length > 0 ? (
                <ul>
                  {result.map(employee => (
                    <li>  🎉 Félicitations à {employee.InfoIdent.nom} {employee.InfoIdent.prenom} pour sa retraite !</li>
                  ))}
                </ul>
              ) : (
                <p>Aucun depart en retraite aujourd'hui.</p>
              )}
               </div>
             </div>
           </div>
         </div>
        </div>
        <div className="container">
       </div>
      </main>
      <Footer/>
    </div>
   
  );
};

export default DashboardChefService;
