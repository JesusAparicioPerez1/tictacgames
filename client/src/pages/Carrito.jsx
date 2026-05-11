import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from '../services/api';

// Página del carrito del usuario registrado
function Carrito() {
  // Productos añadidos al carrito
  const [carrito, setCarrito] = useState([]);

  // Mensaje de estado para errores de carga
  const [mensaje, setMensaje] = useState('');

  // Cargar carrito al entrar en la página
  useEffect(() => {
    const obtenerCarrito = async () => {
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

    obtenerCarrito();
  }, []);

  // Calcula el total del carrito
  const totalCarrito = carrito.reduce((total, item) => {
    return total + Number(item.precio_unitario) * Number(item.cantidad);
  }, 0);

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

      {mensaje && <p className="mensaje-producto">{mensaje}</p>}

      {carrito.length === 0 ? (
        <div className="carrito-vacio">
          <h3>El carrito está vacío</h3>
          <p>Añade productos desde la tienda para poder finalizar tu compra.</p>
        </div>
      ) : (
        <section className="carrito-layout">
          <div className="carrito-lista">
            {carrito.map((item) => (
              <div key={item.cod_producto} className="carrito-item">
                <div className="carrito-imagen">
                  Producto
                </div>

                <div className="carrito-info">
                  <h3>{item.nombre_producto}</h3>
                  <p>Cantidad: {item.cantidad}</p>
                  <p>Precio unitario: {item.precio_unitario} €</p>
                </div>

                <div className="carrito-subtotal">
                  <p>
                    {(Number(item.precio_unitario) * Number(item.cantidad)).toFixed(2)} €
                  </p>
                </div>
              </div>
            ))}
          </div>

          <aside className="carrito-resumen">
            <h3>Resumen</h3>

            <div className="resumen-linea">
              <span>Productos</span>
              <span>{carrito.length}</span>
            </div>

            <div className="resumen-linea total">
              <span>Total</span>
              <span>{totalCarrito.toFixed(2)} €</span>
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