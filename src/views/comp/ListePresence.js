import React, { useEffect, useMemo, useState } from "react";
import { getAllPresences } from "../../services/presenceService";

const ListePresences = () => {
  const [historique, setHistorique] = useState([]);
  const [meta, setMeta] = useState({ page: 1, taille: 10, total: 0, pages: 1 });

  useEffect(() => {
    const fetchPresences = async () => {
      try {
        setChargement(true);
        setErreur(null);
        const response = await getAllPresences();
        const payload = response.data?.data;
        if (!Array.isArray(payload)) {
          throw new Error('Format de données inattendu de la part du serveur.');
        }
        setHistorique(payload);
        setMeta((prev) => ({
          page: response.data?.meta?.page ?? prev.page,
          taille: response.data?.meta?.taille ?? prev.taille,
          total: response.data?.meta?.total ?? 0,
          pages: response.data?.meta?.pages ?? 1,
        }));
      } catch (error) {
        setErreur(error);
      } finally {
        setChargement(false);
      }
    };

    fetchPresences();
  }, [meta.page, meta.taille]);

  // Regroupe les présences par date, du plus récent au plus ancien.
  const groupes = useMemo(() => {
    const grouped = {};
    for (const presence of historique) {
      const date = presence.date_presence ?? 'inconnue';
      (grouped[date] = grouped[date] || []).push(presence);
    }
    return Object.keys(grouped)
      .sort()
      .reverse()
      .reduce((acc, date) => {
        acc[date] = grouped[date];
        return acc;
      }, {});
  }, [historique]);

  const datesTriees = Object.keys(groupes);

  return (
    <Card className="mt-4">
      <CardHeader>
        <h4>📅 Liste des Présences</h4>
      </CardHeader>
      <CardBody>
        {chargement ? (
          <LoadingState label="Chargement de l'historique des présences..." />
        ) : erreur ? (
          <ErrorState
            title="Impossible de charger l'historique"
            description={erreur.message || 'Une erreur est survenue.'}
            onRetry={() => window.location.reload()}
          />
        ) : historique.length === 0 ? (
          <EmptyState
            icon="ClipboardList"
            title="Aucune fiche de présence"
            description="Aucune fiche n'a été enregistrée sur toutes les dates consultables."
          />
        ) : (
          <>
            {datesTriees.map((date) => (
              <div key={date} className="mb-4">
                <h5 className="bg-dark text-white p-2 rounded">📌 {date}</h5>
                <Table responsive striped bordered>
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>Nom et prénoms</TableHeaderCell>
                      <TableHeaderCell>Heure d'Arrivée</TableHeaderCell>
                      <TableHeaderCell>Heure de Départ</TableHeaderCell>
                      <TableHeaderCell>Statut</TableHeaderCell>
                      <TableHeaderCell>Observations</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupes[date].map((presence, idx) => (
                      <TableRow key={presence.matricule ?? idx}>
                        <TableDataCell>
                          {presence.nom} {presence.prenom}
                        </TableDataCell>
                        <TableDataCell>{presence.heure_arrivee || '--:--'}</TableDataCell>
                        <TableDataCell>{presence.heure_depart || '--:--'}</TableDataCell>
                        <TableDataCell>
                          <StatusBadge kind="presence" tone={States[presence.statut]?.tone ?? 'neutral'}>
                            {presence.statut || '—'}
                          </StatusBadge>
                        </TableDataCell>
                        <TableDataCell>{presence.observations || 'Aucune'}</TableDataCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}

            <Pagination
              page={meta.page}
              taille={meta.taille}
              total={meta.total}
              pages={meta.pages}
              onPageChange={(page) => {
                setMeta((prev) => ({ ...prev, page }));
              }}
              onTailleChange={(taille) => {
                setMeta((prev) => ({ page: 1, taille, total: meta.total, pages: Math.ceil(meta.total / taille) }));
              }}
            />
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default ListePresences;
