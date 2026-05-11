import { useEffect, useState } from 'react';
import {
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import api from '../services/api';
import obtenerImagenProducto from '../utils/obtenerImagenProducto';

// Página de catálogo de productos con filtros, búsqueda e imágenes
function Tienda() {
  const [productos, setProductos] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const location = useLocation();

  const [filtros, setFiltros] = useState({
    busqueda: '',
    plataforma: searchParams.get('plataforma') || '',
    tipo_producto: searchParams.get('tipo') || '',
    categoria: searchParams.get('categoria') || '',
    precioMaximo: '',
  });

  const obtenerProductos = async () => {
    try {
      const res = await api.get('/productos');

      setProductos(res.data);

      const categoriasUnicas = [
        ...new Set(
          res.data
            .filter((producto) => producto.tipo_producto !== 'tarjeta')
            .flatMap((producto) =>
              producto.categorias
                ? producto.categorias.split(',').map((cat) => cat.trim())
                : []
            )
            .filter((categoria) => categoria !== '')
        ),
      ];

      setCategorias(categoriasUnicas);
    } catch (error) {
      console.error(error);
      setMensaje('Error al cargar productos');
    }
  };

  const obtenerPlataformas = async () => {
    try {
      const res = await api.get('/plataformas');
      setPlataformas(res.data);
    } catch (error) {
      console.error(error);
      setMensaje('Error al cargar plataformas');
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      await obtenerProductos();
      await obtenerPlataformas();
    };

    cargarDatos();
  }, []);

  const manejarFiltro = (e) => {
    const { name, value } = e.target;

    setFiltros({
      ...filtros,
      [name]: value,
      categoria:
        name === 'tipo_producto' && value === 'tarjeta'
          ? ''
          : filtros.categoria,
    });
  };

  const limpiarFiltros = () => {
    setFiltros({
      busqueda: '',
      plataforma: '',
      tipo_producto: '',
      categoria: '',
      precioMaximo: '',
    });
  };

  const agregarAlCarrito = async (producto, e) => {
    e.stopPropagation();

    const token = localStorage.getItem('token');

    if (!token) {
      window.dispatchEvent(
        new CustomEvent('abrirAuthModal', {
          detail: {
            modo: 'login',
            from: location.pathname,
          },
        })
      );

      return;
    }

    try {
      await api.post(
        '/carrito',
        {
          cod_producto: producto.cod_producto,
          cantidad: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMensaje('Producto añadido al carrito');
    } catch (error) {
      console.error(error);

      setMensaje(
        error.response?.data?.mensaje ||
          'Error al añadir al carrito'
      );
    }
  };

  const productosFiltrados = productos.filter((producto) => {
    const plataformaProducto =
      producto.nombre_plataforma || producto.plataforma || '';

    const categoriasProducto = producto.categorias || '';

    const coincideBusqueda = String(producto.nombre_producto)
      .toLowerCase()
      .includes(filtros.busqueda.toLowerCase());

    const coincidePlataforma =
      !filtros.plataforma ||
      plataformaProducto === filtros.plataforma;

    const coincideTipo =
      !filtros.tipo_producto ||
      String(producto.tipo_producto).trim().toLowerCase() ===
        String(filtros.tipo_producto).trim().toLowerCase();

    const coincideCategoria =
      producto.tipo_producto === 'tarjeta' ||
      !filtros.categoria ||
      categoriasProducto
        .toLowerCase()
        .includes(filtros.categoria.toLowerCase());

    const coincidePrecio =
      !filtros.precioMaximo ||
      Number(producto.precio) <= Number(filtros.precioMaximo);

    return (
      coincideBusqueda &&
      coincidePlataforma &&
      coincideTipo &&
      coincideCategoria &&
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

      {mensaje && (
        <p className="mensaje-producto">
          {mensaje}
        </p>
      )}

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

            {plataformas.map((plataforma) => (
              <option
                key={plataforma.cod_plataforma}
                value={plataforma.nombre_plataforma}
              >
                {plataforma.nombre_plataforma}
              </option>
            ))}
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

          {filtros.tipo_producto !== 'tarjeta' && (
            <>
              <label>Categoría</label>
              <select
                name="categoria"
                value={filtros.categoria}
                onChange={manejarFiltro}
              >
                <option value="">Todas</option>

                {categorias.map((categoria) => (
                  <option
                    key={categoria}
                    value={categoria}
                  >
                    {categoria}
                  </option>
                ))}
              </select>
            </>
          )}

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

          <button
            type="button"
            onClick={limpiarFiltros}
          >
            Limpiar filtros
          </button>
        </aside>

        <div className="productos-grid">
          {productosFiltrados.map((producto) => {
            const plataformaProducto =
              producto.nombre_plataforma || producto.plataforma || '';

            return (
              <article
                key={producto.cod_producto}
                className="producto-card"
                onClick={() =>
                  navigate(`/producto/${producto.cod_producto}`)
                }
              >
                <div className="producto-imagen-contenedor">
                  <img
                    src={obtenerImagenProducto(plataformaProducto)}
                    alt={producto.nombre_producto}
                    className="producto-imagen"
                  />

                  <span className="producto-badge-plataforma">
                    {plataformaProducto}
                  </span>
                </div>

                <div className="producto-card-contenido">
                  <div className="producto-tags">
                    <span className="producto-tipo">
                      {producto.tipo_producto}
                    </span>

                    {producto.tipo_producto !== 'tarjeta' &&
                      producto.categorias && (
                        <span className="producto-categoria">
                          {producto.categorias}
                        </span>
                      )}
                  </div>

                  <h3>{producto.nombre_producto}</h3>

                  <p className="descripcion">
                    {producto.descripcion_producto}
                  </p>

                  <div className="producto-card-footer">
                    <p className="precio">
                      {producto.precio} €
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn-carrito"
                    onClick={(e) => agregarAlCarrito(producto, e)}
                  >
                    Añadir al carrito
                  </button>
                </div>
              </article>
            );
          })}

          {productosFiltrados.length === 0 && (
            <div className="sin-resultados">
              <h3>
                No hay productos que coincidan con los filtros.
              </h3>

              <p>
                Prueba a cambiar la búsqueda o limpiar los filtros.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Tienda;