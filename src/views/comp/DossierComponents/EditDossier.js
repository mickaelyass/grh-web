import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { updateDossier, getDossier } from '../../../services/api';
import InfoIdentForm from './InfoIdentForm';
import InfoBankForm from './InfoBankForm';
import InfoComplementaireForm from './InfoComplementaireForm';
import InfoProForm from './InfoProForm';
import { Col, Row } from '../../../ui/Grid'
import { StepPanels, useSteps, StepNav, StepTabs, FormAlert, FormToasts, useFormErrors } from '../../../forms';

// ---------------------------------------------------------------------------
//  Edition d'un dossier en 4 etapes.
//
//  Le point delicat — et la raison d'etre de StepPanels — est que les 4
//  formulaires restent MONTES en permanence. L'ancien code faisait
//  `{step === 1 && <InfoIdentForm />}`, ce qui DEMONTAIT le formulaire des
//  qu'on changeait d'etape : React detruisait alors l'etat des champs, et les
//  valeurs saisies disparaissaient. Au retour, `initial` reinjectait en plus
//  les donnees d'origine de la base, donc on revoyait l'ancienne valeur.
//
//  On masque donc avec `hidden` (display:none) au lieu de demonter : l'etat
//  survit a la navigation, dans les deux sens.
// ---------------------------------------------------------------------------

const SECTIONS = [
  'Identification',
  'Informations professionnelles',
  'Informations bancaires',
  'Informations complémentaires',
];

// Nom de section -> numero d'etape (1-based), pour la coche des onglets.
const ETAPES_PAR_SECTION = {
  infoIdent: 1,
  infoPro: 2,
  infoBank: 3,
  infoComplementaire: 4,
};

const EditDossierForm = () => {
  const { id_dossier } = useParams();

  const { step, goTo, next, prev } = useSteps(SECTIONS.length);
  const { submitError, toasts, handleSubmit, success, dismissToast, clearError } = useFormErrors();

  const [saving, setSaving] = useState(false);
  const [dossierData, setDossierData] = useState({});
  const [matricule, setMatricule] = useState('');
  const [ident, setIdent] = useState({});

  const [formData, setFormData] = useState({
    infoIdent: {},
    infoPro: {},
    infoBank: {},
    infoComplementaire: {},
  });

  // Etapes deja remplies, pour la coche dans les onglets.
  const [filled, setFilled] = useState({});

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

  const updateFormData = useCallback((section, data) => {
    setFormData((prev) => ({ ...prev, [section]: data }));
    // Une section qui a fourni des donnees est consideree comme remplie
    // (cle = numero d'etape, comme attendu par StepTabs).
    const numero = ETAPES_PAR_SECTION[section];
    if (numero) setFilled((prev) => ({ ...prev, [numero]: true }));
  }, []);

  const updateIdent = useCallback((data) => setIdent(data), []);

  const handleSave = () =>
    handleSubmit(
      async () => {
        setSaving(true);
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
          success('Dossier mis à jour avec succès.');
        } finally {
          setSaving(false);
        }
      },
    );


  return (
    <div className="my-3">
      <FormToasts toasts={toasts} onDismiss={dismissToast} />

      <Row className="mb-3">
        <Col xs={12} md={4}>
          <div className="form-group">
            <label className="form-label" htmlFor="matricule">Matricule</label>
            <input
              type="text"
              id="matricule"
              name="matricule"
              className="form-control"
              value={matricule}
              disabled
            />
          </div>
        </Col>
      </Row>

      <StepTabs
        steps={SECTIONS}
        active={step}
        goTo={goTo}
        completed={filled}
      />

      {/* Les 4 formulaires restent montes : naviguer ne perd aucune donnee. */}
      <StepPanels active={step - 1}>
        <InfoIdentForm
          onSubmite={() => {}}
          setCanProceed={() => {}}
          uptdat={updateIdent}
          updateData={(data) => updateFormData('infoIdent', data)}
          initial={dossierData.InfoIdent}
        />

        <InfoProForm
          onSubmite={() => {}}
          setCanProceed={() => {}}
          infoi={ident}
          updateData={(data) => updateFormData('infoPro', data)}
          initial={dossierData.InfoPro}
        />

        <InfoBankForm
          onSubmite={() => {}}
          setCanProceed={() => {}}
          updateData={(data) => updateFormData('infoBank', data)}
          initial={dossierData.InfoBank}
        />

        <InfoComplementaireForm
          onSubmite={() => {}}
          setCanProceed={() => {}}
          updateData={(data) => updateFormData('infoComplementaire', data)}
          initial={dossierData.InfoComplementaire}
        />
      </StepPanels>

      <FormAlert error={submitError} onDismiss={clearError} />

      <StepNav
        step={step}
        total={SECTIONS.length}
        onPrev={prev}
        onNext={next}
        onSave={handleSave}
        saving={saving}
        hint="Vous pouvez passer d'une section à l'autre librement : vos saisies sont conservées."
      />
    </div>
  );
};

export default EditDossierForm;
