import React, { useState, useEffect, useCallback } from "react";
import { getEvaluations } from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  CContainer,
  CCard,
  CCardBody,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CTable,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
  CSpinner,
  CAlert,
  CBadge,
} from "@coreui/react";

// Utilitaire pour calculer total
const calculateTotalNotes = (notes) => {
  if (notes && typeof notes === "object") {
    return Object.values(notes).reduce((acc, val) => acc + (Number(val) || 0), 0);
  }
  return "N/A";
};

// Critère de performance
const getPerformanceCriteria = (superiorNotes, committeeNotes) => {
  const totalSuperior = calculateTotalNotes(superiorNotes);
  const totalCommittee = calculateTotalNotes(committeeNotes);
  if (totalSuperior === 0 && totalCommittee === 0) return { label: "En attente", color: "secondary" };

  const total = (totalSuperior + totalCommittee) / 2;
  if (total < 10) return { label: "Insuffisant", color: "danger" };
  if (total < 15) return { label: "Passable", color: "warning" };
  if (total < 18) return { label: "Bien", color: "info" };
  return { label: "Très bien", color: "success" };
};

const EvaluationTable = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  })();

  const role = user?.role;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getEvaluations();
        setAgents((res || []).filter(agent => {
          const totalCommitteeNote = calculateTotalNotes(agent.committee_notes);
          const  totalSuperiorNote=calculateTotalNotes(agent.superior_notes)
          return Number(totalCommitteeNote) !== 0 && Number(totalSuperiorNote)!==0;
        }));
      } catch (err) {
        setError("Erreur lors du chargement des évaluations.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEval = useCallback((id) => {
    if (role === "directrice") {
      navigate(`/directrice/evaluations/editCommitte/${id}`);
    } else if (role === "chef_service") {
      navigate(`/chef-service/evaluations/edit/${id}`);
    }
  }, [navigate, role]);

  return (
    <CContainer className="mt-4">
      <CCard>
        <CCardBody>
          <h4 className="mb-4">Liste complète des fiches d’évaluation</h4>

          {loading ? (
            <div className="text-center py-4">
              <CSpinner color="primary" />
            </div>
          ) : error ? (
            <CAlert color="danger">{error}</CAlert>
          ) : agents.length === 0 ? (
            <CAlert color="info">Aucune évaluation trouvée.</CAlert>
          ) : (
            <CAccordion alwaysOpen>
              {agents.map((agent, idx) => {
                const totalSup = calculateTotalNotes(agent.superior_notes);
                const totalCom = calculateTotalNotes(agent.committee_notes);
                const { label, color } = getPerformanceCriteria(agent.superior_notes, agent.committee_notes);

                return (
                  <CAccordionItem itemKey={idx + 1} key={agent.id}>
                    <CAccordionHeader>
                      <div className="d-flex justify-content-between w-100">
                        <div>
                          <strong>{agent.nom_prenom}</strong> — {agent.grade_actuel || "N/A"}
                        </div>
                        <div>
                          <span className="me-3">Année : <strong>{agent.periode_fin ? new Date(agent.periode_fin).getFullYear() : "N/A"}</strong></span>
                          <span className="me-3">Note Sup. : <strong>{totalSup}</strong></span>
                          <span className="me-3">Note Comité : <strong>{totalCom}</strong></span>
                          <CBadge color={color} className="me-3">{label}</CBadge>
                         
                        </div>
                      </div>
                    </CAccordionHeader>
                    <CAccordionBody>
                      <CTable bordered responsive>
                        <CTableBody>
                          <CTableRow>
                            <CTableHeaderCell scope="row">Matricule</CTableHeaderCell>
                            <CTableDataCell>{agent.matricule || "N/A"}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell>Date de naissance</CTableHeaderCell>
                            <CTableDataCell>{agent.date_lieu_naissance || "N/A"}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell>Emploi</CTableHeaderCell>
                            <CTableDataCell>{agent.emploi || "N/A"}</CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell>Objectifs</CTableHeaderCell>
                            <CTableDataCell>
                              <ul className="mb-0">
                                {(agent.objectifs || []).map((obj, i) => <li key={i}>{obj}</li>)}
                              </ul>
                            </CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell>Résultats</CTableHeaderCell>
                            <CTableDataCell>
                              <ul className="mb-0">
                                {(agent.resultats || []).map((res, i) => <li key={i}>{res}</li>)}
                              </ul>
                            </CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell>Contraintes</CTableHeaderCell>
                            <CTableDataCell>{agent.contraintes || "Aucune"}</CTableDataCell>
                          </CTableRow>
                        </CTableBody>
                      </CTable>
                    </CAccordionBody>
                  </CAccordionItem>
                );
              })}
            </CAccordion>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default EvaluationTable;
