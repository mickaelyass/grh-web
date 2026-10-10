import React, { useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { CardHeader } from '../../../ui/Card';
import { Form } from '../../../ui/Form';
import { Col, Row } from '../../../ui/Grid';
import Button from '../../../ui/Button';
import { Field, FormSection, FormAlert, FormToasts, useFormErrors } from '../../../forms';
import { User } from '../../../ui/icons';

// ---------------------------------------------------------------------------
//  Formulaire d'identification de l'agent (react-hook-form + Yup).
//
//  Ce qui change par rapport a la version Formik :
//   - les erreurs s'affichent des que le champ est quitte, plus a la soumission ;
//   - les champs facultatifs sont marques « (facultatif) » et valent null s'ils
//     sont vides, au lieu de partir en '' vers l'API ;
//   - un echec d'enregistrement affiche le message exact du serveur au lieu de
//     disparaitre en silence.
//  Le contrat de props est inchange : onSubmite / updateData / uptdat / setCanProceed.
// ---------------------------------------------------------------------------

const SITUATIONS = ['Célibataire', 'Marié', 'Divorcé', 'Veuf'];
const SEXES = [
  { value: 'F', label: 'Femme' },
  { value: 'M', label: 'Homme' },
];

/** Vide -> null, pour ne jamais envoyer de chaîne vide à l'API. */
const orNull = (v) => (v === '' || v === undefined ? null : v);

const toDateInput = (value) => {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
};

const validationSchema = Yup.object({
  cnss: Yup.string().required('Le CNSS est requis'),
  nom: Yup.string().required('Le nom est requis'),
  prenom: Yup.string().required('Le prénom est requis'),
  dat_nat: Yup.date().required('La date de naissance est requise'),
  lieu_nat: Yup.string().required('Le lieu de naissance est requis'),
  situat_matri: Yup.string()
    .oneOf(SITUATIONS, 'Valeur non valide')
    .required('La situation matrimoniale est requise'),
  email: Yup.string().email('Email invalide').required("L'email est requis"),
  sexe: Yup.string().oneOf(['F', 'M'], 'Sélectionnez un sexe valide').required('Le sexe est requis'),
  // Facultatifs : presents dans le schema pour etre explicites, sans bloquer.
  nom_du_conjoint: Yup.string().nullable(),
  dat_mariage: Yup.date().nullable(),
  nbre_enfants: Yup.number().transform(orNull).nullable().min(0, "Le nombre d'enfants ne peut pas être négatif"),
});

const InfoIdentForm = ({ onSubmite, updateData, initial, uptdat, setCanProceed }) => {
  const { submitError, toasts, handleSubmit, dismissToast, clearError } = useFormErrors();

  const defaultValues = useMemo(() => ({
    cnss: initial?.cnss ?? '',
    nom: initial?.nom ?? '',
    prenom: initial?.prenom ?? '',
    dat_nat: toDateInput(initial?.dat_nat),
    lieu_nat: initial?.lieu_nat ?? '',
    situat_matri: initial?.situat_matri ?? '',
    email: initial?.email ?? '',
    sexe: initial?.sexe ?? '',
    nom_du_conjoint: initial?.nom_du_conjoint ?? '',
    dat_mariage: initial?.dat_mariage ?? '',
    nbre_enfants: initial?.nbre_enfants ?? '',
  }), [initial]);

  const {
    control,
    handleSubmit: rhfHandleSubmit,
    watch,
    formState: { isDirty },
  } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
    // L'ancien code validait a la soumission ; on passe en « des que le champ
    // est quitte » : moins de clics inutiles, retour immediat.
    mode: 'onTouched',
  });

  const situatMatri = watch('situat_matri');
  const estMarie = situatMatri === 'Marié';

  // Conserve le comportement d'origine : des qu'on retouche le formulaire,
  // l'etape suivante redevient impossible jusqu'a une nouvelle soumission.
  useEffect(() => {
    if (isDirty) setCanProceed?.(false);
  }, [isDirty, setCanProceed]);

  const onSubmit = (values) =>
    handleSubmit(
      () => {
        // Normalisation : champs facultatifs vides -> null plutot que ''
        const payload = {
          ...values,
          nom_du_conjoint: orNull(values.nom_du_conjoint),
          dat_mariage: orNull(values.dat_mariage),
          nbre_enfants: values.nbre_enfants === '' ? null : Number(values.nbre_enfants),
        };
        uptdat?.(payload);
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
        <strong>Information D'identification</strong>
      </CardHeader>

      <Form onSubmit={rhfHandleSubmit(onSubmit)} noValidate>
        <FormAlert error={submitError} onDismiss={clearError} />

        <FormSection title="Identité de l'agent" icon={User} columns={2}>
          <Field control={control} name="cnss" label="CNSS" required />
          <Field control={control} name="nom" label="Nom" required />
          <Field control={control} name="prenom" label="Prénom" required />
          <Field control={control} name="dat_nat" label="Date de naissance" type="date" required />
          <Field control={control} name="lieu_nat" label="Lieu de naissance" required />
          <Field control={control} name="email" label="Email" type="email" required />
        </FormSection>

        <FormSection title="Situation personnelle" icon={User} columns={2}>
          <Field
            control={control}
            name="situat_matri"
            label="Situation matrimoniale"
            type="select"
            placeholder="Sélectionner..."
            options={SITUATIONS}
            required
          />
          <Field
            control={control}
            name="sexe"
            label="Sexe"
            type="select"
            placeholder="Sélectionner..."
            options={SEXES}
            required
          />

          {/* Champs conjoint : affichés seulement si marié, explicitement facultatifs */}
          {estMarie ? (
            <>
              <Field
                control={control}
                name="nom_du_conjoint"
                label="Nom du conjoint"
                optional
                hint="À compléter si vous souhaitez l'enregistrer."
              />
              <Field
                control={control}
                name="dat_mariage"
                label="Date de mariage"
                type="date"
                optional
              />
            </>
          ) : null}

          <Field
            control={control}
            name="nbre_enfants"
            label="Nombre d'enfants"
            type="number"
            optional
            hint="Laisser vide si aucun."
          />
        </FormSection>

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

export default InfoIdentForm;
