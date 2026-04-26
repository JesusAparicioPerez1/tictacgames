const productoModelo = require('../models/productoModelo');

// Crea un producto nuevo
const crearProducto = async (req, res) => {
  try {
    const {
      nombre_producto,
      descripcion_producto,
      precio,
      stock,
      tipo_producto,
      plataforma,
    } = req.body;

    const cod_vendedor = req.usuario.cod_usuario;

    if (!nombre_producto || !precio || !tipo_producto || !plataforma) {
      return res.status(400).json({
        mensaje: 'Faltan datos obligatorios',
      });
    }

    const id = await productoModelo.crearProducto({
      nombre_producto,
      descripcion_producto,
      precio,
      stock,
      tipo_producto,
      plataforma,
      cod_vendedor,
    });

    res.status(201).json({
      mensaje: 'Producto creado correctamente',
      cod_producto: id,
    });

  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al crear producto',
      error: error.message,
    });
  }
};

module.exports = {
  crearProducto,
};