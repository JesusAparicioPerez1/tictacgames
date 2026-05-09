import { Navigate, useLocation } from 'react-router-dom';

import { obtenerUsuarioDesdeToken } from '../utils/auth';

// Componente que protege rutas solo accesibles por administradores
function RutaAdmin({ children }) {
  // Obtenemos los datos del usuario desde el token
  const usuario = obtenerUsuarioDesdeToken();

  // Ruta actual
  const location = useLocation();

  // Si no hay usuario, abrimos modal login
  if (!usuario) {

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

  // Si el usuario no es administrador, redirige al inicio
  if (usuario.cod_rol !== 1) {
    return <Navigate to="/" replace />;
  }

  // Si es admin, permite acceder
  return children;
}

export default RutaAdmin;