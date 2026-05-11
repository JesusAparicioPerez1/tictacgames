import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaStore, FaUser, FaShoppingCart, FaClipboardList, FaBoxOpen, FaUsersCog } from 'react-icons/fa';
import { MdOutlineAppRegistration, MdLogout } from 'react-icons/md';

import { obtenerUsuarioDesdeToken } from '../utils/auth';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';

// Layout principal que controla la navegación según el rol del usuario
function MainLayout() {
  const navigate = useNavigate();

  // Se obtiene el usuario a partir del token JWT
  const usuario = obtenerUsuarioDesdeToken();

  // Controla si el modal de autenticación está abierto
  const [authModalAbierto, setAuthModalAbierto] = useState(false);

  // Define si el modal empieza en login o registro
  const [modoAuth, setModoAuth] = useState('login');

  // Guarda la ruta a la que se intentaba acceder antes de iniciar sesión
  const [rutaPendiente, setRutaPendiente] = useState(null);

  // Escucha eventos globales para abrir el modal desde otras páginas
  useEffect(() => {
    const abrirAuthDesdeEvento = (event) => {
      setModoAuth(event.detail?.modo || 'login');
      setRutaPendiente(event.detail?.from || null);
      setAuthModalAbierto(true);
    };

    window.addEventListener('abrirAuthModal', abrirAuthDesdeEvento);

    return () => {
      window.removeEventListener('abrirAuthModal', abrirAuthDesdeEvento);
    };
  }, []);

  // Abre el modal en modo login
  const abrirLogin = () => {
    setModoAuth('login');
    setRutaPendiente(null);
    setAuthModalAbierto(true);
  };

  // Abre el modal en modo registro
  const abrirRegistro = () => {
    setModoAuth('registro');
    setRutaPendiente(null);
    setAuthModalAbierto(true);
  };

  // Cierra el modal de autenticación
  const cerrarAuthModal = () => {
    setAuthModalAbierto(false);
  };

  // Cierra sesión
  const cerrarSesion = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Redirige después de iniciar sesión
  const manejarLoginCorrecto = (usuarioLogueado) => {
    if (rutaPendiente && usuarioLogueado?.cod_rol === 3) {
      navigate(rutaPendiente);
      setRutaPendiente(null);
      return;
    }

    if (usuarioLogueado?.cod_rol === 1) {
      navigate('/admin');
    } else if (usuarioLogueado?.cod_rol === 2) {
      navigate('/vendedor');
    } else {
      navigate('/tienda');
    }
  };

  return (
    <>
      <header className="navbar">
        <nav className="navbar-contenedor">
          {!usuario && (
            <>
              <div className="navbar-logo">
                <Link to="/">TicTac Games</Link>
              </div>

              <div className="navbar-links">
                <Link to="/tienda">
                  <FaStore />
                  Tienda
                </Link>

                <button type="button" onClick={abrirLogin}>
                  <FaUser />
                  Iniciar sesión
                </button>

                <button type="button" onClick={abrirRegistro}>
                  <MdOutlineAppRegistration />
                  Regístrate
                </button>
              </div>
            </>
          )}

          {usuario && usuario.cod_rol === 3 && (
            <>
              <div className="navbar-logo">
                <Link to="/">TicTac Games</Link>
              </div>

              <div className="navbar-links">
                <Link to="/tienda">
                  <FaStore />
                  Tienda
                </Link>

                <Link to="/carrito">
                  <FaShoppingCart />
                  Carrito
                </Link>

                <Link to="/mis-pedidos">
                  <FaClipboardList />
                  Mis pedidos
                </Link>

                <button type="button" onClick={cerrarSesion}>
                  <MdLogout />
                  Cerrar sesión
                </button>
              </div>
            </>
          )}

          {usuario && usuario.cod_rol === 2 && (
            <>
              <div className="navbar-logo">
                <span>Panel Vendedor</span>
              </div>

              <div className="navbar-links">
                <Link to="/vendedor">
                  <FaBoxOpen />
                  Mis productos
                </Link>

                <button type="button" onClick={cerrarSesion}>
                  <MdLogout />
                  Cerrar sesión
                </button>
              </div>
            </>
          )}

          {usuario && usuario.cod_rol === 1 && (
            <>
              <div className="navbar-logo">
                <span>Panel Admin</span>
              </div>

              <div className="navbar-links">
                <Link to="/admin">
                  <FaUsersCog />
                  Usuarios
                </Link>

                <Link to="/admin">
                  <FaBoxOpen />
                  Productos
                </Link>

                <Link to="/admin">
                  <FaStore />
                  Plataformas
                </Link>

                <button type="button" onClick={cerrarSesion}>
                  <MdLogout />
                  Cerrar sesión
                </button>
              </div>
            </>
          )}
        </nav>
      </header>

      <main className="contenido">
        <Outlet />
      </main>

      {(!usuario || usuario.cod_rol === 3) && <Footer />}

      <AuthModal
        key={modoAuth}
        abierto={authModalAbierto}
        modoInicial={modoAuth}
        cerrarModal={cerrarAuthModal}
        onLoginCorrecto={manejarLoginCorrecto}
      />
    </>
  );
}

export default MainLayout;