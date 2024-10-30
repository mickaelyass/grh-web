import React, { useState } from 'react';
import { requestPasswordReset } from '../../services/apiUser';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CAlert,
} from '@coreui/react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [matricule, setMatricule] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await requestPasswordReset({ email, matricule });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError("Impossible d'envoyer l'e-mail de réinitialisation");
      setMessage('');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <CCard className="col-md-6 p-0 shadow">
        <CCardHeader className="bg-success text-light text-center">
          <h3>Mot de passe oublié</h3>
        </CCardHeader>
        <CCardBody className="bg-light">
          {message && <CAlert color="success">{message}</CAlert>}
          {error && <CAlert color="danger">{error}</CAlert>}
          <CForm onSubmit={handleSubmit}>
            <div className="mb-3">
              <CFormLabel htmlFor="matricule">Matricule</CFormLabel>
              <CFormInput
                type="text"
                id="matricule"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                required
                placeholder="Entrez votre matricule"
              />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="email">Email</CFormLabel>
              <CFormInput
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Entrez votre adresse email"
              />
            </div>
            <CButton type="submit" color="success" className="w-100 mt-3">
              Envoyer le lien de réinitialisation
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default ForgotPassword;
