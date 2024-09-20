import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';
const CongeForm = ({ onSubmit }) => {
  const location = useLocation();
  const { matricule } = location.state || {};
  const formik = useFormik({
    initialValues: {
      matricule: matricule||'',
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
    <form onSubmit={formik.handleSubmit} className="p-4 rounded shadow-sm bg-light">
    <div className="mb-3">
      <label htmlFor="matricule" className="form-label ">Matricule</label>
      <input
        id="matricule"
        name="matricule"
        type="hidden"
        className={`form-control ${formik.errors.matricule ? 'is-invalid' : ''}`}
        onChange={formik.handleChange}
        value={formik.values.matricule}
      />
      {formik.errors.matricule ? <div className="invalid-feedback">{formik.errors.matricule}</div> : null}
    </div>

    <div className="mb-3">
      <label htmlFor="date_debut" className="form-label">Date de Début</label>
      <input
        id="date_debut"
        name="date_debut"
        type="date"
        className={`form-control ${formik.errors.date_debut ? 'is-invalid' : ''}`}
        onChange={formik.handleChange}
        value={formik.values.date_debut}
      />
      {formik.errors.date_debut ? <div className="invalid-feedback">{formik.errors.date_debut}</div> : null}
    </div>

    <div className="mb-3">
      <label htmlFor="annee_jouissance" className="form-label">Année de Jouissance</label>
      <input
        id="annee_jouissance"
        name="annee_jouissance"
        type="number"
        className={`form-control ${formik.errors.annee_jouissance ? 'is-invalid' : ''}`}
        onChange={formik.handleChange}
        value={formik.values.annee_jouissance}
      />
      {formik.errors.annee_jouissance ? <div className="invalid-feedback">{formik.errors.annee_jouissance}</div> : null}
    </div>

    <div className="mb-3">
      <label htmlFor="raison" className="form-label">Motif</label>
      <textarea
        id="raison"
        name="raison"
        className={`form-control ${formik.errors.raison ? 'is-invalid' : 'Facultatif'}`}
        onChange={formik.handleChange}
        value={formik.values.raison}
      />
      {formik.errors.raison ? <div className="invalid-feedback">{formik.errors.raison}</div> : null}
    </div>

    <div className="mb-3">
      <label htmlFor="piece_jointe_1" className="form-label">Certificat de non jouissance :</label>
      <input
        id="piece_jointe_1"
        name="piece_jointe_1"
        type="file"
        className="form-control"
        onChange={(event) => {
          formik.setFieldValue('piece_jointe_1', event.currentTarget.files[0]);
        }}
      />
      {formik.errors.piece_jointe_1 ? <div className="invalid-feedback">{formik.errors.piece_jointe_1}</div> : null}
    </div>

    <div className="mb-3">
      <label htmlFor="piece_jointe_2" className="form-label">Attestation du dernier autorisation :</label>
      <input
        id="piece_jointe_2"
        name="piece_jointe_2"
        type="file"
        className="form-control"
        onChange={(event) => {
          formik.setFieldValue('piece_jointe_2', event.currentTarget.files[0]);
        }}
      />
      {formik.errors.piece_jointe_2 ? <div className="invalid-feedback">{formik.errors.piece_jointe_2}</div> : null}
    </div>

    <button type="submit" className="btn btn-primary w-100">Soumettre</button>
  </form>
  );
};

export default CongeForm;
