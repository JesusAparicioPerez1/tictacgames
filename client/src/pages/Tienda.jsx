import { useEffect, useState } from 'react';
import api from '../services/api';

function Tienda() {
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState('');

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

  // Añade producto al carrito
  const agregarAlCarrito = async (cod_producto) => {
    try {
      const token = localStorage.getItem('token');

      await api.post(
        '/carrito',
        {
          cod_producto,
          cantidad: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMensaje('Producto añadido al carrito');
    } catch (error) {
      console.error(error);
      setMensaje(
        error.response?.data?.mensaje || 'Error al añadir al carrito'
      );
    }
  };

  return (
    <main>
      <h2>Tienda</h2>

      {mensaje && <p>{mensaje}</p>}

      <div>
        {productos.map((producto) => (
          <div key={producto.cod_producto}>
            <h3>{producto.nombre_producto}</h3>

            <p>{producto.descripcion_producto}</p>

            <p>Precio: {producto.precio} €</p>

            <p>Categorías: {producto.categorias}</p>

            {/* BOTÓN CLAVE */}
            <button onClick={() => agregarAlCarrito(producto.cod_producto)}>
              Añadir al carrito
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Tienda;