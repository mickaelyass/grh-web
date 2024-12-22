import React, { useEffect, useState } from 'react';
import { getUtilisateurs, deleteUtilisateur } from '../../../services/apiUser';
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

const UtilisateurList = () => {
  const [Utilisateurs, setUtilisateurs] = useState([]);

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const fetchUtilisateurs = async () => {
    try {
      const response = await getUtilisateurs();
      setUtilisateurs(response.data);
    } catch (error) {
      console.error('Error fetching Utilisateurs', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");
      if (confirmDelete) {
        await deleteUtilisateur(id);
        fetchUtilisateurs();
      }
    } catch (error) {
      console.error('Error deleting utilisateur:', error);
    }
  };

  return (
    <div className="dashboard">
      <CCard className="mb-4">
        <CCardHeader className="">
          <h1 className="card-title">Utilisateurs</h1>
        </CCardHeader>
        <CCardBody className="">
          <Link to="/register" className="btn btn-primary mb-3">
            Créer un nouvel utilisateur
          </Link>
          <CTable striped hover className="">
            <CTableHead>
              <CTableRow className="">
                <CTableHeaderCell>Matricule</CTableHeaderCell>
                <CTableHeaderCell>Rôle</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {Utilisateurs.map((Utilisateur) => (
                <CTableRow key={Utilisateur.id_user}>
                  <CTableDataCell>{Utilisateur.matricule}</CTableDataCell>
                  <CTableDataCell>{Utilisateur.role}</CTableDataCell>
                  <CTableDataCell>
                    <Link to={`/admin/edit-utilisateur/${Utilisateur.id_user}`} className="btn btn-secondary me-2">
                      Éditer
                    </Link>
                    <CButton color="danger" onClick={() => handleDelete(Utilisateur.id_user)}>
                      Supprimer
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          {Utilisateurs.length === 0 && <p className="">Aucun utilisateur trouvé.</p>}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default UtilisateurList;
