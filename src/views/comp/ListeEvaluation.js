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
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CButton,
  CSpinner,
  CAlert,
} from "@coreui/react";

// Fonction utilitaire pour calculer les notes
const calculateTotalNotes = (notes) => {
  if (notes && typeof notes === "object") {
    return Object.values(notes).reduce((acc, val) => acc + (Number(val) || 0), 0);
  }
  return "N/A";
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
      setLoading(true);
      setError(null);
      try {
        const response = await getEvaluations();
        setAgents((response || []).filter(agent => {
          const totalCommitteeNote = calculateTotalNotes(agent.committee_notes);
          return Number(totalCommitteeNote) === 0;
        }));

      } catch (err) {
        setError("Erreur lors du chargement des évaluations.");
        console.error("Erreur :", err);
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
          <h4 className="mb-4">Liste générale des fiches d’évaluation</h4>

          {loading ? (
            <div className="text-center py-4">
              <CSpinner color="primary" />
            </div>
          ) : error ? (
            <CAlert color="danger">{error}</CAlert>
          ) : agents.length === 0 ? (
            <CAlert color="info">Aucune fiche trouvée.</CAlert>
          ) : (
            <CAccordion alwaysOpen>
              {agents.map((agent, idx) => (
                <CAccordionItem itemKey={idx + 1} key={agent.id}>
                  <CAccordionHeader>
                    <div className="d-flex justify-content-between w-100">
                      <div>
                        <strong>{agent.nom_prenom}</strong> — {agent.grade_actuel || "N/A"}
                      </div>
                      <div>
                        <span className="me-3">Année : <strong>{agent.periode_fin ? new Date(agent.periode_fin).getFullYear() : "N/A"}</strong></span>
                        <span className="me-3">Note Sup. : <strong>{calculateTotalNotes(agent.superior_notes)}</strong></span>
                        <span className="me-3">Note Comité : <strong>{calculateTotalNotes(agent.committee_notes)}</strong></span>
                        <CButton size="sm" color="primary" onClick={(e) => { e.stopPropagation(); handleEval(agent.id); }}>
                          Évaluer
                        </CButton>
                      </div>
                    </div>
                  </CAccordionHeader>
                  <CAccordionBody>
                    <CTable bordered>
                      <CTableBody>
                        <CTableRow>
                          <CTableHeaderCell>Matricule</CTableHeaderCell>
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
              ))}
            </CAccordion>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default EvaluationTable;
