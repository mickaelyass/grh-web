import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import {
  CForm, CFormLabel, CFormInput, CButton, CCol, CRow, CAlert
} from '@coreui/react';

const InfoBankForm = ({ onSubmite ,updateData, initial}) => {
  const [infoBank, setInfoBank] = useState(null);

  const formik = useFormik({
    initialValues: {
      rib:initial?.rib|| '',
      mtn:initial?.mtn|| '',
      celtics:initial?.celtics|| '',
      moov:initial?.moov|| '',
    },
    validationSchema: Yup.object({
      rib: Yup.string().required('Le RIB est requis'),
      mtn: Yup.string().required('Le numéro MTN est requis'),
      celtics: Yup.string(),
      moov: Yup.string()
    }),
    onSubmit: (values) => {
      setInfoBank(values);
      console.log('Form submitted with values:', values);
      updateData(values);  // Appelle la fonction passée pour mettre à jour les données
      onSubmite(); // Appelle la fonction passée pour passer à l'étape suivante
    }
  });

  return (
    <CForm onSubmit={formik.handleSubmit}>
      <CRow>
        {[
          { id: 'rib', label: 'RIB', type: 'text' },
          { id: 'mtn', label: 'MTN', type: 'text' },
          { id: 'celtics', label: 'Celtics', type: 'text' },
          { id: 'moov', label: 'Moov', type: 'text' }
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
            Soumettre
          </CButton>
        </CCol>
      </CRow>
    </CForm>
  );
};

export default InfoBankForm;
