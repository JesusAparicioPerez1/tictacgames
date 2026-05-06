import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

// Página de catálogo de productos
function Tienda() {
  // Lista de productos
  const [productos, setProductos] = useState([]);

  // Mensaje de error
  const [mensaje, setMensaje] = useState('');

  // Obtener productos al cargar la página
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await api.get('/productos');
        setProductos(res.data);
      } catch (error) {
        console.error(error);
        setMensaje('Error al cargar productos');
      }
    };

    obtenerProductos();
  }, []);

  return (
    <main>
      <h2>Tienda</h2>

      {/* Mensaje de error */}
      {mensaje && <p>{mensaje}</p>}

      {/* Grid de productos */}
      <div className="productos-grid">
        {productos.map((producto) => (
          <div key={producto.cod_producto} className="producto-card">

            {/* Nombre del producto */}
            <h3>{producto.nombre_producto}</h3>

            {/* Descripción breve */}
            <p className="descripcion">
              {producto.descripcion_producto}
            </p>

            {/* Precio */}
            <p className="precio">
              {producto.precio} €
            </p>

            {/* Plataforma */}
            <p className="categorias">
              {producto.plataforma}
            </p>

            {/* Enlace al detalle del producto */}
            <Link
              to={`/producto/${producto.cod_producto}`}
              className="btn-carrito"
            >
              Ver detalle
            </Link>

          </div>
        ))}
      </div>
    </main>
  );
}

export default Tienda;