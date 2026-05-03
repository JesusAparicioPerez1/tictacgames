import { Link, Outlet, useNavigate } from 'react-router-dom';

function MainLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Cierra sesión eliminando el token
  const cerrarSesion = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-logo">
          <Link to="/">TicTac Games</Link>
        </div>

        <nav className="navbar-links">
          <Link to="/">Inicio</Link>
          <Link to="/tienda">Tienda</Link>
          <Link to="/carrito">Carrito</Link>

          {!token ? (
            <>
              <Link to="/login">Iniciar sesión</Link>
              <Link to="/registro">Registro</Link>
            </>
          ) : (
            <button onClick={cerrarSesion}>Cerrar sesión</button>
          )}
        </nav>
      </header>

      <main className="contenido">
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;