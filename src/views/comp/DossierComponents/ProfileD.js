import React, { useEffect, useState } from 'react';
import { getDossier} from '../../../services/api';
import { useParams} from 'react-router-dom';
import ImageProfileEmploye from '../ImageProfileEmploye';
import '../Dasbord.css'
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CAlert,
  CListGroup,
  CListGroupItem,
  CBadge,
} from '@coreui/react';

const ProfileD = () => {
  const { id} = useParams();
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
  console.log(id);
  const [dossier, setDossier] = useState(null);

  useEffect(() => {
    fetchDossier();
    console.log(dossier);
  },[id]);

  const fetchDossier = async () => {
    try {
      const response = await getDossier(id);
      setDossier(response.data);
    } catch (error) {
        setError(error.message);
      }
      finally {
        setLoading(false);
      }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'eeee dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  };

  const renderField = (label, value, isBadge = false) => {
    if (!value) return null;
    return (
      <CListGroupItem>
        <strong>{label}:</strong> {isBadge ? <CBadge color="info">{value}</CBadge> : value}
      </CListGroupItem>
    );
  };

  if (loading) {
    return <div className="text-center mt-5"><CSpinner color="primary" /></div>;
  }

  if (error) {
    return <CAlert color="danger" className="text-center mt-5">{error}</CAlert>;
  }

  if (!dossier) {
    return <CAlert color="info" className="text-center mt-5">No dossier found.</CAlert>;
  }

  return (
    
    <CRow className="dashboard">
      <CCol md={12} lg={12} className="main-content">
        <div className="container mt-5">
          <CCard className="shadow">
            <CCardHeader className="bg-primary text-white">
              <h2 className="mb-0">
                Profile de {dossier.InfoIdent.prenom} {dossier.InfoIdent.nom}
              </h2>
            </CCardHeader>
            <CCardBody>
              <CListGroup>
                <h4 className="text-primary">Utilisateur</h4>
                {renderField('Matricule', dossier.Utilisateur.matricule)}
                {renderField('Role', dossier.Utilisateur.role, true)}

                <h4 className="text-primary mt-4">Informations Identitaires</h4>
                {renderField('CNSS', dossier.InfoIdent.cnss)}
                {renderField('Nom du conjoint', dossier.InfoIdent.nom_du_conjoint)}
                {renderField('Sexe', dossier.InfoIdent.sexe)}
                {renderField('Date de naissance', formatDate(dossier.InfoIdent.dat_nat))}
                {renderField('Lieu de naissance', dossier.InfoIdent.lieu_nat)}
                {renderField('Situation matrimoniale', dossier.InfoIdent.situat_matri)}
                {renderField('Email', dossier.InfoIdent.email)}
                {renderField('Date de mariage', formatDate(dossier.InfoIdent.dat_mariage))}
                {renderField('Nombre d\'enfants', dossier.InfoIdent.nbre_enfants)}

                <h4 className="text-primary mt-4">Informations Professionnelles</h4>
                {renderField('Statut', dossier.InfoPro.statut)}
                {renderField('Date prise de fonction', formatDate(dossier.InfoPro.dat_prise_fonction))}
                {renderField('Date de départ en retraite', formatDate(dossier.InfoPro.dat_de_depart_retraite))}
                {renderField('Date de prise de service dans le département', formatDate(dossier.InfoPro.dat_de_prise_service_dans_departement))}
                {renderField('Date première prise de service', formatDate(dossier.InfoPro.dat_first_prise_de_service))}

                <h4 className="text-primary mt-4">Informations Bancaires</h4>
                {renderField('RIB', dossier.InfoBank.rib)}
                {renderField('MTN', dossier.InfoBank.mtn)}
                {renderField('Celtics', dossier.InfoBank.celtics)}
                {renderField('Libercom', dossier.InfoBank.libercom)}

                <h4 className="text-primary mt-4">Informations Complémentaires</h4>
                {renderField('Observation particulière', dossier.InfoComplementaire.observation_particuliere)}
                {renderField('Détail distinction', dossier.InfoComplementaire.detail_distinction)}
                {renderField('Situation santé', dossier.InfoComplementaire.situat_sante)}
                {renderField('Sanction punitive', dossier.InfoComplementaire.saction_punitive)}
              </CListGroup>
            </CCardBody>
          </CCard>
        </div>
      </CCol>
    </CRow>
   
  );

};

export default ProfileD;
