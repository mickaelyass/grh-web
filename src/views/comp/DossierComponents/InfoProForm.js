import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import Button from '../../../ui/Button';
import { Card, CardBody, CardHeader } from '../../../ui/Card';
import { Form } from '../../../ui/Form';
import { Col, Row } from '../../../ui/Grid';
import {
  Field, FormSection, FormAlert, FormToasts, useFormErrors, CollectionEditor,
} from '../../../forms';
import { Briefcase, GraduationCap } from '../../../ui/icons';

import DetailsForm from './DetailForm';

// ---------------------------------------------------------------------------
//  Information professionnelle (react-hook-form + Yup + CollectionEditor).
//
//  Changements par rapport a la version Formik :
//   - les « Ajouter » qui ecrasaient le diplome/poste precedent sont remplaces
//     par une liste visible : on ajoute, on voit, on supprime ;
//   - le select « grade » (A1-1..E4-4) n'etait relie a aucun champ du modele :
//     il alimentait `grade`, inexistant, alors que `grade_paye` (requis par
//     Yup) n'etait jamais rendu a l'ecran. Il est desormais grade_paye ;
//   - `nombre_jour_conges_disponible` a ete retire : colonne supprimee du
//     modele API, remplacee par la table solde_conge ;
//   - les champs facultatifs sont declares et partent en null vers l'API.
//  Contrat de props inchange : onSubmite / updateData / infoi / setCanProceed,
//  payload ales cles infoPro, detailMutation, poste, diplome (tableaux).
// ---------------------------------------------------------------------------

const STATUTS = ['FE', 'ACDPE', 'AFC'];
const CATEGORIES = ['A', 'B', 'C', 'D', 'E'];
// Grille de grades A1-1 .. E4-4, comme dans l'ancienne UI.
const GRADES = ['A', 'B', 'C', 'D', 'E'].flatMap((categorie) =>
  [1, 2, 3, 4].flatMap((echelle) =>
    [1, 2, 3, 4].map((echelon) => `${categorie}${echelle}-${echelon}`),
  ),
);

const COLONNES_DIPLOME = [
  { name: 'nom_diplome', label: 'Diplôme', required: true },
  { name: 'date_obtention', label: 'Obtenu le', type: 'date' },
  { name: 'institution', label: 'Institution' },
];

const COLONNES_POSTE = [
  { name: 'nom_poste', label: 'Poste', required: true },
  { name: 'date_debut', label: 'Du', type: 'date' },
  { name: 'date_fin', label: 'Au', type: 'date' },
  { name: 'institution', label: 'Institution' },
];

