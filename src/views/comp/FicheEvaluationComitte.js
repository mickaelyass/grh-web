import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from '../../ui/Button'
import { Form, FormFeedback, FormInput, FormLabel, FormSelect } from '../../ui/Form'
import { Col, Container, Row } from '../../ui/Grid'
import { Table, TableBody, TableDataCell, TableHead, TableHeaderCell, TableRow } from '../../ui/Table'
import { ArrowLeft, ArrowRight } from '../../ui/icons'

import { getEvalByID,editEvaluation } from "../../services/api";
import { useParams } from "react-router-dom";

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

const FicheEvaluationComitte = () => {
  const [dossier, setDossier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
const [step, setStep] = useState(1);

 const nextStep = () => {
  if (step < 5) setStep(step + 1);
};

const prevStep = () => {
  if (step > 1) setStep(step - 1);
};
  const  {id}  = useParams(); 

  
    useEffect(() => {
        console.log(id);
      if (id) {
      
        fetchDossier();
        console.log(dossier);
      }
    }, [id]);

    useEffect(() => {
      console.log("Dossier mis à jour:", dossier);
    }, [dossier]); // Affiche la nouvelle valeur de dossier après mise à jour

      const fetchDossier = async () => {
        try {
          const response = await getEvalByID(id);
          console.log(response);
          setDossier(response);
          console.log(dossier);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
    
      const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
      };

  const formik = useFormik({
    initialValues: {
      // Section 1
      nomPrenom: dossier?.nom_prenom,
      dateLieuNaissance: dossier?.date_lieu_naissance,
      telephone: dossier?.telephone,
      email:dossier?.email,
      situationFamiliale: dossier?.situation_familiale,
      situationMilitaire: dossier?.situation_militaire||'',
      diplome:  dossier?.diplome,
      matricule: dossier?.matricule,
      cnss: dossier?.cnss,
      adresse: dossier?.adresse,

      // Section 2
      datePriseService:dossier?.date_prise_service ,
      gradeActuel: dossier?.grade_actuel,
      categorie: dossier?.categorie,
      echelle: dossier?.echelle,
      echelon:dossier?.echelon,
      emploi: dossier?.emploi,
      contratInitial:dossier?.contrat_initial,
      contratRenouvele:dossier?.contrat_renouvele,
      cdi: dossier?.cdi,
      avenants: dossier?.avenants,

     // Section 3 - Évaluation
  periodeDebut: dossier?.periode_debut || "",
  periodeFin: dossier?.periode_fin || "",
  objectifs: dossier?.objectifs?.length ? [...dossier.objectifs] : ["", "", ""],
  resultats: dossier?.resultats?.length ? [...dossier.resultats] : ["", "", ""],
  contraintes: dossier?.contraintes || "",

  // Notes - Supérieur
  superiorNotes: {
    competence: dossier?.superior_notes?.competence || 0,
    ponctualite: dossier?.superior_notes?.ponctualite || 0,
    assiduite: dossier?.superior_notes?.assiduite || 0,
    ethique: dossier?.superior_notes?.ethique || 0,
    valeurs: dossier?.superior_notes?.valeurs || 0,
    animation: dossier?.superior_notes?.animation || 0,
    encadrement: dossier?.superior_notes?.encadrement || 0,
    evaluation: dossier?.superior_notes?.evaluation || 0,
  },

  // Notes - Comité
  committeeNotes: {
    competence: dossier?.committee_notes?.competence || 0,
    ponctualite: dossier?.committee_notes?.ponctualite || 0,
    assiduite: dossier?.committee_notes?.assiduite || 0,
    ethique: dossier?.committee_notes?.ethique || 0,
    valeurs: dossier?.committee_notes?.valeurs || 0,
    animation: dossier?.committee_notes?.animation || 0,
    encadrement: dossier?.committee_notes?.encadrement || 0,
    evaluation: dossier?.committee_notes?.evaluation || 0,
  }
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      
      console.log("Submitted values:", values);
      editEvaluation(id,values);
      // Ajouter la logique de soumission ici
      alert("bien passer");
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
    <Container>
      <h2 className="text-left  text-primary my-4">Fiche d'Évaluation de l'Agent</h2>

      <Form onSubmit={formik.handleSubmit}>
        {/* Section 1 */}
   {step===1 &&<div>
         <h4>1. Identification de l'agent</h4>
        <Row className="mt-3">
  {/* Nom et Prénoms */}
  <Col md={6}>
    <FormLabel>Nom et Prénoms</FormLabel>
    <FormInput
      name="nomPrenom"
      value={formik.values.nomPrenom}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      invalid={formik.touched.nomPrenom && !!formik.errors.nomPrenom}
    />
    <FormFeedback>{formik.errors.nomPrenom}</FormFeedback>
  </Col>

  {/* Date et lieu de naissance */}
  <Col md={6}>
    <FormLabel>Date et lieu de naissance</FormLabel>
    <FormInput
      name="dateLieuNaissance"
      value={formik.values.dateLieuNaissance}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      invalid={formik.touched.dateLieuNaissance && !!formik.errors.dateLieuNaissance}
    />
    <FormFeedback>{formik.errors.dateLieuNaissance}</FormFeedback>
  </Col>
</Row>

<Row className="mt-3">
  {/* Téléphone */}
  <Col md={6}>
    <FormLabel>Téléphone</FormLabel>
    <FormInput
      name="telephone"
      value={formik.values.telephone}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      invalid={formik.touched.telephone && !!formik.errors.telephone}
    />
    <FormFeedback>{formik.errors.telephone}</FormFeedback>
  </Col>

  {/* Email */}
  <Col md={6}>
    <FormLabel>Email</FormLabel>
    <FormInput
      name="email"
      type="email"
      value={formik.values.email}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      invalid={formik.touched.email && !!formik.errors.email}
    />
    <FormFeedback>{formik.errors.email}</FormFeedback>
  </Col>
</Row>

<Row className="mt-3">
  {/* Situation de famille */}
  <Col md={6}>
    <FormLabel>Situation de famille</FormLabel>
    <FormInput
      name="situationFamiliale"
      value={formik.values.situationFamiliale}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      invalid={formik.touched.situationFamiliale && !!formik.errors.situationFamiliale}
    />
    <FormFeedback>{formik.errors.situationFamiliale}</FormFeedback>
  </Col>

  {/* Situation militaire */}
  <Col md={6}>
    <FormLabel>Situation militaire</FormLabel>
    <FormInput
      name="situationMilitaire"
      value={formik.values.situationMilitaire}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      invalid={formik.touched.situationMilitaire && !!formik.errors.situationMilitaire}
    />
    <FormFeedback>{formik.errors.situationMilitaire}</FormFeedback>
  </Col>
</Row>

<Row className="mt-3">
  {/* Diplôme de recrutement */}
  <Col md={6}>
    <FormLabel>Diplôme de recrutement</FormLabel>
    <FormInput
      name="diplome"
      value={formik.values.diplome}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      invalid={formik.touched.diplome && !!formik.errors.diplome}
    />
    <FormFeedback>{formik.errors.diplome}</FormFeedback>
  </Col>

  {/* Matricule */}
  <Col md={6}>
    <FormLabel>Matricule</FormLabel>
    <FormInput
      name="matricule"
      value={formik.values.matricule}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      invalid={formik.touched.matricule && !!formik.errors.matricule}
    />
    <FormFeedback>{formik.errors.matricule}</FormFeedback>
  </Col>
</Row>

<Row className="mt-3">
  {/* N° CNSS */}
  <Col md={6}>
    <FormLabel>N° CNSS</FormLabel>
    <FormInput
      name="cnss"
      value={formik.values.cnss}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      invalid={formik.touched.cnss && !!formik.errors.cnss}
    />
    <FormFeedback>{formik.errors.cnss}</FormFeedback>
  </Col>

  {/* Adresse */}
  <Col md={6}>
    <FormLabel>Adresse</FormLabel>
    <FormInput
      name="adresse"
      value={formik.values.adresse}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      invalid={formik.touched.adresse && !!formik.errors.adresse}
    />
    <FormFeedback>{formik.errors.adresse}</FormFeedback>
  </Col>
</Row>

 <div className="d-flex d-flex justify-content-end my-4">
      <Button color="primary"   onClick={nextStep}>
      <Icon icon={ArrowRight} className="me-2" />
      </Button>
    </div>
       </div>}    
        {/* Ajouter les autres champs de la section 1 de la même manière */}

        {/* Section 2 */}
        
        {/* Section Situation Administrative */}
   {step===2 && <div>
          <h4 className="mt-4">2. Situation administrative</h4>

<Row className="mt-3">
  {/* Date de première prise de service */}
  <Col md={6}>
    <FormLabel>Date de première prise de service</FormLabel>
    <FormInput
      type="date"
      name="datePriseService"
      value={formik.values.datePriseService}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      invalid={formik.touched.datePriseService && !!formik.errors.datePriseService}
    />
    <FormFeedback>{formik.errors.datePriseService}</FormFeedback>
  </Col>

 
</Row>
<Row className="mt-3">
 {/* Grade actuel */}
  <Col md={4}>
    <FormLabel>Grade actuel</FormLabel>
    <FormInput
      name="gradeActuel"
      value={formik.values.gradeActuel}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      invalid={formik.touched.gradeActuel && !!formik.errors.gradeActuel}
    />
    <FormFeedback>{formik.errors.gradeActuel}</FormFeedback>
  </Col>
</Row>

<Row className="mt-3">
   
  {/* Catégorie */}
  <Col md={4}>
    <FormLabel>Catégorie</FormLabel>
    <FormSelect
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
    </FormSelect>
    <FormFeedback>{formik.errors.categorie}</FormFeedback>
  </Col>

  {/* Échelle */}
  <Col md={4}>
    <FormLabel>Échelle</FormLabel>
    <FormSelect
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
    </FormSelect>
    <FormFeedback>{formik.errors.echelle}</FormFeedback>
  </Col>

  {/* Échelon */}
  <Col md={4}>
    <FormLabel>Échelon</FormLabel>
    <FormSelect
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
    </FormSelect>
    <FormFeedback>{formik.errors.echelon}</FormFeedback>
  </Col>
</Row>

<Row className="mt-3">
  {/* Emploi */}
  <Col md={12}>
    <FormLabel>Emploi</FormLabel>
    <FormInput
      name="emploi"
      value={formik.values.emploi}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      invalid={formik.touched.emploi && !!formik.errors.emploi}
    />
    <FormFeedback>{formik.errors.emploi}</FormFeedback>
  </Col>
</Row>
<h5 className="my-2">Référence des actes de carrière</h5>

<Row className="mt-3">
  {/* Contrat initial */}
  <Col md={4}>
    <FormLabel>Contrat initial</FormLabel>
    <FormInput
      name="contratInitial"
      value={formik.values.contratInitial}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      invalid={formik.touched.contratInitial && !!formik.errors.contratInitial}
    />
    <FormFeedback>{formik.errors.contratInitial}</FormFeedback>
  </Col>

  {/* Contrat renouvelé */}
  <Col md={4}>
    <FormLabel>Contrat renouvelé</FormLabel>
    <FormInput
      name="contratRenouvele"
      value={formik.values.contratRenouvele}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      invalid={formik.touched.contratRenouvele && !!formik.errors.contratRenouvele}
    />
    <FormFeedback>{formik.errors.contratRenouvele}</FormFeedback>
  </Col>

  {/* CDI */}
  <Col md={4}>
    <FormLabel>Contrat à durée indéterminée</FormLabel>
    <FormInput
      name="cdi"
      value={formik.values.cdi}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      invalid={formik.touched.cdi && !!formik.errors.cdi}
    />
    <FormFeedback>{formik.errors.cdi}</FormFeedback>
  </Col>
</Row>

<Row className="mt-3">
  {/* Avenants */}
  <Col md={12}>
    <FormLabel>Avenants</FormLabel>
    <FormInput
      name="avenants"
      value={formik.values.avenants}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      invalid={formik.touched.avenants && !!formik.errors.avenants}
    />
    <FormFeedback>{formik.errors.avenants}</FormFeedback>
  </Col>
</Row>

 <div className="d-flex justify-content-between my-4">
      <Button color="secondary" onClick={prevStep}>
      <Icon icon={ArrowLeft} className="me-2" />
      </Button>
      <Button color="primary" onClick={nextStep}>
      <Icon icon={ArrowRight} className="me-2" />
      </Button>
    </div>
        </div>
}      
        {/* Ajouter les autres champs de la section 2 */}

        {/* Section 3 */}
  {step===3 && <div>

         <h4 className="mt-4">3. Évaluation</h4>

        <Row className="mt-3">
          <Col md={6}>
            <FormLabel>Période de référence (Début)</FormLabel>
            <FormInput
              type="date"
              name="periodeDebut"
              value={formik.values.periodeDebut}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              invalid={formik.touched.periodeDebut && !!formik.errors.periodeDebut}
            />
            <FormFeedback>{formik.errors.periodeDebut}</FormFeedback>
          </Col>
          <Col md={6}>
            <FormLabel>Période de référence (Fin)</FormLabel>
            <FormInput
              type="date"
              name="periodeFin"
              value={formik.values.periodeFin}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              invalid={formik.touched.periodeFin && !!formik.errors.periodeFin}
            />
            <FormFeedback>{formik.errors.periodeFin}</FormFeedback>
          </Col>
        </Row>

        {/* Objectifs */}
        <h5 className="mt-4">3.1. Rappel des objectifs</h5>
        {[0, 1, 2].map((index) => (
          <FormInput
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
          <FormInput
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
        
          <FormInput
           
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

           <div className="d-flex justify-content-between my-4">
                <Button color="secondary" onClick={prevStep}>
                <Icon icon={ArrowLeft} className="me-2" />
                </Button>
                <Button color="primary" onClick={nextStep}>
                <Icon icon={ArrowRight} className="me-2" />
                </Button>
              </div>
       </div>}      
       

        {/* Tableau d'évaluation */}
        
   {step===4 && <div>
         <h5 className="mt-4 ">3.4. Note du supérieur hiérarchique</h5>
        <Table striped bordered responsive >
  <TableHead>
    <TableRow>
      <TableHeaderCell width="30%">Critères de performances</TableHeaderCell>
      <TableHeaderCell width="40%">Détails</TableHeaderCell>
      <TableHeaderCell width="30%">Note</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {/* Compétence professionnelle */}
    <TableRow>
      <TableDataCell>Compétence professionnelle (08)</TableDataCell>
      <TableDataCell>Taux de réalisation des programmes d'activités</TableDataCell>
      <TableDataCell>
        <FormInput
          type="number"
          name="superiorNotes.competence"
          value={formik.values.superiorNotes.competence}
          onChange={formik.handleChange}
          min="0"
          max="8"
          step="0.5"
          invalid={formik.touched.superiorNotes?.competence && !!formik.errors.superiorNotes?.competence}
        />
        <FormFeedback>{formik.errors.superiorNotes?.competence}</FormFeedback>
      </TableDataCell>
    </TableRow>

    {/* Conscience professionnelle */}
    <TableRow>
      <TableDataCell rowSpan={4}>Conscience professionnelle (07)</TableDataCell>
      <TableDataCell>Ponctualité (02)</TableDataCell>
      <TableDataCell>
        <FormInput
          type="number"
          name="superiorNotes.ponctualite"
          value={formik.values.superiorNotes.ponctualite}
          onChange={formik.handleChange}
          min="0"
          max="2"
          step="0.5"
          invalid={formik.touched.superiorNotes?.ponctualite && !!formik.errors.superiorNotes?.ponctualite}
        />
        <FormFeedback>{formik.errors.superiorNotes?.ponctualite}</FormFeedback>
      </TableDataCell>
    </TableRow>
    <TableRow>
      <TableDataCell>Assiduité (02)</TableDataCell>
      <TableDataCell>
        <FormInput
          type="number"
          name="superiorNotes.assiduite"
          value={formik.values.superiorNotes.assiduite}
          onChange={formik.handleChange}
          min="0"
          max="2"
          step="0.5"
          invalid={formik.touched.superiorNotes?.assiduite && !!formik.errors.superiorNotes?.assiduite}
        />
        <FormFeedback>{formik.errors.superiorNotes?.assiduite}</FormFeedback>
      </TableDataCell>
    </TableRow>
    <TableRow>
      <TableDataCell>Éthique professionnelle (1.5)</TableDataCell>
      <TableDataCell>
        <FormInput
          type="number"
          name="superiorNotes.ethique"
          value={formik.values.superiorNotes.ethique}
          onChange={formik.handleChange}
          min="0"
          max="1.5"
          step="0.5"
          invalid={formik.touched.superiorNotes?.ethique && !!formik.errors.superiorNotes?.ethique}
        />
        <FormFeedback>{formik.errors.superiorNotes?.ethique}</FormFeedback>
      </TableDataCell>
    </TableRow>
    <TableRow>
      <TableDataCell>Sens des valeurs (1.5)</TableDataCell>
      <TableDataCell>
        <FormInput
          type="number"
          name="superiorNotes.valeurs"
          value={formik.values.superiorNotes.valeurs}
          onChange={formik.handleChange}
          min="0"
          max="1.5"
          step="0.5"
          invalid={formik.touched.superiorNotes?.valeurs && !!formik.errors.superiorNotes?.valeurs}
        />
        <FormFeedback>{formik.errors.superiorNotes?.valeurs}</FormFeedback>
      </TableDataCell>
    </TableRow>

    {/* Sens de leadership */}
    <TableRow>
      <TableDataCell rowSpan={3}>Sens de leadership (05)</TableDataCell>
      <TableDataCell>Animation d'équipe (01)</TableDataCell>
      <TableDataCell>
        <FormInput
          type="number"
          name="superiorNotes.animation"
          value={formik.values.superiorNotes.animation}
          onChange={formik.handleChange}
          min="0"
          max="1"
          step="0.5"
          invalid={formik.touched.superiorNotes?.animation && !!formik.errors.superiorNotes?.animation}
        />
        <FormFeedback>{formik.errors.superiorNotes?.animation}</FormFeedback>
      </TableDataCell>
    </TableRow>
    <TableRow>
      <TableDataCell>Aptitude à l'encadrement (02)</TableDataCell>
      <TableDataCell>
        <FormInput
          type="number"
          name="superiorNotes.encadrement"
          value={formik.values.superiorNotes.encadrement}
          onChange={formik.handleChange}
          min="0"
          max="2"
          step="0.5"
          invalid={formik.touched.superiorNotes?.encadrement && !!formik.errors.superiorNotes?.encadrement}
        />
        <FormFeedback>{formik.errors.superiorNotes?.encadrement}</FormFeedback>
      </TableDataCell>
    </TableRow>
    <TableRow>
      <TableDataCell>Capacité à évaluer (02)</TableDataCell>
      <TableDataCell>
        <FormInput
          type="number"
          name="superiorNotes.evaluation"
          value={formik.values.superiorNotes.evaluation}
          onChange={formik.handleChange}
          min="0"
          max="2"
          step="0.5"
          invalid={formik.touched.superiorNotes?.evaluation && !!formik.errors.superiorNotes?.evaluation}
        />
        <FormFeedback>{formik.errors.superiorNotes?.evaluation}</FormFeedback>
      </TableDataCell>
    </TableRow>
  </TableBody>
</Table>

        {/* Total et performance */}
        <Row className="my-3 ">
          <Col md={4}>
            <strong>Total: {totalSuperior}/20</strong>
          </Col>
          <Col md={8}>
            <strong>
              Classe de performance: {getPerformanceClass(totalSuperior)}
            </strong>
          </Col>
        </Row>
         <div className="d-flex justify-content-between my-4">
              <Button color="secondary" onClick={prevStep}>
              <Icon icon={ArrowLeft} className="me-2" />
              </Button>
              <Button color="primary" onClick={nextStep}>
              <Icon icon={ArrowRight} className="me-2" />
              </Button>
            </div>
       </div>}      

        {/* Répéter la même structure pour le comité de direction */}

   {step===5 && <div>
          <h5 className="mt-4">3.5. Note du Comitte de direction</h5>

<Table striped bordered responsive  >
  <TableHead>
    <TableRow>
      <TableHeaderCell width="30%">Critères de performances</TableHeaderCell>
      <TableHeaderCell width="40%">Détails</TableHeaderCell>
      <TableHeaderCell width="30%">Note</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {/* Compétence professionnelle */}
    <TableRow>
      <TableDataCell>Compétence professionnelle (08)</TableDataCell>
      <TableDataCell>Taux de réalisation des programmes d'activités</TableDataCell>
      <TableDataCell>
        <FormInput
          type="number"
          name="committeeNotes.competence"
          value={formik.values.committeeNotes.competence}
          onChange={formik.handleChange}
          min="0"
          max="8"
          step="0.5"
          invalid={formik.touched.committeeNotes?.competence && !!formik.errors.committeeNotes?.competence}
        />
        <FormFeedback>{formik.errors.committeeNotes?.competence}</FormFeedback>
      </TableDataCell>
    </TableRow>

    {/* Conscience professionnelle */}
    <TableRow>
      <TableDataCell rowSpan={4}>Conscience professionnelle (07)</TableDataCell>
      <TableDataCell>Ponctualité (02)</TableDataCell>
      <TableDataCell>
        <FormInput
          type="number"
          name="committeeNotes.ponctualite"
          value={formik.values.committeeNotes.ponctualite}
          onChange={formik.handleChange}
          min="0"
          max="2"
          step="0.5"
          invalid={formik.touched.committeeNotes?.ponctualite && !!formik.errors.committeeNotes?.ponctualite}
        />
        <FormFeedback>{formik.errors.committeeNotes?.ponctualite}</FormFeedback>
      </TableDataCell>
    </TableRow>
    <TableRow>
      <TableDataCell>Assiduité (02)</TableDataCell>
      <TableDataCell>
        <FormInput
          type="number"
          name="committeeNotes.assiduite"
          value={formik.values.committeeNotes.assiduite}
          onChange={formik.handleChange}
          min="0"
          max="2"
          step="0.5"
          invalid={formik.touched.committeeNotes?.assiduite && !!formik.errors.committeeNotes?.assiduite}
        />
        <FormFeedback>{formik.errors.committeeNotes?.assiduite}</FormFeedback>
      </TableDataCell>
    </TableRow>
    <TableRow>
      <TableDataCell>Éthique professionnelle (1.5)</TableDataCell>
      <TableDataCell>
        <FormInput
          type="number"
          name="committeeNotes.ethique"
          value={formik.values.committeeNotes.ethique}
          onChange={formik.handleChange}
          min="0"
          max="1.5"
          step="0.5"
          invalid={formik.touched.committeeNotes?.ethique && !!formik.errors.committeeNotes?.ethique}
        />
        <FormFeedback>{formik.errors.committeeNotes?.ethique}</FormFeedback>
      </TableDataCell>
    </TableRow>
    <TableRow>
      <TableDataCell>Sens des valeurs (1.5)</TableDataCell>
      <TableDataCell>
        <FormInput
          type="number"
          name="committeeNotes.valeurs"
          value={formik.values.committeeNotes.valeurs}
          onChange={formik.handleChange}
          min="0"
          max="1.5"
          step="0.5"
          invalid={formik.touched.committeeNotes?.valeurs && !!formik.errors.committeeNotes?.valeurs}
        />
        <FormFeedback>{formik.errors.committeeNotes?.valeurs}</FormFeedback>
      </TableDataCell>
    </TableRow>

    {/* Sens de leadership */}
    <TableRow>
      <TableDataCell rowSpan={3}>Sens de leadership (05)</TableDataCell>
      <TableDataCell>Animation d'équipe (01)</TableDataCell>
      <TableDataCell>
        <FormInput
          type="number"
          name="committeeNotes.animation"
          value={formik.values.committeeNotes.animation}
          onChange={formik.handleChange}
          min="0"
          max="1"
          step="0.5"
          invalid={formik.touched.committeeNotes?.animation && !!formik.errors.committeeNotes?.animation}
        />
        <FormFeedback>{formik.errors.committeeNotes?.animation}</FormFeedback>
      </TableDataCell>
    </TableRow>
    <TableRow>
      <TableDataCell>Aptitude à l'encadrement (02)</TableDataCell>
      <TableDataCell>
        <FormInput
          type="number"
          name="committeeNotes.encadrement"
          value={formik.values.committeeNotes.encadrement}
          onChange={formik.handleChange}
          min="0"
          max="2"
          step="0.5"
          invalid={formik.touched.committeeNotes?.encadrement && !!formik.errors.committeeNotes?.encadrement}
        />
        <FormFeedback>{formik.errors.committeeNotes?.encadrement}</FormFeedback>
      </TableDataCell>
    </TableRow>
    <TableRow>
      <TableDataCell>Capacité à évaluer (02)</TableDataCell>
      <TableDataCell>
        <FormInput
          type="number"
          name="committeeNotes.evaluation"
          value={formik.values.committeeNotes.evaluation}
          onChange={formik.handleChange}
          min="0"
          max="2"
          step="0.5"
          invalid={formik.touched.committeeNotes?.evaluation && !!formik.errors.committeeNotes?.evaluation}
        />
        <FormFeedback>{formik.errors.committeeNotes?.evaluation}</FormFeedback>
      </TableDataCell>
    </TableRow>
  </TableBody>
</Table>
<Row className="mt-3 ">
          <Col md={4}>
            <strong>Total: {totalCommittee}/20</strong>
          </Col>
          <Col md={8}>
            <strong>
              Classe de performance: {getPerformanceClass(totalCommittee)}
            </strong>
          </Col>
        </Row>

         <div className="d-flex justify-content-between my-4">
              <Button color="secondary" onClick={prevStep}>
              <Icon icon={ArrowLeft} className="me-2" />
              </Button>
          
            </div>
        </div>}       

 

     {step=== 5 &&<Button type="submit" color="primary" className="mt-4 mb-5">
          Soumettre l'évaluation
        </Button>}     
      </Form>
    </Container>
  );
};

export default FicheEvaluationComitte;