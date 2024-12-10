import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import {
  CForm, CFormLabel, CFormInput, CButton, CCol, CRow, CAlert
} from '@coreui/react';

import DetailsForm from './DetailForm';
import DiplomeForm from './DiplomeForm';
import PosteAnterieurForm from './PosteForm';

const InfoProForm = ({ onSubmite,updateData, initial  }) => {
  // États pour chaque formulaire
  //const [infoPro, setInfoPro] = useState({});
  const [initiale, setInitiale] = useState({});
  const [diplome, setDiplome] = useState({});
  const [poste, setPoste] = useState({});
  const [detailMutation, setDetailMutation] = useState({});
useEffect(() => {
  console.log(initial);
  setInitiale(initial);
}, []);
  // Afficher les sous-formulaires
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [showDiplomeForm, setShowDiplomeForm] = useState(false);
  const [showPosteForm, setShowPosteForm] = useState(false);

  const formik = useFormik({
    initialValues: {
      statut: initial?.statut|| '',
      corps: initial?.corps ||'',
      categorie:initial?.categorie||'',
      branche_du_personnel:initial?.branche_du_personnel||'',
      fonctions: initial?.fonctions||'',
      dat_prise_fonction:initial?.dat_prise_fonction|| 0,
      dat_first_prise_de_service:initial?.dat_first_prise_de_service|| '',
      dat_de_depart_retraite:initial?.dat_de_depart_retraite|| '',
      dat_de_prise_service_dans_departement:initial?.dat_de_prise_service_dans_departement ||'',
      ref_acte_de_prise_service_poste_actuel:initial?.ref_acte_de_prise_service_poste_|| '',
      poste_actuel_service:initial?.poste_actuel_service|| '',
      type_structure:initial?.type_structure|| '',
      ref_nomination:initial?.ref_nomination ||'',
      zone_sanitaire:initial?.zone_sanitaire|| '',
      poste_specifique:initial?.poste_specifique|| '',
    },
    validationSchema: Yup.object({
      statut: Yup.string().required('Le statut est requis'),
      corps: Yup.string().required('Le corps est requis'),
      categorie: Yup.string().required('La catégorie est requise'),
      branche_du_personnel: Yup.string().required('La branche est requise'),
      fonctions: Yup.string().required('Les fonctions sont requises'),
      dat_prise_fonction: Yup.date().required('La date de prise de fonction est requise'),
      grade_paye: Yup.string().required('Le grade payé est requis'),
      indice_paye: Yup.number().min(0, "L'indice ne peut pas être négatif").required("L'indice payé est requis"),
      dat_first_prise_de_service: Yup.date().required('La première prise de service est requise'),
      dat_de_depart_retraite: Yup.date().required('La date de départ à la retraite est requise'),
      dat_de_prise_service_dans_departement: Yup.date().required('La date de prise de service dans le département est requise'),
      poste_actuel_service: Yup.string().required('Le poste actuel est requis'),
      type_structure: Yup.string().required('Le type de structure est requis'),
      poste_specifique: Yup.string(),
    }),
    onSubmit: (values) => {
      // Envoyalerer toutes les données lorsque le formulaire principal est soumis
    
        const dataToSubmit = {
          infoPro: values,
          diplome: diplome, // Utilise l'état du diplôme
          poste: poste, // Utilise l'état du poste
          detailMutation: detailMutation, // Utilise l'état des détails de mutation
        };
      
      updateData(dataToSubmit);
      console.log('Form submitted with data:', dataToSubmit);
      onSubmite(); // Appelle la fonction de parent pour gérer la soumission
    }
  });

  return (
    <div>

<div className='my-3 '> 
             {/* Boutons pour afficher les sous-formulaires */}
      <CButton
        color="secondary"
        className='me-2'
        onClick={() => setShowDetailsForm(!showDetailsForm)}
      >
        Ajouter Détails
      </CButton>
      {showDetailsForm && (
        <DetailsForm info={initiale?.Details}  handle={(data) => setDetailMutation(data)} />
      )}

      <CButton
        color="secondary"
         className='me-2'
        onClick={() => setShowDiplomeForm(!showDiplomeForm)}
      >
        Ajouter Diplôme
      </CButton>
      {showDiplomeForm && (
        <DiplomeForm info={initiale[0]?.Diplome} handle={(data) => setDiplome(data)} />
      )}

      <CButton
        color="secondary"
         className='me-2'
        onClick={() => setShowPosteForm(!showPosteForm)}
      >
        Ajouter Poste
      </CButton>
      {showPosteForm && (
        <PosteAnterieurForm info={initiale?.Poste} handle={(data) => setPoste(data)} />
      )}
          </div>

      <CForm onSubmit={formik.handleSubmit}>
        <CRow>
          {/* Liste des champs */}
          {[
            { id: 'statut', label: 'Statut', type: 'text' },
            { id: 'corps', label: 'Corps', type: 'text' },
            { id: 'categorie', label: 'Catégorie', type: 'text' },
            { id: 'branche_du_personnel', label: 'Branche du personnel', type: 'text' },
            { id: 'fonctions', label: 'Fonctions', type: 'text' },
            { id: 'dat_prise_fonction', label: 'Date de prise de fonction', type: 'date' },
            { id: 'grade_paye', label: 'Grade payé', type: 'text' },
            { id: 'indice_paye', label: 'Indice payé', type: 'number' },
            { id: 'dat_first_prise_de_service', label: 'Date de première prise de service', type: 'date' },
            { id: 'dat_de_depart_retraite', label: 'Date de départ à la retraite', type: 'date' },
            { id: 'dat_de_prise_service_dans_departement', label: 'Date de prise de service dans le département', type: 'date' },
            { id: 'poste_actuel_service', label: 'Poste actuel', type: 'text' },
            { id: 'type_structure', label: 'Type de structure', type: 'text' },
            { id: 'poste_specifique', label: 'Poste spécifique', type: 'text' }
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
            <CButton type="submit" color="primary"   disabled={!formik.isValid || formik.isSubmitting}>
              Soumettre
            </CButton>
          </CCol>
        </CRow>

        
      </CForm>
      
     
    </div>
  );
};

export default InfoProForm;
