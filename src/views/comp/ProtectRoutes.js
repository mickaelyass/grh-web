import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!token) {
    // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
    return <Navigate to="/login" />;
  }

  if (roleRequired && user.role !== roleRequired) {
    // Si l'utilisateur n'a pas le rôle requis, rediriger vers une page d'accès interdit ou autre
    return <Navigate to="/access-denied" />;
  }

  // Si l'utilisateur est authentifié et a le rôle requis, afficher la page demandée
  return children;
};

export default ProtectedRoute;
