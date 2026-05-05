import { useEffect, useState } from 'react';
import api from '../services/api';

// Página de administración: gestión de usuarios
function Admin() {
    // Estado con la lista de usuarios
    const [usuarios, setUsuarios] = useState([]);

    // Estado para mostrar mensajes (éxito / error)
    const [mensaje, setMensaje] = useState('');

    // Obtiene todos los usuarios del backend
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

    // Carga usuarios al entrar en la página
    useEffect(() => {
        const cargarUsuarios = async () => {
        await obtenerUsuarios();
        };

        cargarUsuarios();
    }, []);

    // Cambia el rol de un usuario (admin, vendedor, usuario)
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

        // Refresca lista
        obtenerUsuarios();
        } catch (error) {
        console.error(error);
        setMensaje('Error al cambiar el rol');
        }
    };

    // Desactiva un usuario (borrado lógico)
    const desactivarUsuario = async (cod_usuario) => {
        try {
        const token = localStorage.getItem('token');

        await api.put(
            `/usuarios/${cod_usuario}/desactivar`,
            {},
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );

        setMensaje('Usuario desactivado correctamente');

        // Refresca lista
        obtenerUsuarios();
        } catch (error) {
        console.error(error);
        setMensaje('Error al desactivar usuario');
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
            <div key={u.cod_usuario} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
                
                {/* Información del usuario */}
                <p><strong>ID:</strong> {u.cod_usuario}</p>
                <p><strong>Nombre:</strong> {u.nombre}</p>
                <p><strong>Correo:</strong> {u.correo}</p>
                <p><strong>Rol:</strong> {u.cod_rol}</p>
                <p><strong>Activo:</strong> {u.activo ? 'Sí' : 'No'}</p>

                {/* Botones de cambio de rol */}
                <div>
                <button onClick={() => cambiarRol(u.cod_usuario, 1)}>
                    Admin
                </button>

                <button onClick={() => cambiarRol(u.cod_usuario, 2)}>
                    Vendedor
                </button>

                <button onClick={() => cambiarRol(u.cod_usuario, 3)}>
                    Usuario
                </button>
                </div>

                {/* Botón de desactivar usuario */}
                <div style={{ marginTop: '5px' }}>
                <button onClick={() => desactivarUsuario(u.cod_usuario)}>
                    Desactivar usuario
                </button>
                </div>

            </div>
            ))}
        </div>
        </main>
    );
}

export default Admin;