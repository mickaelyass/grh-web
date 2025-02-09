import React, { useState, useEffect } from "react";
import { getEvaluations } from "../../services/api";
import { useNavigate } from "react-router-dom";
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
  CButton,
  CSpinner,
  CAlert,
} from "@coreui/react";

const EvaluationTable = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

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

  const handleEval = (id) => {
    if (role === "directrice") {
      navigate(`/directrice/evaluations/editCommitte/${id}`);
    } else if (role === "chef_service") {
      navigate(`/chef-service/evaluations/edit/${id}`);
    }
  };

  return (
    <CContainer className="mt-4">
      <CCard>
        <CCardBody>
          <h4 className="mb-3">Liste des Fiches Évaluations des agents </h4>

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
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {agents.map((agent) => (
                  <CTableRow key={agent.id}>
                    <CTableDataCell>
                      {agent.periode_fin
                        ? new Date(agent.periode_fin).getFullYear()
                        : "N/A"}
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
                      {Object.values(agent.superior_notes).reduce(
                        (acc, val) => acc + val,
                        0
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      {Object.values(agent.committee_notes).reduce(
                        (acc, val) => acc + val,
                        0
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton color="primary" onClick={() => handleEval(agent.id)}>
                        Évaluer
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default EvaluationTable;
