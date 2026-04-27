const express = require('express');
const categoriaControlador = require('../controllers/categoriaControlador');
const { verificarToken } = require('../middlewares/authMiddleware');
const { verificarRol } = require('../middlewares/rolMiddleware');

const router = express.Router();

// Público: listar categorías
router.get('/', categoriaControlador.listarCategorias);

// Solo admin: crear categoría
router.post(
  '/',
  verificarToken,
  verificarRol(1),
  categoriaControlador.crearCategoria
);

// Admin o vendedor: asignar categoría a producto
router.post(
  '/asignar',
  verificarToken,
  verificarRol(1, 2),
  categoriaControlador.asignarCategoria
);

module.exports = router;