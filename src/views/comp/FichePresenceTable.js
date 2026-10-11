import React, { useEffect, useMemo, useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Button from '../../ui/Button';
import { Card, CardBody, CardHeader } from '../../ui/Card';
import { Form, FormInput, FormSelect, FormTextarea } from '../../ui/Form';
import { Col, Container, Row } from '../../ui/Grid';
import { Table, TableBody, TableDataCell, TableHead, TableHeaderCell, TableRow } from '../../ui/Table';
import { ErrorState, LoadingState } from '../../components/ui';
import Icon from '../../ui/Icon';
import { Check, Close } from '../../ui/icons';
import { getDossiers } from '../../services/api';
import { getPresencesByDate, savePresence } from '../../services/presenceService';
import { FormAlert, useFormErrors } from '../../forms';

// ---------------------------------------------------------------------------
//  Fiche de présence du jour (react-hook-form + useFieldArray).
//
//  Changements par rapport à la version Formik :
//   - correction du bug « n.map is not a function » : l'API /dossiers
//     renvoie { data, meta } (cf. fix des listes), l'ancien code lisait
//     response.data qui est un objet ;
//   - plus de statut « Absent » pré-rempli pour tout le monde : un clic
//     « Enregistrer » marquait l'effectif entier absent. On part d'une fiche
//     vide et on exige un choix explicite, avec des raccourcis « Tous
//     présents » / « Tous absents » pour les journées simples ;
//   - les heures d'arrivée/départ ne sont éditables que pour les statuts où
//     elles ont un sens (Présent, Retard, Permission) ;
//   - erreurs et succès affichés via le socle (FormAlert + toasts), plus
//     d'alert() ni de console.error silencieux ;
//   - un compteur en direct (présents / absents / retards) donne l'état du
//     pointage avant l'enregistrement.
// ---------------------------------------------------------------------------

const AUJOURDHUI = () => new Date().toISOString().split('T')[0];

const STATUTS = ['Présent', 'Absent', 'Retard', 'Permission', 'Congé', 'Maladie'];
// Statuts pour lesquels une heure a un sens (et que l'on peut saisir).
const STATUTS_HORAIRES = ['Présent', 'Retard', 'Permission'];

const ligneSchema = z
  .object({
    matricule: z.string().min(1, 'Le matricule est requis'),
    statut: z
      .string()
      .min(1, 'Le statut est requis')
      .refine((v) => STATUTS.includes(v), 'Statut invalide'),
    // Heure d'arrivée exigée pour Présent/Retard : un pointage sans heure ne
    // permet pas de calculer les retards. Permission : facultative.
    // (contrôle entre champs déplacé en superRefine : zod n'a pas d'équivalent
    //  direct au `test` + `this.parent` de Yup)
    heure_arrivee: z.string().nullish(),
    heure_depart: z.string().nullish(),
    observations: z.string().nullish(),
  })
  .superRefine((ligne, ctx) => {
    if (ligne.statut === 'Présent' || ligne.statut === 'Retard') {
      if (!ligne.heure_arrivee) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['heure_arrivee'],
          message: 'Heure requise',
        });
      }
    }
  });

const schema = z.object({ fiches: z.array(ligneSchema) });

