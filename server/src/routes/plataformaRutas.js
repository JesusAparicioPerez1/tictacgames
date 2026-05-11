const express = require('express');

const plataformaControlador = require('../controllers/plataformaControlador');

const { verificarToken } = require('../middlewares/authMiddleware');
const { verificarRol } = require('../middlewares/rolMiddleware');

const router = express.Router();

/* ========================= */
/* RUTAS PÚBLICAS */
/* ========================= */

// Obtener plataformas activas o disponibles
router.get(
  '/',
  plataformaControlador.obtenerPlataformas
);

/* ========================= */
/* RUTAS ADMIN */
/* ========================= */

// Crear plataforma
router.post(
  '/',
  verificarToken,
  verificarRol(1),
  plataformaControlador.crearPlataforma
);

// Editar plataforma
router.put(
  '/:cod_plataforma',
  verificarToken,
  verificarRol(1),
  plataformaControlador.editarPlataforma
);

// Eliminar plataforma
router.delete(
  '/:cod_plataforma',
  verificarToken,
  verificarRol(1),
  plataformaControlador.eliminarPlataforma
);

module.exports = router;