// LoginUtilisateur.js
import React ,{useState}from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { login } from '../../services/apiUser';
import { useNavigate } from 'react-router-dom';
import logo from '../../bj.png'

const LoginUtilisateur = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const initialValues = {
    matricule: '',
    password: ''
  };

  const validationSchema = Yup.object({
    matricule: Yup.string().required('Matricule est requis'),
    password: Yup.string().required('Mot de passe est requis')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await login(values);
      console.log(response);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data)); 
      const role = response.data.role;
      const matricule = response.data.matricule;
  
      switch (role) {
        case 'admin':
          navigate('/admin-dashbord');
          break;
        case 'chef_service':
          navigate('/chef-service-dashbord', { state: { user: response.data } });
          break;
        case 'directrice':
          navigate('/directrice-dashbord', { state: { user: response.data } });
          break;
        case 'user':
        default:
          navigate('/user-dashbord', { state: { user: response.data } });
          break;
      }
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
      setError(error.response?.data?.error || 'Erreur lors de la connexion');
    } finally {
      setSubmitting(false);
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
        <h2 className='text-bg-clair'>Connexion</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="matricule">Matricule</label>
                <Field name="matricule" type="text" className="form-control" />
                <ErrorMessage name="matricule" component="div" className="text-danger" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <Field name="password" type="password" className="form-control" />
                <ErrorMessage name="password" component="div" className="text-danger" />
              </div>
              {error && <div className="alert alert-danger mt-3">{error}</div>}
              <button type="submit" className="btn btn-success bg-clair mt-3 px-5" disabled={isSubmitting}>
                Se connecter
              </button>
            </Form>
          )}
        </Formik>
        <p className=' my-4'>
         <a href='/forget-password' className='text-clair mx-3'> Mot de passe oublié</a>
          ou 
         <a href='/register' className='text-clair mx-3'> Créer un nouveau compte</a>
        </p>
        
      </div>
      <p className=' my-4 '>
          <a  href='/register_admin' className=' mx-3  btn  text-light btn-light'> Créer un nouveau compte</a>
        </p>
        
    </div>
  );
};

export default LoginUtilisateur;
