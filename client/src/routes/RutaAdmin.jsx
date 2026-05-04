import { Navigate } from 'react-router-dom';
import { obtenerUsuarioDesdeToken } from '../utils/auth';

// Componente que protege rutas solo accesibles por administradores
function RutaAdmin({ children }) {
    // Obtenemos los datos del usuario desde el token
    const usuario = obtenerUsuarioDesdeToken();

    // Si no hay usuario, redirige al login
    if (!usuario) {
        return <Navigate to="/login" />;
    }

    // Si el usuario no es administrador, redirige al inicio
    if (usuario.cod_rol !== 1) {
        return <Navigate to="/" />;
    }

    // Si es admin, permite acceder a la ruta
    return children;
}

export default RutaAdmin;