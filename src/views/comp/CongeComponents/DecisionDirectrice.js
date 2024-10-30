import React, { useState, useEffect } from 'react';
import { fetchDemandeCongesById, updateDecisionDirectrice } from '../../../services/apiConge';
import { useParams } from 'react-router-dom';
import '../Dasbord.css';
import { getDoc } from '../../../services/api';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CCol,
  CRow,
  CContainer,
  CAlert,
} from '@coreui/react';

const DecisionDirectrice = () => {
  const { id_cong } = useParams();
  const [demande, setDemande] = useState(null);
  const [decision, setDecision] = useState('');
  const [dossier, setDossier] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
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
          console.log(dossier.data);
        } else {
          console.error('Matricule non trouvé dans la demande');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la demande:', error);
      }
    };
    fetchDemande();
  }, [id_cong]);

  const handleDecision = async () => {
    try {
      await updateDecisionDirectrice(id_cong, decision);
      alert('Décision enregistrée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la décision:', error);
    }
  };

  if (!demande) return <CAlert color="info">Chargement...</CAlert>;

  return (
    <div className="dashboard">
      <CRow>
        <CCol md="3" lg="2" className="bg-light sidebar"></CCol>
        <CCol md="9" lg="10" className="main-content">
          <CContainer>
            <h2 className="text-center my-2 rounded bg-clair py-2 text-light">
              Consulter la Demande de Congés
            </h2>

            <CCard className="mb-3">
              <CCardHeader>Détails de la Demande</CCardHeader>
              <CCardBody>
                {dossier && (
                  <p>
                    <strong>Nom et prénom :</strong> {dossier.InfoIdent.nom} {dossier.InfoIdent.prenom}
                  </p>
                )}
                <p><strong>Matricule :</strong> {demande.matricule}</p>
                <p><strong>Date de Début :</strong> {formatDate(demande.date_debut)}</p>
                <p><strong>Année de Jouissance :</strong> {demande.annee_jouissance}</p>
                <p><strong>Raison :</strong> {demande.raison}</p>

                {demande.Piece_jointe && (
                  <div>
                    {demande.Piece_jointe.url_certificat_non_jouissance && (
                      <div>
                        <p><strong>Certificat :</strong></p>
                        <iframe
                          src={demande.Piece_jointe.url_certificat_non_jouissance}
                          width="100%"
                          height="400"
                          title="Certificat"
                          frameBorder="0"
                          scrolling="no"
                        >
                          <p>Votre navigateur ne prend pas en charge les iframes.</p>
                        </iframe>
                      </div>
                    )}
                    {demande.Piece_jointe.url_derniere_autorisation_conges && (
                      <div>
                        <p><strong>Attestation :</strong></p>
                        <iframe
                          src={demande.Piece_jointe.url_derniere_autorisation_conges}
                          width="100%"
                          height="400"
                          title="Attestation"
                          frameBorder="0"
                          scrolling="no"
                        >
                          <p>Votre navigateur ne prend pas en charge les iframes.</p>
                        </iframe>
                      </div>
                    )}
                  </div>
                )}
              </CCardBody>
            </CCard>

            <CCard>
              <CCardHeader>Décision</CCardHeader>
              <CCardBody>
                <CButton color="success" onClick={() => setDecision('Validé')}>
                  Validé
                </CButton>
                <CButton color="danger" className="ms-2" onClick={() => setDecision('Invalidé')}>
                  Invalidé
                </CButton>
                {decision && (
                  <div className="mt-3">
                    <p>Vous avez choisi : {decision}</p>
                    <CButton color="primary" onClick={handleDecision}>
                      Enregistrer la Décision
                    </CButton>
                  </div>
                )}
              </CCardBody>
            </CCard>
          </CContainer>
        </CCol>
      </CRow>
    </div>
  );
};

export default DecisionDirectrice;
