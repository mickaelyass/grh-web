import { useFormik } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import {
  CForm, CFormLabel, CFormInput,CCardHeader,CFormSelect, CButton, CCol, CRow, CAlert,
  CCard,
  CCardBody
} from '@coreui/react';

import DetailsForm from './DetailForm';
import DiplomeForm from './DiplomeForm';
import PosteAnterieurForm from './PosteForm';

const InfoProForm = ({ onSubmite,updateData, initial ,infoi,setCanProceed  }) => {
  // États pour chaque formulaire
  //const [infoPro, setInfoPro] = useState({});
  const [initiale, setInitiale] = useState({});
  const [diplome, setDiplome] = useState({});
  const [poste, setPoste] = useState({});
  const [detailMutation, setDetailMutation] = useState({});
  const [datNat, setDatNat] = useState('');

  // Afficher les sous-formulaires
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [showDiplomeForm, setShowDiplomeForm] = useState(false);
  const [showPosteForm, setShowPosteForm] = useState(false);

  

const formatDate = (dateString) => {
  if (!dateString) return ''; // Return an empty string for invalid dates
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Format as yyyy-MM-dd
};
const calculateRetirementDate = (birthDate, category) => {
  const birth = new Date(birthDate);
  let retirementAge;

  // Déterminer l'âge de départ à la retraite en fonction de la catégorie
  switch (category) {
    case 'A':
      retirementAge = 60;
      break;
    case 'B':
      retirementAge = 58;
      break;
    case 'C':
    case 'D':
      retirementAge = 55;
      break;
    default:
      retirementAge = 60; // Valeur par défaut si la catégorie n'est pas spécifiée
  }

  // Ajouter l'âge de retraite à la date de naissance
  birth.setFullYear(birth.getFullYear() + retirementAge);

  // Retourner la nouvelle date de retraite formatée
  return birth;
};
const formik = useFormik({
    initialValues: {
      statut: initial?.statut|| '',
      corps: initial?.corps ||'',
      categorie:initial?.categorie||'',
      branche_du_personnel:initial?.branche_du_personnel||'',
      fonctions: initial?.fonctions||'',
      dat_prise_fonction:formatDate(initial?.dat_prise_fonction)|| ''   
,
      grade_paye:initial?.grade_paye || 0,
      indice_paye:initial?.indice_paye ||0,
      dat_first_prise_de_service:formatDate(initial?.dat_first_prise_de_service)|| '',
      dat_de_depart_retraite:formatDate(initial?.dat_de_depart_retraite)|| '',
      dat_de_prise_service_dans_departement:formatDate(initial?.dat_de_prise_service_dans_departement )||'',
      nombre_jour_conges_disponible:initial?.nombre_jour_conges_disponible || '',
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
      nombre_jour_conges_disponible:Yup.number(),
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
  const [message, setMessage] = useState('');
  useEffect(() => {
  if (message) {
    const timer = setTimeout(() => setMessage(''), 9000);
    return () => clearTimeout(timer);
  }
}, [message]);


useEffect(() => {
  if (initial) {
    setInitiale(initial);
  }
  if (infoi?.dat_nat && datNat !== infoi.dat_nat) {
  setDatNat(infoi.dat_nat);
}
}, [initial, infoi]);


const retirementDate = useMemo(() => {
  if (datNat && formik.values.categorie) {
    return formatDate(calculateRetirementDate(datNat, formik.values.categorie));
  }
  return '';
}, [datNat, formik.values.categorie]);

useEffect(() => {
  if (retirementDate && formik.values.dat_de_depart_retraite !== retirementDate) {
    formik.setFieldValue('dat_de_depart_retraite', retirementDate);
  }
}, [retirementDate]);

  // Surveiller validité + sous-formulaires
  useEffect(() => {
    if (
      formik.isValid && 
      diplome !== null && 
      poste !== null && 
      detailMutation !== null
    ) {
      setCanProceed(true);
    } else {
      setCanProceed(false);
    }
  }, [formik.isValid, diplome, poste, detailMutation]);



 

  return (
    <div>
      <CCardHeader className='mb-3'>
            <strong>Information Professionnelle</strong>
      </CCardHeader>

      <CCard className="mb-4">
  <CCardHeader>Sous-formulaires</CCardHeader>
  <div className="p-3 d-flex flex-wrap gap-2">
    <CButton
      color="secondary"
      onClick={() => setShowDetailsForm(!showDetailsForm)}
    >
      {showDetailsForm ? "Masquer Détails" : "Ajouter Détails"}
    </CButton>

    <CButton
      color="secondary"
      onClick={() => setShowDiplomeForm(!showDiplomeForm)}
    >
      {showDiplomeForm ? "Masquer Diplôme" : "Ajouter Diplôme"}
    </CButton>

    <CButton
      color="secondary"
      onClick={() => setShowPosteForm(!showPosteForm)}
    >
      {showPosteForm ? "Masquer Poste" : "Ajouter Poste"}
    </CButton>
  </div>

  <div className="p-3">
    {showDetailsForm && (
      <CCard className="mb-3">
        <CCardHeader>Détails de Mutation</CCardHeader>
        <CCardBody>
          <DetailsForm
            info={initiale?.Details}
            handle={(data) => {
              setDetailMutation(data);
              setShowDetailsForm(false);
              setMessage('🛠️ Détail de mutation enregistré');
            }}
          />
        </CCardBody>
      </CCard>
    )}

    {showDiplomeForm && (
      <CCard className="mb-3">
        <CCardHeader>Diplômes</CCardHeader>
        <CCardBody>
          <DiplomeForm
            info={initiale?.Diplomes}
           handle={(data) => {
            setDiplome(data);
            setShowDiplomeForm(false);
            setMessage('🎓 Diplôme enregistré');
          }}
          />
        </CCardBody>
      </CCard>
    )}

    {showPosteForm && (
      <CCard className="mb-3">
        <CCardHeader>Postes Antérieurs</CCardHeader>
        <CCardBody>
          <PosteAnterieurForm
            info={initiale?.PosteAnterieurs}
             handle={(data) => {
              setPoste(data);
              setShowPosteForm(false);
              setMessage('📌 Poste antérieur enregistré');
            }}
          />
        </CCardBody>
      </CCard>
    )}
  </div>
</CCard>
{message && <CAlert color="success">{message}</CAlert>}

      <CForm onSubmit={formik.handleSubmit}>
        <CRow>
          {/* Liste des champs */}


          
            <CCol xs={12} md={6}  className="mb-3">
              <CFormLabel htmlFor='statut'>Statut</CFormLabel>
              <CFormSelect
                id="statut"
                name="statut"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.statut}
                invalid={formik.touched.statut && !!formik.errors.statut}
              >
                <option value="">-- Sélectionnez un statut --</option>
                <option value="FE">FE</option>
                <option value="ACDPE">ACDPE</option>
                <option value="AFC">AFC</option>
          </CFormSelect>

              {formik.touched.statut && formik.errors.statut && (
                <CAlert color="danger">{formik.errors.statut}</CAlert>
              )}
            </CCol>

        
            <CCol xs={12} md={6}  className="mb-3">
              <CFormLabel htmlFor='corps'>Corps</CFormLabel>
              <CFormInput
                id='corps'
                name='corps'
                type='corps'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.corps}
                invalid={formik.touched.corps && !!formik.errors.corps}
              />
              {formik.touched.corps && formik.errors.corps && (
                <CAlert color="danger">{formik.errors.corps}</CAlert>
              )}
            </CCol>



          <CCol xs={12} md={6} className="mb-3">
  <CFormLabel htmlFor="categorie">Catégorie</CFormLabel>
  <CFormSelect
    id="categorie"
    name="categorie"
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    value={formik.values.categorie}
    invalid={formik.touched.categorie && !!formik.errors.categorie}
  >
    <option value="">-- Sélectionnez une catégorie --</option>
    <option value="A">A</option>
    <option value="B">B</option>
    <option value="C">C</option>
    <option value="D">D</option>
    <option value="E">E</option>
  </CFormSelect>
  {formik.touched.categorie && formik.errors.categorie && (
    <CAlert color="danger">{formik.errors.categorie}</CAlert>
  )}
</CCol>

          {[
            { id: 'branche_du_personnel', label: 'Branche du personnel', type: 'text' },
            { id: 'fonctions', label: 'Fonctions', type: 'text' },
            { id: 'dat_prise_fonction', label: 'Date de prise de fonction', type: 'date' }
           
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


<CCol xs={12} md={6} className="mb-3">
  <CFormLabel htmlFor="grade">Grade</CFormLabel>
  <CFormSelect
    id="grade"
    name="grade"
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    value={formik.values.grade}
    invalid={formik.touched.grade && !!formik.errors.grade}
  >
    <option value="">-- Sélectionnez un grade --</option>
    {/* Options dynamiques de A1-1 à E4-4 */}
    {["A", "B", "C", "D", "E"].map((categorie) =>
      [1, 2, 3, 4].map((echelle) =>
        [1, 2, 3, 4].map((echelon) => (
          <option key={`${categorie}${echelle}-${echelon}`} value={`${categorie}${echelle}-${echelon}`}>
            {`${categorie}${echelle}-${echelon}`}
          </option>
        ))
      )
    )}
  </CFormSelect>
  {formik.touched.grade && formik.errors.grade && (
    <CAlert color="danger">{formik.errors.grade}</CAlert>
  )}
</CCol>


   
         {[
    
            { id: 'indice_paye', label: 'Indice payé', type: 'number' },
            { id: 'dat_first_prise_de_service', label: 'Date de première prise de service', type: 'date' },
            { id: 'dat_de_depart_retraite', label: 'Date de départ à la retraite', type: 'date' },
            { id: 'dat_de_prise_service_dans_departement', label: 'Date de prise de service dans le département', type: 'date' },
            { id: 'nombre_jour_conges_disponible', label: 'Nombre de jours de conges disponibles', type: 'number' },
            { id: 'poste_actuel_service', label: 'Service actuel', type: 'text' },
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
