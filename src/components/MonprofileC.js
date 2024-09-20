import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getDoc } from "../services/api"; // Assurez-vous que cette fonction est correctement définie dans votre service API
import { Link } from "react-router-dom";
import Footer from "./Footer";
import ImageUploadForm from "./ImageUploadForm";
import ImageProfileEmploye from "./ImageProfileEmploye";
import MenuUserC from './MenuUserC';
import Head from './Head';
import './Dasbord.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const MonprofileC = () => {

  const [dossier, setDossier] = useState(null); // Initialiser à null
  const location = useLocation();
  const { matricule } = location.state || {}; // Assurez-vous que matricule est passé via location.state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (matricule) {
      fetchDossier();
    }
  }); // Ajouter matricule comme dépendance

  const fetchDossier = async () => {
    try {
      const response = await getDoc(matricule);
      setDossier(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const exportToPDF = async () => {
    const input = document.getElementById('profile-content');
    if (input) {
      const canvas = await html2canvas(input, {
        scale: 2, // Augmente la résolution
        useCORS: true, // Permet le chargement des images
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
  
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 295; // A4 height in mm
  
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 295; // A4 height in mm
      }
  
      pdf.save('profile.pdf');
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    //return <div className="text-center mt-5 text-danger">Error: {error}</div>;
    return <div className="text-center mt-5">Aucun dossier n'est assossier à ce matricule.Veuillez contactez le responsable Ressource Humaine </div>;
  }

  if (!dossier) {
    return <div className="text-center mt-5">No dossier found.</div>;
  }
  
  

  return (
    
    <div className="dashboard">
      <Head toggleMenu={toggleMenu} />
      <MenuUserC isMenuOpen={isMenuOpen} />
      <main className={`content ${isMenuOpen ? 'content-expanded slide-enter' : 'content-collapsed'}`}>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-4">
            {/* Utilisation du composant ImageProfileEmploye */}
           
            <ImageProfileEmploye matricule={dossier.Utilisateur.matricule} />
            <ImageUploadForm matricule={dossier.Utilisateur.matricule}/>

          </div>
          <div className="col-md-8" >
            <div className="card shadow"id="profile-content">
              <div className="card-header bg-clair text-white">
                <h2 className="mb-0">Profile of {dossier.InfoIdent.prenom} {dossier.InfoIdent.nom}</h2>
              </div>
              <div className="card-body">
                <h4 className="text-primary">Utilisateur</h4>
                <p><strong>Matricule:</strong> {dossier.Utilisateur.matricule}</p>
                <p><strong>Role:</strong> {dossier.Utilisateur.role}</p>

                <h4 className="text-primary mt-4">Informations Identitaires</h4>
                <p><strong>CNSS:</strong> {dossier.InfoIdent.cnss}</p>
                <p><strong>Nom du conjoint:</strong> {dossier.InfoIdent.nom_du_conjoint}</p>
                <p><strong>Sexe:</strong> {dossier.InfoIdent.sexe}</p>
                <p><strong>Date de naissance:</strong> {dossier.InfoIdent.dat_nat}</p>
                <p><strong>Lieu de naissance:</strong> {dossier.InfoIdent.lieu_nat}</p>
                <p><strong>Situation matrimoniale:</strong> {dossier.InfoIdent.situat_matri}</p>
                <p><strong>Email:</strong> {dossier.InfoIdent.email}</p>
                <p><strong>Date de mariage:</strong> {dossier.InfoIdent.dat_mariage}</p>
                <p><strong>Nombre d'enfants:</strong> {dossier.InfoIdent.nbre_enfants}</p>
               
                <h4 className="text-primary mt-4">Informations Professionnelles</h4>
                <p><strong>Statut:</strong> {dossier.InfoPro.statut}</p>
                <p><strong>Corps:</strong> {dossier.InfoPro.corps}</p>
                <p><strong>Catégorie:</strong> {dossier.InfoPro.categorie}</p>
                <p><strong>Branche du personnel:</strong> {dossier.InfoPro.branche_du_personnel}</p>
                <p><strong>Fonctions:</strong> {dossier.InfoPro.fonctions}</p>
                <p><strong>Référence nomination:</strong> {dossier.InfoPro.ref_nomination}</p>
                <p><strong>Date prise de fonction:</strong> {dossier.InfoPro.dat_prise_fonction}</p>
                <p><strong>Responsabilité particulière:</strong> {dossier.InfoPro.responsabilite_partiuliere}</p>
                <p><strong>Grade payé:</strong> {dossier.InfoPro.grade_paye}</p>
                <p><strong>Indice payé:</strong> {dossier.InfoPro.indice_paye}</p>
                <p><strong>Date première prise de service:</strong> {dossier.InfoPro.dat_first_prise_de_service}</p>
                <p><strong>Date de départ en retraite:</strong> {dossier.InfoPro.dat_de_depart_retraite}</p>
                <p><strong>Date de prise de service dans le département:</strong> {dossier.InfoPro.dat_de_prise_service_dans_departement}</p>
                <p><strong>Référence acte de prise de service poste actuel:</strong> {dossier.InfoPro.ref_acte_de_prise_service_poste_actuel}</p>
                <p><strong>Poste actuel service:</strong> {dossier.InfoPro.poste_actuel_service}</p>
                <p><strong>Type de structure:</strong> {dossier.InfoPro.type_structure}</p>
                <p><strong>Zone sanitaire:</strong> {dossier.InfoPro.zone_sanitaire}</p>
                <p><strong>Poste spécifique:</strong> {dossier.InfoPro.poste_specifique}</p>
                <p><strong>État départ:</strong> {dossier.InfoPro.DetailsMutation.etat_depart}</p>
                <p><strong>Postes antérieurs:</strong> {dossier.InfoPro.poste_anterieurs}</p>
                <p><strong>Autres diplômes:</strong> {dossier.InfoPro.autres_diplome}</p>

                <h4 className="text-primary mt-4">Informations Bancaires</h4>
                <p><strong>RIB:</strong> {dossier.InfoBank.rib}</p>
                <p><strong>MTN:</strong> {dossier.InfoBank.mtn}</p>
                <p><strong>Celtics:</strong> {dossier.InfoBank.celtics}</p>
                <p><strong>Libercom:</strong> {dossier.InfoBank.libercom}</p>
                

                <h4 className="text-primary mt-4">Informations Complémentaires</h4>
                <p><strong>Observation particulière:</strong> {dossier.InfoComplementaire.observation_particuliere}</p>
                <p><strong>Distinction:</strong> {dossier.InfoComplementaire.distinction}</p>
                <p><strong>Référence distinction:</strong> {dossier.InfoComplementaire.ref_distinction}</p>
                <p><strong>Détail distinction:</strong> {dossier.InfoComplementaire.detail_distinction}</p>
                <p><strong>Situation santé:</strong> {dossier.InfoComplementaire.situat_sante}</p>
                <p><strong>Sanction punitive:</strong> {dossier.InfoComplementaire.saction_punitive}</p>
                <p><strong>Nature sanction:</strong> {dossier.InfoComplementaire.nature_sanction}</p>
              </div>
            </div>
            <button className="btn btn-success mt-3" onClick={exportToPDF}>Exporter en PDF</button>
          </div>
        </div>
      </div>
      </main>
      <Footer/>
    </div>
   
  );
 
};

export default MonprofileC;
