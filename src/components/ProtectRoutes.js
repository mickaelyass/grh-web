import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
    return <Navigate to="/login" />;
  }

  // Si l'utilisateur est authentifié, afficher la page demandée
  return children;
};

export default ProtectedRoute;