import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from '../services/api';

// Página para que el vendedor cree, edite y gestione sus productos
function Vendedor() {
  // Lista de productos del vendedor
  const [productos, setProductos] = useState([]);

  // Lista de plataformas obtenidas desde la base de datos
  const [plataformas, setPlataformas] = useState([]);

  // Mensaje de estado para errores de carga
  const [mensaje, setMensaje] = useState('');

  // Controla si el modal está abierto o cerrado
  const [modalAbierto, setModalAbierto] = useState(false);

  // Producto que se está editando. Si es null, el modal crea un producto nuevo.
  const [productoEditando, setProductoEditando] = useState(null);

  // Estado del formulario
  const [form, setForm] = useState({
    nombre_producto: '',
    descripcion_producto: '',
    precio: '',
    stock: '',
    tipo_producto: '',
    plataforma: '',
  });

  // Muestra alerta de éxito
  const mostrarExito = (texto) => {
    Swal.fire({
      icon: 'success',
      title: 'Correcto',
      text: texto,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#00d084',
      background: '#1e1e1e',
      color: '#ffffff',
    });
  };

  // Muestra alerta de error
  const mostrarError = (texto) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: texto,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#00d084',
      background: '#1e1e1e',
      color: '#ffffff',
    });
  };

  // Obtiene los productos del vendedor autenticado
  const obtenerMisProductos = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await api.get('/productos/mis-productos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProductos(res.data);
    } catch (error) {
      console.error(error);
      setMensaje('Error al cargar productos');
    }
  };

  // Obtiene las plataformas desde la base de datos
  const obtenerPlataformas = async () => {
    try {
      const res = await api.get('/plataformas');

      setPlataformas(res.data);
    } catch (error) {
      console.error(error);
      setMensaje('Error al cargar plataformas');
    }
  };

  // Carga productos y plataformas al entrar al panel
  useEffect(() => {
    const cargarDatos = async () => {
      await obtenerMisProductos();
      await obtenerPlataformas();
    };

    cargarDatos();
  }, []);

  // Abre el modal para crear un producto nuevo
  const abrirModalCrear = () => {
    setProductoEditando(null);

    setForm({
      nombre_producto: '',
      descripcion_producto: '',
      precio: '',
      stock: '',
      tipo_producto: '',
      plataforma: '',
    });

    setModalAbierto(true);
  };

  // Abre el modal para editar un producto existente
  const abrirModalEditar = (producto) => {
    setProductoEditando(producto.cod_producto);

    setForm({
      nombre_producto: producto.nombre_producto || '',
      descripcion_producto: producto.descripcion_producto || '',
      precio: producto.precio || '',
      stock: producto.stock || '',
      tipo_producto: producto.tipo_producto || '',
      plataforma: producto.plataforma || '',
    });

    setModalAbierto(true);
  };

  // Cierra el modal y limpia estado
  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoEditando(null);

    setForm({
      nombre_producto: '',
      descripcion_producto: '',
      precio: '',
      stock: '',
      tipo_producto: '',
      plataforma: '',
    });
  };

  // Actualiza los campos del formulario cuando el usuario escribe o selecciona una opción
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Crea o actualiza producto según el modo del modal
  const guardarProducto = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      // Se prepara el producto convirtiendo precio y stock a número
      const producto = {
        ...form,
        precio: Number(form.precio),
        stock: Number(form.stock),
      };

      // Si existe productoEditando, se actualiza un producto existente
      if (productoEditando) {
        await api.put(`/productos/${productoEditando}`, producto, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        cerrarModal();
        obtenerMisProductos();
        mostrarExito('Producto actualizado correctamente');
      } else {
        // Si no existe productoEditando, se crea un producto nuevo
        await api.post('/productos', producto, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        cerrarModal();
        obtenerMisProductos();
        mostrarExito('Producto creado correctamente');
      }
    } catch (error) {
      console.error(error);

      mostrarError(
        error.response?.data?.mensaje || 'Error al guardar producto'
      );
    }
  };

  // Elimina un producto del vendedor
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

    // Si el usuario cancela, no se elimina nada
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

      obtenerMisProductos();
      mostrarExito('Producto eliminado correctamente');
    } catch (error) {
      console.error(error);

      mostrarError(
        error.response?.data?.mensaje || 'Error al eliminar producto'
      );
    }
  };

  return (
    <main>
      <div className="panel-cabecera">
        <div>
          <h2>Panel Vendedor</h2>
          <p>Gestiona los productos que tienes publicados.</p>
        </div>

        <button onClick={abrirModalCrear}>
          Crear producto
        </button>
      </div>

      {mensaje && <p className="mensaje-producto">{mensaje}</p>}

      <section>
        <h3>Mis productos</h3>

        {productos.length === 0 ? (
          <p>No tienes productos creados.</p>
        ) : (
          productos.map((producto) => (
            <div key={producto.cod_producto} className="panel-card">
              <h4>{producto.nombre_producto}</h4>

              <p>Precio: {producto.precio} €</p>
              <p>Stock: {producto.stock}</p>
              <p>Plataforma: {producto.plataforma}</p>
              <p>Tipo: {producto.tipo_producto}</p>

              <button onClick={() => abrirModalEditar(producto)}>
                Editar
              </button>

              <button onClick={() => eliminarProducto(producto.cod_producto)}>
                Eliminar
              </button>
            </div>
          ))
        )}
      </section>

      {modalAbierto && (
        <div className="modal-fondo">
          <div className="modal-contenido">
            <div className="modal-cabecera">
              <h3>
                {productoEditando ? 'Editar producto' : 'Crear producto'}
              </h3>

              <button onClick={cerrarModal}>
                Cerrar
              </button>
            </div>

            <form onSubmit={guardarProducto}>
              <input
                type="text"
                name="nombre_producto"
                value={form.nombre_producto}
                onChange={handleChange}
                placeholder="Nombre"
                required
              />

              <input
                type="text"
                name="descripcion_producto"
                value={form.descripcion_producto}
                onChange={handleChange}
                placeholder="Descripción"
              />

              <input
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="Precio (€)"
                required
              />

              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                step="1"
                min="0"
                placeholder="Stock"
                required
              />

              <select
                name="tipo_producto"
                value={form.tipo_producto}
                onChange={handleChange}
                required
              >
                <option value="">Tipo</option>
                <option value="videojuego">Videojuego</option>
                <option value="dlc">DLC</option>
                <option value="tarjeta">Tarjeta</option>
              </select>

              <select
                name="plataforma"
                value={form.plataforma}
                onChange={handleChange}
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
                {productoEditando ? 'Guardar cambios' : 'Crear producto'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Vendedor;