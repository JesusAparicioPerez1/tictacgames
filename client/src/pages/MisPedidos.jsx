import { useEffect, useState } from 'react';
import api from '../services/api';

// Página donde el usuario registrado puede consultar sus pedidos
function MisPedidos() {
  // Lista de pedidos del usuario
  const [pedidos, setPedidos] = useState([]);

  // Mensaje de error o estado
  const [mensaje, setMensaje] = useState('');

  // Formatea fechas a formato español
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calcula el total de un pedido sumando sus líneas
  const calcularTotalPedido = (productos) => {
    return productos.reduce((total, producto) => {
      return (
        total +
        Number(producto.precio_unitario) * Number(producto.cantidad)
      );
    }, 0);
  };

  // Carga los pedidos al entrar en la página
  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await api.get('/pedidos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPedidos(res.data);
      } catch (error) {
        console.error(error);
        setMensaje('Error al cargar pedidos');
      }
    };

    obtenerPedidos();
  }, []);

  return (
    <main>
      <h2>Mis pedidos</h2>

      {/* Mensaje de estado */}
      {mensaje && (
        <p className="mensaje-producto">
          {mensaje}
        </p>
      )}

      {/* Si no hay pedidos */}
      {pedidos.length === 0 && !mensaje && (
        <div className="carrito-vacio">
          <h3>No tienes pedidos todavía</h3>
          <p>
            Cuando finalices una compra, aparecerá aquí el historial
            de tus pedidos.
          </p>
        </div>
      )}

      {/* Listado de pedidos */}
      {pedidos.map((pedido) => {
        const totalPedido = calcularTotalPedido(pedido.productos || []);

        return (
          <div
            key={pedido.cod_pedido}
            className="panel-card"
          >
            <div className="pedido-cabecera">
              <div>
                <h3>Pedido #{pedido.cod_pedido}</h3>

                <span className="pedido-fecha">
                  {formatearFecha(pedido.fecha_pedido)}
                </span>
              </div>

              <p className="precio">
                Total: {totalPedido.toFixed(2)} €
              </p>
            </div>

            {(pedido.productos || []).map((producto) => {
              const plataformaProducto =
                producto.nombre_plataforma || producto.plataforma || '';

              const subtotal =
                Number(producto.precio_unitario) *
                Number(producto.cantidad);

              return (
                <div
                  key={producto.cod_producto}
                  className="item-card"
                >
                  <p>
                    <strong>
                      {producto.nombre_producto}
                    </strong>
                  </p>

                  {plataformaProducto && (
                    <p>
                      Plataforma: {plataformaProducto}
                    </p>
                  )}

                  <p>
                    Cantidad: {producto.cantidad}
                  </p>

                  <p>
                    Precio unitario: {producto.precio_unitario} €
                  </p>

                  <p>
                    Subtotal: {subtotal.toFixed(2)} €
                  </p>
                </div>
              );
            })}
          </div>
        );
      })}
    </main>
  );
}

export default MisPedidos;