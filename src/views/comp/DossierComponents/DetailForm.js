import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field } from '../../../forms';
import Button from '../../../ui/Button';
import { Col, Row } from '../../../ui/Grid';
import { Form } from '../../../ui/Form';

// ---------------------------------------------------------------------------
//  DetailForm — détail de mutation (react-hook-form + zod).
//  Les champs sont déclarés une seule fois et rendus via le socle <Field>.
// ---------------------------------------------------------------------------

// Date valide au format AAAA-MM-JJ.
const dateStr = (msg) => z.string().min(1, msg).refine((v) => !Number.isNaN(Date.parse(v)), msg);

const schema = z.object({
  etat: z.string().min(1, 'L’état est requis'),
  poste_actuel: z.string().min(1, 'Le poste actuel est requis'),
  service_actuel: z.string().min(1, 'Le service actuel est requis'),
  nouveau_poste: z.string().min(1, 'Le nouveau poste est requis'),
  nouveau_service: z.string().min(1, 'Le nouveau service est requis'),
  date_prise_fonction: dateStr('La date de prise de fonction est requise'),
  date_changement: dateStr('La date de changement est requise'),
  motif_changement: z.string().min(1, 'Le motif du changement est requis'),
  type_changement: z.string().min(1, 'Le type de changement est requis'),
  besoins_formation: z.string().min(1, 'Les besoins en formation sont requis'),
});

const CHAMPS = [
  { name: 'etat', label: 'État', type: 'text' },
  { name: 'poste_actuel', label: 'Poste actuel', type: 'text' },
  { name: 'service_actuel', label: 'Service actuel', type: 'text' },
  { name: 'nouveau_poste', label: 'Nouveau poste', type: 'text' },
  { name: 'nouveau_service', label: 'Nouveau service', type: 'text' },
  { name: 'date_prise_fonction', label: 'Date de prise de fonction', type: 'date' },
  { name: 'date_changement', label: 'Date de changement', type: 'date' },
  { name: 'motif_changement', label: 'Motif du changement', type: 'text' },
  { name: 'type_changement', label: 'Type de changement', type: 'text' },
  { name: 'besoins_formation', label: 'Besoins en formation', type: 'text' },
];

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const DetailsForm = ({ info, handle }) => {
  const lastInfo = Array.isArray(info) && info.length > 0 ? info[info.length - 1] : {};

  const defaultValues = useMemo(() => ({
    etat: lastInfo.etat || '',
    poste_actuel: lastInfo.poste_actuel || '',
    service_actuel: lastInfo.service_actuel || '',
    nouveau_poste: lastInfo.nouveau_poste || '',
    nouveau_service: lastInfo.nouveau_service || '',
    date_prise_fonction: formatDate(lastInfo.date_prise_fonction) || '',
    date_changement: formatDate(lastInfo.date_changement) || '',
    motif_changement: lastInfo.motif_changement || '',
    type_changement: lastInfo.type_changement || '',
    besoins_formation: lastInfo.besoins_formation || '',
  }), [info]);

  const { control, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
    mode: 'onTouched',
  });

  const onSubmit = (values) => {
    try {
      handle(values);
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
    }
  };

  return (
    <div>
      <Form className="my-2" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Row>
          {CHAMPS.map((field) => (
            <Col xs={12} md={6} key={field.name} className="mb-3">
              <Field control={control} name={field.name} label={field.label} type={field.type} required />
            </Col>
          ))}
          <Col xs={12} className="mt-3">
            <Button type="submit" color="primary" disabled={isSubmitting}>
              Ajouter
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default DetailsForm;
