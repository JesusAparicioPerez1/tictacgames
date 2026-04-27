const categoriaModelo = require('../models/categoriaModelo');

// Crear categoría (solo admin)
const crearCategoria = async (req, res) => {
  try {
    const { nombre_categoria } = req.body;

    if (!nombre_categoria) {
      return res.status(400).json({ mensaje: 'Nombre requerido' });
    }

    const id = await categoriaModelo.crearCategoria(nombre_categoria);

    res.status(201).json({
      mensaje: 'Categoría creada',
      cod_categoria: id,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al crear categoría',
      error: error.message,
    });
  }
};

// Listar categorías (público)
const listarCategorias = async (req, res) => {
  try {
    const categorias = await categoriaModelo.obtenerCategorias();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener categorías',
      error: error.message,
    });
  }
};

// Asignar categoría a producto
const asignarCategoria = async (req, res) => {
  try {
    const { cod_producto, cod_categoria } = req.body;

    if (!cod_producto || !cod_categoria) {
      return res.status(400).json({ mensaje: 'Datos incompletos' });
    }

    await categoriaModelo.asignarCategoriaAProducto(
      cod_producto,
      cod_categoria
    );

    res.json({ mensaje: 'Categoría asignada al producto' });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al asignar categoría',
      error: error.message,
    });
  }
};

module.exports = {
  crearCategoria,
  listarCategorias,
  asignarCategoria,
};