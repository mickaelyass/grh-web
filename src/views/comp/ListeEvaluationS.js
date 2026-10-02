import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from '../../ui/Accordion'
import { Alert } from '../../ui/Alert'
import { Button } from '../../ui/Button'
import { Card, CardBody } from '../../ui/Card'
import { Container } from '../../ui/Grid'
import { Spinner } from '../../ui/Spinner'
import { Table, TableBody, TableDataCell, TableHead, TableHeaderCell, TableRow } from '../../ui/Table'
import React, { useState, useEffect, useCallback } from "react";
import { getDoc, getEvaluationByService } from "../../services/api";
import { useNavigate } from "react-router-dom";

// Utilitaire pour calculer total
const calculateTotalNotes = (notes) => {
  if (notes && typeof notes === "object") {
    return Object.values(notes).reduce((acc, val) => acc + (Number(val) || 0), 0);
  }
  return "N/A";
};

const EvaluationTableS = () => {
  const [agents, setAgents] = useState([]);
  const [serviceName, setServiceName] = useState("");
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
  const matricule = user?.matricule;

  useEffect(() => {
    const fetchAllData = async () => {
      if (!matricule) {
        setError("Matricule manquant.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const docRes = await getDoc(matricule);
        const service = docRes.data?.InfoPro?.poste_actuel_service;

        if (!service) throw new Error("Service introuvable.");
        setServiceName(service);

        const evalRes = await getEvaluationByService(service);
          setAgents((evalRes || []).filter(agent => {
          const totalCommitteeNote = calculateTotalNotes(agent.committee_notes);
          const  totalSuperiorNote=calculateTotalNotes(agent.superior_notes)
          return Number(totalCommitteeNote) === 0 && Number(totalSuperiorNote)===0;
        }));
      } catch (err) {
        setError(err.message || "Erreur inconnue.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [matricule]);

  const handleEval = useCallback((id) => {
    if (role === "directrice") {
      navigate(`/directrice/evaluations/editCommitte/${id}`);
    } else if (role === "chef_service") {
      navigate(`/chef-service/evaluations/edit/${id}`);
    }
  }, [navigate, role]);

  return (
    <Container className="mt-4">
      <Card>
        <CardBody>
          <h4 className="mb-4">Fiches d’évaluation du service : <strong>{serviceName || "..."}</strong></h4>

          {loading ? (
            <div className="text-center py-4">
              <Spinner color="primary" />
            </div>
          ) : error ? (
            <Alert color="danger">{error}</Alert>
          ) : agents.length === 0 ? (
            <Alert color="info">Aucune fiche trouvée.</Alert>
          ) : (
            <Accordion alwaysOpen>
              {agents.map((agent, idx) => (
                <AccordionItem itemKey={idx + 1} key={agent.id}>
                  <AccordionHeader>
                    <div className="d-flex justify-content-between w-100">
                      <div>
                        <strong>{agent.nom_prenom}</strong> — {agent.grade_actuel || "N/A"}
                      </div>
                      <div>
                        <span className="me-3">Année : <strong>{agent.periode_fin ? new Date(agent.periode_fin).getFullYear() : "N/A"}</strong></span>
                        <span className="me-3">Note Sup. : <strong>{calculateTotalNotes(agent.superior_notes)}</strong></span>
                        <span className="me-3">Note Comité : <strong>{calculateTotalNotes(agent.committee_notes)}</strong></span>
                        <Button size="sm" color="primary" onClick={(e) => { e.stopPropagation(); handleEval(agent.id); }}>
                          Évaluer
                        </Button>
                      </div>
                    </div>
                  </AccordionHeader>
                  <AccordionBody>
                    <Table bordered>
                      <TableBody>
                        <TableRow>
                          <TableHeaderCell scope="row">Matricule</TableHeaderCell>
                          <TableDataCell>{agent.matricule}</TableDataCell>
                        </TableRow>
                        <TableRow>
                          <TableHeaderCell>Date de naissance</TableHeaderCell>
                          <TableDataCell>{agent.date_lieu_naissance || "N/A"}</TableDataCell>
                        </TableRow>
                        <TableRow>
                          <TableHeaderCell>Emploi</TableHeaderCell>
                          <TableDataCell>{agent.emploi || "N/A"}</TableDataCell>
                        </TableRow>
                        <TableRow>
                          <TableHeaderCell>Objectifs</TableHeaderCell>
                          <TableDataCell>
                            <ul className="mb-0">
                              {(agent.objectifs || []).map((obj, i) => <li key={i}>{obj}</li>)}
                            </ul>
                          </TableDataCell>
                        </TableRow>
                        <TableRow>
                          <TableHeaderCell>Résultats</TableHeaderCell>
                          <TableDataCell>
                            <ul className="mb-0">
                              {(agent.resultats || []).map((res, i) => <li key={i}>{res}</li>)}
                            </ul>
                          </TableDataCell>
                        </TableRow>
                        <TableRow>
                          <TableHeaderCell>Contraintes</TableHeaderCell>
                          <TableDataCell>{agent.contraintes || "Aucune"}</TableDataCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </AccordionBody>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default EvaluationTableS;
