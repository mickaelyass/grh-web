import Alert from '../../../ui/Alert'
import Button from '../../../ui/Button'
import { Card, CardBody } from '../../../ui/Card'
import { Col, Container, Row } from '../../../ui/Grid'
import React, { useState } from 'react'
import { useNavigate,Link } from 'react-router-dom'

import OtherForm from '../../forms/otherform'
import { register } from '../../../services/apiUser'
//import logo from '../../bj.png'; // Assurez-vous que le chemin vers le logo est correct

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (userData) => {
    try {
      await register(userData);
      navigate('/login') ;// Rediriger vers la page de connexion après une inscription réussie
    } catch (error) {
      console.error("Erreur lors de l'inscription de l'utilisateur : ", error.response || error.message);
      // Le backend renvoie { error: '...' } ; 401 = session absente/expirée.
      const status = error.response?.status;
      setError(
        status === 401
          ? "Session expirée : reconnectez-vous avec un compte administrateur, puis réessayez."
          : error.response?.data?.error || "Échec de l'inscription (matricule déjà attribué ?)",
      );
    }
  }

  return (
    <div>
      <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className=" shadow rounded border-0">
            <CardBody className="p-4">
              <h1 className="text-center  mb-4">Inscription</h1>
              {error && <Alert color="danger">{error}</Alert>}
              <OtherForm onSubmit={handleSubmit} />
              <p className="text-center my-4">
                Vous avez déjà un compte ? 
                <Link  to="/login" className="mx-2 text-decoration-none ">Connexion</Link>
              </p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
    </div>
  )
}

export default Register
