const express = require('express');
const usuarioControlador = require('../controllers/usuarioControlador');
const { verificarToken } = require('../middlewares/authMiddleware');
const { verificarRol } = require('../middlewares/rolMiddleware');

const router = express.Router();

/* ========================= */
/* RUTAS PÚBLICAS */
/* ========================= */

// Ruta para registrar usuarios nuevos
router.post('/registro', usuarioControlador.registrarUsuario);

// Ruta para iniciar sesión
router.post('/login', usuarioControlador.loginUsuario);

/* ========================= */
/* RUTAS ADMIN */
/* ========================= */

// Ruta protegida: solo el administrador puede listar usuarios
router.get(
  '/',
  verificarToken,
  verificarRol(1),
  usuarioControlador.listarUsuarios
);

// Ruta protegida: solo el administrador puede crear usuarios
router.post(
  '/',
  verificarToken,
  verificarRol(1),
  usuarioControlador.crearUsuarioAdmin
);

// Ruta protegida: solo el administrador puede cambiar roles
router.put(
  '/:cod_usuario/rol',
  verificarToken,
  verificarRol(1),
  usuarioControlador.cambiarRolUsuario
);

// Ruta protegida: solo el administrador puede activar o desactivar usuarios
router.put(
  '/:cod_usuario/estado',
  verificarToken,
  verificarRol(1),
  usuarioControlador.cambiarEstadoUsuario
);

// Ruta protegida: solo el administrador puede eliminar usuarios
router.delete(
  '/:cod_usuario',
  verificarToken,
  verificarRol(1),
  usuarioControlador.eliminarUsuario
);

module.exports = router;