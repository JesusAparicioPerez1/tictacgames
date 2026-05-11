const conexionBD = require('../config/conexionBD');

// Obtiene todos los productos con el nombre de la plataforma
const obtenerProductos = async () => {
  const [filas] = await conexionBD.query(`
    SELECT
      p.*,
      pl.nombre_plataforma,
      u.nombre AS vendedor
    FROM producto p
    LEFT JOIN plataforma pl
      ON p.cod_plataforma = pl.cod_plataforma
    LEFT JOIN usuario u
      ON p.cod_usuario = u.cod_usuario
    ORDER BY p.cod_producto DESC
  `);

  return filas;
};

// Obtiene un producto por su ID
const obtenerProductoPorId = async (cod_producto) => {
  const [filas] = await conexionBD.query(
    `
    SELECT
      p.*,
      pl.nombre_plataforma,
      u.nombre AS vendedor
    FROM producto p
    LEFT JOIN plataforma pl
      ON p.cod_plataforma = pl.cod_plataforma
    LEFT JOIN usuario u
      ON p.cod_usuario = u.cod_usuario
    WHERE p.cod_producto = ?
    `,
    [cod_producto]
  );

  return filas[0];
};

// Alias para mantener compatibilidad con controladores antiguos
const obtenerProductoPorCodigo = obtenerProductoPorId;

// Obtiene los productos creados por un vendedor concreto
const obtenerProductosPorUsuario = async (cod_usuario) => {
  const [filas] = await conexionBD.query(
    `
    SELECT
      p.*,
      pl.nombre_plataforma
    FROM producto p
    LEFT JOIN plataforma pl
      ON p.cod_plataforma = pl.cod_plataforma
    WHERE p.cod_usuario = ?
    ORDER BY p.cod_producto DESC
    `,
    [cod_usuario]
  );

  return filas;
};

// Crea un nuevo producto
const crearProducto = async ({
  nombre_producto,
  descripcion_producto,
  precio,
  stock,
  tipo_producto,
  cod_plataforma,
  cod_usuario,
}) => {
  const [resultado] = await conexionBD.query(
    `
    INSERT INTO producto
    (
      nombre_producto,
      descripcion_producto,
      precio,
      stock,
      tipo_producto,
      cod_plataforma,
      cod_usuario
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      nombre_producto,
      descripcion_producto,
      precio,
      stock,
      tipo_producto,
      cod_plataforma,
      cod_usuario,
    ]
  );

  return resultado.insertId;
};

// Edita un producto existente
const editarProducto = async (
  cod_producto,
  {
    nombre_producto,
    descripcion_producto,
    precio,
    stock,
    tipo_producto,
    cod_plataforma,
  }
) => {
  const [resultado] = await conexionBD.query(
    `
    UPDATE producto
    SET
      nombre_producto = ?,
      descripcion_producto = ?,
      precio = ?,
      stock = ?,
      tipo_producto = ?,
      cod_plataforma = ?
    WHERE cod_producto = ?
    `,
    [
      nombre_producto,
      descripcion_producto,
      precio,
      stock,
      tipo_producto,
      cod_plataforma,
      cod_producto,
    ]
  );

  return resultado.affectedRows;
};

// Alias para mantener compatibilidad con controladores antiguos
const actualizarProducto = editarProducto;

// Elimina un producto
const eliminarProducto = async (cod_producto) => {
  const [resultado] = await conexionBD.query(
    `
    DELETE FROM producto
    WHERE cod_producto = ?
    `,
    [cod_producto]
  );

  return resultado.affectedRows;
};

// Obtiene el producto destacado
const obtenerProductoDestacado = async () => {
  const [filas] = await conexionBD.query(`
    SELECT
      p.*,
      pl.nombre_plataforma
    FROM producto p
    LEFT JOIN plataforma pl
      ON p.cod_plataforma = pl.cod_plataforma
    WHERE p.destacado = true
    LIMIT 1
  `);

  return filas[0];
};

// Actualiza producto destacado
const actualizarProductoDestacado = async (
  cod_producto,
  destacado,
  texto_promocion
) => {
  await conexionBD.query(`
    UPDATE producto
    SET destacado = false
  `);

  const [resultado] = await conexionBD.query(
    `
    UPDATE producto
    SET
      destacado = ?,
      texto_promocion = ?
    WHERE cod_producto = ?
    `,
    [destacado, texto_promocion, cod_producto]
  );

  return resultado.affectedRows;
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  obtenerProductoPorCodigo,
  obtenerProductosPorUsuario,
  crearProducto,
  editarProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProductoDestacado,
  actualizarProductoDestacado,
};