import { useEffect, useState } from 'react';
import api from '../services/api';

// Panel de administración con pestañas internas:
// Usuarios | Productos | Plataformas
function Admin() {
  // ===== ESTADO GENERAL =====

  // Lista de usuarios
  const [usuarios, setUsuarios] = useState([]);

  // Lista de productos
  const [productos, setProductos] = useState([]);

  // Mensajes de estado
  const [mensaje, setMensaje] = useState('');

  // Pestaña activa del panel admin
  const [seccionActiva, setSeccionActiva] = useState('usuarios');

  // ===== MODAL CREAR USUARIO =====

  // Controla si el modal de creación de usuario está abierto
  const [modalUsuarioAbierto, setModalUsuarioAbierto] = useState(false);

  // Formulario para crear usuario desde admin
  const [formUsuario, setFormUsuario] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    cod_rol: 3,
  });

  // ===== MODAL EDITAR PRODUCTO =====

  // Controla si el modal de edición de producto está abierto
  const [modalProductoAbierto, setModalProductoAbierto] = useState(false);

  // Producto que se está editando
  const [productoEditando, setProductoEditando] = useState(null);

  // Formulario para editar producto
  const [formProducto, setFormProducto] = useState({
    nombre_producto: '',
    descripcion_producto: '',
    precio: '',
    stock: '',
    tipo_producto: '',
    plataforma: '',
  });

  // ===== MODAL PRODUCTO DESTACADO =====

  // Controla si el modal de producto destacado está abierto
  const [modalDestacadoAbierto, setModalDestacadoAbierto] = useState(false);

  // Producto seleccionado para destacar
  const [productoDestacado, setProductoDestacado] = useState(null);

  // Texto promocional del producto destacado
  const [textoPromocion, setTextoPromocion] = useState('');

  // ===== FUNCIONES DE USUARIOS =====

  // Obtiene todos los usuarios
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

  // Cambia el rol de un usuario
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
      obtenerUsuarios();
    } catch (error) {
      console.error(error);
      setMensaje('Error al cambiar el rol');
    }
  };

  // Activa o desactiva un usuario
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

      obtenerUsuarios();
    } catch (error) {
      console.error(error);
      setMensaje('Error al cambiar estado del usuario');
    }
  };

  // Abre el modal para crear usuario
  const abrirModalUsuario = () => {
    setFormUsuario({
      nombre: '',
      correo: '',
      contrasena: '',
      cod_rol: 3,
    });

    setModalUsuarioAbierto(true);
  };

  // Cierra el modal de usuario
  const cerrarModalUsuario = () => {
    setModalUsuarioAbierto(false);

    setFormUsuario({
      nombre: '',
      correo: '',
      contrasena: '',
      cod_rol: 3,
    });
  };

  // Actualiza campos del formulario de usuario
  const manejarCambioUsuario = (e) => {
    setFormUsuario({
      ...formUsuario,
      [e.target.name]: e.target.value,
    });
  };

  // Crea un usuario desde el panel admin
  const crearUsuario = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      await api.post('/usuarios', formUsuario, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMensaje('Usuario creado correctamente');
      cerrarModalUsuario();
      obtenerUsuarios();
    } catch (error) {
      console.error(error);

      setMensaje(
        error.response?.data?.mensaje || 'Error al crear usuario'
      );
    }
  };

  // Elimina un usuario definitivamente
  const eliminarUsuario = async (cod_usuario) => {
    try {
      const token = localStorage.getItem('token');

      await api.delete(`/usuarios/${cod_usuario}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMensaje('Usuario eliminado correctamente');
      obtenerUsuarios();
    } catch (error) {
      console.error(error);

      setMensaje(
        error.response?.data?.mensaje ||
          'No se puede eliminar el usuario porque tiene datos asociados'
      );
    }
  };

  // ===== FUNCIONES DE PRODUCTOS =====

  // Obtiene todos los productos
  const obtenerProductos = async () => {
    try {
      const res = await api.get('/productos');
      setProductos(res.data);
    } catch (error) {
      console.error(error);
      setMensaje('Error al cargar productos');
    }
  };

  // Abre el modal de edición de producto
  const abrirModalEditarProducto = (producto) => {
    setProductoEditando(producto.cod_producto);

    setFormProducto({
      nombre_producto: producto.nombre_producto || '',
      descripcion_producto: producto.descripcion_producto || '',
      precio: producto.precio || '',
      stock: producto.stock || '',
      tipo_producto: producto.tipo_producto || '',
      plataforma: producto.plataforma || '',
    });

    setModalProductoAbierto(true);
  };

  // Cierra el modal de producto
  const cerrarModalProducto = () => {
    setModalProductoAbierto(false);
    setProductoEditando(null);

    setFormProducto({
      nombre_producto: '',
      descripcion_producto: '',
      precio: '',
      stock: '',
      tipo_producto: '',
      plataforma: '',
    });
  };

  // Actualiza campos del formulario de producto
  const manejarCambioProducto = (e) => {
    setFormProducto({
      ...formProducto,
      [e.target.name]: e.target.value,
    });
  };

  // Guarda los cambios de un producto
  const guardarCambiosProducto = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      const productoActualizado = {
        ...formProducto,
        precio: Number(formProducto.precio),
        stock: Number(formProducto.stock),
      };

      await api.put(
        `/productos/${productoEditando}`,
        productoActualizado,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMensaje('Producto actualizado correctamente');
      cerrarModalProducto();
      obtenerProductos();
    } catch (error) {
      console.error(error);

      setMensaje(
        error.response?.data?.mensaje || 'Error al actualizar producto'
      );
    }
  };

  // Abre el modal para configurar producto destacado
  const abrirModalDestacado = (producto) => {
    setProductoDestacado(producto);
    setTextoPromocion(producto.texto_promocion || '');
    setModalDestacadoAbierto(true);
  };

  // Cierra el modal de producto destacado
  const cerrarModalDestacado = () => {
    setModalDestacadoAbierto(false);
    setProductoDestacado(null);
    setTextoPromocion('');
  };

  // Guarda el producto destacado y su texto promocional
  const guardarProductoDestacado = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      await api.put(
        `/productos/${productoDestacado.cod_producto}/destacado`,
        {
          destacado: true,
          texto_promocion: textoPromocion,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMensaje('Producto destacado actualizado');
      cerrarModalDestacado();
      obtenerProductos();
    } catch (error) {
      console.error(error);

      setMensaje(
        error.response?.data?.mensaje ||
          'Error al actualizar producto destacado'
      );
    }
  };

  // Elimina un producto
  const eliminarProducto = async (cod_producto) => {
    try {
      const token = localStorage.getItem('token');

      await api.delete(`/productos/${cod_producto}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMensaje('Producto eliminado correctamente');
      obtenerProductos();
    } catch (error) {
      console.error(error);
      setMensaje('Error al eliminar producto');
    }
  };

  // ===== EFECTOS =====

  // Carga usuarios al entrar en el panel
  useEffect(() => {
    const cargarUsuarios = async () => {
      await obtenerUsuarios();
    };

    cargarUsuarios();
  }, []);

  // Carga productos cuando se entra en la pestaña productos
  useEffect(() => {
    const cargarProductos = async () => {
      if (seccionActiva === 'productos') {
        await obtenerProductos();
      }
    };

    cargarProductos();
  }, [seccionActiva]);

  return (
    <main>
      <h2>Panel de Administración</h2>

      {/* Mensaje de estado */}
      {mensaje && <p className="mensaje-producto">{mensaje}</p>}

      {/* Pestañas del panel admin */}
      <div className="admin-tabs">
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

      {/* SECCIÓN USUARIOS */}
      {seccionActiva === 'usuarios' && (
        <section>
          <div className="panel-cabecera">
            <div>
              <h3>Usuarios</h3>
              <p>Gestiona usuarios, roles y accesos.</p>
            </div>

            <button onClick={abrirModalUsuario}>
              Crear usuario
            </button>
          </div>

          {usuarios.length === 0 && (
            <p>No hay usuarios para mostrar.</p>
          )}

          {usuarios.map((u) => (
            <div key={u.cod_usuario} className="panel-card">
              <p>
                <strong>{u.nombre}</strong>
              </p>

              <p>{u.correo}</p>

              <p>Rol: {u.cod_rol}</p>

              <p>
                Estado:{' '}
                {Number(u.activo) === 1 ? 'Activo' : 'Desactivado'}
              </p>

              <button onClick={() => cambiarRol(u.cod_usuario, 1)}>
                Admin
              </button>

              <button onClick={() => cambiarRol(u.cod_usuario, 2)}>
                Vendedor
              </button>

              <button onClick={() => cambiarRol(u.cod_usuario, 3)}>
                Usuario
              </button>

              {Number(u.activo) === 1 ? (
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

              <button onClick={() => eliminarUsuario(u.cod_usuario)}>
                Eliminar
              </button>
            </div>
          ))}
        </section>
      )}

      {/* SECCIÓN PRODUCTOS */}
      {seccionActiva === 'productos' && (
        <section>
          {productos.length === 0 && (
            <p>No hay productos para mostrar.</p>
          )}

          {productos.map((p) => (
            <div key={p.cod_producto} className="panel-card">
              <h4>{p.nombre_producto}</h4>

              <p>{p.descripcion_producto}</p>

              <p>Precio: {p.precio} €</p>

              <p>Stock: {p.stock}</p>

              <p>Plataforma: {p.plataforma}</p>

              <p>Tipo: {p.tipo_producto}</p>

              <p>
                Destacado:{' '}
                {Number(p.destacado) === 1 ? 'Sí' : 'No'}
              </p>

              {p.texto_promocion && (
                <p>Promoción: {p.texto_promocion}</p>
              )}

              <button onClick={() => abrirModalEditarProducto(p)}>
                Editar
              </button>

              <button onClick={() => abrirModalDestacado(p)}>
                Destacar
              </button>

              <button onClick={() => eliminarProducto(p.cod_producto)}>
                Eliminar
              </button>
            </div>
          ))}
        </section>
      )}

      {/* SECCIÓN PLATAFORMAS */}
      {seccionActiva === 'plataformas' && (
        <section className="panel-card">
          <h3>Gestión de plataformas</h3>

          <p>
            Esta sección queda preparada para gestionar plataformas como
            Nintendo, PlayStation, Xbox y PC.
          </p>
        </section>
      )}

      {/* MODAL EDITAR PRODUCTO */}
      {modalProductoAbierto && (
        <div className="modal-fondo">
          <div className="modal-contenido">
            <div className="modal-cabecera">
              <h3>Editar producto</h3>

              <button onClick={cerrarModalProducto}>
                Cerrar
              </button>
            </div>

            <form onSubmit={guardarCambiosProducto}>
              <input
                type="text"
                name="nombre_producto"
                value={formProducto.nombre_producto}
                onChange={manejarCambioProducto}
                placeholder="Nombre"
                required
              />

              <input
                type="text"
                name="descripcion_producto"
                value={formProducto.descripcion_producto}
                onChange={manejarCambioProducto}
                placeholder="Descripción"
              />

              <input
                type="number"
                name="precio"
                value={formProducto.precio}
                onChange={manejarCambioProducto}
                step="0.01"
                min="0"
                placeholder="Precio (€)"
                required
              />

              <input
                type="number"
                name="stock"
                value={formProducto.stock}
                onChange={manejarCambioProducto}
                step="1"
                min="0"
                placeholder="Stock"
                required
              />

              <select
                name="tipo_producto"
                value={formProducto.tipo_producto}
                onChange={manejarCambioProducto}
                required
              >
                <option value="">Tipo</option>
                <option value="videojuego">Videojuego</option>
                <option value="dlc">DLC</option>
                <option value="tarjeta">Tarjeta</option>
              </select>

              <select
                name="plataforma"
                value={formProducto.plataforma}
                onChange={manejarCambioProducto}
                required
              >
                <option value="">Plataforma</option>
                <option value="Nintendo">Nintendo</option>
                <option value="PlayStation">PlayStation</option>
                <option value="Xbox">Xbox</option>
                <option value="PC">PC</option>
              </select>

              <button type="submit">
                Guardar cambios
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREAR USUARIO */}
      {modalUsuarioAbierto && (
        <div className="modal-fondo">
          <div className="modal-contenido">
            <div className="modal-cabecera">
              <h3>Crear usuario</h3>

              <button onClick={cerrarModalUsuario}>
                Cerrar
              </button>
            </div>

            <form onSubmit={crearUsuario}>
              <input
                type="text"
                name="nombre"
                value={formUsuario.nombre}
                onChange={manejarCambioUsuario}
                placeholder="Nombre"
                required
              />

              <input
                type="email"
                name="correo"
                value={formUsuario.correo}
                onChange={manejarCambioUsuario}
                placeholder="Correo"
                required
              />

              <input
                type="password"
                name="contrasena"
                value={formUsuario.contrasena}
                onChange={manejarCambioUsuario}
                placeholder="Contraseña"
                required
              />

              <select
                name="cod_rol"
                value={formUsuario.cod_rol}
                onChange={manejarCambioUsuario}
                required
              >
                <option value={1}>Admin</option>
                <option value={2}>Vendedor</option>
                <option value={3}>Usuario</option>
              </select>

              <button type="submit">
                Crear usuario
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PRODUCTO DESTACADO */}
      {modalDestacadoAbierto && (
        <div className="modal-fondo">
          <div className="modal-contenido">
            <div className="modal-cabecera">
              <h3>Producto destacado</h3>

              <button onClick={cerrarModalDestacado}>
                Cerrar
              </button>
            </div>

            <form onSubmit={guardarProductoDestacado}>
              <p>
                <strong>
                  {productoDestacado?.nombre_producto}
                </strong>
              </p>

              <textarea
                value={textoPromocion}
                onChange={(e) =>
                  setTextoPromocion(e.target.value)
                }
                placeholder="Texto promocional"
                rows="4"
              />

              <button type="submit">
                Guardar destacado
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Admin;