import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const DossierForm = ({ dossier, onSubmit }) => {
  const initialValues = { 
    matricule: '',
    infoIdent: {
      cnss: '',
      nom: '',
      prenom: '',
      nom_du_conjoint: '',
      sexe: '',
      dat_nat: '',
      lieu_nat: '',
      situat_matri: '',
      email: '',
      dat_mariage: null,
      nbre_enfants: 0
    },
    infoPro: {
      statut: '',
      corps: '',
      categorie: '',
      branche_du_personnel: '',
      fonctions: '',
      ref_nomination: '',
      dat_prise_fonction: null,
      responsabilite_partiuliere: '',
      grade_paye: '',
      indice_paye: 0,
      dat_first_prise_de_service: null,
      dat_de_depart_retraite: null,
      dat_de_prise_service_dans_departement: null,
      ref_acte_de_prise_service_poste_actuel: '',
      poste_actuel_service: '',
      type_structure: '',
      zone_sanitaire: '',
      poste_specifique: '',
      etat_depart: '',
      poste_anterieurs: '',
      autres_diplome: ''
    },
    infoBank: {
      rib: '',
      mtn: '',
      celtics: '',
      libercom: ''
      
    },
    infoComplementaire: {
      observation_particuliere: '',
      distinction: '',
      ref_distinction: '',
      detail_distinction: '',
      situat_sante: '',
      saction_punitive: '',
      nature_sanction: ''
    }
  } ;

  const validationSchema = Yup.object({
    matricule: Yup.string().required('Matricule is required'),
    infoIdent: Yup.object({
      cnss: Yup.string().required('CNSS is required'),
      nom: Yup.string().required('Nom is required'),
      prenom: Yup.string().required('Prenom is required'),
      sexe: Yup.string().oneOf(['F', 'M'], 'Sélectionnez F ou M').required('Champ requis'),
      dat_nat: Yup.date().required('Date de naissance is required'),
      lieu_nat: Yup.string().required('Lieu de naissance is required'),
      situat_matri: Yup.string().required('Situation Matrimoniale is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      dat_mariage: Yup.date().when('situat_matri', {
        is: (val) => val !== 'Célibataire',
        then: () => Yup.date().required('Date de Mariage is required'),
        otherwise: () => Yup.date().nullable().notRequired(),
      }),

    
     nbre_enfants: Yup.number()
    }),
    infoPro: Yup.object({
      statut: Yup.string().required('Statut is required'),
      corps: Yup.string().required('Corps is required'),
      categorie: Yup.string().required('Catégorie required'),
      branche_du_personnel: Yup.string(),
      fonctions: Yup.string().required('Fonctions is required'),
      ref_nomination: Yup.string(),
      dat_prise_fonction: Yup.date().nonNullable().notRequired(),
      responsabilite_partiuliere: Yup.string(),
      grade_paye: Yup.string().required('Grade payé is required'),
      indice_paye: Yup.number().required('Indice payé is required').min(0, 'Indice payé must be 0 or more'),
      dat_first_prise_de_service: Yup.date().required("Date required"),
      dat_de_depart_retraite: Yup.date().nonNullable().notRequired(),
      dat_de_prise_service_dans_departement: Yup.date().nonNullable().notRequired(),
      ref_acte_de_prise_service_poste_actuel: Yup.string(),
      poste_actuel_service: Yup.string().required('Poste actuel service is required'),
      type_structure: Yup.string(),
      zone_sanitaire: Yup.string().required('Zone sanitaire is required'),
      poste_specifique: Yup.string(),
      etat_depart: Yup.number(),
      poste_anterieurs: Yup.string(),
      autres_diplome: Yup.string()
    }),
    infoBank: Yup.object({
      rib: Yup.string().required('RIB is required'),
      mtn: Yup.string(),
      celtics: Yup.string(),
      libercom: Yup.string(),  
      
    }),
    infoComplementaire: Yup.object({
      observation_particuliere: Yup.string(),
      distinction: Yup.string(),
      ref_distinction: Yup.string(),
      detail_distinction: Yup.string(),
      situat_sante: Yup.string(),
      saction_punitive: Yup.string(),
      nature_sanction: Yup.string() 
    })
  });

  const handleSubmit = (values,{setSubmitting}) => {
    onSubmit(values);
    setSubmitting(false);

  };

  return (
    <Formik
      initialValues={dossier || initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
       {({ values, setFieldValue }) => {

const acceptedMonths = [0, 3, 6, 9]; // Mois acceptés: janvier, avril, juillet, octobre

const adjustToNearestAcceptedMonth = (date) => {
  const month = date.getMonth();
  
  // Vérifier si le mois est déjà accepté
  if (acceptedMonths.includes(month)) {
    return date;
  }

  // Trouver le mois accepté le plus proche
  let nearestMonth = acceptedMonths.reduce((prev, curr) => {
    return (Math.abs(curr - month) < Math.abs(prev - month) ? curr : prev);
  });

  // Ajuster la date au mois accepté le plus proche
  date.setMonth(nearestMonth);
  return date;
};


        // Fonction pour gérer les changements de date
        const handleDateChange = (event) => {
          const { name,value } = event.target;
          setFieldValue(name, value);

          // Vérifier si la date de naissance a été modifiée
    if (name === 'infoIdent.dat_nat'  && value) {
      const birthDate = new Date(value);
      let retirementAge;

      // Déterminer l'âge de la retraite en fonction de la catégorie
      switch (values.infoPro.categorie) {
        case 'A1':
        case 'A2':
        case 'A3':
          retirementAge = 60;
          break;
        case 'B1':
        case 'B2':
        case 'B3':
          retirementAge = 58;
          break;
        case 'C1':
        case 'C2':
        case 'C3':
        case 'D1':
        case 'D2':
        case 'D3':
          retirementAge = 55;
          break;
        default:
          retirementAge = 60; // Valeur par défaut si la catégorie n'est pas spécifiée
          break;
      }

      // Calculer la date de départ à la retraite
      let retirementDate = new Date(birthDate.setFullYear(birthDate.getFullYear() + retirementAge));
    retirementDate = adjustToNearestAcceptedMonth(retirementDate);

    setFieldValue('infoPro.dat_de_depart_retraite', retirementDate.toISOString().split('T')[0]);
          }
        };


        const handleCatChange = (event) => {
          const { name,value } = event.target;
          setFieldValue(name, value);

          // Vérifier si la date de naissance a été modifiée
    if (name === 'infoPro.categorie'  && value) {
      const birthDate = new Date(values.infoIdent.dat_nat);
      let retirementAge;

      // Déterminer l'âge de la retraite en fonction de la catégorie
      switch (values.infoPro.categorie) {
        case 'A1':
        case 'A2':
        case 'A3':
          retirementAge = 60;
          break;
        case 'B1':
        case 'B2':
        case 'B3':
          retirementAge = 58;
          break;
        case 'C1':
        case 'C2':
        case 'C3':
        case 'D1':
        case 'D2':
        case 'D3':
          retirementAge = 55;
          break;
        default:
          retirementAge = 60; // Valeur par défaut si la catégorie n'est pas spécifiée
          break;
      }

      // Calculer la date de départ à la retraite
      let retirementDate = new Date(birthDate.setFullYear(birthDate.getFullYear() + retirementAge));
      retirementDate = adjustToNearestAcceptedMonth(retirementDate);
  
      setFieldValue('infoPro.dat_de_depart_retraite', retirementDate.toISOString().split('T')[0]);
          }
        };

        return (
      <Form>
        <div className="form-group">
          <label htmlFor="matricule">Matricule</label>
          <Field name="matricule" type="text" className="form-control" />
          <ErrorMessage name="matricule" component="div" className="text-danger" />
        </div>
        
        {/* InfoIdent fields */}
        <h3 className='my-3'>Information  d'Identification</h3>
        <div className="form-group">
          <label htmlFor="infoIdent.cnss">CNSS</label>
          <Field name="infoIdent.cnss" type="text" className="form-control" />
          <ErrorMessage name="infoIdent.cnss" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoIdent.nom">Nom</label>
          <Field name="infoIdent.nom" type="text" className="form-control" />
          <ErrorMessage name="infoIdent.nom" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoIdent.prenom">Prénom</label>
          <Field name="infoIdent.prenom" type="text" className="form-control" />
          <ErrorMessage name="infoIdent.prenom" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoIdent.nom_du_conjoint">Nom  et prenom du Conjoint</label>
          <Field name="infoIdent.nom_du_conjoint" type="text" className="form-control" />
          <ErrorMessage name="infoIdent.nom_du_conjoint" component="div" className="text-danger" />
        </div>
        <div className="form-group">
              <label htmlFor="infoIdent.sexe">Sexe</label>
              <Field as="select" name="infoIdent.sexe" className="form-control">
                <option value="" label="Sélectionnez" />
                <option value="F" label="Femme" />
                <option value="M" label="Homme" />
              </Field>
              <ErrorMessage name="infoIdent.sexe" component="div" className="text-danger" />
            </div>
        <div className="form-group">
          <label htmlFor="infoIdent.dat_nat">Date de Naissance</label>
          <Field name="infoIdent.dat_nat" type="date" className="form-control" onChange={handleDateChange}/>
          <ErrorMessage name="infoIdent.dat_nat" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoIdent.lieu_nat">Lieu de Naissance</label>
          <Field name="infoIdent.lieu_nat" type="text" className="form-control" />
          <ErrorMessage name="infoIdent.lieu_nat" component="div" className="text-danger" />
        </div>
        <div className="form-group">
              <label htmlFor="infoIdent.situat_matri">Situation Matrimoniale</label>
              <Field as="select" name="infoIdent.situat_matri" className="form-control">
                <option value="">Sélectionnez</option>
                <option value="Célibataire">Célibataire</option>
                <option value="Marié">Marié</option>
                <option value="Divorcé">Divorcé</option>
                <option value="Veuf">Veuf</option>
              </Field>
              <ErrorMessage name="infoIdent.situat_matri" component="div" className="text-danger" />
            </div>
        <div className="form-group">
          <label htmlFor="infoIdent.email">Email</label>
          <Field name="infoIdent.email" type="email" className="form-control" />
          <ErrorMessage name="infoIdent.email" component="div" className="text-danger" />
        </div>

        <div className="form-group">
          <label htmlFor="infoIdent.dat_mariage">Date de Mariage</label>
          <Field name="infoIdent.dat_mariage" type="date" disabled={values.situat_matri === 'Célibataire'}
           className="form-control" />
          <ErrorMessage name="infoIdent.dat_mariage" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoIdent.nbre_enfants">Nombre d'Enfants</label>
          <Field name="infoIdent.nbre_enfants" type="number" className="form-control" />
          <ErrorMessage name="infoIdent.nbre_enfants" component="div" className="text-danger" />
        </div>
        
        {/* InfoPro fields */}
        <h3 className='my-3'>Info Professionnelles</h3>
        <div className="form-group">
          <label htmlFor="infoPro.statut">Statut</label>
          <Field name="infoPro.statut" type="text" className="form-control" />
          <ErrorMessage name="infoPro.statut" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoPro.corps">Corps</label>
          <Field name="infoPro.corps" type="text" className="form-control" />
          <ErrorMessage name="infoPro.corps" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoPro.categorie">Categorie</label>
          <Field as ="select" name="infoPro.categorie" type="text" className="form-control" onChange={handleCatChange}>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="A3">A3</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option> 
                <option value="B3">B3</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
                <option value="C3">C3</option>
                <option value="D1">D1</option>
                <option value="D2">D2</option>
                <option value="D3">D3</option>
                
            </Field>
          <ErrorMessage name="infoPro.categorie" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoPro.branche_du_personnel">Branche du Personnel</label>
          <Field name="infoPro.branche_du_personnel" type="text" className="form-control" />
          <ErrorMessage name="infoPro.branche_du_personnel" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoPro.fonctions">Fonctions</label>
          <Field name="infoPro.fonctions" type="text" className="form-control" />
          <ErrorMessage name="infoPro.fonctions" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoPro.ref_nomination">Réf. Nomination</label>
          <Field name="infoPro.ref_nomination" type="text" className="form-control" />
          <ErrorMessage name="infoPro.ref_nomination" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoPro.dat_prise_fonction">Date de Prise de Fonction</label>
          <Field name="infoPro.dat_prise_fonction" type="date" className="form-control" />
          <ErrorMessage name="infoPro.dat_prise_fonction" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoPro.responsabilite_partiuliere">Responsabilité Particulière</label>
          <Field name="infoPro.responsabilite_partiuliere" type="text" className="form-control" />
          <ErrorMessage name="infoPro.responsabilite_partiuliere" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoPro.grade_paye">Grade Payé</label>
          <Field name="infoPro.grade_paye" type="text" className="form-control" />
          <ErrorMessage name="infoPro.grade_paye" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoPro.indice_paye">Indice Payé</label>
          <Field name="infoPro.indice_paye" type="number" className="form-control" />
          <ErrorMessage name="infoPro.indice_paye" component="div" className="text-danger" />
        </div>
        <div className="form-group">
              <label htmlFor="infoPro.dat_first_prise_de_service">Date de Première Prise de Service</label>
              <Field name="infoPro.dat_first_prise_de_service" type="date" className="form-control" onChange={handleDateChange} />
              <ErrorMessage name="infoPro.dat_first_prise_de_service" component="div" className="text-danger" />
            </div>
            <div className="form-group">
              <label htmlFor="infoPro.dat_de_depart_retraite">Date de Départ à la Retraite</label>
              <Field name="infoPro.dat_de_depart_retraite" type="date" className="form-control" />
              <ErrorMessage name="infoPro.dat_de_depart_retraite" component="div" className="text-danger" />
            </div>
        <div className="form-group">
          <label htmlFor="infoPro.dat_de_prise_service_dans_departement">Date de Prise de Service dans Département</label>
          <Field name="infoPro.dat_de_prise_service_dans_departement" type="date" className="form-control" />
          <ErrorMessage name="infoPro.dat_de_prise_service_dans_departement" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoPro.ref_acte_de_prise_service_poste_actuel">Réf. Acte de Prise de Service Poste Actuel</label>
          <Field name="infoPro.ref_acte_de_prise_service_poste_actuel" type="text" className="form-control" />
          <ErrorMessage name="infoPro.ref_acte_de_prise_service_poste_actuel" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoPro.poste_actuel_service">Poste Actuel Service</label>
          <Field name="infoPro.poste_actuel_service" type="text" className="form-control" >
          </Field>
          <ErrorMessage name="infoPro.poste_actuel_service" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoPro.type_structure">Type Structure</label>
          <Field name="infoPro.type_structure" type="text" className="form-control" />
          <ErrorMessage name="infoPro.type_structure" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoPro.zone_sanitaire">Zone Sanitaire</label>
          <Field name="infoPro.zone_sanitaire" type="text" className="form-control" />
          <ErrorMessage name="infoPro.zone_sanitaire" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoPro.poste_specifique">Poste Spécifique</label>
          <Field name="infoPro.poste_specifique" type="text" className="form-control" />
          <ErrorMessage name="infoPro.poste_specifique" component="div" className="text-danger" />
        </div>
       {/*  <div className="form-group">
          <label htmlFor="infoPro.etat_depart">État</label>
          <Field  as ='select'name="infoPro.etat_depart" type="text" className="form-control" >
                <option value="Actif">Actif</option>
                <option value="Muté">Muté</option>
                <option value="Détachement">Détachement</option>
                <option value="Mise en disponibilité">Mise en disponibilité</option>
                <option value="Mise à disposition">Mise à disposition</option>
                <option value="Abandon/demission">Abandon/demission</option>
                <option value="Agent en formation">Agent en formation</option>
                <option value="Retraite">Retraite</option>
                <option value="Décédé">Décédé</option>
          </Field>
          <ErrorMessage name="infoPro.etat_depart" component="div" className="text-danger" />
        </div> */}
        <div className="form-group">
          <label htmlFor="infoPro.poste_anterieurs">Poste Antérieurs</label>
          <Field name="infoPro.poste_anterieurs" type="text" className="form-control" />
          <ErrorMessage name="infoPro.poste_anterieurs" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoPro.autres_diplome">Autres Diplômes</label>
          <Field name="infoPro.autres_diplome" type="text" className="form-control" />
          <ErrorMessage name="infoPro.autres_diplome" component="div" className="text-danger" />
        </div>
        
        {/* InfoBank fields */}
        <h3 className='my-3'>Info Bank</h3>
        <div className="form-group">
          <label htmlFor="infoBank.rib">RIB</label>
          <Field name="infoBank.rib" type="text" className="form-control" />
          <ErrorMessage name="infoBank.rib" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoBank.mtn">MTN</label>
          <Field name="infoBank.mtn" type="text" className="form-control" />
          <ErrorMessage name="infoBank.mtn" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoBank.celtics">Celtics</label>
          <Field name="infoBank.celtics" type="text" className="form-control" />
          <ErrorMessage name="infoBank.celtics" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoBank.libercom">Libercom</label>
          <Field name="infoBank.libercom" type="text" className="form-control" />
          <ErrorMessage name="infoBank.libercom" component="div" className="text-danger" />
        </div>
        
        
        {/* InfoComplementaire fields */}
        <h3 className='my-3'>Info Complementaire</h3>
        <div className="form-group">
          <label htmlFor="infoComplementaire.observation_particuliere">Observation Particuliere</label>
          <Field name="infoComplementaire.observation_particuliere" type="text" className="form-control" />
          <ErrorMessage name="infoComplementaire.observation_particuliere" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoComplementaire.distinction">Distinction</label>
          <Field name="infoComplementaire.distinction" type="text" className="form-control" />
          <ErrorMessage name="infoComplementaire.distinction" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoComplementaire.ref_distinction">Réf. Distinction</label>
          <Field name="infoComplementaire.ref_distinction" type="text" className="form-control" />
          <ErrorMessage name="infoComplementaire.ref_distinction" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoComplementaire.detail_distinction">Détail Distinction</label>
          <Field name="infoComplementaire.detail_distinction" type="text" className="form-control" />
          <ErrorMessage name="infoComplementaire.detail_distinction" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoComplementaire.situat_sante">Situation de Santé</label>
          <Field name="infoComplementaire.situat_sante" type="text" className="form-control" />
          <ErrorMessage name="infoComplementaire.situat_sante" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoComplementaire.saction_punitive">Sanction Punitive</label>
          <Field name="infoComplementaire.saction_punitive" type="text" className="form-control" />
          <ErrorMessage name="infoComplementaire.saction_punitive" component="div" className="text-danger" />
        </div>
        <div className="form-group">
          <label htmlFor="infoComplementaire.nature_sanction">Nature Sanction</label>
          <Field name="infoComplementaire.nature_sanction" type="text" className="form-control" />
          <ErrorMessage name="infoComplementaire.nature_sanction" component="div" className="text-danger" />
        </div>
        
        <button type="submit" className="btn btn-primary mt-3">Submit</button>
      </Form>
  );
}}
    </Formik>
  );


};

export default DossierForm;
