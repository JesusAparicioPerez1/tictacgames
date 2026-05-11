const express = require('express');
const carritoControlador = require('../controllers/carritoControlador');
const { verificarToken } = require('../middlewares/authMiddleware');
const { verificarRol } = require('../middlewares/rolMiddleware');

const router = express.Router();

// Usuario registrado puede añadir productos al carrito
router.post(
  '/',
  verificarToken,
  verificarRol(3),
  carritoControlador.agregarAlCarrito
);

// Usuario registrado puede ver su carrito
router.get(
  '/',
  verificarToken,
  verificarRol(3),
  carritoControlador.verCarrito
);

// Usuario registrado puede actualizar la cantidad de un producto del carrito
router.put(
  '/:cod_producto',
  verificarToken,
  verificarRol(3),
  carritoControlador.actualizarCantidadCarrito
);

// Usuario registrado puede eliminar un producto del carrito
router.delete(
  '/:cod_producto',
  verificarToken,
  verificarRol(3),
  carritoControlador.eliminarProductoCarrito
);

// Usuario registrado puede confirmar pedido
router.post(
  '/confirmar',
  verificarToken,
  verificarRol(3),
  carritoControlador.confirmarPedido
);

module.exports = router;