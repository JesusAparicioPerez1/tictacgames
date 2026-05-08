const express = require('express');
const productoControlador = require('../controllers/productoControlador');
const { verificarToken } = require('../middlewares/authMiddleware');
const { verificarRol } = require('../middlewares/rolMiddleware');

const router = express.Router();

// Público: listar productos
router.get('/', productoControlador.listarProductos);

// Privado: crear producto (admin o vendedor)
router.post(
  '/',
  verificarToken,
  verificarRol(1, 2),
  productoControlador.crearProducto
);

// Actualizar producto destacado
router.put(
  '/:cod_producto/destacado',
  verificarToken,
  verificarRol(1),
  productoControlador.actualizarProductoDestacado
);

// Privado: editar producto (admin o vendedor)
router.put(
  '/:cod_producto',
  verificarToken,
  verificarRol(1, 2),
  productoControlador.editarProducto
);

// Privado: eliminar producto (admin o vendedor)
router.delete(
  '/:cod_producto',
  verificarToken,
  verificarRol(1, 2),
  productoControlador.eliminarProducto
);

// Privado: obtener productos del vendedor
router.get(
  '/mis-productos',
  verificarToken,
  productoControlador.listarMisProductos
);

// Producto destacado para Home
router.get(
  '/destacado',
  productoControlador.obtenerProductoDestacado
);

// Público: obtener detalle de un producto concreto
router.get(
  '/:cod_producto',
  productoControlador.obtenerDetalleProducto
);

module.exports = router;