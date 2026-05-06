import { Link } from 'react-router-dom';

// Página principal pública de TicTac Games
function Home() {
  return (
    <main className="home">
      {/* Sección principal de bienvenida */}
      <section className="home-hero">
        <div className="home-hero-texto">
          <h1>TicTac Games</h1>
          <p>
            Compra videojuegos, DLCs y tarjetas digitales para tus plataformas favoritas.
          </p>

          <Link to="/tienda" className="btn-principal">
            Ver catálogo
          </Link>
        </div>
      </section>

      {/* Accesos destacados */}
      <section className="home-seccion">
        <h2>Explora nuestras categorías</h2>

        <div className="home-categorias">
          <div className="home-card">
            <h3>Videojuegos</h3>
            <p>Encuentra juegos para consola y PC.</p>
          </div>

          <div className="home-card">
            <h3>DLCs</h3>
            <p>Amplía tus juegos favoritos con nuevo contenido.</p>
          </div>

          <div className="home-card">
            <h3>Tarjetas</h3>
            <p>Compra saldo y suscripciones digitales.</p>
          </div>
        </div>
      </section>

      {/* Plataformas */}
      <section className="home-seccion">
        <h2>Plataformas disponibles</h2>

        <div className="home-plataformas">
          <span>Nintendo</span>
          <span>PlayStation</span>
          <span>Xbox</span>
          <span>PC</span>
        </div>
      </section>
    </main>
  );
}

export default Home;