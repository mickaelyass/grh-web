import React, { useEffect, useState } from "react";
import { CCard, CCardBody, CCardHeader, CButton, CCol, CRow } from '@coreui/react';
import { useLocation } from "react-router-dom";
import { getDoc } from "../../services/api";
//import './Dashboard.css'; // Assurez-vous d'ajuster le nom du fichier CSS si nécessaire
 import jsPDF from 'jspdf';



const Monprofile = () => {
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const matricule = user ? user.matricule : '';

  useEffect(() => {
    if (matricule) {
     
      fetchDossier();
    }
  }, [matricule]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
  
    const content = `
      ========== PROFIL DU PERSONNEL ==========
      
      Nom complet: ${dossier.InfoIdent.prenom} ${dossier.InfoIdent.nom}
      Matricule: ${dossier.Utilisateur.matricule}
      Role: ${dossier.Utilisateur.role}
      
      ========= INFORMATIONS IDENTITAIRES =========
      - CNSS: ${dossier.InfoIdent.cnss || "N/A"}
      - Sexe: ${dossier.InfoIdent.sexe || "N/A"}
      - Date de naissance: ${formatDate(dossier.InfoIdent.dat_nat)}
      - Lieu de naissance: ${dossier.InfoIdent.lieu_nat || "N/A"}
      - Situation matrimoniale: ${dossier.InfoIdent.situat_matri || "N/A"}
      - Nom du conjoint: ${dossier.InfoIdent.nom_du_conjoint || "N/A"}
      - Date de mariage: ${formatDate(dossier.InfoIdent.dat_mariage)}
      - Nombre d'enfants: ${dossier.InfoIdent.nbre_enfants}
      - Email: ${dossier.InfoIdent.email || "N/A"}
      
      ======INFORMATIONS PROFESSIONNELLES =====
      - Statut: ${dossier.InfoPro.statut || "N/A"}
      - Corps: ${dossier.InfoPro.corps || "N/A"}
      - Catégorie: ${dossier.InfoPro.categorie || "N/A"}
      - Branche du personnel: ${dossier.InfoPro.branche_du_personnel || "N/A"}
      - Poste actuel dans le service: ${dossier.InfoPro.poste_actuel_service || "N/A"}
      - Type de structure: ${dossier.InfoPro.type_structure || "N/A"}
      - Grade payé: ${dossier.InfoPro.grade_paye || "N/A"}
      - Indice payé: ${dossier.InfoPro.indice_paye || "N/A"}
      - Date de première prise de service: ${formatDate(dossier.InfoPro.dat_first_prise_de_service)}
      - Date de départ en retraite: ${formatDate(dossier.InfoPro.dat_de_depart_retraite)}
      - Responsabilités particulières: ${dossier.InfoPro.responsabilite_partiuliere || "N/A"}
      - Nomination: ${dossier.InfoPro.ref_nomination || "N/A"}
      
      Postes antérieurs:
      ${dossier.InfoPro.PosteAnterieurs.map((poste) => `
        - ${poste.nom_poste} (Du: ${formatDate(poste.date_debut)} Au: ${formatDate(poste.date_fin)})
          Institution: ${poste.institution || "N/A"}
      `).join('')}
      
      Diplômes:
      ${dossier.InfoPro.Diplomes.map((diplome) => `
        - ${diplome.nom_diplome} (Date d'obtention: ${formatDate(diplome.date_obtention)})
          Institution: ${diplome.institution || "N/A"}
      `).join('')}
      
      ========= INFORMATIONS BANCAIRES =========
      - RIB: ${dossier.InfoBank.rib || "N/A"}
      - Comptes mobiles:
        - MTN: ${dossier.InfoBank.mtn || "N/A"}
        - Celtis: ${dossier.InfoBank.celtics || "N/A"}
        - Moov: ${dossier.InfoBank.moov || "N/A"}
      
      ===== INFORMATIONS COMPLÉMENTAIRES =====
      - Observations particulières: ${dossier.InfoComplementaire.observation_particuliere || "N/A"}
      - Situation sanitaire: ${dossier.InfoComplementaire.situat_sante || "N/A"}
      
      Sanctions:
      ${dossier.InfoComplementaire.Sanctions.map((sanction) => `
        - Nature: ${sanction.nature_sanction || "N/A"}
          Sanction punitive: ${sanction.sanction_punitive || "N/A"}
      `).join('')}
      
      Distinctions:
      ${dossier.InfoComplementaire.Distinctions.map((distinction) => `
        - Référence: ${distinction.ref_distinction || "N/A"}
          Détails: ${distinction.detail_distinction || "N/A"}
      `).join('')}
      
      Détails:
      ${dossier.InfoPro.Details.map((detail) => `
        - Matricule: ${detail.matricule || "N/A"}
          État: ${detail.etat || "N/A"}
          Poste actuel: ${detail.poste_actuel || "N/A"}
          Nouveau poste: ${detail.nouveau_poste || "N/A"}
          Date de prise de fonction: ${formatDate(detail.date_prise_fonction)}
          Date de changement: ${formatDate(detail.date_changement)}
          Motif du changement: ${detail.motif_changement || "N/A"}
      `).join('')}
    
      =========================================
  
    `;
  
    let yPosition = 10; // starting position on the page
    const marginBottom = 15;
    const pageHeight = doc.internal.pageSize.height;
  
    // Define the max height for content on each page
    const maxHeightPerPage = pageHeight - marginBottom;
  
    const addTextToPDF = (text) => {
      const splitText = doc.splitTextToSize(text, 160); // Adjusted width for more compact layout
      for (let i = 0; i < splitText.length; i++) {
        if (yPosition + 6 > maxHeightPerPage) { // Reduced space for line breaks
          doc.addPage();
          yPosition = 10; // Reset Y position for the new page
        }
        doc.text(10, yPosition, splitText[i]);
        yPosition += 6; // Further reduced line height
      }
    };
  
    addTextToPDF(content);
    doc.save(`Dossier_${dossier.InfoIdent.prenom}_${dossier.InfoIdent.nom}.pdf`);
  };
  


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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5">Aucun dossier n'est associé à ce matricule. Veuillez contacter le responsable Ressources Humaines.</div>;
  if (!dossier) return <div className="text-center mt-5">No dossier found.</div>;

  return (
    <div className="dashboard">
      <div className="container my-3">
        <CRow>
        <CCol md={11}>
            <CCard className="shadow" id="profile-content">
              <CCardHeader className="bg-primary text-white">
                <h2>Profile de {dossier.InfoIdent.prenom} {dossier.InfoIdent.nom}</h2>
              </CCardHeader>
              <CCardBody>
                <h4 className="text-primary">Utilisateur</h4>
                <p><strong>Matricule:</strong> {dossier.Utilisateur.matricule}</p>
                <p><strong>Role:</strong> {dossier.Utilisateur.role}</p>

                <h4 className="text-primary mt-4">Informations Identitaires</h4>
                <p><strong>CNSS:</strong> {dossier.InfoIdent.cnss}</p>
                <p><strong>Nom du conjoint:</strong> {dossier.InfoIdent.nom_du_conjoint}</p>
                <p><strong>Sexe:</strong> {dossier.InfoIdent.sexe}</p>
                <p><strong>Date de naissance:</strong> {formatDate(dossier.InfoIdent.dat_nat)}</p>
                <p><strong>Lieu de naissance:</strong> {dossier.InfoIdent.lieu_nat}</p>
                <p><strong>Situation matrimoniale:</strong> {dossier.InfoIdent.situat_matri}</p>
                <p><strong>Email:</strong> {dossier.InfoIdent.email}</p>
                <p><strong>Date de mariage:</strong> {formatDate(dossier.InfoIdent.dat_mariage)}</p>
                <p><strong>Nombre d'enfants:</strong> {dossier.InfoIdent.nbre_enfants}</p>

                <h4 className="text-primary mt-4">Informations Professionnelles</h4>
                <p><strong>Statut:</strong> {dossier.InfoPro.statut}</p>
                <p><strong>Corps:</strong> {dossier.InfoPro.corps}</p>
                <p><strong>Catégorie:</strong> {dossier.InfoPro.categorie}</p>
                <p><strong>Date prise de fonction:</strong> {formatDate(dossier.InfoPro.dat_prise_fonction)}</p>
                <p><strong>Date de départ en retraite:</strong> {formatDate(dossier.InfoPro.dat_de_depart_retraite)}</p>
                <p><strong>Poste actuel service:</strong> {dossier.InfoPro.poste_actuel_service}</p>
                {/* Ajoutez les autres informations ici */}

                <h4 className="text-primary mt-4">Informations Bancaires</h4>
                <p><strong>RIB:</strong> {dossier.InfoBank.rib}</p>
                {/* Ajoutez les autres informations bancaires ici */}

                <h4 className="text-primary mt-4">Informations Complémentaires</h4>
                <p><strong>Observation particulière:</strong> {dossier.InfoComplementaire.observation_particuliere}</p>
                {/* Ajoutez les autres informations complémentaires ici */}
              </CCardBody>
            </CCard>
         {/*    <CButton color="success" className="mt-3" onClick={exportToPDF}>Exporter en PDF</CButton> */}
          </CCol>
        
          
        </CRow>
        <div className="my-4">
        <button className="btn btn-secondary" onClick={handleDownloadPDF}>
          Télécharger le dossier en PDF
        </button>
      </div>
      </div>
    </div>
  );
};

export default Monprofile;