const InfoProForm = ({ onSubmite, updateData, initial, infoi, setCanProceed }) => {
  const { submitError, toasts, handleSubmit, dismissToast, clearError } = useFormErrors();

  // Collections editees par CollectionEditor — des TABLEAUX, pas des objets
  // ecrases : l'ancien code ne gardait qu'un seul diplome/poste.
  const [diplomes, setDiplomes] = useState(() =>
    Array.isArray(initial?.Diplomes) ? initial.Diplomes : [],
  );
  const [postes, setPostes] = useState(() =>
    Array.isArray(initial?.PosteAnterieurs) ? initial.PosteAnterieurs : [],
  );
  const [detailMutation, setDetailMutation] = useState({});

  // Afficher le sous-formulaire des details de mutation
  const [showDetailsForm, setShowDetailsForm] = useState(false);

/** Vide -> null, pour ne jamais envoyer de chaine vide a l'API. */
const orNull = (v) => (v === '' || v === undefined ? null : v);

const toDateInput = (value) => {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
};

/** Age de depart a la retraite selon la categorie (regle metier). */
const ageDepartRetraite = (categorie) => {
  switch (categorie) {
    case 'A': return 60;
    case 'B': return 58;
    case 'C':
    case 'D': return 55;
    default: return 60;
  }
};

const dateRetraite = (birthDate, categorie) => {
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return '';
  birth.setFullYear(birth.getFullYear() + ageDepartRetraite(categorie));
  return birth.toISOString().slice(0, 10);
};

const validationSchema = Yup.object({
  statut: Yup.string().oneOf(STATUTS, 'Sélectionnez un statut valide').required('Le statut est requis'),
  corps: Yup.string().required('Le corps est requis'),
  categorie: Yup.string().oneOf(CATEGORIES, 'Sélectionnez une catégorie valide').required('La catégorie est requise'),
  branche_du_personnel: Yup.string().required('La branche du personnel est requise'),
  fonctions: Yup.string().required('Les fonctions sont requises'),
  dat_prise_fonction: Yup.date().required('La date de prise de fonction est requise'),
  grade_paye: Yup.string().required('Le grade payé est requis'),
  indice_paye: Yup.number()
    .transform((v) => (v === '' || v === null ? null : v))
    .typeError("L'indice payé doit être un nombre")
    .nullable().required("L'indice payé est requis")
    .min(0, "L'indice ne peut pas être négatif"),
  dat_first_prise_de_service: Yup.date().required('La première prise de service est requise'),
  dat_de_depart_retraite: Yup.date().required('La date de départ à la retraite est requise'),
  dat_de_prise_service_dans_departement: Yup.date().required('La date de prise de service dans le département est requise'),
  poste_actuel_service: Yup.string().required('Le service actuel est requis'),
  type_structure: Yup.string().required('Le type de structure est requis'),
  // Facultatifs : presents dans le schema pour etre explicites, sans bloquer.
  ref_acte_de_prise_service_poste_actuel: Yup.string().nullable(),
  ref_nomination: Yup.string().nullable(),
  zone_sanitaire: Yup.string().nullable(),
  poste_specifique: Yup.string().nullable(),
});

  const defaultValues = useMemo(() => ({
    statut: initial?.statut ?? '',
    corps: initial?.corps ?? '',
    categorie: initial?.categorie ?? '',
    branche_du_personnel: initial?.branche_du_personnel ?? '',
    fonctions: initial?.fonctions ?? '',
    dat_prise_fonction: toDateInput(initial?.dat_prise_fonction),
    grade_paye: initial?.grade_paye ?? '',
    indice_paye: initial?.indice_paye ?? '',
    dat_first_prise_de_service: toDateInput(initial?.dat_first_prise_de_service),
    dat_de_depart_retraite: toDateInput(initial?.dat_de_depart_retraite),
    dat_de_prise_service_dans_departement: toDateInput(initial?.dat_de_prise_service_dans_departement),
    ref_acte_de_prise_service_poste_actuel: initial?.ref_acte_de_prise_service_poste_actuel ?? '',
    poste_actuel_service: initial?.poste_actuel_service ?? '',
    type_structure: initial?.type_structure ?? '',
    ref_nomination: initial?.ref_nomination ?? '',
    zone_sanitaire: initial?.zone_sanitaire ?? '',
    poste_specifique: initial?.poste_specifique ?? '',
  }), [initial]);

  const {
    control,
    handleSubmit: rhfHandleSubmit,
    watch,
    setValue,
    formState: { isDirty },
  } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
    // L'ancien code validait a la soumission ; on passe en « des que le champ
    // est touche » : l'erreur apparait au bon moment.
    mode: 'onTouched',
  });

  const categorie = watch('categorie');
  const datDepartRetraite = watch('dat_de_depart_retraite');

  // Date de naissance transmise par l'etape « Identification » (infoi),
  // ou a defaut celle deja en base sur ce dossier.
  const datNat = infoi?.dat_nat || initial?.dat_nat;

  // Depart a la retraite calcule automatiquement (age selon categorie) —
  // l'utilisateur peut ensuite corriger a la main.
  useEffect(() => {
    if (datNat && categorie) {
      const calculee = dateRetraite(datNat, categorie);
      if (calculee && calculee !== datDepartRetraite) {
        setValue('dat_de_depart_retraite', calculee, { shouldDirty: true });
      }
    }
  }, [datNat, categorie, datDepartRetraite, setValue]);

  // L'etape suivante redevient impossible jusqu'a une nouvelle soumission.
  useEffect(() => {
    if (isDirty) setCanProceed?.(false);
  }, [isDirty, setCanProceed]);

  const onSubmit = (values) =>
    handleSubmit(
      () => {
        const payload = {
          infoPro: {
            ...values,
            indice_paye: values.indice_paye === '' || values.indice_paye === null
              ? null
              : Number(values.indice_paye),
            ref_acte_de_prise_service_poste_actuel: orNull(values.ref_acte_de_prise_service_poste_actuel),
            ref_nomination: orNull(values.ref_nomination),
            zone_sanitaire: orNull(values.zone_sanitaire),
            poste_specifique: orNull(values.poste_specifique),
          },
          detailMutation,
          // Tableaux : l'API remplace la liste par celle-ci (voir updateDossier).
          diplome: diplomes,
          poste: postes,
        };
        updateData?.(payload);
      },
      {
        onFinally: () => {
          setCanProceed?.(true);
          onSubmite?.();
        },
      },
    );



  return (
    <div>
      <FormToasts toasts={toasts} onDismiss={dismissToast} />
      <CardHeader className="mb-3">
        <strong>Informations professionnelles</strong>
      </CardHeader>

      <Form onSubmit={rhfHandleSubmit(onSubmit)} noValidate>
        <FormAlert error={submitError} onDismiss={clearError} />

        <FormSection title="Statut et affectation" icon={Briefcase} columns={2}>
          <Field
            control={control}
            name="statut"
            label="Statut"
            type="select"
            placeholder="Sélectionner..."
            options={STATUTS}
            required
          />
          <Field control={control} name="corps" label="Corps" required />
          <Field
            control={control}
            name="categorie"
            label="Catégorie"
            type="select"
            placeholder="Sélectionner..."
            options={CATEGORIES}
            required
            hint="Utilisée pour calculer la date de départ à la retraite."
          />
          <Field control={control} name="branche_du_personnel" label="Branche du personnel" required />
          <Field control={control} name="fonctions" label="Fonctions" required />
          <Field
            control={control}
            name="grade_paye"
            label="Grade payé"
            type="select"
            placeholder="Sélectionner..."
            options={GRADES}
            required
          />
        </FormSection>

        <FormSection title="Carrière et rémunération" icon={Briefcase} columns={2}>
          <Field control={control} name="indice_paye" label="Indice payé" type="number" required />
          <Field control={control} name="dat_prise_fonction" label="Date de prise de fonction" type="date" required />
          <Field
            control={control}
            name="dat_first_prise_de_service"
            label="Date de première prise de service"
            type="date"
            required
          />
          <Field
            control={control}
            name="dat_de_prise_service_dans_departement"
            label="Date de prise de service dans le département"
            type="date"
            required
          />
          <Field
            control={control}
            name="dat_de_depart_retraite"
            label="Date de départ à la retraite"
            type="date"
            required
            hint="Calculée selon la catégorie ; modifiable si besoin."
          />
        </FormSection>

        <FormSection title="Poste et structure" icon={Briefcase} columns={2}>
          <Field control={control} name="poste_actuel_service" label="Service actuel" required />
          <Field control={control} name="type_structure" label="Type de structure" required />
          <Field control={control} name="poste_specifique" label="Poste spécifique" optional />
          <Field control={control} name="zone_sanitaire" label="Zone sanitaire" optional />
          <Field control={control} name="ref_nomination" label="Référence de nomination" optional />
          <Field
            control={control}
            name="ref_acte_de_prise_service_poste_actuel"
            label="Réf. acte de prise de service (poste actuel)"
            optional
          />
        </FormSection>



        {/* Collections : la liste existante est rechargee depuis l'API et
            editee ici — ajouter n'ecrase plus l'element precedent. */}
        <CollectionEditor
          title="Diplômes"
          items={diplomes}
          onChange={setDiplomes}
          columns={COLONNES_DIPLOME}
          addLabel="Ajouter un diplôme"
        />

        <CollectionEditor
          title="Postes antérieurs"
          items={postes}
          onChange={setPostes}
          columns={COLONNES_POSTE}
          addLabel="Ajouter un poste antérieur"
        />

        {/* Détails de mutation : formulaire optionnel (objet unique) */}
        <Card className="p-4 mt-3">
          <CardHeader className="mb-3">
            <strong>Détails de mutation</strong>
            <span className="text-muted ms-2">(facultatif)</span>
          </CardHeader>
          <Button
            color="secondary"
            className="mb-3"
            onClick={() => setShowDetailsForm(!showDetailsForm)}
          >
            {showDetailsForm ? 'Masquer les détails' : 'Ajouter des détails de mutation'}
          </Button>
          {showDetailsForm && (
            <div className="border rounded p-3 bg-light">
              <DetailsForm
                info={initial?.Details}
                handle={(data) => {
                  setDetailMutation(data);
                  setShowDetailsForm(false);
                }}
              />
            </div>
          )}
        </Card>

        <Row>
          <Col xs={12} className="mt-3">
            <Button type="submit" color="primary">
              Soumettre
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default InfoProForm;
