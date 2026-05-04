import { Navigate } from 'react-router-dom';
import { obtenerUsuarioDesdeToken } from '../utils/auth';

// Componente que protege rutas para vendedores y administradores
function RutaVendedor({ children }) {
  // Se obtiene el usuario desde el token JWT
  const usuario = obtenerUsuarioDesdeToken();

  // Si no hay usuario → redirige a login
  if (!usuario) {
    return <Navigate to="/login" />;
  }

  // Si no es vendedor ni admin → no puede acceder
  if (usuario.cod_rol !== 2 && usuario.cod_rol !== 1) {
    return <Navigate to="/" />;
  }

  // Si cumple condiciones → se muestra la página
  return children;
}

export default RutaVendedor;