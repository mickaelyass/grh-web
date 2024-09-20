import React, { useEffect, useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { Field, ErrorMessage, Formik, Form } from 'formik';
import * as Yup from 'yup';
import { getDossier, updateMutation } from '../../services/api';
import Footer from '../Footer';
import Head from '../Head';
import MenuAdmin from '../MenuAdmin';
import '../Dasbord.css';

const ChangeEtat = () => {
  const { id_dossier } = useParams();
  const navigate = useNavigate();
  const [dossier, setDossier] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const fetchDossier = async () => {
      try {
        const response = await getDossier(id_dossier);
        setDossier(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDossier();
  }, [id_dossier]);

  const EtatFormSchema = Yup.object().shape({
    infoPro: Yup.object().shape({
      etat_depart: Yup.string().required('État is required'),
    }),
  });

  const handleSubmit = async (values) => {
    const { etat_depart } = values.infoPro;
    if (['Actif', 'Abandon/demission', 'Retraite','Décédé'].includes(etat_depart)) {
      const mutationData = {
        etat_depart:etat_depart,  // Set the chosen state
        poste_actuel: "Neant",
        service_actuel: "Neant",
        nouveau_poste: "Neant",
        nouveau_service: "Neant",
        date_prise_fonction: "01/01/01",
        date_changement: "01/01/01",
        motif_changement: "Neant",
        type_changement: "Neant",
        besoins_changement: "Neant",
      };
      await updateMutation(dossier.matricule, mutationData);
      console.log(mutationData);
    }else{
      try {
        switch (etat_depart) {
          case 'Muté':
          
            navigate(`/mutation-form/${dossier.matricule}`);
            break;
          case 'Mise à disposition':
            navigate(`/mise-a-disposition-form/${dossier.matricule}`);
            break;
          case 'Détachement':
            navigate(`/detachement-form/${dossier.matricule}`);
            break;
          case 'Mise en disponibilité':
            navigate(`/mise-en-disponibilite-form/${dossier.matricule}`);
          break;
          // Add cases for other states as needed
          default:
            navigate(`/dossier/${dossier.matricule}`); // Redirect back to dossier if no specific form
            break;
        }
      } catch (error) {
        console.error('Error updating dossier state:', error);
        setError('Failed to update dossier state. Please try again later.');
      }
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

  return (
    <div className="dashboard">
      <Head toggleMenu={toggleMenu} />
      <MenuAdmin isMenuOpen={isMenuOpen} />
      <main className={`content ${isMenuOpen ? 'content-expanded slide-enter' : 'content-collapsed'}`}>
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
            <p><strong>Date première prise de service:</strong> {dossier.InfoPro.dat_first_prise_de_service}</p>
            <p><strong>Date de départ en retraite:</strong> {dossier.InfoPro.dat_de_depart_retraite}</p>
            <p><strong>Date de prise de service dans le département:</strong> {dossier.InfoPro.dat_de_prise_service_dans_departement}</p>
            <p><strong>Poste actuel service:</strong> {dossier.InfoPro.poste_actuel_service}</p>
            <p><strong>Poste spécifique:</strong> {dossier.InfoPro.poste_specifique}</p>
            <p><strong>État départ:</strong> {dossier.InfoPro.DetailsMutation.etat_depart}</p>
          </div>

          <Formik
            initialValues={{ infoPro: { etat_depart: dossier.InfoPro.DetailsMutation.etat_depart || '' } }}
            validationSchema={EtatFormSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="form-group">
                  <label htmlFor="infoPro.etat_depart">Choix du nouveau État</label>
                  <Field as="select" name="infoPro.etat_depart" className="form-control">
                    <option value="">Sélectionner un état</option>
                    <option value="Actif">Actif</option>
                    <option value="Muté">Muté</option>
                    <option value="Détachement">Détachement</option>
                    <option value="Mise en disponibilité">Mise en disponibilité</option>
                    <option value="Mise à disposition">Mise à disposition</option>
                    <option value="Abandon/demission">Abandon/demission</option>
                    {/* <option value="Agent en formation">Agent en formation</option> */}
                    <option value="Retraite">Retraite</option>
                    <option value="Décédé">Décédé</option>
                  </Field>
                  <ErrorMessage name="infoPro.etat_depart" component="div" className="text-danger" />
                </div>
                {error && <div className="text-danger">{error}</div>}
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChangeEtat;
