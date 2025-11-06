import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import CIcon from '@coreui/icons-react';
import { cilArrowLeft, cilArrowRight, cilCheckCircle } from '@coreui/icons';
import {
  CContainer,
  CRow,
  CCol,
  CForm,
  CFormLabel,
  CFormInput,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CFormSelect,
  CFormFeedback,
} from "@coreui/react";
import { getDoc,createEvaluation } from "../../services/api";

const validationSchema = Yup.object().shape({
  // Section 1
  nomPrenom: Yup.string().required("Champ obligatoire"),
  dateLieuNaissance: Yup.string().required("Champ obligatoire"),
  telephone: Yup.string()
    .matches(/^[0-9]+$/, "Numéro invalide")
    .required("Champ obligatoire"),
  email: Yup.string().email("Email invalide").required("Champ obligatoire"),
  situationFamiliale: Yup.string().required("Champ obligatoire"),
  situationMilitaire: Yup.string().required("Champ obligatoire"),
  diplome: Yup.string().required("Champ obligatoire"),
  matricule: Yup.string().required("Champ obligatoire"),
  cnss: Yup.string().required("Champ obligatoire"),
  adresse: Yup.string().required("Champ obligatoire"),

  // Section 2
  datePriseService: Yup.date().required("Champ obligatoire"),
  gradeActuel: Yup.string().required("Champ obligatoire"),
  categorie: Yup.string().required("Champ obligatoire"),
  echelle: Yup.string().required("Champ obligatoire"),
  echelon: Yup.string().required("Champ obligatoire"),
  emploi: Yup.string().required("Champ obligatoire"),
  contratInitial: Yup.string().required("Champ obligatoire"),
  contratRenouvele: Yup.string().required("Champ obligatoire"),
  cdi: Yup.string().required("Champ obligatoire"),
  avenants: Yup.string().required("Champ obligatoire"),

  // Section 3
  periodeDebut: Yup.date().required("Champ obligatoire"),
  periodeFin: Yup.date().required("Champ obligatoire"),
  objectifs: Yup.array().of(Yup.string()),
  resultats: Yup.array().of(Yup.string()),
  contraintes: Yup.string().required("Champ obligatoire"),

  // Notes
  superiorNotes: Yup.object().shape({
    competence: Yup.number()
      .max(8, "Max 8 points")
      .required("Champ obligatoire"),
    ponctualite: Yup.number()
      .max(2, "Max 2 points")
      .required("Champ obligatoire"),
    assiduite: Yup.number()
      .max(2, "Max 2 points")
      .required("Champ obligatoire"),
    ethique: Yup.number()
      .max(1.5, "Max 1.5 points")
      .required("Champ obligatoire"),
    valeurs: Yup.number()
      .max(1.5, "Max 1.5 points")
      .required("Champ obligatoire"),
    animation: Yup.number()
      .max(1, "Max 1 point")
      .required("Champ obligatoire"),
    encadrement: Yup.number()
      .max(2, "Max 2 points")
      .required("Champ obligatoire"),
    evaluation: Yup.number()
      .max(2, "Max 2 points")
      .required("Champ obligatoire"),
  }),

  committeeNotes: Yup.object().shape({
    competence: Yup.number()
      .max(8, "Max 8 points")
      .required("Champ obligatoire"),
    ponctualite: Yup.number()
      .max(2, "Max 2 points")
      .required("Champ obligatoire"),
    assiduite: Yup.number()
      .max(2, "Max 2 points")
      .required("Champ obligatoire"),
    ethique: Yup.number()
      .max(1.5, "Max 1.5 points")
      .required("Champ obligatoire"),
    valeurs: Yup.number()
      .max(1.5, "Max 1.5 points")
      .required("Champ obligatoire"),
    animation: Yup.number()
      .max(1, "Max 1 point")
      .required("Champ obligatoire"),
    encadrement: Yup.number()
      .max(2, "Max 2 points")
      .required("Champ obligatoire"),
    evaluation: Yup.number()
      .max(2, "Max 2 points")
      .required("Champ obligatoire"),
  }),
});

