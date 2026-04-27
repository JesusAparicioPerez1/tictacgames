const express = require('express');
const productoControlador = require('../controllers/productoControlador');
const { verificarToken } = require('../middlewares/authMiddleware');
const { verificarRol } = require('../middlewares/rolMiddleware');

const router = express.Router();

// Público: listar productos
router.get('/', productoControlador.listarProductos);

// Privado: crear producto solo admin o vendedor
router.post(
  '/',
  verificarToken,
  verificarRol(1, 2),
  productoControlador.crearProducto
);

// Privado: editar producto solo admin o vendedor
router.put(
  '/:cod_producto',
  verificarToken,
  verificarRol(1, 2),
  productoControlador.editarProducto
);

// Privado: eliminar producto solo admin o vendedor
router.delete(
  '/:cod_producto',
  verificarToken,
  verificarRol(1, 2),
  productoControlador.eliminarProducto
);

module.exports = router;