import React, { useEffect, useState } from 'react';
import { getDossiers, deleteDossier, getDossierSearch } from '../../../services/api';
import { Link } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CRow,
  CCol,
} from '@coreui/react';
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
    <CCard className="mb-4">
      <CCardHeader className="bg-secondary text-light">{title}</CCardHeader>
      <CCardBody className="p-0">
        <div className="table-responsive">
          <CTable striped hover className="mb-0">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Matricule</CTableHeaderCell>
                <CTableHeaderCell>Nom</CTableHeaderCell>
                <CTableHeaderCell>Prénom</CTableHeaderCell>
                <CTableHeaderCell className="d-none d-md-table-cell">Service</CTableHeaderCell>
                <CTableHeaderCell className="d-none d-lg-table-cell">Téléphone</CTableHeaderCell>
                <CTableHeaderCell className="d-none d-lg-table-cell">Email</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {dossiersList.map(dossier => (
                <CTableRow key={dossier.id_dossier}>
                  <CTableDataCell>{dossier.matricule}</CTableDataCell>
                  <CTableDataCell>{dossier.InfoIdent.nom}</CTableDataCell>
                  <CTableDataCell>{dossier.InfoIdent.prenom}</CTableDataCell>
                  <CTableDataCell className="d-none d-md-table-cell">{dossier.InfoPro.poste_actuel_service}</CTableDataCell>
                  <CTableDataCell className="d-none d-lg-table-cell">{dossier.InfoBank.mtn}</CTableDataCell>
                  <CTableDataCell className="d-none d-lg-table-cell">{dossier.InfoIdent.email}</CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex flex-wrap gap-1">
                      <Link to={`/admin/edit-dossier/${dossier.id_dossier}`} className="btn btn-warning btn-sm" title="Modifier"><FaEdit /></Link>
                      <Link to={`/admin/profile/${dossier.id_dossier}`} className="btn btn-secondary btn-sm" title="Voir"><FaEye /></Link>
                      <Link to={`/admin/profile/gerer-etat/${dossier.id_dossier}`} className="btn btn-primary btn-sm" title="Gérer État"><FaPlus /></Link>
                      <button onClick={() => handleDelete(dossier.id_dossier)} className="btn btn-danger btn-sm" title="Supprimer"><FaTrash /></button>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>
      </CCardBody>
    </CCard>
  );

  return (
    <div className="dashboard container py-4">
      <CCard className="mb-4">
        <CCardHeader>Recherche de dossier</CCardHeader>
        <CCardBody>
           <CRow className="align-items-center g-3">
            <CCol xs={12} md={4}>
              <CFormInput
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Recherche par nom"
              />
            </CCol>
            <CCol xs={12} md={4}>
              <CFormInput
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="Recherche par service"
              />
            </CCol>
            <CCol xs="auto">
              <CButton
                color="secondary"
                className="w-100"
                onClick={() => handleSearch(nom, service)}
              >
                Rechercher
              </CButton>
            </CCol>
            <CCol className="text-end" xs={12} md>
              <Link
                to="/admin/create-dossier"
                className="btn btn-primary float-md-end mt-2 mt-md-0"
              >
                <FaPlus className="me-2" />
                Créer un nouveau dossier
              </Link>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {dossiers.actifs.length > 0 && renderDossiersTable(dossiers.actifs, 'Dossiers des agents Actifs')}
      {dossiers.autres.length > 0 && renderDossiersTable(dossiers.autres, 'Autres des agents mutés ou autres')}
      {dossiers.retireesDecedes.length > 0 && renderDossiersTable(dossiers.retireesDecedes, 'Dossiers des agents Retraités ou Décédés')}
    </div>
  );
};

export default DossierList;
