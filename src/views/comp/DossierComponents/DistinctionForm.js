import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import {
  CForm, CFormLabel, CFormInput, CButton, CCol, CRow, CAlert
} from '@coreui/react';

const DistinctionForm = ({info,handle}) => {
  const [distinction, setDistinction] = useState(null);

  const formik = useFormik({
    initialValues: {
      ref_distinction:info?.ref_distinction|| '',
      detail_distinction:info?.detail_distinction|| '',
     //infoc: ''
    },
    validationSchema: Yup.object({
      ref_distinction: Yup.string().required('La référence de la distinction est requise'),
      detail_distinction: Yup.string().required('Le détail de la distinction est requis'),
     // infoc: Yup.string().required('L\'information complémentaire est requise')
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
          { id: 'ref_distinction', label: 'Référence de la distinction', type: 'text' },
          { id: 'detail_distinction', label: 'Détail de la distinction', type: 'text' },
          /* { id: 'infoc', label: 'Information complémentaire', type: 'text' } */
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

export default DistinctionForm;

