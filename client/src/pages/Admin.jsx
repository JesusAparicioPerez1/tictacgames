import { useEffect, useState } from 'react';
import api from '../services/api';

function Admin() {
    // Estado para almacenar los usuarios obtenidos del backend
    const [usuarios, setUsuarios] = useState([]);

    // Estado para mostrar mensajes de éxito o error
    const [mensaje, setMensaje] = useState('');

    // Obtiene todos los usuarios desde el backend
    const obtenerUsuarios = async () => {
        try {
        const token = localStorage.getItem('token');

        const res = await api.get('/usuarios', {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        setUsuarios(res.data);
        } catch (error) {
        console.error(error);
        setMensaje('Error al cargar usuarios');
        }
    };

    // Carga los usuarios al entrar en el panel admin
    useEffect(() => {
        const cargarUsuarios = async () => {
        await obtenerUsuarios();
    };

    cargarUsuarios();
    }, []);

    // Cambia el rol de un usuario desde el panel admin
    const cambiarRol = async (cod_usuario, cod_rol) => {
        try {
        const token = localStorage.getItem('token');

        await api.put(
            `/usuarios/${cod_usuario}/rol`,
            { cod_rol },
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );

        setMensaje('Rol actualizado correctamente');

        // Recarga la lista para reflejar los cambios
        obtenerUsuarios();
        } catch (error) {
        console.error(error);
        setMensaje('Error al cambiar el rol');
        }
    };

    return (
        <main>
        <h2>Panel de Administración</h2>

        {/* Mensaje de estado */}
        {mensaje && <p>{mensaje}</p>}

        {/* Listado de usuarios */}
        <div>
            {usuarios.map((u) => (
            <div key={u.cod_usuario}>
                <p>ID: {u.cod_usuario}</p>
                <p>Nombre: {u.nombre}</p>
                <p>Correo: {u.correo}</p>
                <p>Rol actual: {u.cod_rol}</p>
                <p>Activo: {u.activo ? 'Sí' : 'No'}</p>

                {/* Botones para cambiar el rol del usuario */}
                <button onClick={() => cambiarRol(u.cod_usuario, 1)}>
                Hacer administrador
                </button>

                <button onClick={() => cambiarRol(u.cod_usuario, 2)}>
                Hacer vendedor
                </button>

                <button onClick={() => cambiarRol(u.cod_usuario, 3)}>
                Hacer usuario
                </button>
            </div>
            ))}
        </div>
        </main>
    );
}

export default Admin;