import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

import {
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CFormFeedback,
} from '@coreui/react';

const UserForm = ({ user, onSubmit }) => {
  const initialValues = {
    matricule: user ? user.matricule : '',
    role: user ? user.role : 'user',
    password: '',
    confirmPassword: '',
  };
   const navigate=useNavigate();
   
  const validationSchema = Yup.object({
    matricule: Yup.string().required('Le matricule est requis'),
    password: Yup.string()
      .required('Le mot de passe est requis')
      .min(8, 'Le mot de passe doit comporter au moins 8 caractères'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Les mots de passe doivent correspondre')
      .required('La confirmation du mot de passe est requise'),
  });

  const handleSubmit = (values) => {
    
    console.log("Les valeurs du formulaire : ", values);  // Ajoutez ceci pour vérifier
    onSubmit(values);
    navigate('/login')
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ touched, errors,handleSubmit }) => (
        <CForm as={Form}>
          {/* Champ Matricule */}
          <div className="mb-3">
            <CFormLabel htmlFor="matricule">Matricule</CFormLabel>
            <Field
              name="matricule"
              type="text"
              as={CFormInput}
              id="matricule"
              invalid={touched.matricule && !!errors.matricule}
            />
            <ErrorMessage
              name="matricule"
              component={CFormFeedback}
              className="d-block"
            />
          </div>


          <div className="mb-3">
            <CFormLabel htmlFor="password">Mot de passe</CFormLabel>
            <Field
              name="password"
              type="password"
              as={CFormInput}
              id="password"
              invalid={touched.password && !!errors.password}
            />
            <ErrorMessage
              name="password"
              component={CFormFeedback}
              className="d-block"
            />
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="confirmPassword">Confirmez le mot de passe</CFormLabel>
            <Field
              name="confirmPassword"
              type="password"
              as={CFormInput}
              id="confirmPassword"
              invalid={touched.confirmPassword && !!errors.confirmPassword}
            />
            <ErrorMessage
              name="confirmPassword"
              component={CFormFeedback}
              className="d-block"
            />
          </div>

          {/* Autres champs */}
          <CButton type="submit"   onClick={() => handleSubmit()}  color="success" className="px-4 mt-3">
            S'inscrire
          </CButton>
        </CForm>
      )}
      
    </Formik>
  )
}
export default UserForm;
