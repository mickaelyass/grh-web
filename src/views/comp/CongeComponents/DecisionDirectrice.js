import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from '../../../ui/Accordion'
import { Alert } from '../../../ui/Alert'
import { Button } from '../../../ui/Button'
import { Card, CardBody, CardHeader } from '../../../ui/Card'
import { Col, Container, Row } from '../../../ui/Grid'
import React, { useState, useEffect } from 'react';
import { fetchDemandeCongesById, updateDecisionDirectrice } from '../../../services/apiConge';
import { useParams } from 'react-router-dom';
import { getDoc } from '../../../services/api';

const DecisionDirectrice = () => {
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
      await updateDecisionDirectrice(id_cong, decision);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la décision:', error);
    }
  };

  if (!demande) return <Alert color="info">Chargement...</Alert>;

  return (
    <Container className="py-4">
      <h3 className="text-center text-white bg-primary p-3 rounded">
        Prise de Décision - Directrice Générale
      </h3>

      <Card className="mb-4 shadow-sm">
        <CardHeader>Détails de la Demande</CardHeader>
        <CardBody>
          {dossier && (
            <p>
              <strong>Nom & Prénom :</strong> {dossier.InfoIdent.nom} {dossier.InfoIdent.prenom}
            </p>
          )}
          <p><strong>Matricule :</strong> {demande.matricule}</p>
          <p><strong>Date de Début :</strong> {formatDate(demande.date_debut)}</p>
          <p><strong>Année de Jouissance :</strong> {demande.annee_jouissance}</p>
          <p><strong>Raison :</strong> {demande.raison}</p>
        </CardBody>
      </Card>

      {(demande.piecesJointes?.url_certificat_non_jouissance ||
        demande.piecesJointes?.url_derniere_autorisation_conges) && (
        <Accordion className="mb-4">
          <AccordionItem itemKey={1}>
            <AccordionHeader>Pièces Jointes</AccordionHeader>
            <AccordionBody>
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
            </AccordionBody>
          </AccordionItem>
        </Accordion>
      )}

      <Card className="shadow-sm">
        <CardHeader>Décision</CardHeader>
        <CardBody>
          <div className="d-flex gap-3 mb-3">
            <Button color="success" onClick={() => setDecision('Validé')}>
              Valider
            </Button>
            <Button color="danger" onClick={() => setDecision('Invalidé')}>
              Invalider
            </Button>
          </div>
          {decision && (
            <>
              <Alert color="info">Vous avez choisi : <strong>{decision}</strong></Alert>
              <Button color="primary" onClick={handleDecision}>
                Enregistrer la Décision
              </Button>
            </>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default DecisionDirectrice;
