import React, { useState, useEffect } from 'react';
import { fetchDemandeCongesById, updateDecisionChefService } from '../../../services/apiConge';
import { getDoc } from '../../../services/api';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CAlert,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
} from '@coreui/react';

const DecisionChef = () => {
  const { id_cong } = useParams();
  const [demande, setDemande] = useState(null);
  const [decision, setDecision] = useState('');
  const [dossier, setDossier] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    const fetchDemande = async () => {
      try {
        const result = await fetchDemandeCongesById(id_cong);
        setDemande(result);
        const matricule = result?.matricule;
        if (matricule) {
          const dossier = await getDoc(matricule);
          setDossier(dossier.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la demande:', error);
      }
    };

    fetchDemande();
  }, [id_cong]);

  const handleDecision = async () => {
    try {
      await updateDecisionChefService(id_cong, decision);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la décision:", error);
    }
  };

  if (!demande) return <CAlert color="info">Chargement des données...</CAlert>;

  return (
    <CContainer className="py-4">
      <h3 className="text-center text-white bg-primary p-3 rounded">
        Prise de Décision - Chef de Service
      </h3>

      <CCard className="mb-4 shadow-sm">
        <CCardHeader>Détails de la Demande</CCardHeader>
        <CCardBody>
          {dossier && (
            <p>
              <strong>Nom & Prénom :</strong> {dossier.InfoIdent.nom} {dossier.InfoIdent.prenom}
            </p>
          )}
          <p><strong>Matricule :</strong> {demande.matricule}</p>
          <p><strong>Date de Début :</strong> {formatDate(demande.date_debut)}</p>
          <p><strong>Année de Jouissance :</strong> {demande.annee_jouissance}</p>
          {demande.raison !== 'Facultatif' && (
            <p><strong>Raison :</strong> {demande.raison}</p>
          )}
        </CCardBody>
      </CCard>

      {(demande.piecesJointes?.url_certificat_non_jouissance ||
        demande.piecesJointes?.url_derniere_autorisation_conges) && (
        <CAccordion>
          <CAccordionItem itemKey={1}>
            <CAccordionHeader>Pièces Jointes</CAccordionHeader>
            <CAccordionBody>
              {demande.piecesJointes.url_certificat_non_jouissance && (
                <div className="mb-3">
                  <p><strong>Certificat de Non-Jouissance :</strong></p>
                  <iframe
                    src={demande.piecesJointes.url_certificat_non_jouissance}
                    width="100%"
                    height="400"
                    title="Certificat"
                    frameBorder="0"
                  ></iframe>
                </div>
              )}
              {demande.piecesJointes.url_derniere_autorisation_conges && (
                <div>
                  <p><strong>Dernière Autorisation :</strong></p>
                  <iframe
                    src={demande.piecesJointes.url_derniere_autorisation_conges}
                    width="100%"
                    height="400"
                    title="Autorisation"
                    frameBorder="0"
                  ></iframe>
                </div>
              )}
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>
      )}

      <CCard className="mt-4 shadow-sm">
        <CCardHeader>Décision</CCardHeader>
        <CCardBody>
          <div className="d-flex gap-3 mb-3">
            <CButton color="success" onClick={() => setDecision('Autorisée')}>
              Autoriser
            </CButton>
            <CButton color="danger" onClick={() => setDecision('Rejetée')}>
              Rejeter
            </CButton>
          </div>
          {decision && (
            <>
              <CAlert color="info">Vous avez choisi : <strong>{decision}</strong></CAlert>
              <CButton color="primary" onClick={handleDecision}>
                Enregistrer la Décision
              </CButton>
            </>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default DecisionChef;
