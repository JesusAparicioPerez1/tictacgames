import { Link } from 'react-router-dom';

// Pie de página visible solo en la parte pública y de usuario registrado
function Footer() {
    return (
        <footer className="footer">
        <div className="footer-contenido">
            <div>
            <h3>TicTac Games</h3>
            <p>Videojuegos, DLCs y tarjetas digitales.</p>
            </div>

            <div className="footer-links">
            <Link to="/">Inicio</Link>
            <Link to="/tienda">Tienda</Link>
            <Link to="/login">Login</Link>
            <Link to="/registro">Registro</Link>
            </div>
        </div>

        <p className="footer-copy">
            Proyecto integrado 2º DAW - Jesús Aparicio Pérez
        </p>
        </footer>
    );
}

export default Footer;