import { Navigate } from 'react-router-dom';

// Protege rutas que necesitan usuario autenticado
function RutaPrivada({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RutaPrivada;