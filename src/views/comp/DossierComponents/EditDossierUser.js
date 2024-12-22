import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDossier, updateDossier } from '../../services/api';
import DossierFormUser from './DossierFormUser';
import Footer from '../Footer';
import Head from '../Head';
import MenuUser from '../MenuUser';
import '../Dasbord.css'

const EditDossierUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [dossier, setDossier] = useState(null);

  useEffect(() => {
    fetchDossier();
  },[id]);

  const fetchDossier = async () => {
    try {
      const response = await getDossier(id);
      const fetchedDossier = response.data;

      // Assurez-vous que fetchedDossier contient toutes les propriétés nécessaires
      const initialDossier = {
        matricule: fetchedDossier.matricule || '',
        infoIdent: {
          cnss: fetchedDossier.InfoIdent?.cnss || '',
          nom: fetchedDossier.InfoIdent?.nom || '',
          prenom: fetchedDossier.InfoIdent?.prenom || '',
          nom_du_conjoint: fetchedDossier.InfoIdent?.nom_du_conjoint || '',
          sexe: fetchedDossier.InfoIdent?.sexe || '',
          dat_nat: fetchedDossier.InfoIdent?.dat_nat || '',
          lieu_nat: fetchedDossier.InfoIdent?.lieu_nat || '',
          situat_matri: fetchedDossier.InfoIdent?.situat_matri || '',
          email: fetchedDossier.InfoBank?.email || '',
          dat_mariage: fetchedDossier.InfoIdent?.dat_mariage || null,
          nbre_enfants: fetchedDossier.InfoIdent?.nbre_enfants || 0
        },
        infoPro: {
          statut: fetchedDossier.InfoPro?.statut || '',
          corps: fetchedDossier.InfoPro?.corps || '',
          categorie: fetchedDossier.InfoPro?.categorie || '',
          branche_du_personnel: fetchedDossier.InfoPro?.branche_du_personnel || '',
          fonctions: fetchedDossier.InfoPro?.fonctions || '',
          ref_nomination: fetchedDossier.InfoPro?.ref_nomination || '',
          dat_prise_fonction: fetchedDossier.InfoPro?.dat_prise_fonction || null,
          responsabilite_partiuliere: fetchedDossier.InfoPro?.responsabilite_partiuliere || '',
          grade_paye: fetchedDossier.InfoPro?.grade_paye || '',
          indice_paye: fetchedDossier.InfoPro?.indice_paye || 0,
          dat_first_prise_de_service: fetchedDossier.InfoPro?.dat_first_prise_de_service || '',
          dat_de_depart_retraite: fetchedDossier.InfoPro?.dat_de_depart_retraite || '',
          dat_de_prise_service_dans_departement: fetchedDossier.InfoPro?.dat_de_prise_service_dans_departement || '',
          ref_acte_de_prise_service_poste_actuel: fetchedDossier.InfoPro?.ref_acte_de_prise_service_poste_actuel || '',
          poste_actuel_service: fetchedDossier.InfoPro?.poste_actuel_service || '',
          type_structure: fetchedDossier.InfoPro?.type_structure || '',
          zone_sanitaire: fetchedDossier.InfoPro?.zone_sanitaire || '',
          poste_specifique: fetchedDossier.InfoPro?.poste_specifique || '',
          etat_depart: fetchedDossier.InfoPro?.etat_depart || '',
          poste_anterieurs: fetchedDossier.InfoPro?.poste_anterieurs || '',
        },
        infoBank: {
          rib: fetchedDossier.InfoBank?.rib || '',
          mtn: fetchedDossier.InfoBank?.mtn || '',
          celtics: fetchedDossier.InfoBank?.celtics || '',
          moov: fetchedDossier.InfoBank?.libercom || ''
         
        },
        infoComplementaire: {
          observation_particuliere: fetchedDossier.InfoComplementaire?.observation_particuliere || '',
          distinction: fetchedDossier.InfoComplementaire?.distinction || '',
          ref_distinction: fetchedDossier.InfoComplementaire?.ref_distinction || '',
          detail_distinction: fetchedDossier.InfoComplementaire?.detail_distinction || '',
          situat_sante: fetchedDossier.InfoComplementaire?.situat_sante || '',
          saction_punitive: fetchedDossier.InfoComplementaire?.saction_punitive || '',
          nature_sanction: fetchedDossier.InfoComplementaire?.nature_sanction || ''
        }
      };

      setDossier(initialDossier);
    } catch (error) {
      console.error('Error fetching dossier', error);
    }
  };

  const handleSubmit = async (dossierData) => {
    try {
      await updateDossier(id, dossierData);
      navigate('/user-dashbord');
    } catch (error) {
      console.error('Error updating dossier', error);
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="dashboard">
      <Head toggleMenu={toggleMenu} />
      <MenuUser isMenuOpen={isMenuOpen} />
      <main
        className={`content ${
          isMenuOpen ? "content-expanded slide-enter" : "content-collapsed"
        }`}
      >
        <div className="col-md-9 col-lg-10 main-content">
          <div className="container">
            <h1 className='my-3 text-primary'>Editer Dossier</h1>
            {dossier ? (
              <DossierFormUser dossier={dossier} onSubmit={handleSubmit} />
            ) : (
              <p>Chargement du dossier...</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );

};

export default EditDossierUser;