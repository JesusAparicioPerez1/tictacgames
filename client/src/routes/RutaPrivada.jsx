import { Navigate, useLocation } from 'react-router-dom';

// Protege rutas que necesitan usuario autenticado
function RutaPrivada({ children }) {
  const token = localStorage.getItem('token');
  const location = useLocation();

  // Si no hay token, redirige al login guardando la ruta actual
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default RutaPrivada;