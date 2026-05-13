const productoModelo = require('../models/productoModelo');

// Crear producto
const crearProducto = async (req, res) => {
  try {
    const {
      nombre_producto,
      descripcion_producto,
      precio,
      stock,
      tipo_producto,
      cod_plataforma,
    } = req.body;

    const cod_usuario = req.usuario.cod_usuario;

    if (
      !nombre_producto ||
      !precio ||
      !tipo_producto ||
      !cod_plataforma
    ) {
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
      cod_plataforma,
      cod_usuario,
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

// Listar productos
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

// Obtener productos más vendidos
const obtenerMasVendidos = async (req, res) => {
  try {
    const productos =
      await productoModelo.obtenerProductosMasVendidos();

    res.json(productos);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener productos más vendidos',
      error: error.message,
    });
  }
};

// Editar producto
const editarProducto = async (req, res) => {
  try {
    const { cod_producto } = req.params;

    const codUsuario = req.usuario.cod_usuario;
    const codRol = req.usuario.cod_rol;

    const producto =
      await productoModelo.obtenerProductoPorCodigo(cod_producto);

    if (!producto) {
      return res.status(404).json({
        mensaje: 'Producto no encontrado',
      });
    }

    const esAdmin = codRol === 1;
    const esPropietario = producto.cod_usuario === codUsuario;

    if (!esAdmin && !esPropietario) {
      return res.status(403).json({
        mensaje: 'No tienes permisos para editar este producto',
      });
    }

    const {
      nombre_producto,
      descripcion_producto,
      precio,
      stock,
      tipo_producto,
      cod_plataforma,
    } = req.body;

    if (
      !nombre_producto ||
      !precio ||
      !tipo_producto ||
      !cod_plataforma
    ) {
      return res.status(400).json({
        mensaje: 'Faltan datos obligatorios',
      });
    }

    await productoModelo.actualizarProducto(
      cod_producto,
      {
        nombre_producto,
        descripcion_producto,
        precio,
        stock,
        tipo_producto,
        cod_plataforma,
      }
    );

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

// Eliminar producto
const eliminarProducto = async (req, res) => {
  try {
    const { cod_producto } = req.params;

    const codUsuario = req.usuario.cod_usuario;
    const codRol = req.usuario.cod_rol;

    const producto =
      await productoModelo.obtenerProductoPorCodigo(cod_producto);

    if (!producto) {
      return res.status(404).json({
        mensaje: 'Producto no encontrado',
      });
    }

    const esAdmin = codRol === 1;
    const esPropietario = producto.cod_usuario === codUsuario;

    if (!esAdmin && !esPropietario) {
      return res.status(403).json({
        mensaje: 'No tienes permisos para eliminar este producto',
      });
    }

    await productoModelo.eliminarProducto(cod_producto);

    res.json({
      mensaje: 'Producto eliminado correctamente',
    });

  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al eliminar producto',
      error: error.message,
    });
  }
};

// Lista productos del usuario autenticado
const listarMisProductos = async (req, res) => {
  try {
    const cod_usuario = req.usuario.cod_usuario;

    const productos =
      await productoModelo.obtenerProductosPorUsuario(cod_usuario);

    res.json(productos);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener productos del vendedor',
      error: error.message,
    });
  }
};

// Devuelve el detalle de un producto concreto
const obtenerDetalleProducto = async (req, res) => {
  try {
    const { cod_producto } = req.params;

    const producto =
      await productoModelo.obtenerProductoPorCodigo(cod_producto);

    if (!producto) {
      return res.status(404).json({
        mensaje: 'Producto no encontrado',
      });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener detalle del producto',
      error: error.message,
    });
  }
};

// Devuelve el producto destacado de la tienda
const obtenerProductoDestacado = async (req, res) => {
  try {
    const producto =
      await productoModelo.obtenerProductoDestacado();

    res.json(producto || null);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: 'Error al obtener producto destacado',
      error: error.message,
    });
  }
};

// Actualiza el producto destacado desde admin
const actualizarProductoDestacado = async (req, res) => {
  try {
    const { cod_producto } = req.params;

    const {
      destacado,
      texto_promocion,
    } = req.body;

    await productoModelo.actualizarProductoDestacado(
      cod_producto,
      destacado,
      texto_promocion
    );

    res.json({
      mensaje: 'Producto destacado actualizado correctamente',
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: 'Error al actualizar producto destacado',
      error: error.message,
    });
  }
};

module.exports = {
  crearProducto,
  listarProductos,
  obtenerMasVendidos,
  editarProducto,
  eliminarProducto,
  listarMisProductos,
  obtenerDetalleProducto,
  obtenerProductoDestacado,
  actualizarProductoDestacado,
};