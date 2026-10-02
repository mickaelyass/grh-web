import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from '../../ui/Accordion'
import { Alert } from '../../ui/Alert'
import { Badge } from '../../ui/Badge'
import { Button } from '../../ui/Button'
import { Card, CardBody } from '../../ui/Card'
import { Container } from '../../ui/Grid'
import { Spinner } from '../../ui/Spinner'
import { Table, TableBody, TableDataCell, TableHeaderCell, TableRow } from '../../ui/Table'
import React, { useState, useEffect, useCallback } from "react";
import { getEvaluations } from "../../services/api";
import { useNavigate } from "react-router-dom";

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
    <Container className="mt-4">
      <Card>
        <CardBody>
          <h4 className="mb-4">Liste complète des fiches d’évaluation</h4>

          {loading ? (
            <div className="text-center py-4">
              <Spinner color="primary" />
            </div>
          ) : error ? (
            <Alert color="danger">{error}</Alert>
          ) : agents.length === 0 ? (
            <Alert color="info">Aucune évaluation trouvée.</Alert>
          ) : (
            <Accordion alwaysOpen>
              {agents.map((agent, idx) => {
                const totalSup = calculateTotalNotes(agent.superior_notes);
                const totalCom = calculateTotalNotes(agent.committee_notes);
                const { label, color } = getPerformanceCriteria(agent.superior_notes, agent.committee_notes);

                return (
                  <AccordionItem itemKey={idx + 1} key={agent.id}>
                    <AccordionHeader>
                      <div className="d-flex justify-content-between w-100">
                        <div>
                          <strong>{agent.nom_prenom}</strong> — {agent.grade_actuel || "N/A"}
                        </div>
                        <div>
                          <span className="me-3">Année : <strong>{agent.periode_fin ? new Date(agent.periode_fin).getFullYear() : "N/A"}</strong></span>
                          <span className="me-3">Note Sup. : <strong>{totalSup}</strong></span>
                          <span className="me-3">Note Comité : <strong>{totalCom}</strong></span>
                          <Badge color={color} className="me-3">{label}</Badge>
                         
                        </div>
                      </div>
                    </AccordionHeader>
                    <AccordionBody>
                      <Table bordered responsive>
                        <TableBody>
                          <TableRow>
                            <TableHeaderCell scope="row">Matricule</TableHeaderCell>
                            <TableDataCell>{agent.matricule || "N/A"}</TableDataCell>
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
                );
              })}
            </Accordion>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default EvaluationTable;