const FicheEvaluation = () => {
  const [dossier, setDossier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
const [step, setStep] = useState(1);

const nextStep = () => {
  if (step < 3) setStep(step + 1);
};

const prevStep = () => {
  if (step > 1) setStep(step - 1);
};


  const user = JSON.parse(localStorage.getItem('user'));
    const matricule = user ? user.matricule : '';
  
    useEffect(() => {
      if (matricule) {
        console.log(matricule);
        fetchDossier();
        console.log(dossier);
      }
    }, [matricule]);

    useEffect(() => {
      console.log("Dossier mis à jour:", dossier);
    }, [dossier]); // Affiche la nouvelle valeur de dossier après mise à jour

      const fetchDossier = async () => {
        try {
          const response = await getDoc(matricule);
          console.log(response.data);
          setDossier(response.data);
          console.log(dossier);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      const formatDa = (isoString) => {
        if (!isoString) return ""; // Ensure it's always a string
        return isoString.split("T")[0]; // Extract only yyyy-MM-dd
      };
      const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
      };


  const formik = useFormik({
    initialValues: {
      // Section 1
      nomPrenom: `${dossier?.InfoIdent.nom} ${dossier?.InfoIdent.prenom}`,
      dateLieuNaissance: `${formatDate(dossier?.InfoIdent.dat_nat)} à ${dossier?.InfoIdent.lieu_nat}`,
      telephone: dossier?.InfoBank.mtn,
      email:dossier?.InfoIdent.email,
      situationFamiliale: dossier?.InfoIdent.situat_matri,
      situationMilitaire: "neant",
      diplome:  dossier?.InfoPro?.Diplomes?.length
      ? dossier.InfoPro.Diplomes[dossier.InfoPro.Diplomes.length - 1].nom_diplome
      : "",
      matricule: dossier?.matricule,
      cnss: dossier?.InfoIdent.cnss,
      adresse: "Non précisé",

      // Section 2
      datePriseService:formatDa(dossier?.InfoPro.dat_first_prise_de_service ),
      gradeActuel: dossier?.InfoPro.grade_paye,
      categorie: dossier?.InfoPro.categorie,
      echelle: "",
      echelon: "",
      emploi: dossier?.InfoPro.fonctions,
      contratInitial: "",
      contratRenouvele: "",
      cdi: "",
      avenants: "",

      // Section 3
      periodeDebut: "",
      periodeFin: "",
      objectifs: ["", "", ""],
      resultats: ["", "", ""],
      contraintes: "",

      // Notes
      superiorNotes: {
        competence: 0,
        ponctualite: 0,
        assiduite: 0,
        ethique: 0,
        valeurs: 0,
        animation: 0,
        encadrement: 0,
        evaluation: 0,
      },
      committeeNotes: {
        competence: 0,
        ponctualite: 0,
        assiduite: 0,
        ethique: 0,
        valeurs: 0,
        animation: 0,
        encadrement: 0,
        evaluation: 0,
      },
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log("Submitted values:", values);
      createEvaluation(values);
      alert( "bien");
      // Ajouter la logique de soumission ici
    },
  });

  const calculateTotal = (notes) => {
    return Object.values(notes).reduce((acc, val) => acc + Number(val), 0);
  };

  const getPerformanceClass = (total) => {
    if (total >= 17) return "Très bonne";
    if (total >= 14) return "Bonne";
    if (total >= 11) return "Assez bonne";
    return "Faible";
  };

  const totalSuperior = calculateTotal(formik.values.superiorNotes);
  const totalCommittee = calculateTotal(formik.values.committeeNotes);

  return (
    <CContainer>
      <h2 className="text-left text-primary my-4">Fiche d'Évaluation de l'Agent</h2>

      <CForm onSubmit={formik.handleSubmit}>
        {/* Section 1 */}
    {step === 1 && (
  <div>
    <h4 className="mb-4">1. Identification de l'agent</h4>

    {/* État civil */}
    <h6 className="text-primary mb-3">État civil</h6>
    <CRow className="mb-3">
      <CCol md={6}>
        <CFormLabel>Nom et Prénoms</CFormLabel>
        <CFormInput
          name="nomPrenom"
          value={formik.values.nomPrenom}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={formik.touched.nomPrenom && !!formik.errors.nomPrenom}
        />
        <CFormFeedback>{formik.errors.nomPrenom}</CFormFeedback>
      </CCol>

      <CCol md={6}>
        <CFormLabel>Date et lieu de naissance</CFormLabel>
        <CFormInput
          name="dateLieuNaissance"
          value={formik.values.dateLieuNaissance}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={formik.touched.dateLieuNaissance && !!formik.errors.dateLieuNaissance}
        />
        <CFormFeedback>{formik.errors.dateLieuNaissance}</CFormFeedback>
      </CCol>
    </CRow>

    {/* Coordonnées */}
    <h6 className="text-primary mb-3">Coordonnées</h6>
    <CRow className="mb-3">
      <CCol md={6}>
        <CFormLabel>Téléphone</CFormLabel>
        <CFormInput
          name="telephone"
          value={formik.values.telephone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={formik.touched.telephone && !!formik.errors.telephone}
        />
        <CFormFeedback>{formik.errors.telephone}</CFormFeedback>
      </CCol>

      <CCol md={6}>
        <CFormLabel>Email</CFormLabel>
        <CFormInput
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={formik.touched.email && !!formik.errors.email}
        />
        <CFormFeedback>{formik.errors.email}</CFormFeedback>
      </CCol>
    </CRow>

    {/* Situation personnelle */}
    <h6 className="text-primary mb-3">Situation personnelle</h6>
    <CRow className="mb-3">
      <CCol md={6}>
        <CFormLabel>Situation de famille</CFormLabel>
        <CFormInput
          name="situationFamiliale"
          value={formik.values.situationFamiliale}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={formik.touched.situationFamiliale && !!formik.errors.situationFamiliale}
        />
        <CFormFeedback>{formik.errors.situationFamiliale}</CFormFeedback>
      </CCol>

      <CCol md={6}>
        <CFormLabel>Situation militaire</CFormLabel>
        <CFormInput
          name="situationMilitaire"
          value={formik.values.situationMilitaire}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={formik.touched.situationMilitaire && !!formik.errors.situationMilitaire}
        />
        <CFormFeedback>{formik.errors.situationMilitaire}</CFormFeedback>
      </CCol>
    </CRow>

    {/* Informations administratives */}
    <h6 className="text-primary mb-3">Informations administratives</h6>
    <CRow className="mb-3">
      <CCol md={6}>
        <CFormLabel>Diplôme de recrutement</CFormLabel>
        <CFormInput
          name="diplome"
          value={formik.values.diplome}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={formik.touched.diplome && !!formik.errors.diplome}
        />
        <CFormFeedback>{formik.errors.diplome}</CFormFeedback>
      </CCol>

      <CCol md={6}>
        <CFormLabel>Matricule</CFormLabel>
        <CFormInput
          name="matricule"
          value={formik.values.matricule}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={formik.touched.matricule && !!formik.errors.matricule}
        />
        <CFormFeedback>{formik.errors.matricule}</CFormFeedback>
      </CCol>
    </CRow>

    <CRow className="mb-4">
      <CCol md={6}>
        <CFormLabel>N° CNSS</CFormLabel>
        <CFormInput
          name="cnss"
          value={formik.values.cnss}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={formik.touched.cnss && !!formik.errors.cnss}
        />
        <CFormFeedback>{formik.errors.cnss}</CFormFeedback>
      </CCol>

      <CCol md={6}>
        <CFormLabel>Adresse</CFormLabel>
        <CFormInput
          name="adresse"
          value={formik.values.adresse}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={formik.touched.adresse && !!formik.errors.adresse}
        />
        <CFormFeedback>{formik.errors.adresse}</CFormFeedback>
      </CCol>
    </CRow>

    {/* Navigation */}
    <div className="d-flex justify-content-end my-4">
      <CButton color="primary" onClick={nextStep}>
        <CIcon icon={cilArrowRight} className="me-2" />
      </CButton>
    </div>
  </div>
)}

        {/* Ajouter les autres champs de la section 1 de la même manière */}

        {/* Section 2 */}
        
        {/* Section Situation Administrative */}
   {step === 2 && (
  <div>
    <h4 className="mb-4 mt-4">2. Situation administrative</h4>

    {/* Prise de service */}
    <h6 className="text-primary mb-3">Date de prise de service</h6>
    <CRow className="mb-3">
      <CCol md={6}>
        <CFormLabel>Date de première prise de service</CFormLabel>
        <CFormInput
          type="date"
          name="datePriseService"
          value={formik.values.datePriseService}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={formik.touched.datePriseService && !!formik.errors.datePriseService}
        />
        <CFormFeedback>{formik.errors.datePriseService}</CFormFeedback>
      </CCol>
    </CRow>

    {/* Grade et classification */}
    <h6 className="text-primary mb-3">Grade et classification</h6>
    <CRow className="mb-3">
      <CCol md={4}>
        <CFormLabel>Grade actuel</CFormLabel>
        <CFormInput
          name="gradeActuel"
          value={formik.values.gradeActuel}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={formik.touched.gradeActuel && !!formik.errors.gradeActuel}
        />
        <CFormFeedback>{formik.errors.gradeActuel}</CFormFeedback>
      </CCol>

      <CCol md={4}>
        <CFormLabel>Catégorie</CFormLabel>
        <CFormSelect
          name="categorie"
          value={formik.values.categorie}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={formik.touched.categorie && !!formik.errors.categorie}
        >
          <option value="">Choisir...</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </CFormSelect>
        <CFormFeedback>{formik.errors.categorie}</CFormFeedback>
      </CCol>

      <CCol md={2}>
        <CFormLabel>Échelle</CFormLabel>
        <CFormSelect
          name="echelle"
          value={formik.values.echelle}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={formik.touched.echelle && !!formik.errors.echelle}
        >
          <option value="">Choisir...</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </CFormSelect>
        <CFormFeedback>{formik.errors.echelle}</CFormFeedback>
      </CCol>

      <CCol md={2}>
        <CFormLabel>Échelon</CFormLabel>
        <CFormSelect
          name="echelon"
          value={formik.values.echelon}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={formik.touched.echelon && !!formik.errors.echelon}
        >
          <option value="">Choisir...</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </CFormSelect>
        <CFormFeedback>{formik.errors.echelon}</CFormFeedback>
      </CCol>
    </CRow>

    {/* Emploi */}
    <h6 className="text-primary mb-3">Emploi</h6>
    <CRow className="mb-3">
      <CCol md={12}>
        <CFormLabel>Emploi</CFormLabel>
        <CFormInput
          name="emploi"
          value={formik.values.emploi}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={formik.touched.emploi && !!formik.errors.emploi}
        />
        <CFormFeedback>{formik.errors.emploi}</CFormFeedback>
      </CCol>
    </CRow>

    {/* Références des actes */}
    <h6 className="text-primary mb-3">Références des actes de carrière</h6>
    <CRow className="mb-3">
      <CCol md={4}>
        <CFormLabel>Contrat initial</CFormLabel>
        <CFormInput
          name="contratInitial"
          value={formik.values.contratInitial}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={formik.touched.contratInitial && !!formik.errors.contratInitial}
        />
        <CFormFeedback>{formik.errors.contratInitial}</CFormFeedback>
      </CCol>

      <CCol md={4}>
        <CFormLabel>Contrat renouvelé</CFormLabel>
        <CFormInput
          name="contratRenouvele"
          value={formik.values.contratRenouvele}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={formik.touched.contratRenouvele && !!formik.errors.contratRenouvele}
        />
        <CFormFeedback>{formik.errors.contratRenouvele}</CFormFeedback>
      </CCol>

      <CCol md={4}>
        <CFormLabel>Contrat à durée indéterminée</CFormLabel>
        <CFormInput
          name="cdi"
          value={formik.values.cdi}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={formik.touched.cdi && !!formik.errors.cdi}
        />
        <CFormFeedback>{formik.errors.cdi}</CFormFeedback>
      </CCol>
    </CRow>

    <CRow className="mb-4">
      <CCol md={12}>
        <CFormLabel>Avenants</CFormLabel>
        <CFormInput
          name="avenants"
          value={formik.values.avenants}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={formik.touched.avenants && !!formik.errors.avenants}
        />
        <CFormFeedback>{formik.errors.avenants}</CFormFeedback>
      </CCol>
    </CRow>

    {/* Navigation */}
    <div className="d-flex justify-content-between my-4">
      <CButton color="secondary" onClick={prevStep}>
      <CIcon icon={cilArrowLeft} className="me-2" />
      </CButton>
      <CButton color="primary" onClick={nextStep}>
      <CIcon icon={cilArrowRight} className="me-2" />
      </CButton>
    </div>
  </div>
)}


        {/* Ajouter les autres champs de la section 2 */}

        {/* Section 3 */}
   {step === 3 && <div>
         <h4 className="mt-4">3. Évaluation</h4>


        <CRow className="mt-3">
          <CCol md={6}>
            <CFormLabel>Période de référence (Début)</CFormLabel>
            <CFormInput
              type="date"
              name="periodeDebut"
              value={formik.values.periodeDebut}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              invalid={formik.touched.periodeDebut && !!formik.errors.periodeDebut}
            />
            <CFormFeedback>{formik.errors.periodeDebut}</CFormFeedback>
          </CCol>
          <CCol md={6}>
            <CFormLabel>Période de référence (Fin)</CFormLabel>
            <CFormInput
              type="date"
              name="periodeFin"
              value={formik.values.periodeFin}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              invalid={formik.touched.periodeFin && !!formik.errors.periodeFin}
            />
            <CFormFeedback>{formik.errors.periodeFin}</CFormFeedback>
          </CCol>
        </CRow>

        {/* Objectifs */}
        <h5 className="mt-4">3.1. Rappel des objectifs</h5>
        {[0, 1, 2].map((index) => (
          <CFormInput
            key={index}
            className="mb-2"
            name={`objectifs[${index}]`}
            value={formik.values.objectifs[index]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            invalid={
              formik.touched.objectifs?.[index] &&
              !!formik.errors.objectifs?.[index]
            }
          />
        ))}

        {/* Résultats */}
        <h5 className="mt-4">3.2. Résultats obtenus</h5>
        {[0, 1, 2].map((index) => (
          <CFormInput
            key={index}
            className="mb-2"
            name={`resultats[${index}]`}
            value={formik.values.resultats[index]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            invalid={
              formik.touched.resultats?.[index] &&
              !!formik.errors.resultats?.[index]
            }
          />
        ))}

          {/* Contraintes */}
          <h5 className="mt-4">3.3. Contraintes et difficultés</h5>
        
          <CFormInput
           
            className="mb-2"
            name='contraintes'
            value={formik.values.contraintes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            invalid={
              formik.touched.contraintes &&
              !!formik.errors.contraintes
            }
          />


        {/* Tableau d'évaluation */}
        <h5 className="mt-4 d-none">3.4. Note du supérieur hiérarchique</h5>
        <CTable striped bordered responsive className="d-none">
  <CTableHead>
    <CTableRow>
      <CTableHeaderCell width="30%">Critères de performances</CTableHeaderCell>
      <CTableHeaderCell width="40%">Détails</CTableHeaderCell>
      <CTableHeaderCell width="30%">Note</CTableHeaderCell>
    </CTableRow>
  </CTableHead>
  <CTableBody>
    {/* Compétence professionnelle */}
    <CTableRow>
      <CTableDataCell>Compétence professionnelle (08)</CTableDataCell>
      <CTableDataCell>Taux de réalisation des programmes d'activités</CTableDataCell>
      <CTableDataCell>
        <CFormInput
          type="number"
          name="superiorNotes.competence"
          value={formik.values.superiorNotes.competence}
          onChange={formik.handleChange}
          min="0"
          max="8"
          step="0.5"
          invalid={formik.touched.superiorNotes?.competence && !!formik.errors.superiorNotes?.competence}
        />
        <CFormFeedback>{formik.errors.superiorNotes?.competence}</CFormFeedback>
      </CTableDataCell>
    </CTableRow>

    {/* Conscience professionnelle */}
    <CTableRow>
      <CTableDataCell rowSpan={4}>Conscience professionnelle (07)</CTableDataCell>
      <CTableDataCell>Ponctualité (02)</CTableDataCell>
      <CTableDataCell>
        <CFormInput
          type="number"
          name="superiorNotes.ponctualite"
          value={formik.values.superiorNotes.ponctualite}
          onChange={formik.handleChange}
          min="0"
          max="2"
          step="0.5"
          invalid={formik.touched.superiorNotes?.ponctualite && !!formik.errors.superiorNotes?.ponctualite}
        />
        <CFormFeedback>{formik.errors.superiorNotes?.ponctualite}</CFormFeedback>
      </CTableDataCell>
    </CTableRow>
    <CTableRow>
      <CTableDataCell>Assiduité (02)</CTableDataCell>
      <CTableDataCell>
        <CFormInput
          type="number"
          name="superiorNotes.assiduite"
          value={formik.values.superiorNotes.assiduite}
          onChange={formik.handleChange}
          min="0"
          max="2"
          step="0.5"
          invalid={formik.touched.superiorNotes?.assiduite && !!formik.errors.superiorNotes?.assiduite}
        />
        <CFormFeedback>{formik.errors.superiorNotes?.assiduite}</CFormFeedback>
      </CTableDataCell>
    </CTableRow>
    <CTableRow>
      <CTableDataCell>Éthique professionnelle (1.5)</CTableDataCell>
      <CTableDataCell>
        <CFormInput
          type="number"
          name="superiorNotes.ethique"
          value={formik.values.superiorNotes.ethique}
          onChange={formik.handleChange}
          min="0"
          max="1.5"
          step="0.5"
          invalid={formik.touched.superiorNotes?.ethique && !!formik.errors.superiorNotes?.ethique}
        />
        <CFormFeedback>{formik.errors.superiorNotes?.ethique}</CFormFeedback>
      </CTableDataCell>
    </CTableRow>
    <CTableRow>
      <CTableDataCell>Sens des valeurs (1.5)</CTableDataCell>
      <CTableDataCell>
        <CFormInput
          type="number"
          name="superiorNotes.valeurs"
          value={formik.values.superiorNotes.valeurs}
          onChange={formik.handleChange}
          min="0"
          max="1.5"
          step="0.5"
          invalid={formik.touched.superiorNotes?.valeurs && !!formik.errors.superiorNotes?.valeurs}
        />
        <CFormFeedback>{formik.errors.superiorNotes?.valeurs}</CFormFeedback>
      </CTableDataCell>
    </CTableRow>

    {/* Sens de leadership */}
    <CTableRow>
      <CTableDataCell rowSpan={3}>Sens de leadership (05)</CTableDataCell>
      <CTableDataCell>Animation d'équipe (01)</CTableDataCell>
      <CTableDataCell>
        <CFormInput
          type="number"
          name="superiorNotes.animation"
          value={formik.values.superiorNotes.animation}
          onChange={formik.handleChange}
          min="0"
          max="1"
          step="0.5"
          invalid={formik.touched.superiorNotes?.animation && !!formik.errors.superiorNotes?.animation}
        />
        <CFormFeedback>{formik.errors.superiorNotes?.animation}</CFormFeedback>
      </CTableDataCell>
    </CTableRow>
    <CTableRow>
      <CTableDataCell>Aptitude à l'encadrement (02)</CTableDataCell>
      <CTableDataCell>
        <CFormInput
          type="number"
          name="superiorNotes.encadrement"
          value={formik.values.superiorNotes.encadrement}
          onChange={formik.handleChange}
          min="0"
          max="2"
          step="0.5"
          invalid={formik.touched.superiorNotes?.encadrement && !!formik.errors.superiorNotes?.encadrement}
        />
        <CFormFeedback>{formik.errors.superiorNotes?.encadrement}</CFormFeedback>
      </CTableDataCell>
    </CTableRow>
    <CTableRow>
      <CTableDataCell>Capacité à évaluer (02)</CTableDataCell>
      <CTableDataCell>
        <CFormInput
          type="number"
          name="superiorNotes.evaluation"
          value={formik.values.superiorNotes.evaluation}
          onChange={formik.handleChange}
          min="0"
          max="2"
          step="0.5"
          invalid={formik.touched.superiorNotes?.evaluation && !!formik.errors.superiorNotes?.evaluation}
        />
        <CFormFeedback>{formik.errors.superiorNotes?.evaluation}</CFormFeedback>
      </CTableDataCell>
    </CTableRow>
  </CTableBody>
</CTable>




        {/* Total et performance */}
        <CRow className="my-3 d-none">
          <CCol md={4}>
            <strong>Total: {totalSuperior}/20</strong>
          </CCol>
          <CCol md={8}>
            <strong>
              Classe de performance: {getPerformanceClass(totalSuperior)}
            </strong>
          </CCol>
        </CRow>

        {/* Répéter la même structure pour le comité de direction */}


        <CTable striped bordered responsive className="d-none">
  <CTableHead>
    <CTableRow>
      <CTableHeaderCell width="30%">Critères de performances</CTableHeaderCell>
      <CTableHeaderCell width="40%">Détails</CTableHeaderCell>
      <CTableHeaderCell width="30%">Note</CTableHeaderCell>
    </CTableRow>
  </CTableHead>
  <CTableBody>
    {/* Compétence professionnelle */}
    <CTableRow>
      <CTableDataCell>Compétence professionnelle (08)</CTableDataCell>
      <CTableDataCell>Taux de réalisation des programmes d'activités</CTableDataCell>
      <CTableDataCell>
        <CFormInput
          type="number"
          name="committeeNotes.competence"
          value={formik.values.committeeNotes.competence}
          onChange={formik.handleChange}
          min="0"
          max="8"
          step="0.5"
          invalid={formik.touched.committeeNotes?.competence && !!formik.errors.committeeNotes?.competence}
        />
        <CFormFeedback>{formik.errors.committeeNotes?.competence}</CFormFeedback>
      </CTableDataCell>
    </CTableRow>

    {/* Conscience professionnelle */}
    <CTableRow>
      <CTableDataCell rowSpan={4}>Conscience professionnelle (07)</CTableDataCell>
      <CTableDataCell>Ponctualité (02)</CTableDataCell>
      <CTableDataCell>
        <CFormInput
          type="number"
          name="committeeNotes.ponctualite"
          value={formik.values.committeeNotes.ponctualite}
          onChange={formik.handleChange}
          min="0"
          max="2"
          step="0.5"
          invalid={formik.touched.committeeNotes?.ponctualite && !!formik.errors.committeeNotes?.ponctualite}
        />
        <CFormFeedback>{formik.errors.committeeNotes?.ponctualite}</CFormFeedback>
      </CTableDataCell>
    </CTableRow>
    <CTableRow>
      <CTableDataCell>Assiduité (02)</CTableDataCell>
      <CTableDataCell>
        <CFormInput
          type="number"
          name="committeeNotes.assiduite"
          value={formik.values.committeeNotes.assiduite}
          onChange={formik.handleChange}
          min="0"
          max="2"
          step="0.5"
          invalid={formik.touched.committeeNotes?.assiduite && !!formik.errors.committeeNotes?.assiduite}
        />
        <CFormFeedback>{formik.errors.committeeNotes?.assiduite}</CFormFeedback>
      </CTableDataCell>
    </CTableRow>
    <CTableRow>
      <CTableDataCell>Éthique professionnelle (1.5)</CTableDataCell>
      <CTableDataCell>
        <CFormInput
          type="number"
          name="committeeNotes.ethique"
          value={formik.values.committeeNotes.ethique}
          onChange={formik.handleChange}
          min="0"
          max="1.5"
          step="0.5"
          invalid={formik.touched.committeeNotes?.ethique && !!formik.errors.committeeNotes?.ethique}
        />
        <CFormFeedback>{formik.errors.committeeNotes?.ethique}</CFormFeedback>
      </CTableDataCell>
    </CTableRow>
    <CTableRow>
      <CTableDataCell>Sens des valeurs (1.5)</CTableDataCell>
      <CTableDataCell>
        <CFormInput
          type="number"
          name="committeeNotes.valeurs"
          value={formik.values.committeeNotes.valeurs}
          onChange={formik.handleChange}
          min="0"
          max="1.5"
          step="0.5"
          invalid={formik.touched.committeeNotes?.valeurs && !!formik.errors.committeeNotes?.valeurs}
        />
        <CFormFeedback>{formik.errors.committeeNotes?.valeurs}</CFormFeedback>
      </CTableDataCell>
    </CTableRow>

    {/* Sens de leadership */}
    <CTableRow>
      <CTableDataCell rowSpan={3}>Sens de leadership (05)</CTableDataCell>
      <CTableDataCell>Animation d'équipe (01)</CTableDataCell>
      <CTableDataCell>
        <CFormInput
          type="number"
          name="committeeNotes.animation"
          value={formik.values.committeeNotes.animation}
          onChange={formik.handleChange}
          min="0"
          max="1"
          step="0.5"
          invalid={formik.touched.committeeNotes?.animation && !!formik.errors.committeeNotes?.animation}
        />
        <CFormFeedback>{formik.errors.committeeNotes?.animation}</CFormFeedback>
      </CTableDataCell>
    </CTableRow>
    <CTableRow>
      <CTableDataCell>Aptitude à l'encadrement (02)</CTableDataCell>
      <CTableDataCell>
        <CFormInput
          type="number"
          name="committeeNotes.encadrement"
          value={formik.values.committeeNotes.encadrement}
          onChange={formik.handleChange}
          min="0"
          max="2"
          step="0.5"
          invalid={formik.touched.committeeNotes?.encadrement && !!formik.errors.committeeNotes?.encadrement}
        />
        <CFormFeedback>{formik.errors.committeeNotes?.encadrement}</CFormFeedback>
      </CTableDataCell>
    </CTableRow>
    <CTableRow>
      <CTableDataCell>Capacité à évaluer (02)</CTableDataCell>
      <CTableDataCell>
        <CFormInput
          type="number"
          name="committeeNotes.evaluation"
          value={formik.values.committeeNotes.evaluation}
          onChange={formik.handleChange}
          min="0"
          max="2"
          step="0.5"
          invalid={formik.touched.committeeNotes?.evaluation && !!formik.errors.committeeNotes?.evaluation}
        />
        <CFormFeedback>{formik.errors.committeeNotes?.evaluation}</CFormFeedback>
      </CTableDataCell>
    </CTableRow>
  </CTableBody>
</CTable>
<CRow className="mt-3 d-none">
          <CCol md={4}>
            <strong>Total: {totalCommittee}/20</strong>
          </CCol>
          <CCol md={8}>
            <strong>
              Classe de performance: {getPerformanceClass(totalCommittee)}
            </strong>
          </CCol>
        </CRow>
        <CButton color="secondary" className="me-2 mt-3" onClick={prevStep}>
          <CIcon icon={cilArrowLeft} className="me-2" />
          </CButton>
       </div>}     

       {step===3 &&<CButton type="submit" color="primary" className="mt-4 mb-5">
          Soumettre l'évaluation
        </CButton> } 
      </CForm>
    </CContainer>
  );
};

export default FicheEvaluation;