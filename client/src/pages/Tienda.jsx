import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

// Página de catálogo de productos con filtros y búsqueda
function Tienda() {
  // Lista completa de productos
  const [productos, setProductos] = useState([]);

  // Mensaje de error
  const [mensaje, setMensaje] = useState('');

  // Estado de filtros y búsqueda
  const [filtros, setFiltros] = useState({
    busqueda: '',
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

  // Actualiza filtros y búsqueda
  const manejarFiltro = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value,
    });
  };

  // Limpia todos los filtros
  const limpiarFiltros = () => {
    setFiltros({
      busqueda: '',
      plataforma: '',
      tipo_producto: '',
      precioMaximo: '',
    });
  };

  // Filtra productos
  const productosFiltrados = productos.filter((producto) => {
    // Buscar por nombre
    const coincideBusqueda =
      producto.nombre_producto
        .toLowerCase()
        .includes(filtros.busqueda.toLowerCase());

    // Filtrar por plataforma
    const coincidePlataforma =
      !filtros.plataforma ||
      producto.plataforma === filtros.plataforma;

    // Filtrar por tipo
    const coincideTipo =
      !filtros.tipo_producto ||
      producto.tipo_producto === filtros.tipo_producto;

    // Filtrar por precio
    const coincidePrecio =
      !filtros.precioMaximo ||
      Number(producto.precio) <= Number(filtros.precioMaximo);

    return (
      coincideBusqueda &&
      coincidePlataforma &&
      coincideTipo &&
      coincidePrecio
    );
  });

  return (
    <main>
      <h2>Tienda</h2>

      {/* Mensaje de error */}
      {mensaje && <p>{mensaje}</p>}

      <section className="tienda-layout">
        {/* Sidebar de filtros */}
        <aside className="filtros">
          <h3>Filtros</h3>

          {/* Buscador */}
          <label>Buscar producto</label>

          <input
            type="text"
            name="busqueda"
            value={filtros.busqueda}
            onChange={manejarFiltro}
            placeholder="Buscar..."
          />

          {/* Plataforma */}
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

          {/* Tipo de producto */}
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

          {/* Precio máximo */}
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

          {/* Limpiar filtros */}
          <button onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </aside>

        {/* Grid de productos */}
        <div className="productos-grid">
          {productosFiltrados.map((producto) => (
            <div
              key={producto.cod_producto}
              className="producto-card"
            >
              {/* Placeholder visual */}
              <div className="producto-imagen">
                {producto.plataforma}
              </div>

              {/* Nombre */}
              <h3>{producto.nombre_producto}</h3>

              {/* Descripción */}
              <p className="descripcion">
                {producto.descripcion_producto}
              </p>

              {/* Precio */}
              <p className="precio">
                {producto.precio} €
              </p>

              {/* Categorías */}
              <p className="categorias">
                {producto.plataforma} · {producto.tipo_producto}
              </p>

              {/* Botón detalle */}
              <Link
                to={`/producto/${producto.cod_producto}`}
                className="btn-carrito"
              >
                Ver detalle
              </Link>
            </div>
          ))}

          {/* Sin resultados */}
          {productosFiltrados.length === 0 && (
            <p>No hay productos que coincidan con los filtros.</p>
          )}
        </div>
      </section>
    </main>
  );
}

export default Tienda;