const FichePresenceTable = () => {
  const { submitError, toasts, handleSubmit, success, dismissToast, clearError } = useFormErrors();
  const [chargement, setChargement] = useState(true);
  const [erreurChargement, setErreurChargement] = useState(null);
  const today = AUJOURDHUI();
  const {
    control,
    handleSubmit: rhfHandleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: { fiches: [] },
    resolver: zodResolver(schema),
  });

  const { fields } = useFieldArray({ control, name: 'fiches' });
  // Compteur en direct : l'état du pointage avant enregistrement.
  const fiches = useWatch({ control, name: 'fiches' }) || [];

  const compteurs = useMemo(() => {
    const compte = { present: 0, absent: 0, retard: 0, autre: 0, nonPointe: 0 };
    for (const fiche of fiches) {
      if (!fiche?.statut) compte.nonPointe += 1;
      else if (fiche.statut === 'Présent') compte.present += 1;
      else if (fiche.statut === 'Absent') compte.absent += 1;
      else if (fiche.statut === 'Retard') compte.retard += 1;
      else compte.autre += 1;
    }
    return compte;
  }, [fiches]);

  useEffect(() => {
    const charger = async () => {
      try {
        setChargement(true);
        setErreurChargement(null);
        const [agentsResponse, presenceResponse] = await Promise.all([
          getDossiers(),
          getPresencesByDate(today),
        ]);
        // L'API /dossiers renvoie { data, meta } : lire .data.data
        // (bug historique « n.map is not a function »).
        const payload = agentsResponse.data?.data;
        const agents = Array.isArray(payload) ? payload : [];
        const pointages = Array.isArray(presenceResponse.data?.data) ? presenceResponse.data.data : [];

        // Une ligne par agent : si la journée est déjà pointée, on repré-
        // sente l'existant, sinon la fiche reste vide (pas d'« Absent »
        // pré-rempli : on ne marque personne absent par défaut).
        const fichesInitiales = agents.map((agent) => {
          const deja = pointages.find((p) => p.matricule === agent.matricule);
          return {
            matricule: agent.matricule,
            nom: `${agent.InfoIdent?.nom ?? ''} ${agent.InfoIdent?.prenom ?? ''}`.trim() || agent.matricule,
            statut: deja?.statut ?? '',
            heure_arrivee: deja?.heure_arrivee ? deja.heure_arrivee.slice(0, 5) : '',
            heure_depart: deja?.heure_depart ? deja.heure_depart.slice(0, 5) : '',
            observations: deja?.observations ?? '',
          };
        });
        reset({ fiches: fichesInitiales });
      } catch (error) {
        setErreurChargement(error);
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, [today, reset]);

  const appliquerATous = (statut) => {
    const heureARecevoir = STATUTS_HORAIRES.includes(statut) ? new Date().toTimeString().slice(0, 5) : '';
    fields.forEach((_, index) => {
      setValue(`fiches.${index}.statut`, statut, { shouldDirty: true });
      if (heureARecevoir) setValue(`fiches.${index}.heure_arrivee`, heureARecevoir, { shouldDirty: true });
    });
  };

  const onSubmit = (values) =>
    rhfHandleSubmit(
      async () => {
        const payload = values.fiches.map((fiche) => ({
          matricule: fiche.matricule,
          date_presence: today,
          statut: fiche.statut,
          heure_arrivee: STATUTS_HORAIRES.includes(fiche.statut) ? fiche.heure_arrivee || null : null,
          heure_depart: fiche.heure_depart || null,
          observations: fiche.observations || null,
        }));
        await savePresence(payload);
        success(`Pointage du ${new Date(today).toLocaleDateString('fr-FR')} enregistré (${payload.length} agent${payload.length > 1 ? 's' : ''}).`);
      },
    );

  const titre = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return (
    <Container>
      <Card className="mt-4">
        <CardHeader>
          <h4>Fiche de Présence du {titre}</h4>
        </CardHeader>
        <CardBody>
          {erreurChargement && (
            <ErrorState
              title="Impossible de charger le pointage"
              description={erreurChargement.message || 'Une erreur est survenue lors du chargement.'}
              onRetry={() => window.location.reload()}
            />
          )}
          {chargement ? (
            <LoadingState label="Chargement de la fiche de présence..." />
          ) : (
            <>
              {/* Compteurs en direct : état du pointage avant enregistrement. */}
              <div className="row g-3 mb-3">
                <Col xs={12} sm={3} className="text-center">
                  <div className="stat-card text-muted">
                    <div className="stat-number">{compteurs.present}</div>
                    <div className="stat-label">Présent</div>
                  </div>
                </Col>
                <Col xs={12} sm={3} className="text-center">
                  <div className="stat-card text-muted">
                    <div className="stat-number">{compteurs.absent}</div>
                    <div className="stat-label">Absent</div>
                  </div>
                </Col>
                <Col xs={12} sm={3} className="text-center">
                  <div className="stat-card text-muted">
                    <div className="stat-number">{compteurs.retard}</div>
                    <div className="stat-label">Retard</div>
                  </div>
                </Col>
                <Col xs={12} sm={3} className="text-center">
                  <div className="stat-card text-muted">
                    <div className="stat-number">{compteurs.nonPointe}</div>
                    <div className="stat-label">À pointer</div>
                  </div>
                </Col>
              </div>

              <FormAlert error={!!submitError}>{submitError}</FormAlert>

              <Form onSubmit={rhfHandleSubmit(onSubmit)}>
                <Row className="mb-3">
                  <Col xs className="text-start">
                    <Button type="button" color="success" size="sm" onClick={() => appliquerATous('Présent')} title="Tout mettre en présent">
                      <Icon icon={Check} size="sm" className="me-1" /> Tous présents
                    </Button>
                  </Col>
                  <Col xs className="text-end">
                    <Button type="button" color="danger" size="sm" onClick={() => appliquerATous('Absent')} title="Tout mettre en absent">
                      <Icon icon={Close} size="sm" className="me-1" /> Tous absents
                    </Button>
                  </Col>
                </Row>

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
                    {fiches.map((fiche, index) => (
                      <TableRow key={fiche.matricule}>
                        <TableDataCell>{fiche.matricule}</TableDataCell>
                        <TableDataCell>{fiche.nom}</TableDataCell>
                        <TableDataCell>
                          <FormSelect
                            value={fiche.statut}
                            onChange={(e) => setValue(`fiches.${index}.statut`, e.target.value, { shouldDirty: true })}
                            disabled={fiche.date_presence !== today}
                          >
                            <option value="">Sélectionner</option>
                            {STATUTS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </FormSelect>
                          {errors?.fiches?.[index]?.statut && (
                            <div className="text-danger mt-1 small">
                              {errors.fiches[index].statut.message}
                            </div>
                          )}
                        </TableDataCell>
                        <TableDataCell>
                          <FormInput
                            type="time"
                            value={fiche.heure_arrivee}
                            onChange={(e) => setValue(`fiches.${index}.heure_arrivee`, e.target.value, { shouldDirty: true })}
                            disabled={fiche.date_presence !== today}
                          />
                        </TableDataCell>
                        <TableDataCell>
                          <FormInput
                            type="time"
                            value={fiche.heure_depart}
                            onChange={(e) => setValue(`fiches.${index}.heure_depart`, e.target.value, { shouldDirty: true })}
                            disabled={fiche.date_presence !== today}
                          />
                        </TableDataCell>
                        <TableDataCell>
                          <FormTextarea
                            value={fiche.observations}
                            onChange={(e) => setValue(`fiches.${index}.observations`, e.target.value, { shouldDirty: true })}
                            rows="1"
                            disabled={fiche.date_presence !== today}
                          />
                        </TableDataCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span>
                    {compteurs.present} présent{compteurs.present > 1 ? 's' : ''}{' '}
                    · {compteurs.absent} absent{compteurs.absent > 1 ? 's' : ''}{' '}
                    · {compteurs.retard} retards {compteurs.retard > 1 ? 's' : ''}
                  </span>
                  <Button type="submit" color="primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer la présence'}
                  </Button>
                </div>
              </Form>
            </>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default FichePresenceTable;




