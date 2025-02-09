import React, { useEffect, useState } from "react";
import { getDossiers } from "../../services/api";
import { FaUser, FaFemale, FaUsers } from 'react-icons/fa'

const Statistique=()=>{
    const [employees, setEmployees] = useState([]);
    const  [homme,setHomme]=useState([]);
    const  [femme,setFemme]=useState([]);
    const  [acdpe,setAcdpe]=useState([]);    
    const  [fe,setFe]=useState([]);    
    const  [afc,setAfc]=useState([]);


    const fetchDossiers = async () => {
        try {
          const response = await getDossiers();
          setEmployees(response.data);
          const h = response.data.filter(employee => employee.InfoIdent.sexe === 'M');
           const f = response.data.filter(employee => employee.InfoIdent.sexe !== 'M'); 
           const ac = response.data.filter(employee => employee.InfoPro.statut == 'ACDPE'); 
           const fe = response.data.filter(employee => employee.InfoPro.statut == 'FE'); 
           const afc = response.data.filter(employee => employee.InfoPro.statut == 'AFC'); 
             setHomme(h);
            setFemme(f);
            setAcdpe(ac);
            setAfc(afc);
            setFe(fe);
        } catch (error) {
          console.error('Error fetching dossiers', error);
        }
      };
  
 

    useEffect(() => {
        fetchDossiers();

      console.log(employees);
     
      }, []);

     
      return(
        <div className="px-2">
         <ul className="d-flex flex-column justify-content-center gap-4">
            <li className="d-flex align-items-center  ">
              <FaUser size={25} color="blue" className="me-2" />
              Nombre d'homme: <span className="text-primary ms-1">{homme.length}</span>
            </li>
            <li className="d-flex align-items-center ">
              <FaFemale size={25} color="pink" className="me-2" />
              Nombre de femme: <span className="text-primary ms-1">{femme.length}</span>
            </li>
            <li className="d-flex align-items-center  ">
              <FaUser size={25} color="blue" className="me-2" />
              Nombre de Fonctionnaire d'Etat: <span className="text-primary ms-1">{fe.length}</span>
            </li>
            <li className="d-flex align-items-center ">
              <FaUser size={25} color="blue" className="me-2" />
              Nombre d'Agent Contratuel de Droit Public de l'Etat: <span className="text-primary ms-1">{acdpe.length}</span>
            </li>
            <li className="d-flex align-items-center ">
              <FaUser size={25} color="blue" className="me-2" />
              Nombre d'Agent sur financement communautaire: <span className="text-primary ms-1">{afc.length}</span>
            </li>
            <li className="d-flex align-items-center ">
              <FaUsers size={25} color="green" className="me-2" /> 
              Nombre total d'agent : <span className="text-primary ms-1"> {employees.length}</span>
            </li>
      </ul>
        </div>
      )
   


};
export default Statistique;