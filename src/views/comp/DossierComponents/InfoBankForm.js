import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Button from '../../../ui/Button';
import { CardHeader } from '../../../ui/Card';
import { Form } from '../../../ui/Form';
import { Col, Row } from '../../../ui/Grid';
import { Field, FormSection, FormAlert, FormToasts, useFormErrors } from '../../../forms';
import { Landmark } from '../../../ui/icons';

// ---------------------------------------------------------------------------
//  Information bancaire (react-hook-form + zod).
//  rib et mtn sont requis (inchangé) ; celtics et moov sont explicitement
//  facultatifs et partent en null vers l'API au lieu de ''.
//  Contrat de props inchange : onSubmite / updateData / initial / setCanProceed.
// ---------------------------------------------------------------------------

/** Vide -> null, pour ne jamais envoyer de chaine vide a l'API. */
const orNull = (v) => (v === '' || v === undefined ? null : v);

const validationSchema = z.object({
  rib: z.string().min(1, 'Le RIB est requis'),
  mtn: z.string().min(1, 'Le numéro MTN est requis'),
  celtics: z.string().nullish(),
  moov: z.string().nullish(),
});

const InfoBankForm = ({ onSubmite, updateData, initial, setCanProceed }) => {
  const { submitError, toasts, handleSubmit, dismissToast, clearError } = useFormErrors();

  const defaultValues = useMemo(() => ({
    rib: initial?.rib ?? '',
    mtn: initial?.mtn ?? '',
    celtics: initial?.celtics ?? '',
    moov: initial?.moov ?? '',
  }), [initial]);

  const {
    control,
    handleSubmit: rhfHandleSubmit,
    formState: { isDirty },
  } = useForm({
    defaultValues,
    resolver: zodResolver(validationSchema),
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
          rib: values.rib,
          mtn: values.mtn,
          celtics: orNull(values.celtics),
          moov: orNull(values.moov),
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
    <div>
      <FormToasts toasts={toasts} onDismiss={dismissToast} />
      <CardHeader className="mb-3">
        <strong>Information bancaire</strong>
      </CardHeader>

      <Form onSubmit={rhfHandleSubmit(onSubmit)} noValidate>
        <FormAlert error={submitError} onDismiss={clearError} />

        <FormSection title="Coordonnées bancaires" icon={Landmark} columns={2}>
          <Field control={control} name="rib" label="RIB" required />
          <Field control={control} name="mtn" label="MTN" required />
          <Field control={control} name="celtics" label="Celtics" optional />
          <Field control={control} name="moov" label="Moov" optional />
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

export default InfoBankForm;
