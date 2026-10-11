import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FormAlert, useFormErrors } from '../../../forms';
import { getDossier, updateMutation } from '../../../services/api';
import '../Dasbord.css';

// Choix d'état de l'agent (doit correspondre aux branches métier de onSubmit).
const ETATS = [
  'Actif', 'Muté', 'Détachement', 'Mise en disponibilité',
  'Mise à disposition', 'Abandon/demission', 'Retraite', 'Décédé',
];

const schema = z.object({
  etat: z.string({ required_error: 'L’état est requis' }).min(1, 'L’état est requis'),
});

const ChangeEtat = () => {
  const { id_dossier } = useParams();
  const navigate = useNavigate();
  const [dossier, setDossier] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const formatDate = (dateString) => {
    if (!dateString) return ''; // Return an empty string for invalid dates
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format as yyyy-MM-dd
  };

  useEffect(() => {
    const fetchDossier = async () => {
      try {
        const response = await getDossier(id_dossier);
        setDossier(response.data);
        console.log(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDossier();
  }, [id_dossier]);

  const { submitError, clearError } = useFormErrors();

  const { control, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { etat: '' },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values) => {
    clearError();
    const { etat } = values;
    try {
      if (['Actif', 'Abandon/demission', 'Retraite', 'Décédé'].includes(etat)) {
        const mutationData = {
          etat,
          poste_actuel: 'Neant', service_actuel: 'Neant',
          nouveau_poste: 'Neant', nouveau_service: 'Neant',
          date_prise_fonction: '01/01/01', date_changement: '01/01/01',
          motif_changement: 'Neant', type_changement: 'Neant', besoins_changement: 'Neant',
        };
        await updateMutation(dossier.matricule, mutationData);
      } else {
        switch (etat) {
          case 'Muté':
            navigate(`/admin/mutation-form/${dossier.matricule}`); break;
          case 'Mise à disposition':
            navigate(`/admin/mise-a-disposition-form/${dossier.matricule}`); break;
          case 'Détachement':
            navigate(`/admin/detachement-form/${dossier.matricule}`); break;
          case 'Mise en disponibilité':
            navigate(`/admin/mise-en-disponibilite-form/${dossier.matricule}`); break;
          default:
            navigate(`/dossier/${dossier.matricule}`); break;
        }
      }
    } catch (err) {
      console.error('Error updating dossier state:', err);
      setError('Échec de la mise à jour de l’état. Veuillez réessayer.');
    }
  };


  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">Error: {error}</div>;
  }

  if (!dossier) {
    return <div className="text-center mt-5">No dossier found.</div>;
  }

  const currentEtat = dossier.InfoPro.Details && dossier.InfoPro.Details.length > 0
  ? dossier.InfoPro.Details[dossier.InfoPro.Details.length - 1].etat
  : ''; // Default to empty string if no details are found


  return (
    <div className="dashboard">
        <div className="container card">
          <div className="card-header text-primary">
            <h2 className="mb-0">Profile de {dossier.InfoIdent.prenom} {dossier.InfoIdent.nom}</h2>
          </div>
          <div className="card-body gap-3">
            <p><strong>Matricule:</strong> {dossier.Utilisateur.matricule}</p>
            <p><strong>Role:</strong> {dossier.Utilisateur.role}</p>
            <p><strong>Statut:</strong> {dossier.InfoPro.statut}</p>
            <p><strong>Corps:</strong> {dossier.InfoPro.corps}</p>
            <p><strong>Catégorie:</strong> {dossier.InfoPro.categorie}</p>
            <p><strong>Fonctions:</strong> {dossier.InfoPro.fonctions}</p>
            <p><strong>Date première prise de service:</strong> {formatDate(dossier.InfoPro.dat_first_prise_de_service)}</p>
            <p><strong>Date de départ en retraite:</strong> {formatDate(dossier.InfoPro.dat_de_depart_retraite)}</p>
            <p><strong>Date de prise de service dans le département:</strong> {formatDate(dossier.InfoPro.dat_de_prise_service_dans_departement)}</p>
            <p><strong>Poste actuel service:</strong> {dossier.InfoPro.poste_actuel_service}</p>
            <p><strong>Poste spécifique:</strong> {dossier.InfoPro.poste_specifique}</p>
            <p><strong>État:</strong> {dossier.InfoPro.Details && 
            dossier.InfoPro.Details.length > 0 
            ? dossier.InfoPro.Details[dossier.InfoPro.Details.length - 1].etat : 'Aucun détail'}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormAlert error={submitError} onDismiss={clearError} />
            <div className="form-group">
              <Field
                control={control}
                name="etat"
                label="Choix du nouvel état"
                type="select"
                placeholder="Sélectionner un état"
                options={ETATS}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary my-2" disabled={isSubmitting}>
              {isSubmitting ? 'Envoi…' : 'Valider'}
            </button>
          </form>
        </div>
    </div>
  );
};

export default ChangeEtat;