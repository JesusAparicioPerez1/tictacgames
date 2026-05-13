const conexionBD = require('../config/conexionBD');

// Obtiene todos los productos con plataforma, vendedor y categorías
const obtenerProductos = async () => {
  const [filas] = await conexionBD.query(`
    SELECT
      p.*,
      pl.nombre_plataforma,
      u.nombre AS vendedor,
      GROUP_CONCAT(c.nombre_categoria SEPARATOR ', ') AS categorias
    FROM producto p
    LEFT JOIN plataforma pl
      ON p.cod_plataforma = pl.cod_plataforma
    LEFT JOIN usuario u
      ON p.cod_usuario = u.cod_usuario
    LEFT JOIN producto_categoria pc
      ON p.cod_producto = pc.cod_producto
    LEFT JOIN categoria c
      ON pc.cod_categoria = c.cod_categoria
    GROUP BY p.cod_producto
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
      u.nombre AS vendedor,
      GROUP_CONCAT(c.nombre_categoria SEPARATOR ', ') AS categorias
    FROM producto p
    LEFT JOIN plataforma pl
      ON p.cod_plataforma = pl.cod_plataforma
    LEFT JOIN usuario u
      ON p.cod_usuario = u.cod_usuario
    LEFT JOIN producto_categoria pc
      ON p.cod_producto = pc.cod_producto
    LEFT JOIN categoria c
      ON pc.cod_categoria = c.cod_categoria
    WHERE p.cod_producto = ?
    GROUP BY p.cod_producto
    `,
    [cod_producto]
  );

  return filas[0];
};

// Alias para mantener compatibilidad
const obtenerProductoPorCodigo = obtenerProductoPorId;

// Obtiene productos de un vendedor
const obtenerProductosPorUsuario = async (cod_usuario) => {
  const [filas] = await conexionBD.query(
    `
    SELECT
      p.*,
      pl.nombre_plataforma,
      GROUP_CONCAT(c.nombre_categoria SEPARATOR ', ') AS categorias
    FROM producto p
    LEFT JOIN plataforma pl
      ON p.cod_plataforma = pl.cod_plataforma
    LEFT JOIN producto_categoria pc
      ON p.cod_producto = pc.cod_producto
    LEFT JOIN categoria c
      ON pc.cod_categoria = c.cod_categoria
    WHERE p.cod_usuario = ?
    GROUP BY p.cod_producto
    ORDER BY p.cod_producto DESC
    `,
    [cod_usuario]
  );

  return filas;
};

// Obtiene los productos más vendidos
const obtenerProductosMasVendidos = async () => {
  const [filas] = await conexionBD.query(`
    SELECT
      p.*,
      pl.nombre_plataforma,
      SUM(lp.cantidad) AS total_vendido
    FROM producto p
    LEFT JOIN plataforma pl
      ON p.cod_plataforma = pl.cod_plataforma
    LEFT JOIN linea_pedido lp
      ON p.cod_producto = lp.cod_producto
    GROUP BY p.cod_producto
    ORDER BY total_vendido DESC
    LIMIT 3
  `);

  return filas;
};

// Crear producto
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

// Editar producto
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

// Alias compatibilidad
const actualizarProducto = editarProducto;

// Eliminar producto
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

// Producto destacado
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

// Actualizar destacado
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
  obtenerProductosMasVendidos,
  crearProducto,
  editarProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProductoDestacado,
  actualizarProductoDestacado,
};