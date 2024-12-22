import React, { useState } from 'react';
import { requestPasswordReset } from '../../../services/apiUser';
import {
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CContainer,
  CAlert,
  CRow,
} from '@coreui/react'

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [matricule, setMatricule] = useState(''); // Add matricule state
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await requestPasswordReset({ email, matricule }); // Include matricule in request
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError('Impossible d\'envoyer l\'e-mail de réinitialisation');
      setMessage('');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
  <div className="container col-6 p-4  rounded shadow">
    <h3 className="text-primary">Mot de passe oublié</h3>
    {message && <div className="alert alert-success">{message}</div>}
    {error && <div className="alert alert-danger">{error}</div>}
    <CForm onSubmit={handleSubmit}>
      <div className="mb-3">
        <CFormLabel htmlFor="matricule">Matricule</CFormLabel>
        <CFormInput
          type="text"
          id="matricule"
          value={matricule}
          onChange={(e) => setMatricule(e.target.value)}
          required
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
        />
      </div>
      <CButton type="submit" color="primary" className="mt-4 w-100">
        Envoyer le lien de réinitialisation
      </CButton>
    </CForm>
  </div>
</div>


  );
};

export default ForgotPassword;
