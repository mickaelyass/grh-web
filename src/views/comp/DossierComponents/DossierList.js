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
import { FaEdit, FaPlus, FaEye, FaTrash } from 'react-icons/fa'; // Importer des icônes

const DossierList = () => {
  const [dossiers, setDossiers] = useState({
    actifs: [],
    retireesDecedes: [],
    autres: []
  });

  const [nom, setNom] = useState('');
  const [service, setService] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    fetchDossiers();
  }, []);

  const fetchDossiers = async () => {
    try {
      const response = await getDossiers();
      const allDossiers = response.data;

      const actifs = allDossiers.filter(dossier => {
        const details = dossier.InfoPro?.Details;
        const lastDetail = Array.isArray(details) && details.length > 0 ? details[0] : null;
        return lastDetail && ['Actif'].includes(lastDetail.etat);
      });

      const retireesDecedes = allDossiers.filter(dossier => {
        const details = dossier.InfoPro?.Details;
        const lastDetail = Array.isArray(details) && details.length > 0 ? details[0] : null;
        return lastDetail && ['Retraite', 'Décédé'].includes(lastDetail.etat);
      });

      const autres = allDossiers.filter(dossier => {
        const details = dossier.InfoPro?.Details;
        const lastDetail = Array.isArray(details) && details.length > 0 ? details[0] : null;
        return lastDetail && !['Actif', 'Retraite', 'Décédé'].includes(lastDetail.etat);
      });

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
      const response = await getDossierSearch(nom, service);
      const result = response.data;
      setDossiers({
        actifs: result.filter(dossier => {
          const details = dossier?.InfoPro?.Details || [];
          const lastDetail = details[0] || null;
          return lastDetail && lastDetail.etat === 'Actif';
        }),

        retireesDecedes: result.filter(dossier => {
          const details = dossier?.InfoPro?.Details || [];
          const lastDetail = details[0] || null;
          return lastDetail && ['Retraite', 'Décédé'].includes(lastDetail.etat);
        }),

        autres: result.filter(dossier => {
          const details = dossier?.InfoPro?.Details || [];
          const lastDetail = details[0] || null;
          return lastDetail && !['Actif', 'Retraite', 'Décédé'].includes(lastDetail.etat);
        }),
      });
      
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    }
  };

  const renderDossiersTable = (dossiersList, title) => (
    <CCard className="mb-4">
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
                <CTableHeaderCell>Télephone</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
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
                  <CTableDataCell>{dossier.InfoBank.mtn}</CTableDataCell>
                  <CTableDataCell>{dossier.InfoIdent.email}</CTableDataCell>
                  <CTableDataCell className="d-flex">
                    <Link to={`/admin/edit-dossier/${dossier.id_dossier}`} className="btn btn-warning me-2 p-1" aria-label="Modifier">
                      <FaEdit />
                    </Link>
                    <Link to={`/admin/profile/${dossier.id_dossier}`} className="btn btn-secondary me-2 p-1" aria-label="Plus">
                      <FaEye />
                    </Link>
                    <Link to={`/admin/profile/gerer-etat/${dossier.id_dossier}`} className="btn btn-primary me-2 p-1" aria-label="Gérer État">
                      <FaPlus />
                    </Link>
                    <button onClick={() => handleDelete(dossier.id_dossier)} className="btn btn-danger p-1" aria-label="Supprimer">
                      <FaTrash />
                    </button>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        ) : (
          <p>Aucun dossier trouvé.</p>
        )}
      </CCardBody>
    </CCard>
  );

  return (
    <div className="dashboard">
      <div className="container p-3">
        <CForm className="row g-3 align-items-center mb-4">
          <div className="col-4">
            <CFormInput
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Nom"
            />
          </div>
          <div className="col-4">
            <CFormInput
              id="service"
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="Service"
            />
          </div>
          <div className="col-auto">
            <CButton onClick={handleSearch} color="secondary">
              Rechercher
            </CButton>
          </div>
        </CForm>

        <Link to="/admin/create-dossier" className="btn btn-primary mb-3">Créer un nouveau dossier</Link>
        
        {renderDossiersTable(dossiers.actifs, 'Dossiers des agents Actifs')}
        {renderDossiersTable(dossiers.autres, 'Autres des agents mutés ou autres')}
        {renderDossiersTable(dossiers.retireesDecedes, 'Dossiers des agents Retraités ou Décédés')}
      </div>
    </div>
  );
};

export default DossierList;
