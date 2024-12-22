import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InfoIdentForm from './InfoIdentForm';
import InfoBankForm from './InfoBankForm';
import InfoComplementaireForm from './InfoComplementaireForm';
import InfoProForm from './InfoProForm';
import DetailForm from './DetailForm';
import DistinctionForm from './DistinctionForm';
import SanctionForm from './SanctionForm';
import DiplomeForm from './DiplomeForm';
import PosteAnterieurForm from './PosteForm.js';
import {createDossier} from '../../../services/api'
import { CButton, CCardHeader, CCol, CRow } from '@coreui/react'; 

const CreateDossierForm = () => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(step +1);

  const prevStep = () => setStep(step - 1);

  const pauseStep = () => setStep(step);

  const handleFormSubmit = () => {
    if (step === 4) {
      pauseStep();
    } else {
      nextStep();
    }
  };
  const [matricule, setMatricule] = useState('');
  const [ident, setIdent] = useState({});


  const [formData, setFormData] = useState({
    infoIdent: {},
    infoPro: {},
    infoBank: {},
    infoComplementaire: {},
  });
  const [data,setData]=useState({});

  // Function to update form data
  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const updat=(data)=>{
    setIdent(data);
  }
  

  // Gérer les changements dans le champ
  const handleMatriculeChange = (e) => {
    setMatricule(e.target.value);
  };
  const handleSubmit = async () => {

    console.log(JSON.stringify(formData));
    try {
      const dataToSend = {
        matricule,
        infoIdent: formData.infoIdent,
        infoPro: formData.infoPro.infoPro,
        infoBank: formData.infoBank,
        infoComplementaire: formData.infoComplementaire.infoComplementaire,
        detailsMutation: formData.infoPro.detailMutation,
        poste: formData.infoPro.poste,
        diplome: formData.infoPro.diplome,
        distinction: formData.infoComplementaire.distinction,
        sanction: formData.infoComplementaire.sanction,
      };

      console.log('Données à envoyer au backend :', dataToSend);
      console.log('Données à envoyer au backend :', JSON.stringify(dataToSend, null, 2));

    


      // Envoie des données au backend
      await createDossier(dataToSend);
      alert('Dossier créé avec succès!');
    } catch (error) {
      console.error('Erreur lors de la création du dossier :', error);

    // Vérifie si l'erreur est une erreur HTTP (Axios ou Fetch)
    if (error.response) {
      // Erreur envoyée par le backend
      const { status, data } = error.response;
      alert(`Erreur ${status} : ${data.error || 'Une erreur est survenue.'}`);
    } else if (error.request) {
      // Aucune réponse reçue du serveur
      alert('Le serveur ne répond pas. Veuillez réessayer plus tard.');
    } else {
      // Erreur lors de la configuration de la requête
      alert(`Erreur inconnue : ${error.message}`);
    }
    }
  };

  return (
    <div className='my-3'>
      <CCardHeader className='mb-3'>
            <strong>CREATION D'UN NOUVEAU DOSSIER</strong>
      </CCardHeader>

    <div className="form-group">
      <label htmlFor="matricule">Matricule :</label>
      <input
        type="text"
        id="matricule"
        name="matricule"
        className="form-control"
        value={matricule}
        onChange={handleMatriculeChange}
        placeholder="Entrez le matricule"
      />

    </div>
      {step === 1 && <InfoIdentForm onSubmite={handleFormSubmit} uptdat={updat} updateData={(data) => updateFormData('infoIdent', data)}  />}
      {step === 2 && <InfoProForm onSubmite={handleFormSubmit} infoi={ident} updateData={(data) => updateFormData('infoPro', data)} />}
      {step === 3 && <InfoBankForm onSubmite={handleFormSubmit} updateData={(data) => updateFormData('infoBank', data)}  />}
      {step === 4 && <InfoComplementaireForm onSubmite={handleFormSubmit} updateData={(data) => updateFormData('infoComplementaire', data)} />}


      {/* {step === 5 && <DetailForm onSubmit={handleFormSubmit} />}
      {step === 6 && <PosteAnterieurForm onSubmit={handleFormSubmit} />}
      {step === 7 && <DiplomeForm onSubmit={handleFormSubmit} />}
      {step === 8 && <DistinctionForm onSubmit={handleFormSubmit} />}
      {step === 9 && <SanctionForm onSubmit={handleFormSubmit} />} */}

      {/* Navigation Buttons */}
         {/* Navigation Buttons */}
      <CRow className="justify-content-end mt-3">
        <CCol xs="auto">
          {step > 1 && step < 5 && (
            <CButton
              color="secondary"
              onClick={prevStep}
              className="me-2" // Bootstrap margin-end class
            >
              Précédent
            </CButton>
          )}
        </CCol>
        
        <CCol xs="auto">
          {step < 4 && (
            <CButton
              color="primary"
              onClick={nextStep}
            >
              Suivant
            </CButton>
          )}
          {step === 4 && (
            <CButton
              color="success"
              onClick={handleSubmit}
            >
              Soumettre
            </CButton>
          )}
        </CCol>
      </CRow>
    </div>
  );
};

export default CreateDossierForm;