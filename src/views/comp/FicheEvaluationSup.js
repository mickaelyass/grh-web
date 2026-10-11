import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '../../ui/Button'
import { Form, FormFeedback, FormInput, FormLabel, FormSelect } from '../../ui/Form'
import { Col, Container, Row } from '../../ui/Grid'
import { Table, TableBody, TableDataCell, TableHead, TableHeaderCell, TableRow } from '../../ui/Table'
import Icon from '../../ui/Icon'
import { ArrowLeft, ArrowRight } from '../../ui/icons'

import { getEvalByID,editEvaluation } from "../../services/api";
import { useParams } from "react-router-dom";

// ---------------------------------------------------------------------------
//  Schéma de validation (react-hook-form + zod).
//  Les champs date sont des <input type="date"> (chaîne AAAA-MM-JJ) : on valide
//  la présence, pas le type JS Date. Les notes sont des nombres bornés.
// ---------------------------------------------------------------------------
const requis = 'Champ obligatoire';
const dateStr = (msg = requis) => z.string().min(1, msg).refine((v) => !Number.isNaN(Date.parse(v)), msg);

const note = (max, msgMax) =>
  z.coerce.number({ invalid_type_error: requis }).min(0, 'Note invalide').max(max, msgMax);

const noteShape = z.object({
  competence: note(8, 'Max 8 points'),
  ponctualite: note(2, 'Max 2 points'),
  assiduite: note(2, 'Max 2 points'),
  ethique: note(1.5, 'Max 1.5 points'),
  valeurs: note(1.5, 'Max 1.5 points'),
  animation: note(1, 'Max 1 point'),
  encadrement: note(2, 'Max 2 points'),
  evaluation: note(2, 'Max 2 points'),
});

const validationSchema = z.object({
  // Section 1
  nomPrenom: z.string().min(1, requis),
  dateLieuNaissance: z.string().min(1, requis),
  telephone: z.string().regex(/^[0-9]+$/, 'Numéro invalide').min(1, requis),
  email: z.string().email('Email invalide').min(1, requis),
  situationFamiliale: z.string().min(1, requis),
  situationMilitaire: z.string().min(1, requis),
  diplome: z.string().min(1, requis),
  matricule: z.string().min(1, requis),
  cnss: z.string().min(1, requis),
  adresse: z.string().min(1, requis),

  // Section 2
  datePriseService: dateStr(),
  gradeActuel: z.string().min(1, requis),
  categorie: z.string().min(1, requis),
  echelle: z.string().min(1, requis),
  echelon: z.string().min(1, requis),
  emploi: z.string().min(1, requis),
  contratInitial: z.string().min(1, requis),
  contratRenouvele: z.string().min(1, requis),
  cdi: z.string().min(1, requis),
  avenants: z.string().min(1, requis),

  // Section 3
  periodeDebut: dateStr(),
  periodeFin: dateStr(),
  objectifs: z.array(z.string()).optional(),
  resultats: z.array(z.string()).optional(),
  contraintes: z.string().min(1, requis),

  // Notes
  superiorNotes: noteShape,
  committeeNotes: noteShape,
});

