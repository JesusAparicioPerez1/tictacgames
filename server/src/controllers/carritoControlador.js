const productoModelo = require('../models/productoModelo');
const pedidoModelo = require('../models/pedidoModelo');

// Carrito temporal en memoria
const carritos = {};

// Añade un producto al carrito del usuario
const agregarAlCarrito = async (req, res) => {
  try {
    const codUsuario = req.usuario.cod_usuario;
    const { cod_producto, cantidad } = req.body;

    if (!cod_producto || !cantidad) {
      return res.status(400).json({
        mensaje: 'Producto y cantidad son obligatorios',
      });
    }

    const producto = await productoModelo.obtenerProductoPorCodigo(cod_producto);

    if (!producto) {
      return res.status(404).json({
        mensaje: 'Producto no encontrado',
      });
    }

    if (!carritos[codUsuario]) {
      carritos[codUsuario] = [];
    }

    const productoEnCarrito = carritos[codUsuario].find(
      (item) => item.cod_producto === cod_producto
    );

    if (productoEnCarrito) {
      productoEnCarrito.cantidad += cantidad;
    } else {
      carritos[codUsuario].push({
        cod_producto,
        nombre_producto: producto.nombre_producto,
        precio_unitario: producto.precio,
        cantidad,
      });
    }

    res.json({
      mensaje: 'Producto añadido al carrito',
      carrito: carritos[codUsuario],
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al añadir producto al carrito',
      error: error.message,
    });
  }
};

// Muestra el carrito del usuario
const verCarrito = (req, res) => {
  const codUsuario = req.usuario.cod_usuario;

  res.json({
    carrito: carritos[codUsuario] || [],
  });
};

// Convierte el carrito en pedido
const confirmarPedido = async (req, res) => {
  try {
    const codUsuario = req.usuario.cod_usuario;
    const carrito = carritos[codUsuario];

    if (!carrito || carrito.length === 0) {
      return res.status(400).json({
        mensaje: 'El carrito está vacío',
      });
    }

    const codPedido = await pedidoModelo.crearPedido(codUsuario);

    for (const item of carrito) {
      await pedidoModelo.crearLineaPedido({
        cod_pedido: codPedido,
        cod_producto: item.cod_producto,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
      });
    }

    carritos[codUsuario] = [];

    res.status(201).json({
      mensaje: 'Pedido creado correctamente',
      cod_pedido: codPedido,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al confirmar pedido',
      error: error.message,
    });
  }
};

module.exports = {
  agregarAlCarrito,
  verCarrito,
  confirmarPedido,
};