const conexionBD = require('../config/conexionBD');

// Inserta un nuevo producto en la BD
const crearProducto = async (producto) => {
  const {
    nombre_producto,
    descripcion_producto,
    precio,
    stock,
    tipo_producto,
    plataforma,
    cod_vendedor,
  } = producto;

  const [resultado] = await conexionBD.query(
    `INSERT INTO producto 
    (nombre_producto, descripcion_producto, precio, stock, tipo_producto, plataforma, cod_vendedor)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      nombre_producto,
      descripcion_producto,
      precio,
      stock,
      tipo_producto,
      plataforma,
      cod_vendedor,
    ]
  );

  return resultado.insertId;
};

module.exports = {
  crearProducto,
};


// Obtiene todos los productos activos
const obtenerProductos = async () => {
  const [filas] = await conexionBD.query(
    'SELECT * FROM producto WHERE activo = TRUE'
  );

  return filas;
};

module.exports = {
  crearProducto,
  obtenerProductos,
};


// Obtiene un producto por su código
const obtenerProductoPorCodigo = async (cod_producto) => {
  const [filas] = await conexionBD.query(
    'SELECT * FROM producto WHERE cod_producto = ?',
    [cod_producto]
  );

  return filas[0];
};

// Actualiza un producto existente
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
    `UPDATE producto
     SET nombre_producto = ?,
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

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorCodigo,
  actualizarProducto,
};