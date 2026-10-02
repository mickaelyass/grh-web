import { Button } from '../../../ui/Button'
import { Card, CardBody, CardHeader } from '../../../ui/Card'
import { Table, TableBody, TableDataCell, TableHead, TableHeaderCell, TableRow } from '../../../ui/Table'
import React, { useEffect, useState } from 'react';
import { deleteUtilisateur } from '../../../services/apiUser';
import { Link } from 'react-router-dom';

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
      <Card className="mb-4">
        <CardHeader>
          <h1 className="card-title">Utilisateurs</h1>
        </CardHeader>
        <CardBody>
          <Link to="/register" className="btn btn-primary mb-3">
            Créer un nouvel utilisateur
          </Link>
          <Table striped hover>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Nom</TableHeaderCell>
                <TableHeaderCell>Prénom</TableHeaderCell>
                <TableHeaderCell>Matricule</TableHeaderCell>
                <TableHeaderCell>Rôle</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dossiers.map((dossier) => (
                <TableRow key={dossier.id_dossier}>
                  <TableDataCell>{dossier.InfoIdent?.nom || '-'}</TableDataCell>
                  <TableDataCell>{dossier.InfoIdent?.prenom || '-'}</TableDataCell>
                  <TableDataCell>{dossier.matricule}</TableDataCell>
                  <TableDataCell>{dossier.Utilisateur?.role || '-'}</TableDataCell>
                  <TableDataCell>
                    <Link to={`/admin/edit-utilisateur/${dossier.Utilisateur?.id_user}`} className="btn btn-secondary me-2">
                      Éditer
                    </Link>
                    <Button color="danger" onClick={() => handleDelete(dossier.Utilisateur?.id_user)}>
                      Supprimer
                    </Button>
                  </TableDataCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {dossiers.length === 0 && <p>Aucun utilisateur trouvé.</p>}
        </CardBody>
      </Card>
    </div>
  );
};

export default UtilisateurList;
