import { Button } from '../../../ui/Button'
import { Card, CardBody, CardHeader } from '../../../ui/Card'
import { Form, FormInput } from '../../../ui/Form'
import { Col, Row } from '../../../ui/Grid'
import { Table, TableBody, TableDataCell, TableHead, TableHeaderCell, TableRow } from '../../../ui/Table'
import React, { useEffect, useState } from 'react';
import { getDossiers, deleteDossier, getDossierSearch } from '../../../services/api';
import { Link } from 'react-router-dom';

import { FaEdit, FaPlus, FaEye, FaTrash } from 'react-icons/fa';

const DossierList = () => {
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

      const categorize = (etatList) =>
        allDossiers.filter((dossier) => {
          const details = dossier.InfoPro?.Details || [];
          const lastDetail = details[0] || null;
          return lastDetail && etatList.includes(lastDetail.etat);
        });

      setDossiers({
        actifs: categorize(['Actif']),
        retireesDecedes: categorize(['Retraite', 'Décédé']),
        autres: allDossiers.filter((dossier) => {
          const details = dossier.InfoPro?.Details || [];
          const lastDetail = details[0] || null;
          return lastDetail && !['Actif', 'Retraite', 'Décédé'].includes(lastDetail.etat);
        }),
      });
    } catch (error) {
      console.error('Erreur lors du chargement des dossiers:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm(`Le dossier ${id} sera supprimé`)) {
        await deleteDossier(id);
        fetchDossiers();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await getDossierSearch(nom, service);
      const result = response.data;

      const filterAndSet = (list) => ({
        actifs: list.filter(d => d.InfoPro?.Details?.[0]?.etat === 'Actif'),
        retireesDecedes: list.filter(d => ['Retraite', 'Décédé'].includes(d.InfoPro?.Details?.[0]?.etat)),
        autres: list.filter(d => !['Actif', 'Retraite', 'Décédé'].includes(d.InfoPro?.Details?.[0]?.etat)),
      });

      setDossiers(filterAndSet(result));
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    }
  };

  const renderDossiersTable = (dossiersList, title) => (
    <Card className="mb-4">
      <CardHeader className="bg-secondary text-light">{title}</CardHeader>
      <CardBody className="p-0">
        <div className="table-responsive">
          <Table striped hover className="mb-0">
            <TableHead>
              <TableRow>
                <TableHeaderCell>Matricule</TableHeaderCell>
                <TableHeaderCell>Nom</TableHeaderCell>
                <TableHeaderCell>Prénom</TableHeaderCell>
                <TableHeaderCell className="d-none d-md-table-cell">Service</TableHeaderCell>
                <TableHeaderCell className="d-none d-lg-table-cell">Téléphone</TableHeaderCell>
                <TableHeaderCell className="d-none d-lg-table-cell">Email</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dossiersList.map(dossier => (
                <TableRow key={dossier.id_dossier}>
                  <TableDataCell>{dossier.matricule}</TableDataCell>
                  <TableDataCell>{dossier.InfoIdent.nom}</TableDataCell>
                  <TableDataCell>{dossier.InfoIdent.prenom}</TableDataCell>
                  <TableDataCell className="d-none d-md-table-cell">{dossier.InfoPro.poste_actuel_service}</TableDataCell>
                  <TableDataCell className="d-none d-lg-table-cell">{dossier.InfoBank.mtn}</TableDataCell>
                  <TableDataCell className="d-none d-lg-table-cell">{dossier.InfoIdent.email}</TableDataCell>
                  <TableDataCell>
                    <div className="d-flex flex-wrap gap-1">
                      <Link to={`/admin/edit-dossier/${dossier.id_dossier}`} className="btn btn-warning btn-sm" title="Modifier"><FaEdit /></Link>
                      <Link to={`/admin/profile/${dossier.id_dossier}`} className="btn btn-secondary btn-sm" title="Voir"><FaEye /></Link>
                      <Link to={`/admin/profile/gerer-etat/${dossier.id_dossier}`} className="btn btn-primary btn-sm" title="Gérer État"><FaPlus /></Link>
                      <button onClick={() => handleDelete(dossier.id_dossier)} className="btn btn-danger btn-sm" title="Supprimer"><FaTrash /></button>
                    </div>
                  </TableDataCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div className="dashboard container py-4">
      <Card className="mb-4">
        <CardHeader>Recherche de dossier</CardHeader>
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
              <Button
                color="secondary"
                className="w-100"
                onClick={() => handleSearch(nom, service)}
              >
                Rechercher
              </Button>
            </Col>
            <Col className="text-end" xs={12} md>
              <Link
                to="/admin/create-dossier"
                className="btn btn-primary float-md-end mt-2 mt-md-0"
              >
                <FaPlus className="me-2" />
                Créer un nouveau dossier
              </Link>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {dossiers.actifs.length > 0 && renderDossiersTable(dossiers.actifs, 'Dossiers des agents Actifs')}
      {dossiers.autres.length > 0 && renderDossiersTable(dossiers.autres, 'Autres des agents mutés ou autres')}
      {dossiers.retireesDecedes.length > 0 && renderDossiersTable(dossiers.retireesDecedes, 'Dossiers des agents Retraités ou Décédés')}
    </div>
  );
};

export default DossierList;
