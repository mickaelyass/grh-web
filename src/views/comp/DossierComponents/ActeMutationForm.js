import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, useFormErrors } from '../../../forms';
import { Button } from '../../../ui/Button';
import { updateMutation } from '../../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import '../Dasbord.css';

// ---------------------------------------------------------------------------
//  ActeMutationForm — formulaire d'acte administratif (mutation, détachement,
//  mise à disposition, mise en disponibilité). Les 4 écrans partagent exactement
//  la même logique ; seule la valeur d'`etat` diffère. On factorise donc ici.
//
//  Migré de Formik/Yup vers react-hook-form + zod.
// ---------------------------------------------------------------------------

// Date valide au format AAAA-MM-JJ (les <input type="date"> produisent ce format).
const dateStr = (msg) => z.string().min(1, msg).refine((v) => !Number.isNaN(Date.parse(v)), msg);

const schema = z.object({
  etat: z.string().optional(),
  poste_actuel: z.string().min(1, 'Le poste actuel est requis'),
  service_actuel: z.string().min(1, 'Le service actuel est requis'),
  nouveau_poste: z.string().min(1, 'Le nouveau poste est requis'),
  nouveau_service: z.string().min(1, 'Le nouveau service est requis'),
  date_prise_fonction: dateStr('La date de prise de fonction est requise'),
  date_changement: dateStr('La date de mutation est requise'),
  motif_changement: z.string().min(1, 'Le motif de la mutation est requis'),
  type_changement: z.string().min(1, 'Le type de mutation est requis'),
  besoins_formation: z.string().optional(),
});

const ActeMutationForm = ({ titre = 'Formulaire', etat }) => {
  const navigate = useNavigate();
  const { matricule } = useParams();
  const { submitError, success, clearError } = useFormErrors();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      etat,
      poste_actuel: '',
      service_actuel: '',
      nouveau_poste: '',
      nouveau_service: '',
      date_prise_fonction: '',
      date_changement: '',
      motif_changement: '',
      type_changement: '',
      besoins_formation: '',
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values) => {
    clearError();
    try {
      await updateMutation(matricule, values);
      success("Changement d'état réussi");
      navigate('/admin/dossier-list');
    } catch (error) {
      console.error('Erreur lors de la mutation :', error);
    }
  };

  return (
    <div className="dashboard">
      <div className="row">
        <div className="col">
          <div className="container py-2">
            <h2>{titre}</h2>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {submitError && <div className="alert alert-danger">{submitError}</div>}

              <div className="form-group">
                <Field control={control} name="etat" label="État" type="select" options={[etat]} />
              </div>

              <div className="form-group">
                <Field control={control} name="poste_actuel" label="Poste actuel" required />
              </div>

              <div className="form-group">
                <Field control={control} name="service_actuel" label="Service actuel" required />
              </div>

              <div className="form-group">
                <Field control={control} name="nouveau_poste" label="Nouveau poste" required />
              </div>

              <div className="form-group">
                <Field control={control} name="nouveau_service" label="Nouveau service" required />
              </div>

              <div className="form-group">
                <Field control={control} name="date_prise_fonction" label="Date de prise de fonction" type="date" required />
              </div>

              <div className="form-group">
                <Field control={control} name="date_changement" label="Date de mutation" type="date" required />
              </div>

              <div className="form-group">
                <Field control={control} name="motif_changement" label="Motif de la mutation" type="textarea" required />
              </div>

              <div className="form-group">
                <Field
                  control={control}
                  name="type_changement"
                  label="Type de mutation"
                  type="select"
                  options={[
                    { value: 'interne', label: 'Interne' },
                    { value: 'externe', label: 'Externe' },
                  ]}
                  placeholder="Sélectionner"
                  required
                />
              </div>

              <div className="form-group">
                <Field control={control} name="besoins_formation" label="Besoins en formation" type="textarea" optional />
              </div>

              <Button type="submit" color="primary" className="my-2" disabled={isSubmitting}>
                {isSubmitting ? 'Envoi en cours…' : 'Soumettre'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActeMutationForm;
