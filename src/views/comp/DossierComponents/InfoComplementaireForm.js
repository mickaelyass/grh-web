import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import Button from '../../../ui/Button';
import { Card, CardHeader } from '../../../ui/Card';
import { Form } from '../../../ui/Form';
import { Col, Row } from '../../../ui/Grid';
import {
  Field, FormSection, FormAlert, FormToasts, useFormErrors, CollectionEditor,
} from '../../../forms';
import { ClipboardCheck } from '../../../ui/icons';

// ---------------------------------------------------------------------------
//  Informations complementaires (react-hook-form + Yup + CollectionEditor).
//
//  Changements par rapport a la version Formik :
//   - distinctions et sanctions deviennent des LISTES editables : l'ancien
//     code ne gardait qu'un seul objet, ecrase a chaque ajout ;
//   - l'alerte verte « ✔ enregistrée » temporaire disparait au profit des
//     toasts permanents et du tableau visible ;
//   - observation_particuliere est explicitement facultative (null).
//  Contrat de props inchange : onSubmite / updateData / initial /
//  setCanProceed ; le payload garde les cles infoComplementaire,
//  distinction et sanction (maintenant des tableaux).
// ---------------------------------------------------------------------------

const COLONNES_DISTINCTION = [
  { name: 'ref_distinction', label: 'Référence', required: true },
  { name: 'detail_distinction', label: 'Détail', required: true },
];

const COLONNES_SANCTION = [
  { name: 'sanction_punitive', label: 'Sanction punitive', required: true },
  { name: 'nature_sanction', label: 'Nature de la sanction', required: true },
];

/** Vide -> null, pour ne jamais envoyer de chaine vide a l'API. */
const orNull = (v) => (v === '' || v === undefined ? null : v);

const validationSchema = Yup.object({
  observation_particuliere: Yup.string().nullable(),
  situat_sante: Yup.string().required('La situation de santé est requise'),
});

const InfoComplementaireForm = ({ onSubmite, updateData, initial, setCanProceed }) => {
  const { submitError, toasts, handleSubmit, dismissToast, clearError } = useFormErrors();

  // Collections : des tableaux editables (l'ancien code ecrasait l'objet).
  const [distinctions, setDistinctions] = useState(() =>
    Array.isArray(initial?.Distinctions) ? initial.Distinctions : [],
  );
  const [sanctions, setSanctions] = useState(() =>
    Array.isArray(initial?.Sanctions) ? initial.Sanctions : [],
  );

  const defaultValues = useMemo(() => ({
    observation_particuliere: initial?.observation_particuliere ?? '',
    situat_sante: initial?.situat_sante ?? '',
  }), [initial]);

  const {
    control,
    handleSubmit: rhfHandleSubmit,
    formState: { isDirty },
  } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
    mode: 'onTouched',
  });

  // L'etape suivante redevient impossible jusqu'a une nouvelle soumission.
  useEffect(() => {
    if (isDirty) setCanProceed?.(false);
  }, [isDirty, setCanProceed]);

  const onSubmit = (values) =>
    handleSubmit(
      () => {
        updateData?.({
          infoComplementaire: {
            observation_particuliere: orNull(values.observation_particuliere),
            situat_sante: values.situat_sante,
          },
          // Tableaux : l'API remplace la liste par celle-ci (voir updateDossier).
          distinction: distinctions,
          sanction: sanctions,
        });
      },
      {
        onFinally: () => {
          setCanProceed?.(true);
          onSubmite?.();
        },
      },
    );

  return (
    <Card className="p-4">
      <FormToasts toasts={toasts} onDismiss={dismissToast} />
      <CardHeader className="mb-3">
        <strong>Informations complémentaires</strong>
      </CardHeader>

      <Form onSubmit={rhfHandleSubmit(onSubmit)} noValidate>
        <FormAlert error={submitError} onDismiss={clearError} />

        <FormSection title="Observations" icon={ClipboardCheck} columns={2}>
          <Field
            control={control}
            name="situat_sante"
            label="Situation de santé"
            required
          />
          <Field
            control={control}
            name="observation_particuliere"
            label="Observation particulière"
            type="textarea"
            rows={3}
            optional
          />
        </FormSection>

        {/* Collections : listes rechargees depuis l'API et editees ici */}
        <CollectionEditor
          title="Distinctions"
          items={distinctions}
          onChange={setDistinctions}
          columns={COLONNES_DISTINCTION}
          addLabel="Ajouter une distinction"
        />

        <CollectionEditor
          title="Sanctions"
          items={sanctions}
          onChange={setSanctions}
          columns={COLONNES_SANCTION}
          addLabel="Ajouter une sanction"
        />

        <Row>
          <Col xs={12} className="mt-3">
            <Button type="submit" color="primary">
              Soumettre
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default InfoComplementaireForm;
