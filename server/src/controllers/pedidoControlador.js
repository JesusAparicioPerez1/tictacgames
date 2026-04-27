const pedidoModelo = require('../models/pedidoModelo');

// Lista pedidos del usuario
const listarPedidos = async (req, res) => {
  try {
    const codUsuario = req.usuario.cod_usuario;

    const datos = await pedidoModelo.obtenerPedidosPorUsuario(codUsuario);

    // Agrupar pedidos
    const pedidos = {};

    datos.forEach((fila) => {
      if (!pedidos[fila.cod_pedido]) {
        pedidos[fila.cod_pedido] = {
          cod_pedido: fila.cod_pedido,
          fecha_pedido: fila.fecha_pedido,
          productos: [],
        };
      }

      pedidos[fila.cod_pedido].productos.push({
        cod_producto: fila.cod_producto,
        nombre_producto: fila.nombre_producto,
        cantidad: fila.cantidad,
        precio_unitario: fila.precio_unitario,
      });
    });

    res.json(Object.values(pedidos));

  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener pedidos',
      error: error.message,
    });
  }
};

module.exports = {
  listarPedidos,
};