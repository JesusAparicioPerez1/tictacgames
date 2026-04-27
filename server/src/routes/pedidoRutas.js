const express = require('express');
const pedidoControlador = require('../controllers/pedidoControlador');
const { verificarToken } = require('../middlewares/authMiddleware');
const { verificarRol } = require('../middlewares/rolMiddleware');

const router = express.Router();

// Usuario registrado puede ver sus pedidos
router.get(
  '/',
  verificarToken,
  verificarRol(3),
  pedidoControlador.listarPedidos
);

module.exports = router;