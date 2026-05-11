const express = require('express');

const pedidoControlador = require('../controllers/pedidoControlador');

const { verificarToken } = require('../middlewares/authMiddleware');

const { verificarRol } = require('../middlewares/rolMiddleware');

const router = express.Router();

// =========================
// PEDIDOS USUARIO
// =========================

// Usuario registrado puede ver sus pedidos
router.get(
  '/',
  verificarToken,
  verificarRol(3),
  pedidoControlador.listarPedidos
);

// =========================
// ESTADÍSTICAS ADMIN
// =========================

// El administrador puede consultar estadísticas de ventas
router.get(
  '/estadisticas',
  verificarToken,
  verificarRol(1),
  pedidoControlador.obtenerEstadisticasVentas
);

module.exports = router;