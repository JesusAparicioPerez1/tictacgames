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


// Devuelve lista de productos
const listarProductos = async (req, res) => {
  try {
    const productos = await productoModelo.obtenerProductos();

    res.json(productos);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener productos',
      error: error.message,
    });
  }
};

module.exports = {
  crearProducto,
  listarProductos,
};


// Edita un producto si el usuario es admin o el vendedor propietario
const editarProducto = async (req, res) => {
  try {
    const { cod_producto } = req.params;
    const codUsuario = req.usuario.cod_usuario;
    const codRol = req.usuario.cod_rol;

    const producto = await productoModelo.obtenerProductoPorCodigo(cod_producto);

    if (!producto) {
      return res.status(404).json({
        mensaje: 'Producto no encontrado',
      });
    }

    const esAdmin = codRol === 1;
    const esPropietario = producto.cod_vendedor === codUsuario;

    if (!esAdmin && !esPropietario) {
      return res.status(403).json({
        mensaje: 'No tienes permisos para editar este producto',
      });
    }

    const actualizado = await productoModelo.actualizarProducto(
      cod_producto,
      req.body
    );

    if (!actualizado) {
      return res.status(400).json({
        mensaje: 'No se pudo actualizar el producto',
      });
    }

    res.json({
      mensaje: 'Producto actualizado correctamente',
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al editar producto',
      error: error.message,
    });
  }
};

module.exports = {
  crearProducto,
  listarProductos,
  editarProducto,
};