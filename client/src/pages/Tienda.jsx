import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import obtenerImagenProducto from '../utils/obtenerImagenProducto';

// Página de catálogo de productos con filtros, búsqueda e imágenes
function Tienda() {
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  // Permite leer parámetros de la URL
  const [searchParams] = useSearchParams();

  const [filtros, setFiltros] = useState({
    busqueda: '',
    plataforma: searchParams.get('plataforma') || '',
    tipo_producto: searchParams.get('tipo') || '',
    precioMaximo: '',
  });

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

  const manejarFiltro = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value,
    });
  };

  const limpiarFiltros = () => {
    setFiltros({
      busqueda: '',
      plataforma: '',
      tipo_producto: '',
      precioMaximo: '',
    });
  };

  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda = producto.nombre_producto
      .toLowerCase()
      .includes(filtros.busqueda.toLowerCase());

    const coincidePlataforma =
      !filtros.plataforma ||
      producto.plataforma === filtros.plataforma;

    const coincideTipo =
      !filtros.tipo_producto ||
      producto.tipo_producto === filtros.tipo_producto;

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

      {mensaje && <p>{mensaje}</p>}

      <section className="tienda-layout">
        <aside className="filtros">
          <h3>Filtros</h3>

          <label>Buscar producto</label>
          <input
            type="text"
            name="busqueda"
            value={filtros.busqueda}
            onChange={manejarFiltro}
            placeholder="Buscar..."
          />

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

        <div className="productos-grid">
          {productosFiltrados.map((producto) => (
            <div key={producto.cod_producto} className="producto-card">
              <img
                src={obtenerImagenProducto(producto.plataforma)}
                alt={producto.nombre_producto}
                className="producto-imagen"
              />

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