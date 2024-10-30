import React, { useState } from 'react';

import '../Dasbord.css';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateMutation } from '../../../services/api';
import { useNavigate, useParams } from "react-router-dom";

const MiseEnDisponibilité = () => {
 const navigate=useNavigate();
  const { matricule } = useParams();



  // Schéma de validation avec Yup
  const MutationSchema = Yup.object().shape({
    etat_depart: Yup.string().required("L'état de départ est requis"),
    poste_actuel: Yup.string().required("Le poste actuel est requis"),
    service_actuel: Yup.string().required("Le service actuel est requis"),
    nouveau_poste: Yup.string().required("Le nouveau poste est requis"),
    nouveau_service: Yup.string().required("Le nouveau service est requis"),
    date_prise_fonction: Yup.date().required("La date de prise de fonction est requise"),
    date_changement: Yup.date().required("La date de mutation est requise"),
    motif_changement: Yup.string().required("Le motif de la mutation est requis"),
    type_changement: Yup.string().required("Le type de mutation est requis"),
    besoins_formation: Yup.string(),
  });
  return (
    <div className="dashboard">
     
        <div className='row'>
          <div className='col'>
            <div className="container py-2">
              <div className="container">
                <h2>Formulaire de mise en disponibilité</h2>
                <Formik
                  initialValues={{
                    etat_depart: "",
                    poste_actuel: "",
                    service_actuel: "",
                    nouveau_poste: "",
                    nouveau_service: "",
                    date_prise_fonction: "",
                    date_changement: "",
                    motif_changement: "",
                    type_changement: "",
                    besoins_changement: "",
                  }}
                  validationSchema={MutationSchema}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    console.log(values);
                    console.log(matricule);
                    updateMutation(matricule, values)
                      .then(response => {
                        console.log('Mutation mise à jour avec succès:', response.data);
                        alert("Changement d'état reussir");
                        navigate('/admin/dossier-list');
                        
                       // resetForm(); // Réinitialiser le formulaire après soumission
                      })
                      .catch(error => {
                        console.error('Erreur lors de la mise à jour de la mutation:', error);
                      })
                      .finally(() => {
                        setSubmitting(false);
                      });
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="form-group">
                        <label>État de Départ</label>
                        <Field name="etat_depart"  value='Mise en disponibilité' className="form-control"></Field>
                        <ErrorMessage name="etat_depart" component="div" className="text-danger" />
                      </div>

                      <div className="form-group">
                        <label>Poste Actuel</label>
                        <Field name="poste_actuel" type="text" className="form-control" />
                        <ErrorMessage name="poste_actuel" component="div" className="text-danger" />
                      </div>

                      <div className="form-group">
                        <label>Service Actuel</label>
                        <Field name="service_actuel" type="text" className="form-control" />
                        <ErrorMessage name="service_actuel" component="div" className="text-danger" />
                      </div>

                      <div className="form-group">
                        <label>Nouveau Poste</label>
                        <Field name="nouveau_poste" type="text" className="form-control" />
                        <ErrorMessage name="nouveau_poste" component="div" className="text-danger" />
                      </div>

                      <div className="form-group">
                        <label>Nouveau Service</label>
                        <Field name="nouveau_service" type="text" className="form-control" />
                        <ErrorMessage name="nouveau_service" component="div" className="text-danger" />
                      </div>

                      <div className="form-group">
                        <label>Date de Prise de Fonction</label>
                        <Field name="date_prise_fonction" type="date" className="form-control" />
                        <ErrorMessage name="date_prise_fonction" component="div" className="text-danger" />
                      </div>

                      <div className="form-group">
                        <label>Date de mise en disponibilité</label>
                        <Field name="date_changement" type="date" className="form-control" />
                        <ErrorMessage name="date_changement" component="div" className="text-danger" />
                      </div>

                      <div className="form-group">
                        <label>Motif de la mise en disponibilité</label>
                        <Field name="motif_changement" as="textarea" className="form-control" />
                        <ErrorMessage name="motif_changement" component="div" className="text-danger" />
                      </div>

                      <div className="form-group">
                        <label>Type de mise en disponibilité</label>
                        <Field name="type_changement" as="select" className="form-control">
                          <option value="">Sélectionner</option>
                          <option value="interne">Interne</option>
                          <option value="externe">Externe</option>
                        </Field>
                        <ErrorMessage name="type_changement" component="div" className="text-danger" />
                      </div>

                      <div className="form-group">
                        <label>Besoins en Formation</label>
                        <Field name="besoins_formation" as="textarea" className="form-control" />
                        <ErrorMessage name="besoins_formation" component="div" className="text-danger" />
                      </div>
                  
                      <button type="submit" className="btn btn-primary my-2" disabled={isSubmitting}>
                        Soumettre
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default MiseEnDisponibilité;
