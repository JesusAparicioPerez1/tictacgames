import { useEffect, useState } from 'react';
import api from '../services/api';

function Admin() {
    // Estado para almacenar los usuarios obtenidos del backend
    const [usuarios, setUsuarios] = useState([]);

    // Estado para mostrar mensajes de error
    const [mensaje, setMensaje] = useState('');

    // Se ejecuta al cargar la página para obtener los usuarios
    useEffect(() => {
        const obtenerUsuarios = async () => {
        try {
            // Recuperamos el token del usuario autenticado
            const token = localStorage.getItem('token');

            // Petición al backend para obtener todos los usuarios (solo admin)
            const res = await api.get('/usuarios', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });

            // Guardamos los usuarios en el estado
            setUsuarios(res.data);
        } catch (error) {
            console.error(error);
            setMensaje('Error al cargar usuarios');
        }
        };

        obtenerUsuarios();
    }, []);

    return (
        <main>
        <h2>Panel de Administración</h2>

        {/* Mensaje de error */}
        {mensaje && <p>{mensaje}</p>}

        {/* Listado de usuarios */}
        <div>
            {usuarios.map((u) => (
            <div key={u.cod_usuario}>
                <p>ID: {u.cod_usuario}</p>
                <p>Correo: {u.correo}</p>
                <p>Rol: {u.cod_rol}</p>
            </div>
            ))}
        </div>
        </main>
    );
}

export default Admin;