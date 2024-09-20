import React,{useState} from 'react';
import { register } from '../../services/apiUser';
import { useNavigate } from 'react-router-dom';
import AdminForm from './AdminForm';


const RegisterAdmin = () => {
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
        <header className="row py-4 bg-light text-primary mb-4">
        <div>
        <img className='mx-5' alt='' src='/frontend/src/bj.png' width="60px" height='60px'></img>
          <span className='text-center h2 mx-5 my-auto'>DDS littoral</span></div> 
      </header>
       <div className="container col-6 p-3 px-auto py-auto my-auto bg-light rounded">
      
      <h1 className='text-primary'>Inscription</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <AdminForm onSubmit={handleSubmit} />
      <p className=' my-4'>Vous avez  deja un compte ?
          <a href='/login' className=' mx-3'> Connexion</a>
        </p>
    </div>
    
    </div>
   
  );
};

export default RegisterAdmin;