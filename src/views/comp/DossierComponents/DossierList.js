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
  const [result, setResult] = useState('');

  useEffect(() => {
    fetchDossiers();
  }, []);

  const fetchDossiers = async () => {
    try {
      const response = await getDossiers();
      const allDossiers = response.data;
      console.log(allDossiers);

      // Filtrer les actifs
  const actifs = allDossiers.filter(dossier => {
  const details = dossier.InfoPro?.Details;
  const lastDetail = Array.isArray(details) && details.length > 0 ? details[details.length - 1] : null;
  return lastDetail && ['Actif'].includes(lastDetail.etat);
});
console.log('Actifs:', actifs);

// Filtrer les retraites et décédés
const retireesDecedes = allDossiers.filter(dossier => {
  const details = dossier.InfoPro?.Details;
  const lastDetail = Array.isArray(details) && details.length > 0 ? details[details.length - 1] : null;
  return lastDetail && ['Retraite', 'Décédé'].includes(lastDetail.etat);
});
console.log('Retraites ou Décédés:', retireesDecedes);

// Filtrer les autres
const autres = allDossiers.filter(dossier => {
  const details = dossier.InfoPro?.Details;
  const lastDetail = Array.isArray(details) && details.length > 0 ? details[details.length - 1] : null;
  return lastDetail && !['Actif', 'Retraite', 'Décédé'].includes(lastDetail.etat);
});
console.log('Autres:', autres);


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
      const result = response.data;  // Données retournées par l'API
      console.log(result);
      setDossiers({
        // Filtrer les dossiers actifs
        actifs: result.filter(dossier => {
          const details = dossier?.InfoPro?.Details || [];
          const lastDetail = details[details.length - 1] || null;
          return lastDetail && lastDetail.etat === 'Actif';
        }),
  
        // Filtrer les retraites et décédés
        retireesDecedes: result.filter(dossier => {
          const details = dossier?.InfoPro?.Details || [];
          const lastDetail = details[details.length - 1] || null;
          return lastDetail && ['Retraite', 'Décédé'].includes(lastDetail.etat);
        }),
  
        // Filtrer les autres
        autres: result.filter(dossier => {
          const details = dossier?.InfoPro?.Details || [];
          const lastDetail = details[details.length - 1] || null;
          return lastDetail && !['Actif', 'Retraite', 'Décédé'].includes(lastDetail.etat);
        }),
      });
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    }
  };
  

  const renderDossiersTable = (dossiersList, title) => (
    <CCard className="mb-4t">
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
                    <button onClick={() => handleDelete(dossier.id_dossier)} className=" btn btn-danger me-2">Supprimer</button>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        ) : (
          <p className="">Aucun dossier trouvé.</p>
        )}
      </CCardBody>
    </CCard>
  );

  return (
    <div className="dashboard ">
      <div className="container p-3">
        <CForm className="row g-3 align-items-center mb-4">
          <div className="col-4">
            <CFormInput
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Nom"
              className=""
            />
          </div>
          <div className="col-4">
            <CFormInput
              id="service"
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="Service"
              className=""
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
