import { Alert } from '../../../ui/Alert'
import { Button } from '../../../ui/Button'
import { Card, CardBody } from '../../../ui/Card'
import { Col, Container, Row } from '../../../ui/Grid'
import React, { useState } from 'react'
import { useNavigate,Link } from 'react-router-dom'

import UserForm from '../../forms/userForm'
import { register } from '../../../services/apiUser'
//import logo from '../../bj.png'; // Assurez-vous que le chemin vers le logo est correct

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (userData) => {
    try {
      await register(userData);
    
      // Rediriger vers la page de connexion après une inscription réussie
    } catch (error) {
      console.error("Erreur lors de l'inscription de l'utilisateur : ", error);
      setError(error.response?.data?.message || 'Le matricule est déjà attribué');
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
              <UserForm onSubmit={handleSubmit} />
              <p className="text-center my-4">
                Vous avez déjà un compte ? 
                <Link  to="/login" className="mx-2 text-decoration-none">Connexion</Link>
                <Link  to="/register-admin" className="mx-2 text-decoration-none">.</Link>
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
