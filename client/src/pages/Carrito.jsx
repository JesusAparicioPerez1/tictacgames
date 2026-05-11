import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from '../services/api';
import obtenerImagenProducto from '../utils/obtenerImagenProducto';

// Página del carrito del usuario registrado
function Carrito() {
  // Productos añadidos al carrito
  const [carrito, setCarrito] = useState([]);

  // Mensaje de estado para errores de carga
  const [mensaje, setMensaje] = useState('');

  // Cargar carrito al entrar en la página
  useEffect(() => {
    const cargarCarrito = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await api.get('/carrito', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCarrito(res.data.carrito);
      } catch (error) {
        console.error(error);
        setMensaje('Error al cargar el carrito');
      }
    };

    cargarCarrito();
  }, []);

  // Calcula el número total de unidades del carrito
  const totalUnidades = carrito.reduce((total, item) => {
    return total + Number(item.cantidad);
  }, 0);

  // Calcula el total del carrito
  const totalCarrito = carrito.reduce((total, item) => {
    return total + Number(item.precio_unitario) * Number(item.cantidad);
  }, 0);

  // Actualiza la cantidad de un producto en backend y frontend
  const actualizarCantidad = async (cod_producto, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const res = await api.put(
        `/carrito/${cod_producto}`,
        {
          cantidad: nuevaCantidad,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCarrito(res.data.carrito);
    } catch (error) {
      console.error(error);

      setMensaje(
        error.response?.data?.mensaje ||
          'Error al actualizar cantidad'
      );
    }
  };

  // Aumenta en 1 la cantidad de un producto
  const aumentarCantidad = (item) => {
    const nuevaCantidad = Number(item.cantidad) + 1;

    actualizarCantidad(item.cod_producto, nuevaCantidad);
  };

  // Disminuye en 1 la cantidad de un producto
  const disminuirCantidad = (item) => {
    const nuevaCantidad = Number(item.cantidad) - 1;

    if (nuevaCantidad < 1) {
      return;
    }

    actualizarCantidad(item.cod_producto, nuevaCantidad);
  };

  // Elimina un producto del carrito
  const eliminarDelCarrito = async (cod_producto) => {
    const confirmacion = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar producto?',
      text: 'El producto se quitará del carrito.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#555',
      background: '#1e1e1e',
      color: '#ffffff',
    });

    if (!confirmacion.isConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const res = await api.delete(`/carrito/${cod_producto}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCarrito(res.data.carrito);
    } catch (error) {
      console.error(error);

      setMensaje(
        error.response?.data?.mensaje ||
          'Error al eliminar producto del carrito'
      );
    }
  };

  // Confirma el pedido y vacía el carrito
  const confirmarPedido = async () => {
    const confirmacion = await Swal.fire({
      icon: 'question',
      title: '¿Finalizar compra?',
      text: `Se creará un pedido por un total de ${totalCarrito.toFixed(2)} €`,
      showCancelButton: true,
      confirmButtonText: 'Sí, finalizar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#00d084',
      cancelButtonColor: '#555',
      background: '#1e1e1e',
      color: '#ffffff',
    });

    // Si el usuario cancela, no se realiza el pedido
    if (!confirmacion.isConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const res = await api.post(
        '/carrito/confirmar',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Vacía el carrito tras confirmar el pedido
      setCarrito([]);

      Swal.fire({
        icon: 'success',
        title: 'Pedido realizado',
        text: `Pedido creado correctamente. ID: ${res.data.cod_pedido}`,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#00d084',
        background: '#1e1e1e',
        color: '#ffffff',
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text:
          error.response?.data?.mensaje ||
          'Error al confirmar pedido',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#00d084',
        background: '#1e1e1e',
        color: '#ffffff',
      });
    }
  };

  return (
    <main>
      <h2>Carrito</h2>

      {mensaje && (
        <p className="mensaje-producto">
          {mensaje}
        </p>
      )}

      {carrito.length === 0 ? (
        <div className="carrito-vacio">
          <h3>El carrito está vacío</h3>

          <p>
            Añade productos desde la tienda para poder finalizar tu compra.
          </p>
        </div>
      ) : (
        <section className="carrito-layout">
          <div className="carrito-lista">
            {carrito.map((item) => {
              const plataformaProducto =
                item.nombre_plataforma || item.plataforma || '';

              const subtotal =
                Number(item.precio_unitario) * Number(item.cantidad);

              return (
                <div
                  key={item.cod_producto}
                  className="carrito-item"
                >
                  <div className="carrito-imagen">
                    <img
                      src={obtenerImagenProducto(plataformaProducto)}
                      alt={item.nombre_producto}
                      className="carrito-img"
                    />
                  </div>

                  <div className="carrito-info">
                    <h3>{item.nombre_producto}</h3>

                    {plataformaProducto && (
                      <p>
                        Plataforma: {plataformaProducto}
                      </p>
                    )}

                    <p>
                      Precio unitario:{' '}
                      {item.precio_unitario} €
                    </p>

                    <div className="carrito-controles">
                      <button
                        type="button"
                        onClick={() => disminuirCantidad(item)}
                      >
                        -
                      </button>

                      <span>
                        {item.cantidad}
                      </span>

                      <button
                        type="button"
                        onClick={() => aumentarCantidad(item)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="btn-eliminar-carrito"
                      onClick={() =>
                        eliminarDelCarrito(item.cod_producto)
                      }
                    >
                      Eliminar
                    </button>
                  </div>

                  <div className="carrito-subtotal">
                    <p>{subtotal.toFixed(2)} €</p>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="carrito-resumen">
            <h3>Resumen</h3>

            <div className="resumen-linea">
              <span>Productos</span>
              <span>{totalUnidades}</span>
            </div>

            <div className="resumen-linea total">
              <span>Total</span>

              <span>
                {totalCarrito.toFixed(2)} €
              </span>
            </div>

            <button
              className="btn-comprar"
              onClick={confirmarPedido}
            >
              Finalizar compra
            </button>
          </aside>
        </section>
      )}
    </main>
  );
}

export default Carrito;