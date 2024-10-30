import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CForm, CFormInput, CFormLabel, CFormTextarea, CFormFeedback, CButton, CCard, CCardBody } from '@coreui/react';
import { useLocation } from 'react-router-dom';

const CongeForm = ({ onSubmit }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const matricule = user ? user.matricule : '';
  const formik = useFormik({
    initialValues: {
      matricule: matricule,
      date_debut: '',
      annee_jouissance: '',
      raison: 'Facultatif',
      piece_jointe_1: null,
      piece_jointe_2: null
    },
    validationSchema: Yup.object({
      matricule: Yup.string().required('Matricule est requis'),
      date_debut: Yup.date().required('Date de début est requise'),
      annee_jouissance: Yup.number().required('Année de jouissance est requise'),
      raison: Yup.string(),
      piece_jointe_1: Yup.mixed().required('La première pièce jointe est requise'),
      piece_jointe_2: Yup.mixed().required('La deuxième pièce jointe est requise')
    }),
    onSubmit: (values) => {
      onSubmit(values);
    }
  });

  return (
    <CCard className="shadow-sm">
      <CCardBody>
        <CForm onSubmit={formik.handleSubmit} className="p-4">
          <input
            id="matricule"
            name="matricule"
            type="hidden"
            onChange={formik.handleChange}
            value={formik.values.matricule}
          />

          <div className="mb-3">
            <CFormLabel htmlFor="date_debut">Date de Début</CFormLabel>
            <CFormInput
              id="date_debut"
              name="date_debut"
              type="date"
              className={formik.errors.date_debut ? 'is-invalid' : ''}
              onChange={formik.handleChange}
              value={formik.values.date_debut}
            />
            {formik.errors.date_debut && (
              <CFormFeedback invalid>{formik.errors.date_debut}</CFormFeedback>
            )}
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="annee_jouissance">Année de Jouissance</CFormLabel>
            <CFormInput
              id="annee_jouissance"
              name="annee_jouissance"
              type="number"
              className={formik.errors.annee_jouissance ? 'is-invalid' : ''}
              onChange={formik.handleChange}
              value={formik.values.annee_jouissance}
            />
            {formik.errors.annee_jouissance && (
              <CFormFeedback invalid>{formik.errors.annee_jouissance}</CFormFeedback>
            )}
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="raison">Motif</CFormLabel>
            <CFormTextarea
              id="raison"
              name="raison"
              className={formik.errors.raison ? 'is-invalid' : ''}
              onChange={formik.handleChange}
              value={formik.values.raison}
            />
            {formik.errors.raison && (
              <CFormFeedback invalid>{formik.errors.raison}</CFormFeedback>
            )}
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="piece_jointe_1">Certificat de non jouissance :</CFormLabel>
            <CFormInput
              id="piece_jointe_1"
              name="piece_jointe_1"
              type="file"
              className={formik.errors.piece_jointe_1 ? 'is-invalid' : ''}
              onChange={(event) => {
                formik.setFieldValue('piece_jointe_1', event.currentTarget.files[0]);
              }}
            />
            {formik.errors.piece_jointe_1 && (
              <CFormFeedback invalid>{formik.errors.piece_jointe_1}</CFormFeedback>
            )}
          </div>

          <div className="mb-3">
            <CFormLabel htmlFor="piece_jointe_2">Attestation du dernier autorisation :</CFormLabel>
            <CFormInput
              id="piece_jointe_2"
              name="piece_jointe_2"
              type="file"
              className={formik.errors.piece_jointe_2 ? 'is-invalid' : ''}
              onChange={(event) => {
                formik.setFieldValue('piece_jointe_2', event.currentTarget.files[0]);
              }}
            />
            {formik.errors.piece_jointe_2 && (
              <CFormFeedback invalid>{formik.errors.piece_jointe_2}</CFormFeedback>
            )}
          </div>

          <CButton type="submit" color="primary" className="w-100">
            Soumettre
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default CongeForm;
