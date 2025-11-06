import React, { useEffect, useState } from 'react';
import { deleteUtilisateur } from '../../../services/apiUser';
import { Link } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react';
import '../Dasbord.css';
import { getDossiers } from '../../../services/api';

const UtilisateurList = () => {
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

  const handleDelete = async (id) => {
  try {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");
    if (confirmDelete) {
      await deleteUtilisateur(id);
      fetchDossiers();
      alert('Utilisateur supprimé avec succès');
    }
  } catch (error) {
    // error.response.data.error contiendra le message d'erreur envoyé par le backend
    alert(`Erreur: ${error.response?.data?.error || 'Erreur lors de la suppression'}`);
  }
};


  return (
      <div className="dashboard">
      <CCard className="mb-4">
        <CCardHeader>
          <h1 className="card-title">Utilisateurs</h1>
        </CCardHeader>
        <CCardBody>
          <Link to="/register" className="btn btn-primary mb-3">
            Créer un nouvel utilisateur
          </Link>
          <CTable striped hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Nom</CTableHeaderCell>
                <CTableHeaderCell>Prénom</CTableHeaderCell>
                <CTableHeaderCell>Matricule</CTableHeaderCell>
                <CTableHeaderCell>Rôle</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {dossiers.map((dossier) => (
                <CTableRow key={dossier.id_dossier}>
                  <CTableDataCell>{dossier.InfoIdent?.nom || '-'}</CTableDataCell>
                  <CTableDataCell>{dossier.InfoIdent?.prenom || '-'}</CTableDataCell>
                  <CTableDataCell>{dossier.matricule}</CTableDataCell>
                  <CTableDataCell>{dossier.Utilisateur?.role || '-'}</CTableDataCell>
                  <CTableDataCell>
                    <Link to={`/admin/edit-utilisateur/${dossier.Utilisateur?.id_user}`} className="btn btn-secondary me-2">
                      Éditer
                    </Link>
                    <CButton color="danger" onClick={() => handleDelete(dossier.Utilisateur?.id_user)}>
                      Supprimer
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          {dossiers.length === 0 && <p>Aucun utilisateur trouvé.</p>}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default UtilisateurList;
