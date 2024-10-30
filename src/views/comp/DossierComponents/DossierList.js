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
} from '@coreui/react';
import '../Dasbord.css';

const DossierList = () => {
  const [dossiers, setDossiers] = useState({
    actifs: [],
    retireesDecedes: [],
    autres: []
  });

  const [nom, setNom] = useState('');
  const [service, setService] = useState('');

  useEffect(() => {
    fetchDossiers();
  }, []);

  const fetchDossiers = async () => {
    try {
      const response = await getDossiers();
      const allDossiers = response.data;

      const actifs = allDossiers.filter(dossier => dossier.InfoPro.DetailsMutation.etat_depart === 'Actif');
      const retireesDecedes = allDossiers.filter(dossier => ['Retraite', 'Décédé'].includes(dossier.InfoPro.DetailsMutation.etat_depart));
      const autres = allDossiers.filter(dossier => !['Actif', 'Retraite', 'Décédé'].includes(dossier.InfoPro.DetailsMutation.etat_depart));

      setDossiers({
        actifs,
        retireesDecedes,
        autres
      });
    } catch (error) {
      console.error('Error fetching dossiers', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm(`Le dossier ${id} sera supprimé`)) {
        await deleteDossier(id);
        fetchDossiers();
      }
    } catch (error) {
      console.error('Error deleting dossier', error);
    }
  };

  const handleSearch = async () => {
    try {
      const result = await getDossierSearch(nom, service);
      setDossiers({
        actifs: result.filter(dossier => dossier.InfoPro.etat_depart === 'Actif'),
        retireesDecedes: result.filter(dossier => ['Retraite', 'Décédé'].includes(dossier.InfoPro.etat_depart)),
        autres: result.filter(dossier => !['Actif', 'Retraite', 'Décédé'].includes(dossier.InfoPro.etat_depart))
      });
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  const renderDossiersTable = (dossiersList, title) => (
    <CCard className="mb-4 bg-dark text-light">
      <CCardHeader className="bg-secondary text-light">{title}</CCardHeader>
      <CCardBody>
        {dossiersList.length > 0 ? (
          <CTable striped hover className="text-light">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Matricule</CTableHeaderCell>
                <CTableHeaderCell>Nom</CTableHeaderCell>
                <CTableHeaderCell>Prénom</CTableHeaderCell>
                <CTableHeaderCell>Service</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {dossiersList.map(dossier => (
                <CTableRow key={dossier.id_dossier} className="text-light">
                  <CTableDataCell>{dossier.matricule}</CTableDataCell>
                  <CTableDataCell>{dossier.InfoIdent.nom}</CTableDataCell>
                  <CTableDataCell>{dossier.InfoIdent.prenom}</CTableDataCell>
                  <CTableDataCell>{dossier.InfoPro.poste_actuel_service}</CTableDataCell>
                  <CTableDataCell>
                    <Link to={`/admin/edit-dossier/${dossier.id_dossier}`} className="btn btn-warning me-2">Modifier</Link>
                    <Link to={`/admin/profile/${dossier.id_dossier}`} className="btn btn-secondary me-2">Plus</Link>
                    <Link to={`/admin/profile/gerer-etat/${dossier.id_dossier}`} className="btn btn-primary me-2">Gérer État</Link>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        ) : (
          <p className="text-light">Aucun dossier trouvé.</p>
        )}
      </CCardBody>
    </CCard>
  );

  return (
    <div className="dashboard bg-dark text-light">
      <div className="container p-3">
        <CForm className="row g-3 align-items-center mb-4">
          <div className="col-4">
            <CFormInput
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Nom"
              className="bg-dark text-light"
            />
          </div>
          <div className="col-4">
            <CFormInput
              id="service"
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="Service"
              className="bg-dark text-light"
            />
          </div>
          <div className="col-auto">
            <CButton onClick={handleSearch} color="secondary">
              Rechercher
            </CButton>
          </div>
        </CForm>
        
        <Link to="/admin/create-dossier" className="btn btn-primary mb-3">Créer un nouveau dossier</Link>
        
        {renderDossiersTable(dossiers.actifs, 'Dossiers Actifs')}
        {renderDossiersTable(dossiers.autres, 'Autres Dossiers')}
        {renderDossiersTable(dossiers.retireesDecedes, 'Dossiers Retraités ou Décédés')}
      </div>
    </div>
  );
};

export default DossierList;
