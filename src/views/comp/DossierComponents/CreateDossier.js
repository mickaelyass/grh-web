import React, { useState, useCallback } from 'react';
import InfoIdentForm from './InfoIdentForm';
import InfoBankForm from './InfoBankForm';
import InfoComplementaireForm from './InfoComplementaireForm';
import InfoProForm from './InfoProForm';
import { createDossier } from '../../../services/api';
import Button from '../../../ui/Button'
import { CardHeader } from '../../../ui/Card'
import { Col, Row } from '../../../ui/Grid'
import Icon from '../../../ui/Icon'
import { ArrowLeft, ArrowRight } from '../../../ui/icons'

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

  // Mise à jour du status de validation d'une étape.
  // ⚠️ Stable (useCallback) : ces setters sont passés en prop aux sous-formulaires,
  // qui les placent dans un useEffect de dépendances. S'ils étaient recréés à
  // chaque render, l'effet se redéclencherait et, `isDirty` restant true après
  // soumission, réécrirait `setCanProceed(false)` par-dessus le `true` validé —
  // le bouton « Suivant » restait alors bloqué à l'étape courante.
  const handleStepValidated = useCallback((stepNumber, isValid) => {
    setValidatedSteps(prev => ({
      ...prev,
      [stepNumber]: isValid,
    }));
  }, []);

  const setCanProceed1 = useCallback((isValid) => handleStepValidated(1, isValid), [handleStepValidated]);
  const setCanProceed2 = useCallback((isValid) => handleStepValidated(2, isValid), [handleStepValidated]);
  const setCanProceed3 = useCallback((isValid) => handleStepValidated(3, isValid), [handleStepValidated]);
  const setCanProceed4 = useCallback((isValid) => handleStepValidated(4, isValid), [handleStepValidated]);

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
      <CardHeader className="mb-3">
        <strong>CREATION D&apos;UN NOUVEAU DOSSIER</strong>
      </CardHeader>

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
          setCanProceed={setCanProceed1}
          uptdat={updateIdent}
          updateData={(data) => updateFormData('infoIdent', data)}
          initial={formData.infoIdent}
        />
      )}
      {step === 2 && (
        <InfoProForm
          onSubmite={() => handleStepValidated(2, true)}
          setCanProceed={setCanProceed2}
          infoi={ident}
          updateData={(data) => updateFormData('infoPro', data)}
          initial={formData.infoPro}
        />
      )}
      {step === 3 && (
        <InfoBankForm
          onSubmite={() => handleStepValidated(3, true)}
          setCanProceed={setCanProceed3}
          updateData={(data) => updateFormData('infoBank', data)}
          initial={formData.infoBank}
        />
      )}
      {step === 4 && (
        <InfoComplementaireForm
          onSubmite={() => handleStepValidated(4, true)}
          setCanProceed={setCanProceed4}
          updateData={(data) => updateFormData('infoComplementaire', data)}
          initial={formData.infoComplementaire}
        />
      )}

      {/* Navigation Buttons */}
      <Row className="justify-content-end mt-3">
        <Col xs="auto">
          {step > 1 && (
            <Button color="secondary" onClick={prevStep} className="me-2">
             <Icon icon={ArrowLeft} className="me-2" />
            </Button>
          )}
        </Col>

        <Col xs="auto" style={{ position: 'relative' }}>
          {step < 4 && (
            <>
              <Button
                color="primary"
                onClick={nextStep}
                disabled={!validatedSteps[step]} // bouton désactivé si étape non validée
              >
               <Icon icon={ArrowRight} className="me-2" />
              </Button>
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
            <Button color="success" onClick={handleSubmit}>
              Soumettre
            </Button>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default CreateDossierForm;