const FicheEvaluationSup = () => {
  const [dossier, setDossier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  const  {id}  = useParams(); 
const [step, setStep] = useState(1);

const nextStep = () => {
  if (step < 4) setStep(step + 1);
};

const prevStep = () => {
  if (step > 1) setStep(step - 1);
};

  
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

  const buildValues = (dossier) => ({
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
  });

const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: buildValues(dossier),
    onSubmit: (values) => {
      
      console.log("Submitted values:", values);
      editEvaluation(id,values);
      // Ajouter la logique de soumission ici
      alert("bien passer");
    },
  });

  useEffect(() => {
    if (dossier) reset(buildValues(dossier));
  }, [dossier, reset]);

  const calculateTotal = (notes) => {
    return Object.values(notes).reduce((acc, val) => acc + Number(val), 0);
  };

  const getPerformanceClass = (total) => {
    if (total >= 17) return "Très bonne";
    if (total >= 14) return "Bonne";
    if (total >= 11) return "Assez bonne";
    return "Faible";
  };

  const totalSuperior = calculateTotal(watch().superiorNotes);
  const totalCommittee = calculateTotal(watch().committeeNotes);

  return (
    <Container>
          <h2 className="text-left text-primary my-4">Fiche d'Évaluation de l'Agent</h2>
    
          <Form onSubmit={handleSubmit()}>
            {/* Section 1 */}
       {step===1 &&<div>
             <h4>1. Identification de l'agent</h4>
            <Row className="mt-3">
      {/* Nom et Prénoms */}
      <Col md={6}>
        <FormLabel>Nom et Prénoms</FormLabel>
        <FormInput
          name="nomPrenom"
          {...register("nomPrenom")}
          invalid={!!errors.nomPrenom}
        />
        <FormFeedback>{errors.nomPrenom?.message}</FormFeedback>
      </Col>
    
      {/* Date et lieu de naissance */}
      <Col md={6}>
        <FormLabel>Date et lieu de naissance</FormLabel>
        <FormInput
          name="dateLieuNaissance"
          {...register("dateLieuNaissance")}
          invalid={!!errors.dateLieuNaissance}
        />
        <FormFeedback>{errors.dateLieuNaissance?.message}</FormFeedback>
      </Col>
    </Row>
    
    <Row className="mt-3">
      {/* Téléphone */}
      <Col md={6}>
        <FormLabel>Téléphone</FormLabel>
        <FormInput
          name="telephone"
          {...register("telephone")}
          invalid={!!errors.telephone}
        />
        <FormFeedback>{errors.telephone?.message}</FormFeedback>
      </Col>
    
      {/* Email */}
      <Col md={6}>
        <FormLabel>Email</FormLabel>
        <FormInput
          name="email"
          type="email"
          {...register("email")}
          invalid={!!errors.email}
        />
        <FormFeedback>{errors.email?.message}</FormFeedback>
      </Col>
    </Row>
    
    <Row className="mt-3">
      {/* Situation de famille */}
      <Col md={6}>
        <FormLabel>Situation de famille</FormLabel>
        <FormInput
          name="situationFamiliale"
          {...register("situationFamiliale")}
          invalid={!!errors.situationFamiliale}
        />
        <FormFeedback>{errors.situationFamiliale?.message}</FormFeedback>
      </Col>
    
      {/* Situation militaire */}
      <Col md={6}>
        <FormLabel>Situation militaire</FormLabel>
        <FormInput
          name="situationMilitaire"
          {...register("situationMilitaire")}
          invalid={!!errors.situationMilitaire}
        />
        <FormFeedback>{errors.situationMilitaire?.message}</FormFeedback>
      </Col>
    </Row>
    
    <Row className="mt-3">
      {/* Diplôme de recrutement */}
      <Col md={6}>
        <FormLabel>Diplôme de recrutement</FormLabel>
        <FormInput
          name="diplome"
          {...register("diplome")}
          invalid={!!errors.diplome}
        />
        <FormFeedback>{errors.diplome?.message}</FormFeedback>
      </Col>
    
      {/* Matricule */}
      <Col md={6}>
        <FormLabel>Matricule</FormLabel>
        <FormInput
          name="matricule"
          {...register("matricule")}
          invalid={!!errors.matricule}
        />
        <FormFeedback>{errors.matricule?.message}</FormFeedback>
      </Col>
    </Row>
    
    <Row className="mt-3">
      {/* N° CNSS */}
      <Col md={6}>
        <FormLabel>N° CNSS</FormLabel>
        <FormInput
          name="cnss"
          {...register("cnss")}
          invalid={!!errors.cnss}
        />
        <FormFeedback>{errors.cnss?.message}</FormFeedback>
      </Col>
    
      {/* Adresse */}
      <Col md={6}>
        <FormLabel>Adresse</FormLabel>
        <FormInput
          name="adresse"
          {...register("adresse")}
          invalid={!!errors.adresse}
        />
        <FormFeedback>{errors.adresse?.message}</FormFeedback>
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
          {...register("datePriseService")}
          invalid={!!errors.datePriseService}
        />
        <FormFeedback>{errors.datePriseService?.message}</FormFeedback>
      </Col>
    
     
    </Row>
    <Row className="mt-3">
     {/* Grade actuel */}
      <Col md={4}>
        <FormLabel>Grade actuel</FormLabel>
        <FormInput
          name="gradeActuel"
          {...register("gradeActuel")}
          invalid={!!errors.gradeActuel}
        />
        <FormFeedback>{errors.gradeActuel?.message}</FormFeedback>
      </Col>
    </Row>
    
    
    <Row className="mt-3">
       
      {/* Catégorie */}
      <Col md={4}>
        <FormLabel>Catégorie</FormLabel>
        <FormSelect
          name="categorie"
          {...register("categorie")}
          invalid={!!errors.categorie}
        >
          <option value="">Choisir...</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </FormSelect>
        <FormFeedback>{errors.categorie?.message}</FormFeedback>
      </Col>
    
      {/* Échelle */}
      <Col md={4}>
        <FormLabel>Échelle</FormLabel>
        <FormSelect
          name="echelle"
          {...register("echelle")}
          invalid={!!errors.echelle}
        >
             <option value="">Choisir...</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </FormSelect>
        <FormFeedback>{errors.echelle?.message}</FormFeedback>
      </Col>
    
      {/* Échelon */}
      <Col md={4}>
        <FormLabel>Échelon</FormLabel>
        <FormSelect
          name="echelon"
          {...register("echelon")}
          invalid={!!errors.echelon}
        >
             <option value="">Choisir...</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </FormSelect>
        <FormFeedback>{errors.echelon?.message}</FormFeedback>
      </Col>
    </Row>
    
    <Row className="mt-3">
      {/* Emploi */}
      <Col md={12}>
        <FormLabel>Emploi</FormLabel>
        <FormInput
          name="emploi"
          {...register("emploi")}
          invalid={!!errors.emploi}
        />
        <FormFeedback>{errors.emploi?.message}</FormFeedback>
      </Col>
    </Row>
    <h5 className="my-2">Référence des actes de carrière</h5>
    
    <Row className="mt-3">
      {/* Contrat initial */}
      <Col md={4}>
        <FormLabel>Contrat initial</FormLabel>
        <FormInput
          name="contratInitial"
          {...register("contratInitial")}
          invalid={!!errors.contratInitial}
        />
        <FormFeedback>{errors.contratInitial?.message}</FormFeedback>
      </Col>
    
      {/* Contrat renouvelé */}
      <Col md={4}>
        <FormLabel>Contrat renouvelé</FormLabel>
        <FormInput
          name="contratRenouvele"
          {...register("contratRenouvele")}
          invalid={!!errors.contratRenouvele}
        />
        <FormFeedback>{errors.contratRenouvele?.message}</FormFeedback>
      </Col>
    
      {/* CDI */}
      <Col md={4}>
        <FormLabel>Contrat à durée indéterminée</FormLabel>
        <FormInput
          name="cdi"
          {...register("cdi")}
          invalid={!!errors.cdi}
        />
        <FormFeedback>{errors.cdi?.message}</FormFeedback>
      </Col>
    </Row>
    
    <Row className="mt-3">
      {/* Avenants */}
      <Col md={12}>
        <FormLabel>Avenants</FormLabel>
        <FormInput
          name="avenants"
          {...register("avenants")}
          invalid={!!errors.avenants}
        />
        <FormFeedback>{errors.avenants?.message}</FormFeedback>
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
                  {...register("periodeDebut")}
                  invalid={!!errors.periodeDebut}
                />
                <FormFeedback>{errors.periodeDebut?.message}</FormFeedback>
              </Col>
              <Col md={6}>
                <FormLabel>Période de référence (Fin)</FormLabel>
                <FormInput
                  type="date"
                  name="periodeFin"
                  {...register("periodeFin")}
                  invalid={!!errors.periodeFin}
                />
                <FormFeedback>{errors.periodeFin?.message}</FormFeedback>
              </Col>
            </Row>
    
            {/* Objectifs */}
            <h5 className="mt-4">3.1. Rappel des objectifs</h5>
            {[0, 1, 2].map((index) => (
              <FormInput
                key={index}
                className="mb-2"
                name={`objectifs[${index}]`}
                {...register(`objectifs[${index}]`)}
                invalid={!!errors.objectifs?.[index]}
              />
            ))}
    
            {/* Résultats */}
            <h5 className="mt-4">3.2. Résultats obtenus</h5>
            {[0, 1, 2].map((index) => (
              <FormInput
                key={index}
                className="mb-2"
                name={`resultats[${index}]`}
                {...register(`resultats[${index}]`)}
                invalid={!!errors.resultats?.[index]}
              />
            ))}
    
              {/* Contraintes */}
              <h5 className="mt-4">3.3. Contraintes et difficultés</h5>
            
              <FormInput
               
                className="mb-2"
                name='contraintes'
                {...register("contraintes")}
                invalid={!!errors.contraintes}
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
              {...register("superiorNotes.competence")}
              min="0"
              max="8"
              step="0.5"
              invalid={!!errors.superiorNotes?.competence}
            />
            <FormFeedback>{errors.superiorNotes?.competence?.message}</FormFeedback>
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
              {...register("superiorNotes.ponctualite")}
              min="0"
              max="2"
              step="0.5"
              invalid={!!errors.superiorNotes?.ponctualite}
            />
            <FormFeedback>{errors.superiorNotes?.ponctualite?.message}</FormFeedback>
          </TableDataCell>
        </TableRow>
        <TableRow>
          <TableDataCell>Assiduité (02)</TableDataCell>
          <TableDataCell>
            <FormInput
              type="number"
              name="superiorNotes.assiduite"
              {...register("superiorNotes.assiduite")}
              min="0"
              max="2"
              step="0.5"
              invalid={!!errors.superiorNotes?.assiduite}
            />
            <FormFeedback>{errors.superiorNotes?.assiduite?.message}</FormFeedback>
          </TableDataCell>
        </TableRow>
        <TableRow>
          <TableDataCell>Éthique professionnelle (1.5)</TableDataCell>
          <TableDataCell>
            <FormInput
              type="number"
              name="superiorNotes.ethique"
              {...register("superiorNotes.ethique")}
              min="0"
              max="1.5"
              step="0.5"
              invalid={!!errors.superiorNotes?.ethique}
            />
            <FormFeedback>{errors.superiorNotes?.ethique?.message}</FormFeedback>
          </TableDataCell>
        </TableRow>
        <TableRow>
          <TableDataCell>Sens des valeurs (1.5)</TableDataCell>
          <TableDataCell>
            <FormInput
              type="number"
              name="superiorNotes.valeurs"
              {...register("superiorNotes.valeurs")}
              min="0"
              max="1.5"
              step="0.5"
              invalid={!!errors.superiorNotes?.valeurs}
            />
            <FormFeedback>{errors.superiorNotes?.valeurs?.message}</FormFeedback>
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
              {...register("superiorNotes.animation")}
              min="0"
              max="1"
              step="0.5"
              invalid={!!errors.superiorNotes?.animation}
            />
            <FormFeedback>{errors.superiorNotes?.animation?.message}</FormFeedback>
          </TableDataCell>
        </TableRow>
        <TableRow>
          <TableDataCell>Aptitude à l'encadrement (02)</TableDataCell>
          <TableDataCell>
            <FormInput
              type="number"
              name="superiorNotes.encadrement"
              {...register("superiorNotes.encadrement")}
              min="0"
              max="2"
              step="0.5"
              invalid={!!errors.superiorNotes?.encadrement}
            />
            <FormFeedback>{errors.superiorNotes?.encadrement?.message}</FormFeedback>
          </TableDataCell>
        </TableRow>
        <TableRow>
          <TableDataCell>Capacité à évaluer (02)</TableDataCell>
          <TableDataCell>
            <FormInput
              type="number"
              name="superiorNotes.evaluation"
              {...register("superiorNotes.evaluation")}
              min="0"
              max="2"
              step="0.5"
              invalid={!!errors.superiorNotes?.evaluation}
            />
            <FormFeedback>{errors.superiorNotes?.evaluation?.message}</FormFeedback>
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

    
     
    
         {step=== 4 &&<Button type="submit" color="primary" className="mt-4 mb-5">
              Soumettre l'évaluation
            </Button>}     
          </Form>
        </Container>
  );
};

export default FicheEvaluationSup;