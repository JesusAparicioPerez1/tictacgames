const conexionBD = require('../config/conexionBD');

// Obtiene todos los productos
const obtenerProductos = async () => {
  const [filas] = await conexionBD.query(
    `SELECT *
     FROM producto
     ORDER BY cod_producto DESC`
  );

  return filas;
};

// Obtiene un producto por ID
const obtenerProductoPorId = async (cod_producto) => {
  const [filas] = await conexionBD.query(
    `SELECT *
     FROM producto
     WHERE cod_producto = ?`,
    [cod_producto]
  );

  return filas[0];
};

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
    (
      nombre_producto,
      descripcion_producto,
      precio,
      stock,
      tipo_producto,
      plataforma,
      cod_usuario
    )
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

// Editar producto
const editarProducto = async (
  cod_producto,
  {
    nombre_producto,
    descripcion_producto,
    precio,
    stock,
    tipo_producto,
    plataforma,
  }
) => {
  const [resultado] = await conexionBD.query(
    `UPDATE producto
     SET
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

// Eliminar producto
const eliminarProducto = async (cod_producto) => {
  const [resultado] = await conexionBD.query(
    `DELETE FROM producto
     WHERE cod_producto = ?`,
    [cod_producto]
  );

  return resultado.affectedRows;
};

// Obtiene producto destacado
const obtenerProductoDestacado = async () => {
  const [filas] = await conexionBD.query(
    `SELECT *
     FROM producto
     WHERE destacado = TRUE
     LIMIT 1`
  );

  return filas[0];
};

// Actualiza producto destacado
const actualizarProductoDestacado = async (
  cod_producto,
  destacado,
  texto_promocion
) => {

  // Quitamos destacado a todos
  await conexionBD.query(
    `UPDATE producto
     SET destacado = FALSE`
  );

  // Marcamos el seleccionado
  const [resultado] = await conexionBD.query(
    `UPDATE producto
     SET
      destacado = ?,
      texto_promocion = ?
     WHERE cod_producto = ?`,
    [
      destacado,
      texto_promocion,
      cod_producto,
    ]
  );

  return resultado.affectedRows;
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  editarProducto,
  eliminarProducto,
  obtenerProductoDestacado,
  actualizarProductoDestacado,
};