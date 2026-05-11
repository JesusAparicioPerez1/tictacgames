import { Link } from 'react-router-dom';

// Pie de página visible solo en la parte pública y usuario registrado
function Footer() {
  // Abre modal de login desde el footer
  const abrirLogin = () => {
    window.dispatchEvent(
      new CustomEvent('abrirAuthModal', {
        detail: {
          modo: 'login',
        },
      })
    );
  };

  // Abre modal de registro desde el footer
  const abrirRegistro = () => {
    window.dispatchEvent(
      new CustomEvent('abrirAuthModal', {
        detail: {
          modo: 'registro',
        },
      })
    );
  };

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

          <button type="button" onClick={abrirLogin}>
            Iniciar sesión
          </button>

          <button type="button" onClick={abrirRegistro}>
            Registro
          </button>
        </div>
      </div>

      <p className="footer-copy">
        Proyecto integrado 2º DAW - Jesús Aparicio Pérez
      </p>
    </footer>
  );
}

export default Footer;