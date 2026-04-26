const express = require('express');
const productoControlador = require('../controllers/productoControlador');
const { verificarToken } = require('../middlewares/authMiddleware');
const { verificarRol } = require('../middlewares/rolMiddleware');


const router = express.Router();

// Crear producto
router.post('/', productoControlador.crearProducto);

module.exports = router;


// Obtener productos (público)
router.get('/', productoControlador.listarProductos);

// Privado (solo vendedor/admin)
router.post('/', verificarToken, verificarRol(1, 2), productoControlador.crearProducto);


// Privado: editar producto
router.put(
  '/:cod_producto',
  verificarToken,
  verificarRol(1, 2),
  productoControlador.editarProducto
);