import React, { useEffect, useState } from "react";
import { useParams ,useNavigate} from "react-router-dom";
import { CCard, CCardBody, CCardHeader, CCol, CContainer, CRow, CSpinner, CButton } from "@coreui/react";
import { getDossier, updateDossier } from "../../../services/api";
import DossierForm from "./DossierForm";
import "../Dasbord.css";

const EditDossier = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDossier();
  }, [id]);

  const fetchDossier = async () => {
    setLoading(true);
    try {
      const response = await getDossier(id);
      const fetchedDossier = response.data;
      const initialDossier = {
        matricule: fetchedDossier.matricule || "",
        infoIdent: {
          cnss: fetchedDossier.InfoIdent?.cnss || "",
          nom: fetchedDossier.InfoIdent?.nom || "",
          prenom: fetchedDossier.InfoIdent?.prenom || "",
          nom_du_conjoint: fetchedDossier.InfoIdent?.nom_du_conjoint || "",
          sexe: fetchedDossier.InfoIdent?.sexe || "",
          dat_nat: fetchedDossier.InfoIdent?.dat_nat || "",
          lieu_nat: fetchedDossier.InfoIdent?.lieu_nat || "",
          situat_matri: fetchedDossier.InfoIdent?.situat_matri || "",
          email: fetchedDossier.InfoIdent?.email || "",
          dat_mariage: fetchedDossier.InfoIdent?.dat_mariage || null,
          nbre_enfants: fetchedDossier.InfoIdent?.nbre_enfants || 0,
        },
        infoPro: {
          statut: fetchedDossier.InfoPro?.statut || "",
          corps: fetchedDossier.InfoPro?.corps || "",
          categorie: fetchedDossier.InfoPro?.categorie || "",
          branche_du_personnel: fetchedDossier.InfoPro?.branche_du_personnel || "",
          fonctions: fetchedDossier.InfoPro?.fonctions || "",
          ref_nomination: fetchedDossier.InfoPro?.ref_nomination || "",
          dat_prise_fonction: fetchedDossier.InfoPro?.dat_prise_fonction || "",
          responsabilite_partiuliere: fetchedDossier.InfoPro?.responsabilite_partiuliere || "",
          grade_paye: fetchedDossier.InfoPro?.grade_paye || "",
          indice_paye: fetchedDossier.InfoPro?.indice_paye || 0,
          dat_first_prise_de_service: fetchedDossier.InfoPro?.dat_first_prise_de_service || "",
          dat_de_depart_retraite: fetchedDossier.InfoPro?.dat_de_depart_retraite || "",
          dat_de_prise_service_dans_departement: fetchedDossier.InfoPro?.dat_de_prise_service_dans_departement || null,
          ref_acte_de_prise_service_poste_actuel: fetchedDossier.InfoPro?.ref_acte_de_prise_service_poste_actuel || "",
          poste_actuel_service: fetchedDossier.InfoPro?.poste_actuel_service || "",
          type_structure: fetchedDossier.InfoPro?.type_structure || "",
          zone_sanitaire: fetchedDossier.InfoPro?.zone_sanitaire || "",
          poste_specifique: fetchedDossier.InfoPro?.poste_specifique || "",
          etat_depart: fetchedDossier.InfoPro?.etat_depart || "",
          poste_anterieurs: fetchedDossier.InfoPro?.poste_anterieurs || "",
          autres_diplome: fetchedDossier.InfoPro?.autres_diplome || "",
        },
        infoBank: {
          rib: fetchedDossier.InfoBank?.rib || "",
          mtn: fetchedDossier.InfoBank?.mtn || "",
          celtics: fetchedDossier.InfoBank?.celtics || "",
          libercom: fetchedDossier.InfoBank?.libercom || ""
        },
        infoComplementaire: {
          observation_particuliere: fetchedDossier.InfoComplementaire?.observation_particuliere || "",
          distinction: fetchedDossier.InfoComplementaire?.distinction || "",
          ref_distinction: fetchedDossier.InfoComplementaire?.ref_distinction || "",
          detail_distinction: fetchedDossier.InfoComplementaire?.detail_distinction || "",
          situat_sante: fetchedDossier.InfoComplementaire?.situat_sante || "",
          saction_punitive: fetchedDossier.InfoComplementaire?.saction_punitive || "",
          nature_sanction: fetchedDossier.InfoComplementaire?.nature_sanction || "",
        },
      };
      setDossier(initialDossier);
    } catch (error) {
      console.error("Error fetching dossier", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (dossierData) => {
    try {
      alert("cool");
      await updateDossier(id, dossierData);
      alert("co88ol");
       navigate('/admin/dossier-list');
    } catch (error) {
      console.error("Error updating dossier", error);
    } 

    
  };

  return (
    <CContainer className="dashboard">
      <CRow className="justify-content-center">
        <CCol xs={12} md={12} lg={12}>
          <CCard className="shadow-sm">
            <CCardHeader>
              <h1 className="text-primary">Éditer Dossier</h1>
            </CCardHeader>
            <CCardBody>
              {loading ? (
                <div className="text-center">
                  <CSpinner color="primary" />
                  <p>Chargement du dossier...</p>
                </div>
              ) : (
                dossier && (
                  <>
                    <DossierForm dossier={dossier} onSubmit={handleSubmit} />
                   {/*  <CButton color="primary" className="mt-3" onClick={() => handleSubmit(dossier)}>
                      Enregistrer les modifications
                    </CButton> */}
                  </>
                )
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default EditDossier;
