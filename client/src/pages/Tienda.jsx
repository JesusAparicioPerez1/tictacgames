import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

// Página de catálogo de productos con filtros
function Tienda() {
  // Lista completa de productos
  const [productos, setProductos] = useState([]);

  // Mensaje de error
  const [mensaje, setMensaje] = useState('');

  // Filtros del catálogo
  const [filtros, setFiltros] = useState({
    plataforma: '',
    tipo_producto: '',
    precioMaximo: '',
  });

  // Obtener productos al cargar la página
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await api.get('/productos');
        setProductos(res.data);
      } catch (error) {
        console.error(error);
        setMensaje('Error al cargar productos');
      }
    };

    obtenerProductos();
  }, []);

  // Actualiza los filtros cuando el usuario cambia un campo
  const manejarFiltro = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value,
    });
  };

  // Limpia todos los filtros
  const limpiarFiltros = () => {
    setFiltros({
      plataforma: '',
      tipo_producto: '',
      precioMaximo: '',
    });
  };

  // Aplica los filtros sobre la lista de productos
  const productosFiltrados = productos.filter((producto) => {
    const coincidePlataforma =
      !filtros.plataforma || producto.plataforma === filtros.plataforma;

    const coincideTipo =
      !filtros.tipo_producto || producto.tipo_producto === filtros.tipo_producto;

    const coincidePrecio =
      !filtros.precioMaximo ||
      Number(producto.precio) <= Number(filtros.precioMaximo);

    return coincidePlataforma && coincideTipo && coincidePrecio;
  });

  return (
    <main>
      <h2>Tienda</h2>

      {mensaje && <p>{mensaje}</p>}

      <section className="tienda-layout">
        {/* Zona de filtros */}
        <aside className="filtros">
          <h3>Filtros</h3>

          <label>Plataforma</label>
          <select
            name="plataforma"
            value={filtros.plataforma}
            onChange={manejarFiltro}
          >
            <option value="">Todas</option>
            <option value="Nintendo">Nintendo</option>
            <option value="PlayStation">PlayStation</option>
            <option value="Xbox">Xbox</option>
            <option value="PC">PC</option>
          </select>

          <label>Tipo</label>
          <select
            name="tipo_producto"
            value={filtros.tipo_producto}
            onChange={manejarFiltro}
          >
            <option value="">Todos</option>
            <option value="videojuego">Videojuego</option>
            <option value="dlc">DLC</option>
            <option value="tarjeta">Tarjeta</option>
          </select>

          <label>Precio máximo</label>
          <input
            type="number"
            name="precioMaximo"
            value={filtros.precioMaximo}
            onChange={manejarFiltro}
            placeholder="Ej: 50"
            min="0"
            step="0.01"
          />

          <button onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </aside>

        {/* Grid de productos */}
        <div className="productos-grid">
          {productosFiltrados.map((producto) => (
            <div key={producto.cod_producto} className="producto-card">
              <h3>{producto.nombre_producto}</h3>

              <p className="descripcion">
                {producto.descripcion_producto}
              </p>

              <p className="precio">
                {producto.precio} €
              </p>

              <p className="categorias">
                {producto.plataforma} · {producto.tipo_producto}
              </p>

              <Link
                to={`/producto/${producto.cod_producto}`}
                className="btn-carrito"
              >
                Ver detalle
              </Link>
            </div>
          ))}

          {productosFiltrados.length === 0 && (
            <p>No hay productos que coincidan con los filtros.</p>
          )}
        </div>
      </section>
    </main>
  );
}

export default Tienda;