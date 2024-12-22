import React from 'react';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import {
  CForm, CFormLabel, CFormInput, CButton, CCol, CRow, CAlert
} from '@coreui/react';

const SanctionForm = ({info,handle}) => {
  const [sanction, setSanction] = useState(null);
  const lastInfo = Array.isArray(info) && info.length > 0 ? info[info.length - 1] : {};
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      sanction_punitive:lastInfo?.sanction_punitive|| '',
      nature_sanction:lastInfo?.nature_sanction|| '',
      //infoc: ''
    },
    validationSchema: Yup.object({
      sanction_punitive: Yup.string().required('La sanction punitive est requise'),
      nature_sanction: Yup.string().required('La nature de la sanction est requise'),
      //infoc: Yup.string().required('L\'information complémentaire est requise')
    }),
    onSubmit: (values) => {
      try {
        console.log('Données soumises:', values);
        handle(values);
      } catch (error) {
        console.error('Erreur lors de la soumission du formulaire:', error);
      }
    }
  });

  return (
    <CForm className='my-2' onSubmit={formik.handleSubmit}>
      <CRow>
        {[
          { id: 'sanction_punitive', label: 'Sanction punitive', type: 'text' },
          { id: 'nature_sanction', label: 'Nature de la sanction', type: 'text' },
         /*  { id: 'infoc', label: 'Information complémentaire', type: 'text' } */
        ].map((field) => (
          <CCol xs={12} md={6} key={field.id} className="mb-3">
            <CFormLabel htmlFor={field.id}>{field.label}</CFormLabel>
            <CFormInput
              id={field.id}
              name={field.id}
              type={field.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[field.id]||''}
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

export default SanctionForm;
