import {
  Navigate,
  useLocation,
} from 'react-router-dom';

import { obtenerUsuarioDesdeToken } from '../utils/auth';

// Componente que protege rutas para vendedores y administradores
function RutaVendedor({ children }) {

  // Se obtiene el usuario desde el token JWT
  const usuario = obtenerUsuarioDesdeToken();

  // Ruta actual
  const location = useLocation();

  // Si no hay usuario → abre modal login
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

  // Si no es vendedor ni admin → no puede acceder
  if (
    usuario.cod_rol !== 2 &&
    usuario.cod_rol !== 1
  ) {
    return <Navigate to="/" replace />;
  }

  // Si cumple condiciones → se muestra la página
  return children;
}

export default RutaVendedor;