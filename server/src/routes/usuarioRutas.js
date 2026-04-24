const express = require('express');
const usuarioControlador = require('../controllers/usuarioControlador');

const router = express.Router();

// Ruta para registrar usuarios nuevos.
router.post('/registro', usuarioControlador.registrarUsuario);

router.post('/login', usuarioControlador.loginUsuario);

module.exports = router;