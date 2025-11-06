import React from 'react';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import {
  CForm, CFormLabel, CFormInput, CButton, CCol, CRow, CAlert
} from '@coreui/react';

const PosteAnterieurForm = ({info,handle}) => {
  const lastInfo = Array.isArray(info) && info.length > 0 ? info[info.length - 1] : {};

  const formatDate = (dateString) => {
    if (!dateString) return ''; // Return an empty string for invalid dates
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format as yyyy-MM-dd
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nom_poste:lastInfo?.nom_poste|| '',
      date_debut:formatDate(lastInfo?.date_debut)|| '',
      date_fin:formatDate(lastInfo?.date_fin)|| '',
      institution: lastInfo?.institution||'',
      //infop: ''
    },
    validationSchema: Yup.object({
      nom_poste: Yup.string().required('Le nom du poste est requis'),
      date_debut: Yup.date().required('La date de début est requise'),
      date_fin: Yup.date().required('La date de fin est requise'),
      institution: Yup.string().required('L\'institution est requise'),
     //infop: Yup.string().required('L\'information complémentaire est requise')
    }),
    onSubmit: (values) => {
      console.log(values);
      try {
        console.log('Données soumises:', values);
        handle(values);
      } catch (error) {
        console.error('Erreur lors de la soumission du formulaire:', error);
      }
    }
  });
  

  return (
    <CForm onSubmit={formik.handleSubmit}>
      <CRow>
        {[
          { id: 'nom_poste', label: 'Nom du poste', type: 'text' },
          { id: 'date_debut', label: 'Date de début', type: 'date' },
          { id: 'date_fin', label: 'Date de fin', type: 'date' },
          { id: 'institution', label: 'Institution', type: 'text' },
          /* { id: 'infop', label: 'Information complémentaire', type: 'text' } */
        ].map((field) => (
          <CCol xs={12} md={6} key={field.id} className="mb-3">
            <CFormLabel htmlFor={field.id}>{field.label}</CFormLabel>
            <CFormInput
              id={field.id}
              name={field.id}
              type={field.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[field.id]}
              invalid={formik.touched[field.id] && !!formik.errors[field.id]}
            />
            {formik.touched[field.id] && formik.errors[field.id] && (
              <CAlert color="danger">{formik.errors[field.id]}</CAlert>
            )}
          </CCol>
        ))}
        <CCol xs={12} className="mt-3">
          <CButton type="submit" color="primary" disabled={!formik.isValid || formik.isSubmitting}>
            Ajouter
          </CButton>
        </CCol>
      </CRow>
    </CForm>
  );
};

export default PosteAnterieurForm;
