import React, { useEffect, useState } from 'react';
import { getDossiers } from '../../../services/api';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react';
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
      <CCard className="mb-4">
        <CCardHeader>
          <h2 className="card-title">Liste des Utilisateurs</h2>
        </CCardHeader>
        <CCardBody>
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Nom</CTableHeaderCell>
                <CTableHeaderCell>Prénom</CTableHeaderCell>
                <CTableHeaderCell>Matricule</CTableHeaderCell>
                <CTableHeaderCell>Rôle</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {dossiers.map((dossier) => (
                <CTableRow key={dossier.id_dossier}>
                  <CTableDataCell>{dossier.InfoIdent?.nom || '-'}</CTableDataCell>
                  <CTableDataCell>{dossier.InfoIdent?.prenom || '-'}</CTableDataCell>
                  <CTableDataCell>{dossier.matricule}</CTableDataCell>
                  <CTableDataCell>{dossier.Utilisateur?.role || '-'}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          {dossiers.length === 0 && <p className="text-center mt-3">Aucun utilisateur trouvé.</p>}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default UtilisateurListD;
