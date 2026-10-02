import React from 'react';
import CongeForm from '../CongeComponents/CongeForm';
import { createDemandeConges } from '../../../services/apiConge';
import '../Dasbord.css';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader } from '../../../ui/Card'
import { Col, Row } from '../../../ui/Grid'

const CreateCongeG = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('matricule', values.matricule);
    formData.append('type_conge', values.type_conge);
    formData.append('date_debut', values.date_debut);
    formData.append('annee_jouissance', values.annee_jouissance);
    formData.append('nombre_de_jour', values.nombre_de_jour);
    formData.append('date_de_fin', values.date_de_fin);
    formData.append('raison', values.raison);
    if (values.piece_jointe_1) {
      formData.append('certificat', values.piece_jointe_1);
    }

    if (values.piece_jointe_2) {
      formData.append('attestation', values.piece_jointe_2);
    }

    try {
      await createDemandeConges(formData);
   
      navigate('/securite/dashboard');
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la création de la demande de congés');
    }
  };

  return (
    <div className="dashboard">
      <Row>
        <Col md={3} lg={2} className="bg-light sidebar"></Col>
        <Col md={9} lg={10} className="main-content">
          <Card className="shadow-sm">
            <CardHeader className="text-light bg-primary rounded py-2 ps-2 mb-3">
              <h1>Créer une Demande de Congés</h1>
            </CardHeader>
            <CardBody>
              <CongeForm onSubmit={handleSubmit} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreateCongeG;
