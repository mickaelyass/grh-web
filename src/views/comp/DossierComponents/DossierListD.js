import { Button } from '../../../ui/Button'
import { Card, CardBody, CardHeader } from '../../../ui/Card'
import { Form, FormInput } from '../../../ui/Form'
import { Col, Row } from '../../../ui/Grid'
import { Table, TableBody, TableDataCell, TableHead, TableHeaderCell, TableRow } from '../../../ui/Table'
import React, { useEffect, useState } from 'react';
import { getDossiers, deleteDossier, getDossierSearch } from '../../../services/api';
import { Link } from 'react-router-dom';

import { FaEye, FaPlus } from 'react-icons/fa';

const DossierListD = () => {
  const [dossiers, setDossiers] = useState({ actifs: [], retireesDecedes: [], autres: [] });
  const [nom, setNom] = useState('');
  const [service, setService] = useState('');

  useEffect(() => {
    fetchDossiers();
  }, []);

  const fetchDossiers = async () => {
    try {
      const response = await getDossiers();
      const allDossiers = response.data;

      const classify = (etat) => (dossier) => {
        const details = dossier.InfoPro?.Details || [];
        const lastDetail = details[0] || null;
        return lastDetail && etat.includes(lastDetail.etat);
      };

      setDossiers({
        actifs: allDossiers.filter(classify(['Actif'])),
        retireesDecedes: allDossiers.filter(classify(['Retraite', 'Décédé'])),
        autres: allDossiers.filter(classify([])),
      });
    } catch (error) {
      console.error('Erreur lors du chargement des dossiers', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await getDossierSearch(nom, service);
      const result = response.data;

      const classify = (etat) => (dossier) => {
        const details = dossier.InfoPro?.Details || [];
        const lastDetail = details[0] || null;
        return lastDetail && etat.includes(lastDetail.etat);
      };

      setDossiers({
        actifs: result.filter(classify(['Actif'])),
        retireesDecedes: result.filter(classify(['Retraite', 'Décédé'])),
        autres: result.filter((dossier) => {
          const details = dossier.InfoPro?.Details || [];
          const lastDetail = details[0] || null;
          return lastDetail && !['Actif', 'Retraite', 'Décédé'].includes(lastDetail.etat);
        }),
      });
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    }
  };

  const renderDossiersTable = (dossiersList, title) => (
    <Card className="mb-4 shadow-sm">
      <CardHeader className="bg-dark   text-white">
        <strong>{title}</strong>
      </CardHeader>
      <CardBody className="p-0">
        {dossiersList.length > 0 ? (
          <Table striped responsive hover className="mb-0">
            <TableHead color="dark">
              <TableRow>
                <TableHeaderCell>Matricule</TableHeaderCell>
                <TableHeaderCell>Nom</TableHeaderCell>
                <TableHeaderCell>Prénom</TableHeaderCell>
                <TableHeaderCell>Service</TableHeaderCell>
                <TableHeaderCell>Action</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dossiersList.map((dossier) => (
                <TableRow key={dossier.id_dossier}>
                  <TableDataCell>{dossier.matricule}</TableDataCell>
                  <TableDataCell>{dossier.InfoIdent?.nom || '-'}</TableDataCell>
                  <TableDataCell>{dossier.InfoIdent?.prenom || '-'}</TableDataCell>
                  <TableDataCell>{dossier.InfoPro?.poste_actuel_service || '-'}</TableDataCell>
                  <TableDataCell>
                    <Link
                      to={`/directrice/profileD/${dossier.id_dossier}`}
                      className="btn btn-outline-secondary btn-sm"
                      aria-label="Voir le dossier"
                    >
                      <FaEye />
                    </Link>
                  </TableDataCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="p-3">Aucun dossier trouvé.</p>
        )}
      </CardBody>
    </Card>
  );

  return (
    <div className="dashboard container-fluid p-3">
      <Card className="mb-4 shadow-sm">
        <CardBody>
          <Row className="align-items-center g-3">
            <Col xs={12} md={4}>
              <FormInput
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Recherche par nom"
              />
            </Col>
            <Col xs={12} md={4}>
              <FormInput
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="Recherche par service"
              />
            </Col>
            <Col xs="auto">
              <Button color="secondary" onClick={handleSearch}>
                Rechercher
              </Button>
            </Col>
            <Col className="text-end" xs={12} md>
              <Link to="/directrice/create-dossier" className="btn btn-primary float-md-end mt-2 mt-md-0">
                <FaPlus className="me-2" />
                Créer un nouveau dossier
              </Link>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {dossiers.actifs.length > 0 && renderDossiersTable(dossiers.actifs, 'Agents Actifs')}
      {dossiers.autres.length > 0 && renderDossiersTable(dossiers.autres, 'Agents Mutés ou Autres')}
      {dossiers.retireesDecedes.length > 0 && renderDossiersTable(dossiers.retireesDecedes, 'Agents Retraités ou Décédés')}
    </div>
  );
};

export default DossierListD;

