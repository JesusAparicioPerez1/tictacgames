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
const crearLineaPedido = async ({
  cod_pedido,
  cod_producto,
  cantidad,
  precio_unitario,
}) => {
  await conexionBD.query(
    `INSERT INTO linea_pedido 
     (cod_pedido, cod_producto, cantidad, precio_unitario)
     VALUES (?, ?, ?, ?)`,
    [cod_pedido, cod_producto, cantidad, precio_unitario]
  );
};

// Obtiene pedidos con sus líneas
const obtenerPedidosPorUsuario = async (cod_usuario) => {
  const [filas] = await conexionBD.query(
    `
    SELECT 
      p.cod_pedido,
      p.fecha_pedido,
      lp.cod_producto,
      pr.nombre_producto,
      pr.plataforma,
      lp.cantidad,
      lp.precio_unitario
    FROM pedido p
    JOIN linea_pedido lp ON p.cod_pedido = lp.cod_pedido
    JOIN producto pr ON lp.cod_producto = pr.cod_producto
    WHERE p.cod_usuario = ?
    ORDER BY p.cod_pedido DESC
  `,
    [cod_usuario]
  );

  return filas;
};

// Obtiene el total vendido agrupado por plataforma
const obtenerVentasPorPlataforma = async () => {
  const [filas] = await conexionBD.query(`
    SELECT
      pr.plataforma,
      SUM(lp.cantidad * lp.precio_unitario) AS total_vendido
    FROM linea_pedido lp
    JOIN producto pr ON lp.cod_producto = pr.cod_producto
    GROUP BY pr.plataforma
    ORDER BY total_vendido DESC
  `);

  return filas;
};

// Obtiene el total vendido agrupado por vendedor
const obtenerVentasPorVendedor = async () => {
  const [filas] = await conexionBD.query(`
    SELECT
      u.nombre AS vendedor,
      SUM(lp.cantidad * lp.precio_unitario) AS total_vendido
    FROM linea_pedido lp
    JOIN producto pr ON lp.cod_producto = pr.cod_producto
    JOIN usuario u ON pr.cod_usuario = u.cod_usuario
    GROUP BY u.cod_usuario, u.nombre
    ORDER BY total_vendido DESC
  `);

  return filas;
};

module.exports = {
  crearPedido,
  crearLineaPedido,
  obtenerPedidosPorUsuario,
  obtenerVentasPorPlataforma,
  obtenerVentasPorVendedor,
};