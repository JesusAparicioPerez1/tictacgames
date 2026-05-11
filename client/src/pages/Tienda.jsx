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
      <div className="tienda-cabecera">
        <div>
          <h2>Tienda</h2>
          <p>
            Explora videojuegos, DLCs y tarjetas digitales.
          </p>
        </div>

        <span>
          {productosFiltrados.length} producto(s)
        </span>
      </div>

      {mensaje && <p className="mensaje-producto">{mensaje}</p>}

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

          <button type="button" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </aside>

        <div className="productos-grid">
          {productosFiltrados.map((producto) => (
            <article key={producto.cod_producto} className="producto-card">
              <div className="producto-imagen-contenedor">
                <img
                  src={obtenerImagenProducto(producto.plataforma)}
                  alt={producto.nombre_producto}
                  className="producto-imagen"
                />

                <span className="producto-badge-plataforma">
                  {producto.plataforma}
                </span>
              </div>

              <div className="producto-card-contenido">
                <span className="producto-tipo">
                  {producto.tipo_producto}
                </span>

                <h3>{producto.nombre_producto}</h3>

                <p className="descripcion">
                  {producto.descripcion_producto}
                </p>

                <div className="producto-card-footer">
                  <p className="precio">
                    {producto.precio} €
                  </p>
                </div>

                <Link
                  to={`/producto/${producto.cod_producto}`}
                  className="btn-carrito"
                >
                  Ver detalle
                </Link>
              </div>
            </article>
          ))}

          {productosFiltrados.length === 0 && (
            <div className="sin-resultados">
              <h3>No hay productos que coincidan con los filtros.</h3>
              <p>Prueba a cambiar la búsqueda o limpiar los filtros.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Tienda;