import React, { useState } from 'react'
import { useNavigate,Link } from 'react-router-dom'

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CAlert,
  CRow,
} from '@coreui/react'

import OtherForm from '../../forms/otherform'
import { register } from '../../../services/apiUser'
//import logo from '../../bj.png'; // Assurez-vous que le chemin vers le logo est correct

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (userData) => {
    console.log("Données utilisateur à enregistrer : ", userData);
    try {
      console.log("Données utilisateur à enregistrer : ", userData);
      await register(userData);
      navigate('/login') ;// Rediriger vers la page de connexion après une inscription réussie
    } catch (error) {
      console.error("Erreur lors de l'inscription de l'utilisateur : ", error.response || error.message);
      setError(error.response?.data?.message || 'Le matricule est déjà attribué');
    }
  }

  return (
    <div>
      <CContainer className="py-5">
      <CRow className="justify-content-center">
        <CCol md={6}>
          <CCard className="bg-dark shadow rounded border-0">
            <CCardBody className="p-4">
              <h1 className="text-center text-primary mb-4">Inscription</h1>
              {error && <CAlert color="danger">{error}</CAlert>}
              <OtherForm onSubmit={handleSubmit} />
              <p className="text-center my-4">
                Vous avez déjà un compte ? 
                <Link  to="/login" className="mx-2 text-decoration-none text-primary">Connexion</Link>
              </p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
    </div>
  )
}

export default Register
