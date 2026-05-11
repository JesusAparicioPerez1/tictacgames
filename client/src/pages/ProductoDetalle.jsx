import { useEffect, useState } from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import api from '../services/api';
import obtenerImagenProducto from '../utils/obtenerImagenProducto';

// Página de detalle de producto
function ProductoDetalle() {
  const { id } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  // Producto seleccionado
  const [producto, setProducto] = useState(null);

  // Mensaje informativo o de error
  const [mensaje, setMensaje] = useState('');

  // Carga el producto concreto según el id recibido por la URL
  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const res = await api.get(`/productos/${id}`);
        setProducto(res.data);
      } catch (error) {
        console.error(error);
        setMensaje('Error al cargar producto');
      }
    };

    obtenerProducto();
  }, [id]);

  // Añade el producto actual al carrito del usuario autenticado
  const agregarAlCarrito = async () => {
    const token = localStorage.getItem('token');

    // Si no hay token, se abre el modal de login
    if (!token) {
      window.dispatchEvent(
        new CustomEvent('abrirAuthModal', {
          detail: {
            modo: 'login',
            from: location.pathname,
          },
        })
      );

      return;
    }

    try {
      await api.post(
        '/carrito',
        {
          cod_producto: producto.cod_producto,
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
        error.response?.data?.mensaje ||
          'Error al añadir al carrito'
      );
    }
  };

  // Mientras no se haya cargado el producto, se muestra un mensaje de carga
  if (!producto) {
    return <p>Cargando producto...</p>;
  }

  // Se obtiene el nombre de la plataforma de forma compatible
  // con productos antiguos y con consultas que usen JOIN.
  const plataformaProducto =
    producto.nombre_plataforma || producto.plataforma || '';

  return (
    <main>
      <button
        className="btn-volver"
        onClick={() => navigate(-1)}
      >
        ← Volver
      </button>

      <section className="detalle-producto">
        <div className="detalle-imagen">
          <img
            src={obtenerImagenProducto(plataformaProducto)}
            alt={producto.nombre_producto}
            className="detalle-img"
          />
        </div>

        <div className="detalle-info">
          <p className="detalle-tipo">
            {producto.tipo_producto}
          </p>

          <h1>{producto.nombre_producto}</h1>

          <p className="detalle-plataforma">
            Plataforma: {plataformaProducto}
          </p>

          <div className="detalle-divider"></div>

          <p className="detalle-descripcion">
            {producto.descripcion_producto}
          </p>

          <div className="detalle-compra">
            <div>
              <p className="detalle-label">Precio</p>

              <p className="detalle-precio">
                {producto.precio} €
              </p>
            </div>

            <div>
              <p className="detalle-label">Stock disponible</p>

              <p className="detalle-stock">
                {producto.stock}
              </p>
            </div>
          </div>

          <button
            className="btn-comprar"
            onClick={agregarAlCarrito}
          >
            Añadir al carrito
          </button>

          {mensaje && (
            <p className="mensaje-producto">
              {mensaje}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default ProductoDetalle;