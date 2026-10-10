import Button from '../../ui/Button'
import { Form as UiForm, FormFeedback, FormInput, FormLabel } from '../../ui/Form'
import React from 'react';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const OtherForm = ({ user, onSubmit }) => {
  const initialValues = {
    matricule: user ? user.matricule : '',
    role: user ? user.role : 'employe',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    matricule: Yup.string().required('Le matricule est requis'),
    password: Yup.string()
      .required('Le mot de passe est requis')
      .min(8, 'Le mot de passe doit comporter au moins 8 caractères'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Les mots de passe doivent correspondre')
      .required('La confirmation du mot de passe est requise'),
  });

  // La soumission est déléguée UNIQUEMENT à Formik (pas de onClick parallèle :
  // il déclenchait une double soumission avec `values` undefined).
  const submitValues = (values) => {
    console.log("Les valeurs du formulaire : ", values);  // Ajoutez ceci pour vérifier
    onSubmit(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submitValues}
      enableReinitialize
    >
      {({ touched, errors }) => (
        <FormikForm as={UiForm}>
          {/* Champ Matricule */}
          <div className="mb-3">
            <FormLabel htmlFor="matricule">Matricule</FormLabel>
            <Field
              name="matricule"
              type="text"
              as={FormInput}
              id="matricule"
              invalid={touched.matricule && !!errors.matricule}
            />
            <ErrorMessage
              name="matricule"
              component={FormFeedback}
              className="d-block"
            />
          </div>
         {/* Champ Role avec Select */}
         <div className="mb-3">
            <FormLabel htmlFor="role">Rôle</FormLabel>
            <Field
              name="role"
              as="select"
              id="role"
              className={`form-control ${
                touched.role && errors.role ? 'is-invalid' : ''
              }`}
            >
              {/* Rôles alignés sur le backend (models/utilisateur.js : ENUM) */}
              <option value="employe">Employé</option>
              <option value="chef_service">Chef de service</option>
              <option value="directrice">Directrice</option>
              <option value="admin">Administrateur</option>
            </Field>
            <ErrorMessage
              name="role"
              component={FormFeedback}
              className="d-block"
            />
          </div>

          <div className="mb-3">
            <FormLabel htmlFor="password">Mot de passe</FormLabel>
            <Field
              name="password"
              type="password"
              as={FormInput}
              id="password"
              invalid={touched.password && !!errors.password}
            />
            <ErrorMessage
              name="password"
              component={FormFeedback}
              className="d-block"
            />
          </div>

          <div className="mb-3">
            <FormLabel htmlFor="confirmPassword">Confirmez le mot de passe</FormLabel>
            <Field
              name="confirmPassword"
              type="password"
              as={FormInput}
              id="confirmPassword"
              invalid={touched.confirmPassword && !!errors.confirmPassword}
            />
            <ErrorMessage
              name="confirmPassword"
              component={FormFeedback}
              className="d-block"
            />
          </div>

          <Button type="submit"  color="success" className="px-4 mt-3">
            S'inscrire
          </Button>
        </FormikForm>
      )}
      
    </Formik>
  )
}
export default OtherForm;
