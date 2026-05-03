import { Link, Outlet, useNavigate } from 'react-router-dom';
import { obtenerUsuarioDesdeToken } from '../utils/auth';

function MainLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const usuario = obtenerUsuarioDesdeToken();

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
            <>
                <span>
                    Bienvenido, {usuario?.cod_rol === 1 && 'Admin'}
                    {usuario?.cod_rol === 2 && 'Vendedor'}
                    {usuario?.cod_rol === 3 && 'Usuario'}
                </span>
                <button onClick={cerrarSesion}>Cerrar sesión</button>
            </>
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