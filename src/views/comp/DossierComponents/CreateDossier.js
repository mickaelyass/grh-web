import React,{useState} from 'react';
import { createDossier } from '../../../services/api';
import DossierForm from './DossierForm';
import { useNavigate } from 'react-router-dom';
import '../Dasbord.css'


const CreateDossier = () => {
  const navigate = useNavigate();

  const handleSubmit = async (dossierData) => {
    try {
      await createDossier(dossierData);
      console.log(dossierData);
     navigate('/admin/dossier-list');  
    } catch (error) {
      console.error('Error creating dossier', error);
    }
    
  };

  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    
    <div className="dashboard">
      <div className='row'>
   <div className="col-md-3 col-lg-2 bg-light sidebar">

     </div>
       <div className='col-md-9 col-lg-10 main-content'>
      <div className="container">
     <h1>
      Create Dossier</h1>
      <DossierForm onSubmit={handleSubmit} />
    </div>
       </div>
    </div>

    </div>
   
  );

};

export default CreateDossier;
