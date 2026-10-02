import { Alert } from '../../../ui/Alert'
import { Button } from '../../../ui/Button'
import { CardHeader } from '../../../ui/Card'
import { Form, FormInput, FormLabel, FormSelect } from '../../../ui/Form'
import { Col, Row } from '../../../ui/Grid'
import { useFormik } from 'formik';
import { useState, useEffect, useMemo } from 'react';

import * as Yup from 'yup';

const InfoIdentForm = ({ onSubmite , updateData, initial, uptdat, setCanProceed }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const initialValues = useMemo(() => ({
  cnss: initial?.cnss || '',
  nom: initial?.nom || '',
  prenom: initial?.prenom || '',
  dat_nat: formatDate(initial?.dat_nat) || '',
  lieu_nat: initial?.lieu_nat || '',
  situat_matri: initial?.situat_matri || '',
  email: initial?.email || '',
  sexe: initial?.sexe || '',
  nom_du_conjoint: initial?.nom_du_conjoint || '',
  dat_mariage: initial?.dat_mariage || null,
  nbre_enfants: initial?.nbre_enfants || 0,
}), [initial]);

// Étape 1 : Déclaration de Formik
  const formik = useFormik({
   
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      cnss: Yup.string().required('Le CNSS est requis'),
      nom: Yup.string().required('Le nom est requis'),
      prenom: Yup.string().required('Le prénom est requis'),
      dat_nat: Yup.date().required('La date de naissance est requise'),
      lieu_nat: Yup.string().required('Le lieu de naissance est requis'),
      situat_matri: Yup.string()
        .oneOf(['Célibataire', 'Marié', 'Divorcé', 'Veuf'], 'Valeur non valide')
        .required('La situation matrimoniale est requise'),
      email: Yup.string().email('Email invalide').required('L\'email est requis'),
      sexe: Yup.string().oneOf(['F', 'M'], 'Sélectionnez un sexe valide').required('Le sexe est requis'),
      nom_du_conjoint: Yup.string(),
      dat_mariage: Yup.date().nullable(),
      nbre_enfants: Yup.number().min(0, 'Le nombre d\'enfants ne peut pas être négatif'),
    }),
    onSubmit: (values) => {
      uptdat(values);
      updateData(values);
      setCanProceed(true);
      console.debug()
      console.log(values)
      onSubmite();
    }
  });

  // Remet à false canProceed si l’utilisateur modifie le formulaire après soumission
useEffect(() => {
  if (!formik.isSubmitting && formik.dirty) {
    setCanProceed(false);
  }
}, [formik.values]);

 

  return (
    <div>
      <CardHeader className='mb-3'>
        <strong>Information D'identification</strong>
      </CardHeader>
      <Form onSubmit={formik.handleSubmit}>
        <Row>
          {[
            { label: 'CNSS', name: 'cnss', type: 'text' },
            { label: 'Nom', name: 'nom', type: 'text' },
            { label: 'Prénom', name: 'prenom', type: 'text' },
            { label: 'Date de naissance', name: 'dat_nat', type: 'date' },
            { label: 'Lieu de naissance', name: 'lieu_nat', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
          ].map((field, index) => (
            <Col xs={12} md={6} key={index}>
              <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
              <FormInput
                id={field.name}
                name={field.name}
                type={field.type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[field.name]}
                invalid={formik.touched[field.name] && !!formik.errors[field.name]}
              />
              {formik.touched[field.name] && formik.errors[field.name] && <Alert color="danger">{formik.errors[field.name]}</Alert>}
            </Col>
          ))}

          <Col xs={12} md={6}>
            <FormLabel htmlFor="situat_matri">Situation matrimoniale</FormLabel>
            <FormSelect
              id="situat_matri"
              name="situat_matri"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.situat_matri}
              invalid={formik.touched.situat_matri && !!formik.errors.situat_matri}
            >
              <option value="">Sélectionner...</option>
              <option value="Célibataire">Célibataire</option>
              <option value="Marié">Marié</option>
              <option value="Divorcé">Divorcé</option>
              <option value="Veuf">Veuf</option>
            </FormSelect>
            {formik.touched.situat_matri && formik.errors.situat_matri && <Alert color="danger">{formik.errors.situat_matri}</Alert>}
          </Col>

          <Col xs={12} md={6}>
            <FormLabel htmlFor="sexe">Sexe</FormLabel>
            <FormSelect
              id="sexe"
              name="sexe"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.sexe}
              invalid={formik.touched.sexe && !!formik.errors.sexe}
            >
              <option value="">Sélectionner...</option>
              <option value="F">Femme</option>
              <option value="M">Homme</option>
            </FormSelect>
            {formik.touched.sexe && formik.errors.sexe && <Alert color="danger">{formik.errors.sexe}</Alert>}
          </Col>

          {formik.values.situat_matri === 'Marié' && (
            <>
              <Col xs={12} md={6}>
                <FormLabel htmlFor="nom_du_conjoint">Nom du conjoint</FormLabel>
                <FormInput
                  id="nom_du_conjoint"
                  name="nom_du_conjoint"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.nom_du_conjoint}
                  invalid={formik.touched.nom_du_conjoint && !!formik.errors.nom_du_conjoint}
                />
                {formik.touched.nom_du_conjoint && formik.errors.nom_du_conjoint && <Alert color="danger">{formik.errors.nom_du_conjoint}</Alert>}
              </Col>

              <Col xs={12} md={6}>
                <FormLabel htmlFor="dat_mariage">Date de mariage</FormLabel>
                <FormInput
                  id="dat_mariage"
                  name="dat_mariage"
                  type="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.dat_mariage}
                  invalid={formik.touched.dat_mariage && !!formik.errors.dat_mariage}
                />
                {formik.touched.dat_mariage && formik.errors.dat_mariage && <Alert color="danger">{formik.errors.dat_mariage}</Alert>}
              </Col>
            </>
          )}

          <Col xs={12} md={6}>
            <FormLabel htmlFor="nbre_enfants">Nombre d'enfants</FormLabel>
            <FormInput
              id="nbre_enfants"
              name="nbre_enfants"
              type="number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.nbre_enfants}
              invalid={formik.touched.nbre_enfants && !!formik.errors.nbre_enfants}
            />
            {formik.touched.nbre_enfants && formik.errors.nbre_enfants && <Alert color="danger">{formik.errors.nbre_enfants}</Alert>}
          </Col>

          <Col xs={12} className="mt-3">
              <Button type="submit" color="primary" disabled={!formik.isValid || formik.isSubmitting}>
              Soumettre
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default InfoIdentForm;
