import React,{useState} from 'react';
import { register } from '../../services/apiUser';
import UtilisateurForm from './UtilisateurForm';
import { useNavigate } from 'react-router-dom';
import logo from '../../bj.png'

const RegisterUtilisateur = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (userData) => {
    try {
      await register(userData);
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      console.error('Error registering user', error);
      setError( 'Le matricule est deja attribué');
    }
  };

  return (
    <div>
         <header className="row py-4 bg-clair  text-dark mb-4">
        <div>
        <img className='ms-5' alt='' src={logo} width="70px" height='60px'></img>
         
          <span className='text-light mx-5 h2  my-auto'>Direction Départementale de la Santé littoral</span></div> 
      </header>
       <div className="container col-6 p-3 px-auto py-auto my-auto bg-light rounded">
      
      <h1 className='text-clair'>Inscription</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <UtilisateurForm onSubmit={handleSubmit} />
      <p className=' my-4'>Vous avez  deja un compte ?
          <a href='/login' className=' mx-3'> Connexion</a>
        </p>
    </div>
    
    </div>
   
  );
};

export default RegisterUtilisateur;