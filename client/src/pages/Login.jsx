import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
    const [formulario, setFormulario] = useState({
        correo: '',
        contrasena: '',
    });

    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    // Actualiza los campos del formulario
    const manejarCambio = (e) => {
        setFormulario({
        ...formulario,
        [e.target.name]: e.target.value,
        });
    };

    // Envía credenciales al backend
    const manejarSubmit = async (e) => {
        e.preventDefault();

        try {
        const respuesta = await api.post('/usuarios/login', formulario);

        localStorage.setItem('token', respuesta.data.token);

        setMensaje('Login correcto');

        navigate('/tienda');
        } catch (error) {
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