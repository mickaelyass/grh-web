import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import {
  CForm, CFormLabel, CFormInput, CButton, CCol, CRow, CAlert,
} from '@coreui/react';


import DistinctionForm from './DistinctionForm';
import SanctionForm from './SanctionForm';

const InfoComplementaireForm = ({ onSubmite ,updateData, initial }) => {
  //const [infoComplementaire, setInfoComplementaire] = useState(null);
  const [distinction, setDistinction] = useState(null);
  const [sanction, setSanction] = useState(null);

  const [showDistinctionForm, setShowDistinctionForm] = useState(false);
  const [showSanctionForm, setShowSactionForm] = useState(false);


  const formik = useFormik({
    initialValues: {
      observation_particuliere: initial?.observation_particuliere ||'',
      situat_sante:initial?.situat_sante|| '',
      /* sanction: '',
      distinction: '', */
    },
    validationSchema: Yup.object({
      observation_particuliere: Yup.string(),
      situat_sante: Yup.string()
        .required('La situation de santé est requise')
    
     /*  sanction: Yup.number()
        .positive("La sanction doit être un nombre positif")
        .integer("La sanction doit être un entier")
        .nullable(true),
      distinction: Yup.number()
        .positive("La distinction doit être un nombre positif")
        .integer("La distinction doit être un entier")
        .nullable(true), */
    }),
    onSubmit: (values) => {
      //setInfoComplementaire(values);
      console.log(values);
      // Envoyer toutes les données lorsque le formulaire principal est soumis
      const dataToSubmit = {
        infoComplementaire:values || {},
        distinction:distinction || {},
        sanction:sanction || {}
      };
    
      updateData(dataToSubmit);
      console.log('Form submitted with data:', dataToSubmit);  
      onSubmite();
       // Appelle la fonction passée pour passer à l'étape suivante
    },
  });

  return (
    <div>
      <div className='my-3 '> 
             {/* Boutons pour afficher les sous-formulaires */}
      <CButton
        color="secondary"
        className='me-2'
        onClick={() => setShowSactionForm(!showSanctionForm)}
      >
        Ajouter Sanction
      </CButton>
      {showSanctionForm && (
        <SanctionForm info={initial?.Sanctions} handle={(data) => setSanction(data)} />
      )}

      <CButton
        color="secondary"
         className='me-2'
        onClick={() => setShowDistinctionForm(!showDistinctionForm)}
      >
        Ajouter Distinction
      </CButton>
      {showDistinctionForm && (
        <DistinctionForm info={initial?.Distinctions} handle={(data) => setDistinction(data)} />
      )}
      </div>

      <CForm onSubmit={formik.handleSubmit}>
      <CRow>
        {[
          { id: 'observation_particuliere', label: 'Observation particulière', type: 'textarea' },
          { id: 'situat_sante', label: 'Situation de santé', type: 'text' },
        /*   { id: 'sanction', label: 'Sanction', type: 'number' },
          { id: 'distinction', label: 'Distinction', type: 'number' }, */
        ].map((field) => (
          <CCol xs={12} md={6} key={field.id} className="mb-3">
            <CFormLabel htmlFor={field.id}>{field.label}</CFormLabel>
            <CFormInput
              id={field.id}
              name={field.id}
              type={field.type}
              as={field.type === 'textarea' ? 'textarea' : 'input'}
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
    </div>
  );
};

export default InfoComplementaireForm;
