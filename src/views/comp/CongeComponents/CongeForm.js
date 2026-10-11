import Button from '../../../ui/Button'
import { Card, CardBody } from '../../../ui/Card'
import { Form, FormFeedback, FormInput, FormLabel, FormSelect } from '../../../ui/Form'
import React, { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { getDoc } from '../../../services/api';

// ---------------------------------------------------------------------------
//  CongeForm — demande de congé (react-hook-form + zod).
//  Validation CONDITIONNELLE selon le type de congé (via zod superRefine) :
//   - administratif : 2 pièces jointes requises
//   - maternité     : certificat de grossesse (pièce 1) requis
//   - maladie       : certificat médical (pièce 1) requis
//  La date de fin est calculée automatiquement (début + nombre de jours).
// ---------------------------------------------------------------------------

const TYPES_MATERNITE_OU_MALADIE = ['Congé maternité', 'Congé maladie'];

const fichierOk = (v) => Boolean(v) && (Array.isArray(v) ? v.length > 0 : v instanceof File || typeof v === 'object');

const schema = z
  .object({
    matricule: z.string().min(1, 'Matricule est requis'),
    type_conge: z.string().min(1, 'Type de congé est requis'),
    date_debut: z.string().min(1, 'Date de début est requise'),
    nombre_de_jour: z.coerce.number({ invalid_type_error: 'Nombre de jours est requis' }).min(1, 'Nombre de jours est requis'),
    annee_jouissance: z.any().optional(),
    piece_jointe_1: z.any().optional(),
    piece_jointe_2: z.any().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.type_conge === 'Congé administratif') {
      if (!fichierOk(values.piece_jointe_1)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['piece_jointe_1'], message: 'La première pièce jointe est requise' });
      if (!fichierOk(values.piece_jointe_2)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['piece_jointe_2'], message: 'La deuxième pièce jointe est requise' });
    } else if (TYPES_MATERNITE_OU_MALADIE.includes(values.type_conge)) {
      if (!fichierOk(values.piece_jointe_1)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['piece_jointe_1'], message: values.type_conge === 'Congé maternité' ? 'Certificat de grossesse requis' : 'Certificat médical requis' });
      }
    }
  });

const CongeForm = ({ onSubmit }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const matricule = user ? user.matricule : '';
  const [dossier, setDossier] = useState(null);

  useEffect(() => {
    if (matricule) {
      const fetchDossier = async () => {
        try {
          const response = await getDoc(matricule);
          setDossier(response.data);
        } catch (error) {
          console.error('Erreur chargement dossier:', error.message);
        }
      };
      fetchDossier();
    }
  }, [matricule]);

  const calculateEndDate = (startDate, numberOfDays) => {
    if (!startDate || !numberOfDays) return '';
    const start = new Date(startDate);
    start.setDate(start.getDate() + Number(numberOfDays));
    return start.toISOString().split('T')[0];
  };

  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      matricule,
      type_conge: '',
      date_debut: '',
      annee_jouissance: '0000',
      nombre_de_jour: '',
      date_de_fin: '',
      raison: 'Facultatif',
      piece_jointe_1: null,
      piece_jointe_2: null,
    },
    resolver: zodResolver(schema),
    mode: 'onTouched',
  });

  const typeConge = useWatch({ control, name: 'type_conge' });
  const dateDebut = useWatch({ control, name: 'date_debut' });
  const nombreDeJour = useWatch({ control, name: 'nombre_de_jour' });
  const dateFin = useMemo(() => calculateEndDate(dateDebut, nombreDeJour), [dateDebut, nombreDeJour]);

  const isFieldVisible = (field) => {
    if (typeConge === 'Congé administratif') return true;
    if (typeConge === 'Congé maternité' && field === 'piece_jointe_1') return true;
    if (typeConge === 'Congé maladie' && field === 'piece_jointe_1') return true;
    return false;
  };

  const submit = (values) => onSubmit({ ...values, date_de_fin: dateFin });

  return (
    <Card className="shadow-sm">
      <CardBody>
        <Form onSubmit={handleSubmit(submit)} className="p-4" noValidate>
          <input id="matricule" name="matricule" type="hidden" value={matricule} />

          <div className="mb-3">
            <FormLabel htmlFor="type_conge">Type de Congé</FormLabel>
            <FormSelect id="type_conge" invalid={Boolean(errors.type_conge)} {...register('type_conge')}>
              <option value="">-- Sélectionnez le type de congé --</option>
              <option value="Congé administratif">Congé administratif</option>
              <option value="Congé maladie">Congé maladie</option>
              {dossier?.InfoIdent.sexe == 'F' && <option value="Congé maternité">Congé maternité</option>}
              <option value="Autres">Autres</option>
            </FormSelect>
            {errors.type_conge && <FormFeedback invalid>{errors.type_conge.message}</FormFeedback>}
          </div>

          <div className="mb-3">
            <FormLabel htmlFor="date_debut">Date de Début</FormLabel>
            <FormInput id="date_debut" type="date" invalid={Boolean(errors.date_debut)} {...register('date_debut')} />
            {errors.date_debut && <FormFeedback invalid>{errors.date_debut.message}</FormFeedback>}
          </div>

          {typeConge === 'Congé administratif' && (
            <div className="mb-3">
              <FormLabel htmlFor="annee_jouissance">Année de Jouissance</FormLabel>
              <FormSelect id="annee_jouissance" {...register('annee_jouissance')}>
                <option value="">-- Sélectionnez une année --</option>
                {Array.from({ length: 31 }, (_, i) => 2010 + i).map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </FormSelect>
            </div>
          )}

          <div className="mb-3">
            <FormLabel htmlFor="nombre_de_jour">Nombre de jours</FormLabel>
            <FormInput id="nombre_de_jour" type="number" invalid={Boolean(errors.nombre_de_jour)} {...register('nombre_de_jour')} />
            {errors.nombre_de_jour && <FormFeedback invalid>{errors.nombre_de_jour.message}</FormFeedback>}
          </div>

          {['piece_jointe_1', 'piece_jointe_2'].map(
            (field) =>
              isFieldVisible(field) && (
                <div className="mb-3" key={field}>
                  <FormLabel htmlFor={field}>
                    {field === 'piece_jointe_1' && typeConge === 'Congé maternité'
                      ? 'Certificat de grossesse'
                      : field === 'piece_jointe_1' && typeConge === 'Congé maladie'
                      ? 'Certificat médical'
                      : field === 'piece_jointe_1'
                      ? 'Première pièce jointe'
                      : 'Deuxième pièce jointe'}
                  </FormLabel>
                  <FormInput id={field} type="file" invalid={Boolean(errors[field])} {...register(field)} />
                  {errors[field] && <FormFeedback invalid>{errors[field].message}</FormFeedback>}
                </div>
              )
          )}

          <div className="mb-3">
            <FormLabel htmlFor="date_de_fin">Date de Fin</FormLabel>
            <FormInput id="date_de_fin" type="date" value={dateFin} readOnly />
          </div>

          <Button type="submit" color="primary" className="w-100">
            Soumettre
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default CongeForm;


