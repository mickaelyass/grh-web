import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CForm, CFormInput, CFormLabel, CButton, CRow, CCol, CAlert } from '@coreui/react';

const DetailsForm = ({ info,handle}) => {
  const [details, setDetails] = useState(null);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      etat: info?.etat||'',
      poste_actuel: info?.poste_actuel||'',
      service_actuel:info?.service_actuel|| '',
      nouveau_poste:info?.nouveau_poste||'',
      nouveau_service:info?.nouveau_service|| '',
      date_prise_fonction: info?.date_prise_fonction||'',
      date_changement:info?.date_changement|| '',
      motif_changement:info?.motif_changement|| '',
      type_changement:info?.type_changement|| '', 
      besoins_formation:info?.besoins_formation|| '',
      //infop: ''
    },
    validationSchema: Yup.object({
      etat: Yup.string().required('L\'état est requis'),
      poste_actuel: Yup.string().required('Le poste actuel est requis'),
      service_actuel: Yup.string().required('Le service actuel est requis'),
      nouveau_poste: Yup.string().required('Le nouveau poste est requis'),
      nouveau_service: Yup.string().required('Le nouveau service est requis'),
      date_prise_fonction: Yup.date().required('La date de prise de fonction est requise'),
      date_changement: Yup.date().required('La date de changement est requise'),
      motif_changement: Yup.string().required('Le motif du changement est requis'),
      type_changement: Yup.string().required('Le type de changement est requis'),
      besoins_formation: Yup.string().required('Les besoins en formation sont requis'),
      //infop: Yup.number().required('L\'information complémentaire est requise')
    }),
    onSubmit: (values) => {
      console.log('Données soumises:', values);
      try {
        
        handle(values);
      } catch (error) {
        console.error('Erreur lors de la soumission du formulaire:', error);
      } 
    }
  });

  return (
    <CForm className='my-2' onSubmit={formik.handleSubmit} >
      <CRow>
        {[
          { id: 'etat', label: 'Etat', type: 'text' },
          { id: 'poste_actuel', label: 'Poste actuel', type: 'text' },
          { id: 'service_actuel', label: 'Service actuel', type: 'text' },
          { id: 'nouveau_poste', label: 'Nouveau poste', type: 'text' },
          { id: 'nouveau_service', label: 'Nouveau service', type: 'text' },
          { id: 'date_prise_fonction', label: 'Date de prise de fonction', type: 'date' },
          { id: 'date_changement', label: 'Date de changement', type: 'date' },
          { id: 'motif_changement', label: 'Motif du changement', type: 'text' },
          { id: 'type_changement', label: 'Type de changement', type: 'text' },
          { id: 'besoins_formation', label: 'Besoins en formation', type: 'text' },
         /*  { id: 'infop', label: 'Information complémentaire', type: 'number' } */
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

export default DetailsForm;
