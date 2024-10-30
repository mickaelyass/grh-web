import React, { useEffect, useState } from "react";
import { CCard, CCardBody, CCardHeader, CButton, CCol, CRow } from '@coreui/react';
import { useLocation } from "react-router-dom";
import { getDoc } from "../../services/api";
import ImageUploadForm from "./ImageUploadForm";
import ImageProfileEmploye from "./ImageProfileEmploye";
//import './Dashboard.css'; // Assurez-vous d'ajuster le nom du fichier CSS si nécessaire
/* import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'; */

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
        <CCol md={8}>
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
          <CCol md={4}>
            <ImageProfileEmploye matricule={dossier.Utilisateur.matricule} />
            <ImageUploadForm matricule={dossier.Utilisateur.matricule} />
          </CCol>
          
        </CRow>
      </div>
    </div>
  );
};

export default Monprofile;
