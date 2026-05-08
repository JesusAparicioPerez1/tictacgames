import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import api from '../services/api';
import obtenerImagenProducto from '../utils/obtenerImagenProducto';

// Página principal pública de TicTac Games
function Home() {
  // Producto destacado mostrado en el banner promocional
  const [productoDestacado, setProductoDestacado] = useState(null);

  // Cargar producto destacado
  useEffect(() => {
    const cargarProductoDestacado = async () => {
      try {
        const res = await api.get('/productos/destacado');
        setProductoDestacado(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    cargarProductoDestacado();
  }, []);

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
              src={obtenerImagenProducto(productoDestacado.plataforma)}
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

      {/* PLATAFORMAS */}
      <section className="home-seccion">

        <h2>Plataformas disponibles</h2>

        <div className="home-plataformas">

          <Link to="/tienda?plataforma=Nintendo">
            Nintendo
          </Link>

          <Link to="/tienda?plataforma=PlayStation">
            PlayStation
          </Link>

          <Link to="/tienda?plataforma=Xbox">
            Xbox
          </Link>

          <Link to="/tienda?plataforma=PC">
            PC
          </Link>

        </div>
      </section>

    </main>
  );
}

export default Home;