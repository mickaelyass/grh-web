import { Card, CardBody, CardHeader } from '../../../ui/Card'
import { Table, TableBody, TableDataCell, TableHead, TableHeaderCell, TableRow } from '../../../ui/Table'
import React, { useEffect, useState } from 'react';
import { getDossiers } from '../../../services/api';

import '../Dasbord.css';

const UtilisateurListD = () => {
  const [dossiers, setDossiers] = useState([]);

  useEffect(() => {
    fetchDossiers();
  }, []);

  const fetchDossiers = async () => {
    try {
      const response = await getDossiers();
      setDossiers(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des dossiers', error);
    }
  };

  return (
    <div className="dashboard">
      <Card className="mb-4">
        <CardHeader>
          <h2 className="card-title">Liste des Utilisateurs</h2>
        </CardHeader>
        <CardBody>
          <Table striped hover responsive>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Nom</TableHeaderCell>
                <TableHeaderCell>Prénom</TableHeaderCell>
                <TableHeaderCell>Matricule</TableHeaderCell>
                <TableHeaderCell>Rôle</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dossiers.map((dossier) => (
                <TableRow key={dossier.id_dossier}>
                  <TableDataCell>{dossier.InfoIdent?.nom || '-'}</TableDataCell>
                  <TableDataCell>{dossier.InfoIdent?.prenom || '-'}</TableDataCell>
                  <TableDataCell>{dossier.matricule}</TableDataCell>
                  <TableDataCell>{dossier.Utilisateur?.role || '-'}</TableDataCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {dossiers.length === 0 && <p className="text-center mt-3">Aucun utilisateur trouvé.</p>}
        </CardBody>
      </Card>
    </div>
  );
};

export default UtilisateurListD;
