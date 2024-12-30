import React, { useEffect, useState } from "react";
import { getDossiers } from "../../services/api";
import { FaUser, FaFemale, FaUsers } from 'react-icons/fa'

const Statistique=()=>{
    const [employees, setEmployees] = useState([]);
    const  [homme,setHomme]=useState([]);
    const  [femme,setFemme]=useState([]);


    const fetchDossiers = async () => {
        try {
          const response = await getDossiers();
          setEmployees(response.data);
          const h = response.data.filter(employee => employee.InfoIdent.sexe === 'M');
           const f = response.data.filter(employee => employee.InfoIdent.sexe !== 'M'); 
             setHomme(h);
            setFemme(f);
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
            <li className="d-flex align-items-center ">
              <FaUsers size={25} color="green" className="me-2" /> 
              Nombre total d'agent : <span className="text-primary ms-1"> {employees.length}</span>
            </li>
      </ul>
        </div>
      )
   


};
export default Statistique;