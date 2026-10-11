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

import { getDoc, createEvaluation } from '../../services/api';

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

  const buildValues = (dossier) => ({
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
  });

const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: buildValues(dossier),
    onSubmit: (values) => {
      console.log("Submitted values:", values);
      createEvaluation(values);
      alert( "bien");
      // Ajouter la logique de soumission ici
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
    {step === 1 && (
  <div>
    <h4 className="mb-4">1. Identification de l'agent</h4>

    {/* État civil */}
    <h6 className="text-primary mb-3">État civil</h6>
    <Row className="mb-3">
      <Col md={6}>
        <FormLabel>Nom et Prénoms</FormLabel>
        <FormInput
          name="nomPrenom"
          {...register("nomPrenom")}
          invalid={!!errors.nomPrenom}
        />
        <FormFeedback>{errors.nomPrenom?.message}</FormFeedback>
      </Col>

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

    {/* Coordonnées */}
    <h6 className="text-primary mb-3">Coordonnées</h6>
    <Row className="mb-3">
      <Col md={6}>
        <FormLabel>Téléphone</FormLabel>
        <FormInput
          name="telephone"
          {...register("telephone")}
          invalid={!!errors.telephone}
        />
        <FormFeedback>{errors.telephone?.message}</FormFeedback>
      </Col>

      <Col md={6}>
        <FormLabel>Email</FormLabel>
        <FormInput
          type="email"
          name="email"
          {...register("email")}
          invalid={!!errors.email}
        />
        <FormFeedback>{errors.email?.message}</FormFeedback>
      </Col>
    </Row>

    {/* Situation personnelle */}
    <h6 className="text-primary mb-3">Situation personnelle</h6>
    <Row className="mb-3">
      <Col md={6}>
        <FormLabel>Situation de famille</FormLabel>
        <FormInput
          name="situationFamiliale"
          {...register("situationFamiliale")}
          invalid={!!errors.situationFamiliale}
        />
        <FormFeedback>{errors.situationFamiliale?.message}</FormFeedback>
      </Col>

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

    {/* Informations administratives */}
    <h6 className="text-primary mb-3">Informations administratives</h6>
    <Row className="mb-3">
      <Col md={6}>
        <FormLabel>Diplôme de recrutement</FormLabel>
        <FormInput
          name="diplome"
          {...register("diplome")}
          invalid={!!errors.diplome}
        />
        <FormFeedback>{errors.diplome?.message}</FormFeedback>
      </Col>

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

    <Row className="mb-4">
      <Col md={6}>
        <FormLabel>N° CNSS</FormLabel>
        <FormInput
          name="cnss"
          {...register("cnss")}
          invalid={!!errors.cnss}
        />
        <FormFeedback>{errors.cnss?.message}</FormFeedback>
      </Col>

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

    {/* Navigation */}
    <div className="d-flex justify-content-end my-4">
      <Button color="primary" onClick={nextStep}>
        <Icon icon={ArrowRight} className="me-2" />
      </Button>
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
    <Row className="mb-3">
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

    {/* Grade et classification */}
    <h6 className="text-primary mb-3">Grade et classification</h6>
    <Row className="mb-3">
      <Col md={4}>
        <FormLabel>Grade actuel</FormLabel>
        <FormInput
          name="gradeActuel"
          {...register("gradeActuel")}
          invalid={!!errors.gradeActuel}
        />
        <FormFeedback>{errors.gradeActuel?.message}</FormFeedback>
      </Col>

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

      <Col md={2}>
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

      <Col md={2}>
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

    {/* Emploi */}
    <h6 className="text-primary mb-3">Emploi</h6>
    <Row className="mb-3">
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

    {/* Références des actes */}
    <h6 className="text-primary mb-3">Références des actes de carrière</h6>
    <Row className="mb-3">
      <Col md={4}>
        <FormLabel>Contrat initial</FormLabel>
        <FormInput
          name="contratInitial"
          {...register("contratInitial")}
          invalid={!!errors.contratInitial}
        />
        <FormFeedback>{errors.contratInitial?.message}</FormFeedback>
      </Col>

      <Col md={4}>
        <FormLabel>Contrat renouvelé</FormLabel>
        <FormInput
          name="contratRenouvele"
          {...register("contratRenouvele")}
          invalid={!!errors.contratRenouvele}
        />
        <FormFeedback>{errors.contratRenouvele?.message}</FormFeedback>
      </Col>

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

    <Row className="mb-4">
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

    {/* Navigation */}
    <div className="d-flex justify-content-between my-4">
      <Button color="secondary" onClick={prevStep}>
      <Icon icon={ArrowLeft} className="me-2" />
      </Button>
      <Button color="primary" onClick={nextStep}>
      <Icon icon={ArrowRight} className="me-2" />
      </Button>
    </div>
  </div>
)}

        {/* Ajouter les autres champs de la section 2 */}

        {/* Section 3 */}
   {step === 3 && <div>
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

        {/* Tableau d'évaluation */}
        <h5 className="mt-4 d-none">3.4. Note du supérieur hiérarchique</h5>
        <Table striped bordered responsive className="d-none">
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
        <Row className="my-3 d-none">
          <Col md={4}>
            <strong>Total: {totalSuperior}/20</strong>
          </Col>
          <Col md={8}>
            <strong>
              Classe de performance: {getPerformanceClass(totalSuperior)}
            </strong>
          </Col>
        </Row>

        {/* Répéter la même structure pour le comité de direction */}

        <Table striped bordered responsive className="d-none">
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
          {...register("committeeNotes.competence")}
          min="0"
          max="8"
          step="0.5"
          invalid={!!errors.committeeNotes?.competence}
        />
        <FormFeedback>{errors.committeeNotes?.competence?.message}</FormFeedback>
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
          {...register("committeeNotes.ponctualite")}
          min="0"
          max="2"
          step="0.5"
          invalid={!!errors.committeeNotes?.ponctualite}
        />
        <FormFeedback>{errors.committeeNotes?.ponctualite?.message}</FormFeedback>
      </TableDataCell>
    </TableRow>
    <TableRow>
      <TableDataCell>Assiduité (02)</TableDataCell>
      <TableDataCell>
        <FormInput
          type="number"
          name="committeeNotes.assiduite"
          {...register("committeeNotes.assiduite")}
          min="0"
          max="2"
          step="0.5"
          invalid={!!errors.committeeNotes?.assiduite}
        />
        <FormFeedback>{errors.committeeNotes?.assiduite?.message}</FormFeedback>
      </TableDataCell>
    </TableRow>
    <TableRow>
      <TableDataCell>Éthique professionnelle (1.5)</TableDataCell>
      <TableDataCell>
        <FormInput
          type="number"
          name="committeeNotes.ethique"
          {...register("committeeNotes.ethique")}
          min="0"
          max="1.5"
          step="0.5"
          invalid={!!errors.committeeNotes?.ethique}
        />
        <FormFeedback>{errors.committeeNotes?.ethique?.message}</FormFeedback>
      </TableDataCell>
    </TableRow>
    <TableRow>
      <TableDataCell>Sens des valeurs (1.5)</TableDataCell>
      <TableDataCell>
        <FormInput
          type="number"
          name="committeeNotes.valeurs"
          {...register("committeeNotes.valeurs")}
          min="0"
          max="1.5"
          step="0.5"
          invalid={!!errors.committeeNotes?.valeurs}
        />
        <FormFeedback>{errors.committeeNotes?.valeurs?.message}</FormFeedback>
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
          {...register("committeeNotes.animation")}
          min="0"
          max="1"
          step="0.5"
          invalid={!!errors.committeeNotes?.animation}
        />
        <FormFeedback>{errors.committeeNotes?.animation?.message}</FormFeedback>
      </TableDataCell>
    </TableRow>
    <TableRow>
      <TableDataCell>Aptitude à l'encadrement (02)</TableDataCell>
      <TableDataCell>
        <FormInput
          type="number"
          name="committeeNotes.encadrement"
          {...register("committeeNotes.encadrement")}
          min="0"
          max="2"
          step="0.5"
          invalid={!!errors.committeeNotes?.encadrement}
        />
        <FormFeedback>{errors.committeeNotes?.encadrement?.message}</FormFeedback>
      </TableDataCell>
    </TableRow>
    <TableRow>
      <TableDataCell>Capacité à évaluer (02)</TableDataCell>
      <TableDataCell>
        <FormInput
          type="number"
          name="committeeNotes.evaluation"
          {...register("committeeNotes.evaluation")}
          min="0"
          max="2"
          step="0.5"
          invalid={!!errors.committeeNotes?.evaluation}
        />
        <FormFeedback>{errors.committeeNotes?.evaluation?.message}</FormFeedback>
      </TableDataCell>
    </TableRow>
  </TableBody>
</Table>
<Row className="mt-3 d-none">
          <Col md={4}>
            <strong>Total: {totalCommittee}/20</strong>
          </Col>
          <Col md={8}>
            <strong>
              Classe de performance: {getPerformanceClass(totalCommittee)}
            </strong>
          </Col>
        </Row>
        <Button color="secondary" className="me-2 mt-3" onClick={prevStep}>
          <Icon icon={ArrowLeft} className="me-2" />
          </Button>
       </div>}     

       {step===3 &&<Button type="submit" color="primary" className="mt-4 mb-5">
          Soumettre l'évaluation
        </Button> } 
      </Form>
    </Container>
  );
};

export default FicheEvaluation;