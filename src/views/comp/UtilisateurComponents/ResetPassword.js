import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../services/apiUser';

const ResetPassword = () => {
  const { resetToken  } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      console.log('Token from URL:', resetToken );
      const response = await resetPassword(resetToken , { password });
      setMessage(response.data.message);
      setError('');
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); // Use backend error message
      } else {
        setError('Erreur lors de la réinitialisation du mot de passe');
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
  <div className="container col-6 p-4  rounded ">
    <h3 className=" text-center">Réinitialiser le mot de passe</h3>
    {message && <div className="alert alert-success">{message}</div>}
    {error && <div className="alert alert-danger">{error}</div>}
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="password">Nouveau mot de passe</label>
        <input
          type="password"
          className="form-control"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="form-group mt-3">
        <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
        <input
          type="password"
          className="form-control"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-success mt-4 w-100">
        Réinitialiser le mot de passe
      </button>
    </form>
  </div>
</div>

  );
};

export default ResetPassword;
