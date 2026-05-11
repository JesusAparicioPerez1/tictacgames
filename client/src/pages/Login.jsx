import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { obtenerUsuarioDesdeToken } from '../utils/auth';

function Login() {
    const [formulario, setFormulario] = useState({
        correo: '',
        contrasena: '',
    });

    const [mensaje, setMensaje] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    // Actualiza los campos del formulario
    const manejarCambio = (e) => {
        setFormulario({
        ...formulario,
        [e.target.name]: e.target.value,
        });
    };

    // Envía los datos al backend y redirige según contexto/rol
    const manejarSubmit = async (e) => {
        e.preventDefault();

        try {
        const respuesta = await api.post('/usuarios/login', formulario);

        localStorage.setItem('token', respuesta.data.token);

        const usuario = obtenerUsuarioDesdeToken();

        // Si venía de una ruta protegida, vuelve allí
        const rutaAnterior = location.state?.from?.pathname;

        if (rutaAnterior) {
            navigate(rutaAnterior, { replace: true });
            return;
        }

        // Si no venía de ninguna ruta, redirige según rol
        if (usuario?.cod_rol === 1) {
            navigate('/admin', { replace: true });
        } else if (usuario?.cod_rol === 2) {
            navigate('/vendedor', { replace: true });
        } else {
            navigate('/tienda', { replace: true });
        }
        } catch (error) {
        console.error(error);
        setMensaje(
            error.response?.data?.mensaje || 'Error al iniciar sesión'
        );
        }
    };

    return (
        <main>
        <h2>Iniciar sesión</h2>

        <form onSubmit={manejarSubmit}>
            <div>
            <label>Correo</label>
            <input
                type="email"
                name="correo"
                value={formulario.correo}
                onChange={manejarCambio}
                required
            />
            </div>

            <div>
            <label>Contraseña</label>
            <input
                type="password"
                name="contrasena"
                value={formulario.contrasena}
                onChange={manejarCambio}
                required
            />
            </div>

            <button type="submit">Entrar</button>
        </form>

        {mensaje && <p>{mensaje}</p>}
        </main>
    );
}

export default Login;