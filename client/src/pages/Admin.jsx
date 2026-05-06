import { useEffect, useState } from 'react';
import api from '../services/api';

// Panel de administración con pestañas internas:
// Usuarios | Productos | Plataformas
    function Admin() {
    // ===== ESTADO =====
    // Lista de usuarios
    const [usuarios, setUsuarios] = useState([]);

    // Lista de productos (para la pestaña Productos)
    const [productos, setProductos] = useState([]);

    // Mensajes de estado (éxito/error)
    const [mensaje, setMensaje] = useState('');

    // Control de la pestaña activa del admin
    // 'usuarios' | 'productos' | 'plataformas'
    const [seccionActiva, setSeccionActiva] = useState('usuarios');

    // ===== FUNCIONES USUARIOS =====
    // Obtener todos los usuarios
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

    // Cambiar rol de usuario
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

        // Recargar usuarios
        obtenerUsuarios();
        } catch (error) {
        console.error(error);
        setMensaje('Error al cambiar el rol');
        }
    };

    // Activar o desactivar usuario
    const cambiarEstadoUsuario = async (cod_usuario, activo) => {
        try {
        const token = localStorage.getItem('token');

        await api.put(
            `/usuarios/${cod_usuario}/estado`,
            { activo },
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );

        setMensaje(
            activo
            ? 'Usuario activado correctamente'
            : 'Usuario desactivado correctamente'
        );

        // Recargar usuarios
        obtenerUsuarios();
        } catch (error) {
        console.error(error);
        setMensaje('Error al cambiar estado del usuario');
        }
    };

    // ===== FUNCIONES PRODUCTOS =====
    // Obtener productos (para admin)
    const obtenerProductos = async () => {
        try {
        const res = await api.get('/productos');
        setProductos(res.data);
        } catch (error) {
        console.error(error);
        setMensaje('Error al cargar productos');
        }
    };

    // Eliminar producto (admin puede eliminar cualquiera)
    const eliminarProducto = async (cod_producto) => {
        try {
        const token = localStorage.getItem('token');

        await api.delete(`/productos/${cod_producto}`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        setMensaje('Producto eliminado');

        // Recargar productos
        obtenerProductos();
        } catch (error) {
        console.error(error);
        setMensaje('Error al eliminar producto');
        }
    };

    // ===== EFECTOS =====
    // Cargar usuarios al entrar
    useEffect(() => {
        const cargar = async () => {
        await obtenerUsuarios();
        };
        cargar();
    }, []);

    // Cargar productos cuando se cambia a la pestaña Productos
        useEffect(() => {
        const cargarProductos = async () => {
            if (seccionActiva === 'productos') {
        await obtenerProductos();
        }
    };

    cargarProductos();
    }, [seccionActiva]);

    // ===== RENDER =====
    return (
        <main>
        <h2>Panel de Administración</h2>

        {/* Mensaje de estado */}
        {mensaje && <p>{mensaje}</p>}

        {/* ===== PESTAÑAS ===== */}
        <div style={{ marginBottom: '20px' }}>
            <button onClick={() => setSeccionActiva('usuarios')}>
            Usuarios
            </button>

            <button onClick={() => setSeccionActiva('productos')}>
            Productos
            </button>

            <button onClick={() => setSeccionActiva('plataformas')}>
            Plataformas
            </button>
        </div>

        {/* ===== SECCIÓN USUARIOS ===== */}
        {seccionActiva === 'usuarios' && (
            <div>
            {usuarios.map((u) => (
                <div
                key={u.cod_usuario}
                className="panel-card"
                >
                <p><strong>{u.nombre}</strong></p>
                <p>{u.correo}</p>
                <p>Rol: {u.cod_rol}</p>
                <p>Activo: {u.activo ? 'Sí' : 'No'}</p>

                {/* Botones de rol */}
                <button onClick={() => cambiarRol(u.cod_usuario, 1)}>
                    Admin
                </button>

                <button onClick={() => cambiarRol(u.cod_usuario, 2)}>
                    Vendedor
                </button>

                <button onClick={() => cambiarRol(u.cod_usuario, 3)}>
                    Usuario
                </button>

                {/* Botón dinámico activar/desactivar */}
                {u.activo ? (
                    <button
                    onClick={() =>
                        cambiarEstadoUsuario(u.cod_usuario, false)
                    }
                    >
                    Desactivar
                    </button>
                ) : (
                    <button
                    onClick={() =>
                        cambiarEstadoUsuario(u.cod_usuario, true)
                    }
                    >
                    Activar
                    </button>
                )}
                </div>
            ))}
            </div>
        )}

        {/* ===== SECCIÓN PRODUCTOS ===== */}
        {seccionActiva === 'productos' && (
            <div>
            {productos.map((p) => (
                <div
                key={p.cod_producto}
                className="panel-card"
                >
                <p><strong>{p.nombre_producto}</strong></p>
                <p>{p.precio} €</p>
                <p>{p.plataforma}</p>

                <button onClick={() => eliminarProducto(p.cod_producto)}>
                    Eliminar
                </button>
                </div>
            ))}
            </div>
        )}

        {/* ===== SECCIÓN PLATAFORMAS ===== */}
        {seccionActiva === 'plataformas' && (
            <div>
            <p>Gestión de plataformas (pendiente)</p>
            </div>
        )}
        </main>
    );
}

export default Admin;