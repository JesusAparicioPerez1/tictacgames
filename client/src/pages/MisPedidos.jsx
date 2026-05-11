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

  // Obtiene los pedidos del usuario autenticado
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

  // Carga los pedidos al entrar en la página
  useEffect(() => {

    const cargarPedidos = async () => {
      await obtenerPedidos();
    };

    cargarPedidos();

  }, []);

  return (
    <main>

      <h2>Mis pedidos</h2>

      {/* Mensaje de estado */}
      {mensaje && <p>{mensaje}</p>}

      {/* Si no hay pedidos */}
      {pedidos.length === 0 && !mensaje && (
        <p>No tienes pedidos todavía.</p>
      )}

      {/* Listado de pedidos */}
      {pedidos.map((pedido) => (

        <div
          key={pedido.cod_pedido}
          className="panel-card"
        >

          <div className="pedido-cabecera">

            <h3>
              Pedido #{pedido.cod_pedido}
            </h3>

            <span className="pedido-fecha">
              {formatearFecha(pedido.fecha_pedido)}
            </span>

          </div>

          {pedido.productos.map((producto) => (

            <div
              key={producto.cod_producto}
              className="item-card"
            >

              <p>
                <strong>
                  {producto.nombre_producto}
                </strong>
              </p>

              <p>
                Cantidad: {producto.cantidad}
              </p>

              <p>
                Precio unitario: {producto.precio_unitario} €
              </p>

            </div>

          ))}

        </div>

      ))}

    </main>
  );
}

export default MisPedidos;