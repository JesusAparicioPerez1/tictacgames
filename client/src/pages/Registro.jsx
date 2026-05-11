import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Registro() {
    const [formulario, setFormulario] = useState({
        nombre: '',
        apellido: '',
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

    // Envía los datos de registro al backend
    const manejarSubmit = async (e) => {
        e.preventDefault();

        try {
        await api.post('/usuarios/registro', formulario);

        setMensaje('Usuario registrado correctamente');

        setTimeout(() => {
            navigate('/login');
        }, 1000);
        } catch (error) {
        setMensaje(
            error.response?.data?.mensaje || 'Error al registrar usuario'
        );
        }
    };

    return (
        <main>
        <h2>Registro</h2>

        <form onSubmit={manejarSubmit}>
            <div>
            <label>Nombre</label>
            <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
                required
            />
            </div>

            <div>
            <label>Apellido</label>
            <input
                type="text"
                name="apellido"
                value={formulario.apellido}
                onChange={manejarCambio}
            />
            </div>

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

            <button type="submit">Crear cuenta</button>
        </form>

        {mensaje && <p>{mensaje}</p>}
        </main>
    );
}

export default Registro;