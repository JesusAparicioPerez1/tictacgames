import { Link, Outlet, useNavigate } from 'react-router-dom';
import { obtenerUsuarioDesdeToken } from '../utils/auth';
import Footer from '../components/Footer';

// Layout principal que controla la navegación según el rol del usuario
function MainLayout() {
    const navigate = useNavigate();

    // Se obtiene el usuario a partir del token JWT
    const usuario = obtenerUsuarioDesdeToken();

    // Función para cerrar sesión
    const cerrarSesion = () => {
        localStorage.removeItem('token'); // Elimina el token
        navigate('/'); // Redirige al inicio
    };

    return (
        <>
        {/* Cabecera de la aplicación */}
        <header className="navbar">
            <nav className="navbar-contenedor">

            {/* CASO 1: Usuario NO autenticado */}
            {!usuario && (
                <>
                {/* Logo que lleva a la home */}
                <div className="navbar-logo">
                    <Link to="/">TicTac Games</Link>
                </div>

                {/* Enlaces disponibles para usuario anónimo */}
                <div className="navbar-links">
                    <Link to="/tienda">Tienda</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/registro">Registro</Link>
                </div>
                </>
            )}

            {/* CASO 2: Usuario registrado */}
            {usuario && usuario.cod_rol === 3 && (
                <>
                <div className="navbar-logo">
                    <Link to="/">TicTac Games</Link>
                </div>

                {/* Enlaces para usuario que puede comprar */}
                <div className="navbar-links">
                    <Link to="/tienda">Tienda</Link>
                    <Link to="/carrito">Carrito</Link>
                    <Link to="/mis-pedidos">Mis pedidos</Link>
                    <button onClick={cerrarSesion}>Cerrar sesión</button>
                </div>
                </>
            )}

            {/* CASO 3: Vendedor */}
            {usuario && usuario.cod_rol === 2 && (
                <>
                {/* El vendedor no navega por tienda */}
                <div className="navbar-logo">
                    <span>Panel Vendedor</span>
                </div>

                {/* Solo acceso a su panel */}
                <div className="navbar-links">
                    <Link to="/vendedor">Mis productos</Link>
                    <button onClick={cerrarSesion}>Cerrar sesión</button>
                </div>
                </>
            )}

            {/* CASO 4: Administrador */}
            {usuario && usuario.cod_rol === 1 && (
                <>
                {/* Panel de administración */}
                <div className="navbar-logo">
                    <span>Panel Admin</span>
                </div>

                {/* Secciones internas del admin */}
                <div className="navbar-links">
                    <Link to="/admin">Usuarios</Link>
                    <Link to="/admin">Productos</Link>
                    <Link to="/admin">Plataformas</Link>
                    <button onClick={cerrarSesion}>Cerrar sesión</button>
                </div>
                </>
            )}

            </nav>
        </header>

        {/* Contenido de cada página */}
        <main className="contenido">
            <Outlet />
        </main>
        {/* Footer solo para anónimo y usuario registrado */}
        {(!usuario || usuario.cod_rol === 3) && <Footer />}
        </>
        
    );
}

export default MainLayout;