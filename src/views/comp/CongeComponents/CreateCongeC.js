import React from 'react';
import CongeForm from '../CongeComponents/CongeForm';
import { createDemandeConges } from '../../../services/apiConge';
import '../Dasbord.css';
import { useNavigate } from 'react-router-dom';
import { CCard, CCardHeader, CCardBody, CRow, CCol } from '@coreui/react';

const CreateCongeC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('matricule', values.matricule);
    formData.append('date_debut', values.date_debut);
    formData.append('annee_jouissance', values.annee_jouissance);
    formData.append('raison', values.raison);
    if (values.piece_jointe_1) {
      formData.append('certificat', values.piece_jointe_1);
    }

    if (values.piece_jointe_2) {
      formData.append('attestation', values.piece_jointe_2);
    }

    try {
      await createDemandeConges(formData);
      alert('Demande soumise avec succès');
      navigate('/chef-service/dashboard');
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la création de la demande de congés');
    }
  };

  return (
    <div className="dashboard">
      <CRow>
        <CCol md={3} lg={2} className="bg-light sidebar"></CCol>
        <CCol md={9} lg={10} className="main-content">
          <CCard className="shadow-sm">
            <CCardHeader className="text-light bg-primary rounded py-2 ps-2 mb-3">
              <h1>Créer une Demande de Congés</h1>
            </CCardHeader>
            <CCardBody>
              <CongeForm onSubmit={handleSubmit} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default CreateCongeC;
