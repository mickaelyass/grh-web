import React, { useState, useEffect } from "react";
import { getEvaluations } from "../../services/api";
import {
  CContainer,
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CAlert,
  CBadge,
} from "@coreui/react";

const EvaluationTable = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDossiers();
  }, []);

  const fetchDossiers = async () => {
    try {
      const response = await getEvaluations();
      setAgents(response);
    } catch (err) {
      setError("Erreur lors du chargement des évaluations.");
      console.error("Error fetching dossiers", err);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceCriteria = (superiorNotes, committeeNotes) => {
    const totalSuperior = Object.values(superiorNotes).reduce((acc, val) => acc + val, 0);
    const totalCommittee = Object.values(committeeNotes).reduce((acc, val) => acc + val, 0);
    const totalScore = (totalSuperior + totalCommittee)/2;

    if (totalSuperior === 0 && totalCommittee === 0) return { label: "En attente", color: "secondary" };
    if (totalScore < 10) return { label: "Insuffisant", color: "danger" };
    if (totalScore >= 10 && totalScore < 15) return { label: "Passable", color: "warning" };
    if (totalScore >= 15 && totalScore < 18) return { label: "Bien", color: "info" };
    return { label: "Très bien", color: "success" };
  };

  return (
    <CContainer className="mt-4">
      <CCard>
        <CCardBody>
          <h4 className="mb-3">Liste des Fiches Évaluations des agents</h4>

          {loading ? (
            <div className="text-center">
              <CSpinner color="primary" />
            </div>
          ) : error ? (
            <CAlert color="danger">{error}</CAlert>
          ) : agents.length === 0 ? (
            <CAlert color="info">Aucune évaluation trouvée.</CAlert>
          ) : (
            <CTable striped bordered hover responsive>
              <CTableHead color="info">
                <CTableRow>
                  <CTableHeaderCell>Année d'Évaluation</CTableHeaderCell>
                  <CTableHeaderCell>Nom & Prénom</CTableHeaderCell>
                  <CTableHeaderCell>Matricule</CTableHeaderCell>
                  <CTableHeaderCell>Date de Naissance</CTableHeaderCell>
                  <CTableHeaderCell>Grade Actuel</CTableHeaderCell>
                  <CTableHeaderCell>Emploi</CTableHeaderCell>
                  <CTableHeaderCell>Objectifs</CTableHeaderCell>
                  <CTableHeaderCell>Résultats</CTableHeaderCell>
                  <CTableHeaderCell>Contraintes</CTableHeaderCell>
                  <CTableHeaderCell>Note Supérieure Totale</CTableHeaderCell>
                  <CTableHeaderCell>Note Comité Totale</CTableHeaderCell>
                  <CTableHeaderCell>Critère de Performance</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {agents.map((agent) => {
                  const { label, color } = getPerformanceCriteria(agent.superior_notes, agent.committee_notes);
                  return (
                    <CTableRow key={agent.id}>
                      <CTableDataCell>
                        {agent.periode_fin ? new Date(agent.periode_fin).getFullYear() : "N/A"}
                      </CTableDataCell>
                      <CTableDataCell>{agent.nom_prenom}</CTableDataCell>
                      <CTableDataCell>{agent.matricule}</CTableDataCell>
                      <CTableDataCell>{agent.date_lieu_naissance}</CTableDataCell>
                      <CTableDataCell>{agent.grade_actuel}</CTableDataCell>
                      <CTableDataCell>{agent.emploi}</CTableDataCell>
                      <CTableDataCell>
                        <ul className="list-unstyled">
                          {agent.objectifs.map((objectif, index) => (
                            <li key={index}>- {objectif}</li>
                          ))}
                        </ul>
                      </CTableDataCell>
                      <CTableDataCell>
                        <ul className="list-unstyled">
                          {agent.resultats.map((resultat, index) => (
                            <li key={index}>- {resultat}</li>
                          ))}
                        </ul>
                      </CTableDataCell>
                      <CTableDataCell>{agent.contraintes}</CTableDataCell>
                      <CTableDataCell>
                        {Object.values(agent.superior_notes).reduce((acc, val) => acc + val, 0)}
                      </CTableDataCell>
                      <CTableDataCell>
                        {Object.values(agent.committee_notes).reduce((acc, val) => acc + val, 0)}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={color}>{label}</CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  );
                })}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default EvaluationTable;
