import { useFormik } from 'formik';
import { useState } from 'react';

import * as Yup from 'yup';
import {
  CForm, CFormLabel, CFormInput, CFormSelect,CCardHeader, CButton, CCol, CRow, CAlert
} from '@coreui/react';

const InfoIdentForm = ({ onSubmite ,updateData, initial,uptdat }) => {
  console.log('Initial data:', initial);
  
  const [infoIdent, setInfoIdent] = useState(null);
  const formatDate = (dateString) => {
    if (!dateString) return ''; // Return an empty string for invalid dates
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format as yyyy-MM-dd
  };

  console.log(formatDate(initial?.dat_nat) );
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      cnss: initial?.cnss || '',
      nom: initial?.nom || '',
      prenom: initial?.prenom || '',
      dat_nat: formatDate(initial?.dat_nat) || '',
      lieu_nat: initial?.lieu_nat || '',
      situat_matri: initial?.situat_matri || '',
      email: initial?.email || '',
      sexe: initial?.sexe || '', // 'F' ou 'M'
      nom_du_conjoint: initial?.nom_du_conjoint || '',
      dat_mariage:initial?.dat_mariage || null ,
      nbre_enfants: initial?.nbre_enfants || 0,
    },
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
      dat_mariage: Yup.date()
      .nullable() ,
     
      nbre_enfants: Yup.number().min(0, 'Le nombre d\'enfants ne peut pas être négatif')
    }),
    onSubmit: (values) => {
      console.log('Form submitted:', values); // Vérifiez si cela s'affiche
      try {
      
        uptdat(values);
        updateData(values); // Appelle la fonction pour mettre à jour les données
        onSubmite(); // Passe à l'étape suivante
      } catch (error) {
        console.log(formik.errors);
        console.error('Erreur lors de la soumission du formulaire:', error);
      }
    }
  });

  return (
    <div>
       <CCardHeader className='mb-3'>
            <strong>Information D'identification</strong>
      </CCardHeader>
      <CForm onSubmit={formik.handleSubmit}>
      <CRow>
        {[
          { label: 'CNSS', name: 'cnss', type: 'text' },
          { label: 'Nom', name: 'nom', type: 'text' },
          { label: 'Prénom', name: 'prenom', type: 'text' },
          { label: 'Date de naissance', name: 'dat_nat', type: 'date' },
          { label: 'Lieu de naissance', name: 'lieu_nat', type: 'text' },
          { label: 'Email', name: 'email', type: 'email' },
        ].map((field, index) => (
          <CCol xs={12} md={6} key={index}>
            <CFormLabel htmlFor={field.name}>{field.label}</CFormLabel>
            <CFormInput
              id={field.name}
              name={field.name}
              type={field.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[field.name]}
              invalid={formik.touched[field.name] && !!formik.errors[field.name]}
            />
            {formik.touched[field.name] && formik.errors[field.name] && <CAlert color="danger">{formik.errors[field.name]}</CAlert>}
          </CCol>
        ))}

        <CCol xs={12} md={6}>
          <CFormLabel htmlFor="situat_matri">Situation matrimoniale</CFormLabel>
          <CFormSelect
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
          </CFormSelect>
          {formik.touched.situat_matri && formik.errors.situat_matri && <CAlert color="danger">{formik.errors.situat_matri}</CAlert>}
        </CCol>

        <CCol xs={12} md={6}>
          <CFormLabel htmlFor="sexe">Sexe</CFormLabel>
          <CFormSelect
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
          </CFormSelect>
          {formik.touched.sexe && formik.errors.sexe && <CAlert color="danger">{formik.errors.sexe}</CAlert>}
        </CCol>

        {formik.values.situat_matri === 'Marié' && (
          <>
            <CCol xs={12} md={6}>
              <CFormLabel htmlFor="nom_du_conjoint">Nom du conjoint</CFormLabel>
              <CFormInput
                id="nom_du_conjoint"
                name="nom_du_conjoint"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nom_du_conjoint}
                invalid={formik.touched.nom_du_conjoint && !!formik.errors.nom_du_conjoint}
              />
              {formik.touched.nom_du_conjoint && formik.errors.nom_du_conjoint && <CAlert color="danger">{formik.errors.nom_du_conjoint}</CAlert>}
            </CCol>

            <CCol xs={12} md={6}>
              <CFormLabel htmlFor="dat_mariage">Date de mariage</CFormLabel>
              <CFormInput
                id="dat_mariage"
                name="dat_mariage"
                type="date"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.dat_mariage}
                invalid={formik.touched.dat_mariage && !!formik.errors.dat_mariage}
              />
              {formik.touched.dat_mariage && formik.errors.dat_mariage && <CAlert color="danger">{formik.errors.dat_mariage}</CAlert>}
            </CCol>
          </>
        )}

        <CCol xs={12} md={6}>
          <CFormLabel htmlFor="nbre_enfants">Nombre d'enfants</CFormLabel>
          <CFormInput
            id="nbre_enfants"
            name="nbre_enfants"
            type="number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.nbre_enfants}
            invalid={formik.touched.nbre_enfants && !!formik.errors.nbre_enfants}
          />
          {formik.touched.nbre_enfants && formik.errors.nbre_enfants && <CAlert color="danger">{formik.errors.nbre_enfants}</CAlert>}
        </CCol>

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

export default InfoIdentForm;
