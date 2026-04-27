// Dependencias principales
const express = require('express');
const cors = require('cors');

// Conexión a base de datos
const conexionBD = require('./config/conexionBD');

// Rutas
const usuarioRutas = require('./routes/usuarioRutas');
const productoRutas = require('./routes/productoRutas');
const categoriaRutas = require('./routes/categoriaRutas');
const carritoRutas = require('./routes/carritoRutas');
const pedidoRutas = require('./routes/pedidoRutas');

// Middlewares de autenticación y roles
const { verificarToken } = require('./middlewares/authMiddleware');
const { verificarRol } = require('./middlewares/rolMiddleware');

// Inicialización de la app
const app = express();

// Middleware para permitir JSON y peticiones externas
app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api/usuarios', usuarioRutas);
app.use('/api/productos', productoRutas);
app.use('/api/categorias', categoriaRutas);
app.use('/api/carrito', carritoRutas);
app.use('/api/pedidos', pedidoRutas);

// Ruta base para comprobar servidor
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de TicTac Games funcionando correctamente',
  });
});

// Ruta de prueba de base de datos
app.get('/api/prueba-bd', async (req, res) => {
  try {
    const [resultado] = await conexionBD.query('SELECT 1 + 1 AS resultado');

    res.json({
      mensaje: 'Conexión con MySQL correcta',
      resultado: resultado[0].resultado,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al conectar con MySQL',
      error: error.message,
    });
  }
});

// Ruta protegida (requiere token)
app.get('/api/protegida', verificarToken, (req, res) => {
  res.json({
    mensaje: 'Acceso permitido',
    usuario: req.usuario,
  });
});

// Ruta de prueba solo para administradores
app.get('/api/admin', verificarToken, verificarRol(1), (req, res) => {
  res.json({
    mensaje: 'Acceso permitido solo para administrador',
  });
});

// Ruta de prueba solo para vendedores
app.get('/api/vendedor', verificarToken, verificarRol(2), (req, res) => {
  res.json({
    mensaje: 'Acceso permitido solo para vendedor',
  });
});

// Ruta de prueba solo para usuarios registrados
app.get('/api/registrado', verificarToken, verificarRol(3), (req, res) => {
  res.json({
    mensaje: 'Acceso permitido solo para usuario registrado',
  });
});


module.exports = app;


