import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import api from '../services/api';
import obtenerImagenProducto from '../utils/obtenerImagenProducto';

// Página principal pública de TicTac Games
function Home() {
  // Producto destacado mostrado en el banner promocional
  const [productoDestacado, setProductoDestacado] = useState(null);

  // Productos más vendidos
  const [masVendidos, setMasVendidos] = useState([]);

  // Lista de plataformas disponibles
  const [plataformas, setPlataformas] = useState([]);

  // Cargar producto destacado, más vendidos y plataformas
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Obtener producto destacado
        const resProducto = await api.get('/productos/destacado');
        setProductoDestacado(resProducto.data);

        // Obtener productos más vendidos
        const resMasVendidos = await api.get('/productos/mas-vendidos');
        setMasVendidos(resMasVendidos.data);

        // Obtener plataformas desde la base de datos
        const resPlataformas = await api.get('/plataformas');
        setPlataformas(resPlataformas.data);
      } catch (error) {
        console.error(error);
      }
    };

    cargarDatos();
  }, []);

  // Compatibilidad con consultas antiguas y JOINs
  const plataformaProducto =
    productoDestacado?.nombre_plataforma ||
    productoDestacado?.plataforma ||
    '';

  return (
    <main className="home">
      {/* HERO PRINCIPAL */}
      <section className="home-hero">
        <div className="home-hero-texto">
          <h1>TicTac Games</h1>

          <p>
            Compra videojuegos, DLCs y tarjetas digitales
            para tus plataformas favoritas.
          </p>

          <Link
            to="/tienda"
            className="btn-principal"
          >
            Ver catálogo
          </Link>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="home-seccion">
        <h2>Explora nuestras categorías</h2>

        <div className="home-categorias">
          <Link
            to="/tienda?tipo=videojuego"
            className="home-card"
          >
            <h3>Videojuegos</h3>

            <p>
              Encuentra juegos para consola y PC.
            </p>
          </Link>

          <Link
            to="/tienda?tipo=dlc"
            className="home-card"
          >
            <h3>DLCs</h3>

            <p>
              Amplía tus juegos favoritos con nuevo contenido.
            </p>
          </Link>

          <Link
            to="/tienda?tipo=tarjeta"
            className="home-card"
          >
            <h3>Tarjetas</h3>

            <p>
              Compra saldo y suscripciones digitales.
            </p>
          </Link>
        </div>
      </section>

      {/* BANNER PRODUCTO DESTACADO */}
      {productoDestacado && (
        <section className="home-banner">
          <div className="home-banner-imagen">
            <img
              src={obtenerImagenProducto(plataformaProducto)}
              alt={productoDestacado.nombre_producto}
            />
          </div>

          <div className="home-banner-info">
            <p className="home-banner-tag">
              ¡NOVEDAD!
            </p>

            <h2>
              {productoDestacado.nombre_producto}
            </h2>

            <p>
              {productoDestacado.texto_promocion ||
                'Producto destacado de la tienda'}
            </p>

            <div className="home-banner-bottom">
              <span>
                {productoDestacado.precio} €
              </span>

              <Link
                to={`/producto/${productoDestacado.cod_producto}`}
                className="btn-principal"
              >
                Ver detalle
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* MÁS VENDIDOS */}
      {masVendidos.length > 0 && (
        <section className="home-seccion">
          <h2>¡Los más buscados!</h2>

          <div className="home-categorias">
            {masVendidos.map((producto) => {
              const plataformaMasVendido =
                producto.nombre_plataforma ||
                producto.plataforma ||
                '';

              return (
                <Link
                  key={producto.cod_producto}
                  to={`/producto/${producto.cod_producto}`}
                  className="home-card home-masvendido-card"
                >
                  <img
                    src={obtenerImagenProducto(plataformaMasVendido)}
                    alt={producto.nombre_producto}
                    className="home-masvendidos-img"
                  />

                  <h3>{producto.nombre_producto}</h3>

                  <p>
                    Plataforma: {plataformaMasVendido}
                  </p>

                  <strong>
                    {producto.precio} €
                  </strong>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* PLATAFORMAS */}
      <section className="home-seccion">
        <h2>Plataformas disponibles</h2>

        <div className="home-plataformas">
          {plataformas.map((plataforma) => (
            <Link
              key={plataforma.cod_plataforma}
              to={`/tienda?plataforma=${plataforma.nombre_plataforma}`}
            >
              {plataforma.nombre_plataforma}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;