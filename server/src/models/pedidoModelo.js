const conexionBD = require('../config/conexionBD');

// Crea un pedido asociado a un usuario
const crearPedido = async (cod_usuario) => {
  const [resultado] = await conexionBD.query(
    'INSERT INTO pedido (cod_usuario) VALUES (?)',
    [cod_usuario]
  );

  return resultado.insertId;
};

// Crea una línea de pedido
const crearLineaPedido = async ({ cod_pedido, cod_producto, cantidad, precio_unitario }) => {
  await conexionBD.query(
    `INSERT INTO linea_pedido 
     (cod_pedido, cod_producto, cantidad, precio_unitario)
     VALUES (?, ?, ?, ?)`,
    [cod_pedido, cod_producto, cantidad, precio_unitario]
  );
};

module.exports = {
  crearPedido,
  crearLineaPedido,
};