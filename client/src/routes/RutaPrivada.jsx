import { Navigate, useLocation } from 'react-router-dom';

// Protege rutas que necesitan usuario autenticado
function RutaPrivada({ children }) {
  const token = localStorage.getItem('token');

  const location = useLocation();

  // Si no hay token, abre modal login
  if (!token) {

    window.dispatchEvent(
      new CustomEvent('abrirAuthModal', {
        detail: {
          modo: 'login',
          from: location.pathname,
        },
      })
    );

    return <Navigate to="/" replace />;
  }

  return children;
}

export default RutaPrivada;