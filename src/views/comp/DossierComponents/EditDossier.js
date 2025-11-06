import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { updateDossier, getDossier } from '../../../services/api';
import InfoIdentForm from './InfoIdentForm';
import InfoBankForm from './InfoBankForm';
import InfoComplementaireForm from './InfoComplementaireForm';
import InfoProForm from './InfoProForm';
import { CButton, CCol, CRow } from '@coreui/react';
import { cilArrowLeft, cilArrowRight } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const EditDossierForm = () => {
  const { id_dossier } = useParams();

  const [step, setStep] = useState(1);
  const [validatedSteps, setValidatedSteps] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });

  const [dossierData, setDossierData] = useState({});
  const [matricule, setMatricule] = useState('');
  const [ident, setIdent] = useState({});

  const [formData, setFormData] = useState({
    infoIdent: {},
    infoPro: {},
    infoBank: {},
    infoComplementaire: {},
  });

  useEffect(() => {
    const fetchDossier = async () => {
      try {
        const data = await getDossier(id_dossier);
        const dossier = data.data;
        setDossierData(dossier);
        setMatricule(dossier.Utilisateur?.matricule || '');
      } catch (error) {
        console.error("Erreur de chargement du dossier :", error);
      }
    };

    fetchDossier();
  }, [id_dossier]);

  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const updateIdent = (data) => setIdent(data);

  const handleStepValidated = (stepNumber, isValid) => {
    setValidatedSteps((prev) => ({
      ...prev,
      [stepNumber]: isValid,
    }));
  };

  const nextStep = () => {
    if (validatedSteps[step]) {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
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

      await updateDossier(id_dossier, dataToSend);
      alert('Dossier mis à jour avec succès.');
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error);
      alert('Erreur lors de la mise à jour du dossier.');
    }
  };

  return (
    <div className="my-3">
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

      {/* Étapes */}
      {step === 1 && (
        <InfoIdentForm
          onSubmite={() => handleStepValidated(1, true)}
          setCanProceed={(isValid) => handleStepValidated(1, isValid)}
          uptdat={updateIdent}
          updateData={(data) => updateFormData('infoIdent', data)}
          initial={dossierData.InfoIdent}
        />
      )}

      {step === 2 && (
        <InfoProForm
          onSubmite={() => handleStepValidated(2, true)}
          setCanProceed={(isValid) => handleStepValidated(2, isValid)}
          infoi={ident}
          updateData={(data) => updateFormData('infoPro', data)}
          initial={dossierData.InfoPro}
        />
      )}

      {step === 3 && (
        <InfoBankForm
          onSubmite={() => handleStepValidated(3, true)}
          setCanProceed={(isValid) => handleStepValidated(3, isValid)}
          updateData={(data) => updateFormData('infoBank', data)}
          initial={dossierData.InfoBank}
        />
      )}

      {step === 4 && (
        <InfoComplementaireForm
          onSubmite={() => handleStepValidated(4, true)}
          setCanProceed={(isValid) => handleStepValidated(4, isValid)}
          updateData={(data) => updateFormData('infoComplementaire', data)}
          initial={dossierData.InfoComplementaire}
        />
      )}

      {/* Boutons de navigation */}
      <CRow className="justify-content-end mt-3">
        <CCol xs="auto">
          {step > 1 && (
            <CButton color="secondary" onClick={prevStep} className="me-2">
            <CIcon icon={cilArrowLeft} className="me-2" />
            </CButton>
          )}
        </CCol>

        <CCol xs="auto" style={{ position: 'relative' }}>
          {step < 4 && (
            <>
              <CButton
                color="primary"
                onClick={nextStep}
                disabled={!validatedSteps[step]}
              >
              <CIcon icon={cilArrowRight} className="me-2" />
              </CButton>
              {!validatedSteps[step] && (
                <div
                  style={{
                    color: 'red',
                    fontSize: '0.85rem',
                    marginTop: '0.25rem',
                    position: 'absolute',
                    width: '100%',
                    textAlign: 'center',
                    left: 0,
                  }}
                >
                </div>
              )}
            </>
          )}
          {step === 4 && (
            <CButton color="success" onClick={handleSubmit}>
              Sauvegarder
            </CButton>
          )}
        </CCol>
      </CRow>
    </div>
  );
};

export default EditDossierForm;
