import Button from '../../../ui/Button'
import { Card, CardBody, CardHeader } from '../../../ui/Card'
import { Table, TableBody, TableDataCell, TableHead, TableHeaderCell, TableRow } from '../../../ui/Table'
import React, { useEffect, useState } from 'react';
import { deleteUtilisateur, getUtilisateurs } from '../../../services/apiUser';
import { Link } from 'react-router-dom';

import '../Dasbord.css';

const UtilisateurList = () => {
   const [utilisateurs, setUtilisateurs] = useState([]);
   const [erreur, setErreur] = useState(null);

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const fetchUtilisateurs = async () => {
    setErreur(null);
    try {
      const response = await getUtilisateurs();
      // L'API renvoie { data: [...], meta: {...} } (pagination) : c'est `data.data`
      // qu'il faut lire. Utiliser `response.data` tel quel faisait planter le
      // rendu dès que la liste n'était pas un tableau.
      setUtilisateurs(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs', error);
      setErreur("Impossible de charger les comptes utilisateurs.");
    }
  };

  const handleDelete = async (id) => {
  try {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");
    if (confirmDelete) {
      await deleteUtilisateur(id);
      fetchUtilisateurs();
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
          <h1 className="card-title">Comptes utilisateurs</h1>
        </CardHeader>
        <CardBody>
          <Link to="/admin/register" className="btn btn-primary mb-3">
            Créer un nouvel utilisateur
          </Link>
          {erreur && <p className="text-danger">{erreur}</p>}
          <Table striped hover>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Matricule</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Rôle</TableHeaderCell>
                <TableHeaderCell>État</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {utilisateurs.map((utilisateur) => (
                <TableRow key={utilisateur.id_user}>
                  <TableDataCell>{utilisateur.matricule}</TableDataCell>
                  <TableDataCell>{utilisateur.email || '-'}</TableDataCell>
                  <TableDataCell>{utilisateur.role}</TableDataCell>
                  <TableDataCell>{utilisateur.is_active ? 'Actif' : 'Inactif'}</TableDataCell>
                  <TableDataCell>
                    <Link to={`/admin/edit-utilisateur/${utilisateur.id_user}`} className="btn btn-secondary me-2">
                      Éditer
                    </Link>
                    <Button color="danger" onClick={() => handleDelete(utilisateur.id_user)}>
                      Supprimer
                    </Button>
                  </TableDataCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {utilisateurs.length === 0 && !erreur && <p>Aucun utilisateur trouvé.</p>}
        </CardBody>
      </Card>
    </div>
  );
};

export default UtilisateurList;
