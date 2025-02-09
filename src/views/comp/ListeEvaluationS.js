import React, { useState, useEffect } from "react";
import { getDoc, getEvaluationByService } from "../../services/api";
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

const EvaluationTableS = () => {
  const [agents, setAgents] = useState([]);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const matricule = user?.matricule;

  useEffect(() => {
    if (matricule) {
      fetchDoc();
    }
  }, [matricule]);

  useEffect(() => {
    if (service) {
      fetchDossiers();
    }
  }, [service]);

  const fetchDoc = async () => {
    try {
      setLoading(true);
      const response = await getDoc(matricule);
      console.log(response.data);
      if (response.data?.InfoPro?.poste_actuel_service) {
        setService(response.data.InfoPro.poste_actuel_service);
      } else {
        setError("Aucune information de service trouvée.");
        setLoading(false);
      }
    } catch (err) {
      setError("Erreur lors du chargement des informations.");
      console.error("Error fetching document:", err);
      setLoading(false);
    }
  };

  const fetchDossiers = async () => {
    console.log(service);
    try {
        
      setLoading(true);
      const response = await getEvaluationByService(service);
      setAgents(response || []);
    } catch (err) {
      setError("Erreur lors du chargement des évaluations.");
      console.error("Error fetching dossiers:", err);
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
                        {agent.objectifs?.map((objectif, index) => (
                          <li key={index}>- {objectif}</li>
                        ))}
                      </ul>
                    </CTableDataCell>
                    <CTableDataCell>
                      <ul className="list-unstyled">
                        {agent.resultats?.map((resultat, index) => (
                          <li key={index}>- {resultat}</li>
                        ))}
                      </ul>
                    </CTableDataCell>
                    <CTableDataCell>{agent.contraintes || "N/A"}</CTableDataCell>
                    <CTableDataCell>
                      {agent.superior_notes
                        ? Object.values(agent.superior_notes).reduce((acc, val) => acc + val, 0)
                        : "N/A"}
                    </CTableDataCell>
                    <CTableDataCell>
                      {agent.committee_notes
                        ? Object.values(agent.committee_notes).reduce((acc, val) => acc + val, 0)
                        : "N/A"}
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

export default EvaluationTableS;
