const conexionBD = require('../config/conexionBD');

// Crear categoría
const crearCategoria = async (nombre_categoria) => {
  const [res] = await conexionBD.query(
    'INSERT INTO categoria (nombre_categoria) VALUES (?)',
    [nombre_categoria]
  );
  return res.insertId;
};

// Listar categorías
const obtenerCategorias = async () => {
  const [filas] = await conexionBD.query('SELECT * FROM categoria');
  return filas;
};

// Asignar categoría a producto
const asignarCategoriaAProducto = async (cod_producto, cod_categoria) => {
  const [res] = await conexionBD.query(
    `INSERT INTO producto_categoria (cod_producto, cod_categoria)
     VALUES (?, ?)`,
    [cod_producto, cod_categoria]
  );
  return res.insertId;
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  asignarCategoriaAProducto,
};