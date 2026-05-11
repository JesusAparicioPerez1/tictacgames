import { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../services/api';

// Panel de administración
function Admin() {
  // =========================
  // ESTADOS GENERALES
  // =========================

  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [plataformas, setPlataformas] = useState([]);

  const [mensaje, setMensaje] = useState('');
  const [seccionActiva, setSeccionActiva] = useState('usuarios');

  // =========================
  // MODAL USUARIOS
  // =========================

  const [modalUsuarioAbierto, setModalUsuarioAbierto] = useState(false);

  const [formUsuario, setFormUsuario] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    cod_rol: 3,
  });

  // =========================
  // MODAL PRODUCTOS
  // =========================

  const [modalProductoAbierto, setModalProductoAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  const [formProducto, setFormProducto] = useState({
    nombre_producto: '',
    descripcion_producto: '',
    precio: '',
    stock: '',
    tipo_producto: '',
    plataforma: '',
  });

  // =========================
  // MODAL DESTACADO
  // =========================

  const [modalDestacadoAbierto, setModalDestacadoAbierto] = useState(false);
  const [productoDestacado, setProductoDestacado] = useState(null);
  const [textoPromocion, setTextoPromocion] = useState('');

  // =========================
  // MODAL PLATAFORMAS
  // =========================

  const [modalPlataformaAbierto, setModalPlataformaAbierto] = useState(false);
  const [plataformaEditando, setPlataformaEditando] = useState(null);
  const [nombrePlataforma, setNombrePlataforma] = useState('');

  // =========================
  // SWEETALERT
  // =========================

  const mostrarExito = (texto) => {
    Swal.fire({
      icon: 'success',
      title: 'Correcto',
      text: texto,
      confirmButtonColor: '#00d084',
      background: '#1e1e1e',
      color: '#ffffff',
    });
  };

  const mostrarError = (texto) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: texto,
      confirmButtonColor: '#00d084',
      background: '#1e1e1e',
      color: '#ffffff',
    });
  };

  // =========================
  // USUARIOS
  // =========================

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

      mostrarExito('Rol actualizado correctamente');
      obtenerUsuarios();
    } catch (error) {
      console.error(error);
      mostrarError('Error al cambiar rol');
    }
  };

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

      mostrarExito(
        activo
          ? 'Usuario activado correctamente'
          : 'Usuario desactivado correctamente'
      );

      obtenerUsuarios();
    } catch (error) {
      console.error(error);
      mostrarError('Error al cambiar estado');
    }
  };

  const abrirModalUsuario = () => {
    setFormUsuario({
      nombre: '',
      correo: '',
      contrasena: '',
      cod_rol: 3,
    });

    setModalUsuarioAbierto(true);
  };

  const cerrarModalUsuario = () => {
    setModalUsuarioAbierto(false);

    setFormUsuario({
      nombre: '',
      correo: '',
      contrasena: '',
      cod_rol: 3,
    });
  };

  const manejarCambioUsuario = (e) => {
    setFormUsuario({
      ...formUsuario,
      [e.target.name]: e.target.value,
    });
  };

  const crearUsuario = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      await api.post('/usuarios', formUsuario, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      cerrarModalUsuario();
      obtenerUsuarios();
      mostrarExito('Usuario creado correctamente');
    } catch (error) {
      console.error(error);

      mostrarError(
        error.response?.data?.mensaje || 'Error al crear usuario'
      );
    }
  };

  const eliminarUsuario = async (cod_usuario) => {
    const confirmacion = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar usuario?',
      text: 'Esta acción eliminará el usuario definitivamente.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#555',
      background: '#1e1e1e',
      color: '#ffffff',
    });

    if (!confirmacion.isConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await api.delete(`/usuarios/${cod_usuario}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      obtenerUsuarios();
      mostrarExito('Usuario eliminado correctamente');
    } catch (error) {
      console.error(error);

      mostrarError(
        error.response?.data?.mensaje ||
          'No se puede eliminar el usuario'
      );
    }
  };

  // =========================
  // PRODUCTOS
  // =========================

  const obtenerProductos = async () => {
    try {
      const res = await api.get('/productos');
      setProductos(res.data);
    } catch (error) {
      console.error(error);
      setMensaje('Error al cargar productos');
    }
  };

  const abrirModalEditarProducto = (producto) => {
    setProductoEditando(producto.cod_producto);

    setFormProducto({
      nombre_producto: producto.nombre_producto || '',
      descripcion_producto: producto.descripcion_producto || '',
      precio: producto.precio || '',
      stock: producto.stock || '',
      tipo_producto: producto.tipo_producto || '',
      plataforma: producto.nombre_plataforma || producto.plataforma || '',
    });

    setModalProductoAbierto(true);
  };

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

  const manejarCambioProducto = (e) => {
    setFormProducto({
      ...formProducto,
      [e.target.name]: e.target.value,
    });
  };

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

      cerrarModalProducto();
      obtenerProductos();
      mostrarExito('Producto actualizado correctamente');
    } catch (error) {
      console.error(error);

      mostrarError(
        error.response?.data?.mensaje || 'Error al actualizar producto'
      );
    }
  };

  const abrirModalDestacado = (producto) => {
    setProductoDestacado(producto);
    setTextoPromocion(producto.texto_promocion || '');
    setModalDestacadoAbierto(true);
  };

  const cerrarModalDestacado = () => {
    setModalDestacadoAbierto(false);
    setProductoDestacado(null);
    setTextoPromocion('');
  };

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

      cerrarModalDestacado();
      obtenerProductos();
      mostrarExito('Producto destacado actualizado');
    } catch (error) {
      console.error(error);

      mostrarError(
        error.response?.data?.mensaje ||
          'Error al actualizar producto destacado'
      );
    }
  };

  const eliminarProducto = async (cod_producto) => {
    const confirmacion = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar producto?',
      text: 'Esta acción eliminará el producto seleccionado.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#555',
      background: '#1e1e1e',
      color: '#ffffff',
    });

    if (!confirmacion.isConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await api.delete(`/productos/${cod_producto}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      obtenerProductos();
      mostrarExito('Producto eliminado correctamente');
    } catch (error) {
      console.error(error);
      mostrarError('Error al eliminar producto');
    }
  };

  // =========================
  // PLATAFORMAS
  // =========================

  const obtenerPlataformas = async () => {
    try {
      const res = await api.get('/plataformas');
      setPlataformas(res.data);
    } catch (error) {
      console.error(error);
      mostrarError('Error al cargar plataformas');
    }
  };

  const abrirModalCrearPlataforma = () => {
    setPlataformaEditando(null);
    setNombrePlataforma('');
    setModalPlataformaAbierto(true);
  };

  const abrirModalEditarPlataforma = (plataforma) => {
    setPlataformaEditando(plataforma.cod_plataforma);
    setNombrePlataforma(plataforma.nombre_plataforma);
    setModalPlataformaAbierto(true);
  };

  const cerrarModalPlataforma = () => {
    setModalPlataformaAbierto(false);
    setPlataformaEditando(null);
    setNombrePlataforma('');
  };

  const guardarPlataforma = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      if (plataformaEditando) {
        await api.put(
          `/plataformas/${plataformaEditando}`,
          {
            nombre_plataforma: nombrePlataforma,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        mostrarExito('Plataforma actualizada correctamente');
      } else {
        await api.post(
          '/plataformas',
          {
            nombre_plataforma: nombrePlataforma,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        mostrarExito('Plataforma creada correctamente');
      }

      cerrarModalPlataforma();
      obtenerPlataformas();
    } catch (error) {
      console.error(error);

      mostrarError(
        error.response?.data?.mensaje || 'Error al guardar plataforma'
      );
    }
  };

  const eliminarPlataforma = async (cod_plataforma) => {
    const confirmacion = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar plataforma?',
      text: 'No podrás eliminarla si tiene productos asociados.',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#555',
      background: '#1e1e1e',
      color: '#ffffff',
    });

    if (!confirmacion.isConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await api.delete(`/plataformas/${cod_plataforma}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      obtenerPlataformas();
      mostrarExito('Plataforma eliminada correctamente');
    } catch (error) {
      console.error(error);

      mostrarError(
        error.response?.data?.mensaje || 'Error al eliminar plataforma'
      );
    }
  };

  // =========================
  // CAMBIO DE PESTAÑAS
  // =========================

  const mostrarUsuarios = () => {
    setSeccionActiva('usuarios');
    obtenerUsuarios();
  };

  const mostrarProductos = () => {
    setSeccionActiva('productos');
    obtenerProductos();
    obtenerPlataformas();
  };

  const mostrarPlataformas = () => {
    setSeccionActiva('plataformas');
    obtenerPlataformas();
  };

  return (
    <main>
      <h2>Panel de Administración</h2>

      {mensaje && (
        <p className="mensaje-producto">
          {mensaje}
        </p>
      )}

      {/* TABS */}
      <div className="admin-tabs">
        <button onClick={mostrarUsuarios}>
          Usuarios
        </button>

        <button onClick={mostrarProductos}>
          Productos
        </button>

        <button onClick={mostrarPlataformas}>
          Plataformas
        </button>
      </div>

      {/* USUARIOS */}
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
            <div
              key={u.cod_usuario}
              className="panel-card"
            >
              <p>
                <strong>{u.nombre}</strong>
              </p>

              <p>{u.correo}</p>
              <p>Rol: {u.cod_rol}</p>

              <p>
                Estado:{' '}
                {Number(u.activo) === 1
                  ? 'Activo'
                  : 'Desactivado'}
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

      {/* PRODUCTOS */}
      {seccionActiva === 'productos' && (
        <section>
          {productos.length === 0 && (
            <p>No hay productos para mostrar.</p>
          )}

          {productos.map((p) => (
            <div
              key={p.cod_producto}
              className="panel-card"
            >
              <h4>{p.nombre_producto}</h4>

              <p>{p.descripcion_producto}</p>
              <p>Precio: {p.precio} €</p>
              <p>Stock: {p.stock}</p>

              <p>
                Plataforma:{' '}
                {p.nombre_plataforma || p.plataforma}
              </p>

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

      {/* PLATAFORMAS */}
      {seccionActiva === 'plataformas' && (
        <section>
          <div className="panel-cabecera">
            <div>
              <h3>Plataformas</h3>
              <p>Gestiona las plataformas disponibles.</p>
            </div>

            <button onClick={abrirModalCrearPlataforma}>
              Crear plataforma
            </button>
          </div>

          {plataformas.length === 0 && (
            <p>No hay plataformas registradas.</p>
          )}

          {plataformas.map((plataforma) => (
            <div
              key={plataforma.cod_plataforma}
              className="panel-card"
            >
              <h4>{plataforma.nombre_plataforma}</h4>

              <p>
                Estado:{' '}
                {Number(plataforma.activo) === 1
                  ? 'Activa'
                  : 'Desactivada'}
              </p>

              <button
                onClick={() =>
                  abrirModalEditarPlataforma(plataforma)
                }
              >
                Editar
              </button>

              <button
                onClick={() =>
                  eliminarPlataforma(plataforma.cod_plataforma)
                }
              >
                Eliminar
              </button>
            </div>
          ))}
        </section>
      )}

      {/* MODAL USUARIO */}
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

                {plataformas.map((plataforma) => (
                  <option
                    key={plataforma.cod_plataforma}
                    value={plataforma.nombre_plataforma}
                  >
                    {plataforma.nombre_plataforma}
                  </option>
                ))}
              </select>

              <button type="submit">
                Guardar cambios
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

      {/* MODAL PLATAFORMA */}
      {modalPlataformaAbierto && (
        <div className="modal-fondo">
          <div className="modal-contenido">
            <div className="modal-cabecera">
              <h3>
                {plataformaEditando
                  ? 'Editar plataforma'
                  : 'Crear plataforma'}
              </h3>

              <button onClick={cerrarModalPlataforma}>
                Cerrar
              </button>
            </div>

            <form onSubmit={guardarPlataforma}>
              <input
                type="text"
                value={nombrePlataforma}
                onChange={(e) =>
                  setNombrePlataforma(e.target.value)
                }
                placeholder="Nombre de plataforma"
                required
              />

              <button type="submit">
                {plataformaEditando
                  ? 'Guardar cambios'
                  : 'Crear plataforma'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Admin;