const express = require('express');
const productoControlador = require('../controllers/productoControlador');

const router = express.Router();

// Crear producto
router.post('/', productoControlador.crearProducto);

module.exports = router;