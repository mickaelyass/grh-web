import React, { useState, useCallback } from 'react';
import InfoIdentForm from './InfoIdentForm';
import InfoBankForm from './InfoBankForm';
import InfoComplementaireForm from './InfoComplementaireForm';
import InfoProForm from './InfoProForm';
import { createDossier } from '../../../services/api';
import Button from '../../../ui/Button'
import { CardHeader } from '../../../ui/Card'
import Icon from '../../../ui/Icon'
import { ArrowLeft, ArrowRight } from '../../../ui/icons'

// Libellés des 4 étapes, affichés dans l'indicateur de progression.
const ETAPES = [
  'Identification de l’agent',
  'Informations professionnelles',
  'Informations bancaires',
  'Informations complémentaires',
];

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

      {/* Navigation */}
      <div className="gp-steps-nav mt-4 pt-3 border-top">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
          {/* Indicateur d'étape */}
          <div className="text-muted">
            <strong>Étape {step} sur 4</strong>
            <span className="d-block small">{ETAPES[step - 1]}</span>
          </div>

          <div className="d-flex gap-2">
            {step > 1 && (
              <Button color="secondary" onClick={prevStep}>
                <Icon icon={ArrowLeft} className="me-2" />
                Précédent
              </Button>
            )}

            {step < 4 && (
              <Button
                color="primary"
                onClick={nextStep}
                disabled={!validatedSteps[step]} // désactivé tant que l'étape n'est pas soumise
              >
                Suivant
                <Icon icon={ArrowRight} className="ms-2" />
              </Button>
            )}
            {step === 4 && (
              <Button color="success" onClick={handleSubmit}>
                Soumettre le dossier
              </Button>
            )}
          </div>
        </div>

        {/* Aide claire : pourquoi le bouton « Suivant » est bloqué */}
        {step < 4 && !validatedSteps[step] && (
          <p className="gp-steps-hint text-muted small mt-2 mb-0">
            Remplissez les champs requis puis cliquez sur « Soumettre » pour valider cette étape et débloquer « Suivant ».
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateDossierForm;
