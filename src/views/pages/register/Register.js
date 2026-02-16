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
      <CContainer className="py-5">
      <CRow className="justify-content-center">
        <CCol md={6}>
          <CCard className=" shadow rounded border-0">
            <CCardBody className="p-4">
              <h1 className="text-center  mb-4">Inscription</h1>
              {error && <CAlert color="danger">{error}</CAlert>}
              <UserForm onSubmit={handleSubmit} />
              <p className="text-center my-4">
                Vous avez déjà un compte ? 
                <Link  to="/login" className="mx-2 text-decoration-none">Connexion</Link>
                <Link  to="/register-admin" className="mx-2 text-decoration-none">.</Link>
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
