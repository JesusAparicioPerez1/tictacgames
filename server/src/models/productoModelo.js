const conexionBD = require('../config/conexionBD');

// Crear producto
const crearProducto = async ({
  nombre_producto,
  descripcion_producto,
  precio,
  stock,
  tipo_producto,
  plataforma,
  cod_usuario,
}) => {
  const [resultado] = await conexionBD.query(
    `INSERT INTO producto 
    (nombre_producto, descripcion_producto, precio, stock, tipo_producto, plataforma, cod_usuario)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      nombre_producto,
      descripcion_producto,
      precio,
      stock,
      tipo_producto,
      plataforma,
      cod_usuario,
    ]
  );

  return resultado.insertId;
};

// Obtener productos
const obtenerProductos = async () => {
  const [filas] = await conexionBD.query(`
    SELECT 
      p.cod_producto,
      p.nombre_producto,
      p.descripcion_producto,
      p.precio,
      p.stock,
      p.plataforma,
      p.tipo_producto,
      GROUP_CONCAT(c.nombre_categoria) AS categorias
    FROM producto p
    LEFT JOIN producto_categoria pc ON p.cod_producto = pc.cod_producto
    LEFT JOIN categoria c ON pc.cod_categoria = c.cod_categoria
    WHERE p.activo = TRUE
    GROUP BY p.cod_producto
  `);

  return filas;
};

// Obtener producto por ID
const obtenerProductoPorCodigo = async (cod_producto) => {
  const [filas] = await conexionBD.query(
    'SELECT * FROM producto WHERE cod_producto = ?',
    [cod_producto]
  );

  return filas[0];
};

// Actualizar producto
const actualizarProducto = async (cod_producto, producto) => {
  const {
    nombre_producto,
    descripcion_producto,
    precio,
    stock,
    tipo_producto,
    plataforma,
  } = producto;

  const [resultado] = await conexionBD.query(
    `UPDATE producto SET
      nombre_producto = ?,
      descripcion_producto = ?,
      precio = ?,
      stock = ?,
      tipo_producto = ?,
      plataforma = ?
    WHERE cod_producto = ?`,
    [
      nombre_producto,
      descripcion_producto,
      precio,
      stock,
      tipo_producto,
      plataforma,
      cod_producto,
    ]
  );

  return resultado.affectedRows;
};

// Eliminar (borrado lógico)
const eliminarProducto = async (cod_producto) => {
  const [resultado] = await conexionBD.query(
    'UPDATE producto SET activo = FALSE WHERE cod_producto = ?',
    [cod_producto]
  );

  return resultado.affectedRows;
};

// Obtiene productos de un vendedor concreto
const obtenerProductosPorUsuario = async (cod_usuario) => {
  const [filas] = await conexionBD.query(
    `SELECT 
      cod_producto,
      nombre_producto,
      precio,
      stock,
      plataforma,
      tipo_producto
     FROM producto
     WHERE cod_usuario = ? AND activo = TRUE`,
    [cod_usuario]
  );

  return filas;
};


module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorCodigo,
  actualizarProducto,
  eliminarProducto,
  obtenerProductosPorUsuario,
};