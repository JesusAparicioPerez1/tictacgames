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

// Usuario registrado puede confirmar pedido
router.post(
  '/confirmar',
  verificarToken,
  verificarRol(3),
  carritoControlador.confirmarPedido
);

module.exports = router;