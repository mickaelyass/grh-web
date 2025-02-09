import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InfoIdentForm from './InfoIdentForm';
import InfoBankForm from './InfoBankForm';
import InfoComplementaireForm from './InfoComplementaireForm';
import InfoProForm from './InfoProForm';
import { updateDossier, getDossier} from '../../../services/api';
import { CButton, CCol, CRow } from '@coreui/react';
import { useParams } from 'react-router-dom';

const EditDossierForm = () => {
  const [dossierData,setDossierData]=useState({});

  const [step, setStep] = useState(1);
  const [ident, setIdent] = useState(1);
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

  const [formData, setFormData] = useState({
    infoIdent: {},
    infoPro: {},
    infoBank: {},
    infoComplementaire: {},
  });
  const [data,setData]=useState({});

  useEffect(() => {
    console.log('matricule',id_dossier);
    const fetchDossier = async () => {
      try {
        const data = await getDossier(id_dossier);
        console.log(data);
        setDossierData(data.data);
        setMatricule(data.data.Utilisateur.matricule)
        // Initialize the form with existing dossier data
      
      } catch (error) {
        console.error("Error fetching dossier data:", error);
      }
    };

    fetchDossier();
  }, [id_dossier]);

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

  // Fetch dossier data on mount to populate form fields
  

  

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        matricule: matricule,
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

      console.log('Données à envoyer au backend :', JSON.stringify(dataToSend, null, 2));

      // Envoie des données au backend pour mettre à jour le dossier
      await updateDossier(id_dossier, dataToSend);
      alert('Dossier mis à jour avec succès!');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du dossier :', error);
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
      <div className="form-group">
        <label htmlFor="matricule">Matricule :</label>
        <input
          type="text"
          id="matricule"
          name="matricule"
          className="form-control"
          value={matricule}
          disabled
        />
      </div>

      {step === 1 && <InfoIdentForm onSubmite={handleFormSubmit} uptdat={updat} initial={dossierData.InfoIdent} updateData={(data) => updateFormData('infoIdent', data)} initialValues={formData.infoIdent} />}
      {step === 2 && <InfoProForm onSubmite={handleFormSubmit} infoi={ident} initial={dossierData.InfoPro}  updateData={(data) => updateFormData('infoPro', data)} initialValues={formData.infoPro} />}
      {step === 3 && <InfoBankForm onSubmite={handleFormSubmit} initial={dossierData.InfoBank} updateData={(data) => updateFormData('infoBank', data)} initialValues={formData.infoBank} />}
      {step === 4 && <InfoComplementaireForm onSubmite={handleFormSubmit} initial={dossierData.InfoComplementaire } updateData={(data) => updateFormData('infoComplementaire', data)} initialValues={formData.infoComplementaire} />}

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

export default EditDossierForm;
