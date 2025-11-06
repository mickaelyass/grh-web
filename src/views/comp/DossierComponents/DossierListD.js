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
  CCol
} from '@coreui/react';
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
    <CCard className="mb-4 shadow-sm">
      <CCardHeader className="bg-dark   text-white">
        <strong>{title}</strong>
      </CCardHeader>
      <CCardBody className="p-0">
        {dossiersList.length > 0 ? (
          <CTable striped responsive hover className="mb-0">
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell>Matricule</CTableHeaderCell>
                <CTableHeaderCell>Nom</CTableHeaderCell>
                <CTableHeaderCell>Prénom</CTableHeaderCell>
                <CTableHeaderCell>Service</CTableHeaderCell>
                <CTableHeaderCell>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {dossiersList.map((dossier) => (
                <CTableRow key={dossier.id_dossier}>
                  <CTableDataCell>{dossier.matricule}</CTableDataCell>
                  <CTableDataCell>{dossier.InfoIdent?.nom || '-'}</CTableDataCell>
                  <CTableDataCell>{dossier.InfoIdent?.prenom || '-'}</CTableDataCell>
                  <CTableDataCell>{dossier.InfoPro?.poste_actuel_service || '-'}</CTableDataCell>
                  <CTableDataCell>
                    <Link
                      to={`/directrice/profileD/${dossier.id_dossier}`}
                      className="btn btn-outline-secondary btn-sm"
                      aria-label="Voir le dossier"
                    >
                      <FaEye />
                    </Link>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        ) : (
          <p className="p-3">Aucun dossier trouvé.</p>
        )}
      </CCardBody>
    </CCard>
  );

  return (
    <div className="dashboard container-fluid p-3">
      <CCard className="mb-4 shadow-sm">
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
              <CButton color="secondary" onClick={handleSearch}>
                Rechercher
              </CButton>
            </CCol>
            <CCol className="text-end" xs={12} md>
              <Link to="/directrice/create-dossier" className="btn btn-primary float-md-end mt-2 mt-md-0">
                <FaPlus className="me-2" />
                Créer un nouveau dossier
              </Link>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {dossiers.actifs.length > 0 && renderDossiersTable(dossiers.actifs, 'Agents Actifs')}
      {dossiers.autres.length > 0 && renderDossiersTable(dossiers.autres, 'Agents Mutés ou Autres')}
      {dossiers.retireesDecedes.length > 0 && renderDossiersTable(dossiers.retireesDecedes, 'Agents Retraités ou Décédés')}
    </div>
  );
};

export default DossierListD;

