import React, { useState } from 'react';
import InfoIdentForm from './InfoIdentForm';
import InfoBankForm from './InfoBankForm';
import InfoComplementaireForm from './InfoComplementaireForm';
import InfoProForm from './InfoProForm';
import { createDossier } from '../../../services/api';
import { CButton, CCardHeader, CCol, CRow } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilArrowRight } from '@coreui/icons';

const CreateDossierForm = () => {
  const [step, setStep] = useState(1);

  // Gestion du statut de validation par étape
  // Exemple pour 4 étapes : on peut aussi initialiser dynamiquement selon nb d'étapes
  const [validatedSteps, setValidatedSteps] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });

  const [matricule, setMatricule] = useState('');
  const [ident, setIdent] = useState({});

  const [formData, setFormData] = useState({
    infoIdent: {},
    infoPro: {},
    infoBank: {},
    infoComplementaire: {},
  });

  // Met à jour la donnée partielle pour une section donnée
  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data,
    }));
  };

  // Mise à jour du status de validation d'une étape
  const handleStepValidated = (stepNumber, isValid) => {
    setValidatedSteps(prev => ({
      ...prev,
      [stepNumber]: isValid,
    }));
  };

  // Gestion du matricule
  const handleMatriculeChange = (e) => {
    setMatricule(e.target.value);
  };

  // Aller à l'étape suivante si validée
  const nextStep = () => {
    if (validatedSteps[step]) {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  // Soumission finale
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

      await createDossier(dataToSend);
      alert('Dossier créé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création du dossier :', error);
      alert('Erreur lors de la création du dossier. Veuillez réessayer.');
    }
  };

  // Mise à jour de ident (exemple pour passer à InfoProForm)
  const updateIdent = (data) => {
    setIdent(data);
  };

  return (
    <div className="my-3">
      <CCardHeader className="mb-3">
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

      {/* Affichage conditionnel des formulaires par étape */}
      {step === 1 && (
        <InfoIdentForm
          onSubmite={() => handleStepValidated(1, true)}
          setCanProceed={(isValid) => handleStepValidated(1, isValid)}
          uptdat={updateIdent}
          updateData={(data) => updateFormData('infoIdent', data)}
          initial={formData.infoIdent}
        />
      )}
      {step === 2 && (
        <InfoProForm
          onSubmite={() => handleStepValidated(2, true)}
          setCanProceed={(isValid) => handleStepValidated(2, isValid)}
          infoi={ident}
          updateData={(data) => updateFormData('infoPro', data)}
          initial={formData.infoPro}
        />
      )}
      {step === 3 && (
        <InfoBankForm
          onSubmite={() => handleStepValidated(3, true)}
          setCanProceed={(isValid) => handleStepValidated(3, isValid)}
          updateData={(data) => updateFormData('infoBank', data)}
          initial={formData.infoBank}
        />
      )}
      {step === 4 && (
        <InfoComplementaireForm
          onSubmite={() => handleStepValidated(4, true)}
          setCanProceed={(isValid) => handleStepValidated(4, isValid)}
          updateData={(data) => updateFormData('infoComplementaire', data)}
          initial={formData.infoComplementaire}
        />
      )}

      {/* Navigation Buttons */}
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
                disabled={!validatedSteps[step]} // bouton désactivé si étape non validée
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
              Soumettre
            </CButton>
          )}
        </CCol>
      </CRow>
    </div>
  );
};

export default CreateDossierForm;
