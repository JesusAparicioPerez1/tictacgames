const express = require('express');
const cors = require('cors');
const conexionBD = require('./config/conexionBD');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta base
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de TicTac Games funcionando correctamente',
  });
});

// Ruta prueba base de datos
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

module.exports = app;