import { Button } from '../../ui/Button'
import { Card, CardBody, CardHeader } from '../../ui/Card'
import { FormInput, FormSelect, FormTextarea } from '../../ui/Form'
import { Container } from '../../ui/Grid'
import { Table, TableBody, TableDataCell, TableHead, TableHeaderCell, TableRow } from '../../ui/Table'
import React, { useEffect, useState } from "react";
import { getDossiers } from "../../services/api";
import { getPresencesByDate, savePresence } from "../../services/presenceService";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Fonction pour récupérer la date du jour en format YYYY-MM-DD
const getTodayDate = () => new Date().toISOString().split("T")[0];

const FichePresenceTable = () => {
  const [agents, setAgents] = useState([]);
  const [initialValues, setInitialValues] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = getTodayDate();
  const now = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', // nom complet du jour
    year: 'numeric', // année complète
    month: 'long', // mois en toute lettre
    day: 'numeric', // jour du mois
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentsResponse, presenceResponse] = await Promise.all([
          getDossiers(),
          getPresencesByDate(today),
          console.log(today)
  
        ]);

        const agentsList = agentsResponse.data || [];
        const presenceList = presenceResponse.data || [];

        const mappedData = agentsList?.map((agent) => {
          const existingFiche = presenceList.find((p) => p.matricule === agent.matricule);
          return {
            matricule: agent.matricule,
            nom: `${agent.InfoIdent.nom} ${agent.InfoIdent.prenom}`,
            date_presence: today,
            statut: existingFiche?.statut || "Absent",
            heure_arrivee: existingFiche?.heure_arrivee || "00:00",
            heure_depart: existingFiche?.heure_depart || "00:00",
            observations: existingFiche?.observations || "",
          };
        });

        setAgents(agentsList);
        setInitialValues({ fiches: mappedData });
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const validationSchema = Yup.object({
    fiches: Yup.array().of(
      Yup.object().shape({
        statut: Yup.string()
          .oneOf(["Présent", "Absent", "Retard", "Permission", "Congé", "Maladie"], "Statut invalide")
          .required("Obligatoire"),
        heure_arrivee: Yup.string().nullable(),
        heure_depart: Yup.string().nullable(),
        observations: Yup.string().nullable(),
      })
    ),
  });

  const handleSubmit = async (values, { resetForm }) => {
    
    try {
      
     
      console.log("Données soumises :", values.fiches);
      await savePresence( {data:values.fiches });
      resetForm({ values });
    } catch (error) {
      console.error("Erreur d'enregistrement :", error);
      alert("Erreur lors de l'enregistrement. Veuillez réessayer.");
    }
  };

  return (
    <Container>
      <Card className="mt-4">
        <CardHeader>
          <h4>Fiche de Présence du  {now}</h4>
        </CardHeader>
        <CardBody>
          {loading ? (
            <p>Chargement des agents...</p>
          ) : (
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {({ values, isSubmitting }) => (
                <Form>
                  <Table responsive striped bordered>
                    <TableHead>
                      <TableRow>
                        <TableHeaderCell>Matricule</TableHeaderCell>
                        <TableHeaderCell>Nom</TableHeaderCell>
                        <TableHeaderCell>Statut</TableHeaderCell>
                        <TableHeaderCell>Heure Arrivée</TableHeaderCell>
                        <TableHeaderCell>Heure Départ</TableHeaderCell>
                        <TableHeaderCell>Observations</TableHeaderCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {values.fiches.map((fiche, index) => (
                        <TableRow key={index}>
                          <TableDataCell>{fiche.matricule}</TableDataCell>
                          <TableDataCell>{fiche.nom}</TableDataCell>
                          <TableDataCell>
                            <Field as={FormSelect} name={`fiches.${index}.statut`} disabled={fiche.date_presence !== today}>
                              <option value="">Sélectionner</option>
                              <option value="Présent">Présent</option>
                              <option value="Absent">Absent</option>
                              <option value="Retard">Retard</option>
                              <option value="Permission">Permission</option>
                              <option value="Congé">Congé</option>
                              <option value="Maladie">Maladie</option>
                            </Field>
                            <ErrorMessage name={`fiches.${index}.statut`} component="div" className="text-danger" />
                          </TableDataCell>
                          <TableDataCell>
                            <Field as={FormInput} type="time" name={`fiches.${index}.heure_arrivee`} disabled={fiche.date_presence !== today} />
                          </TableDataCell>
                          <TableDataCell>
                            <Field as={FormInput} type="time" name={`fiches.${index}.heure_depart`} disabled={fiche.date_presence !== today} />
                          </TableDataCell>
                          <TableDataCell>
                            <Field as={FormTextarea} name={`fiches.${index}.observations`} rows="1" disabled={fiche.date_presence !== today} />
                          </TableDataCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Button type="submit" color="primary" className="mt-3" disabled={isSubmitting}>
                    {isSubmitting ? "Enregistrement..." : "Enregistrer la présence"}
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default FichePresenceTable;
