const express = require('express');
const usuarioControlador = require('../controllers/usuarioControlador');
const { verificarToken } = require('../middlewares/authMiddleware');
const { verificarRol } = require('../middlewares/rolMiddleware');

const router = express.Router();

// Ruta para registrar usuarios nuevos.
router.post('/registro', usuarioControlador.registrarUsuario);

// Ruta para iniciar sesión.
router.post('/login', usuarioControlador.loginUsuario);

// Ruta protegida: solo el administrador puede listar usuarios.
router.get(
  '/',
  verificarToken,
  verificarRol(1),
  usuarioControlador.listarUsuarios
);

module.exports = router;