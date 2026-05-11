const plataformaModelo = require('../models/plataformaModelo');

// Obtiene todas las plataformas
const obtenerPlataformas = async (req, res) => {
  try {
    const plataformas = await plataformaModelo.obtenerPlataformas();

    res.json(plataformas);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener plataformas',
      error: error.message,
    });
  }
};

// Crea una nueva plataforma
const crearPlataforma = async (req, res) => {
  try {
    const { nombre_plataforma } = req.body;

    if (!nombre_plataforma) {
      return res.status(400).json({
        mensaje: 'El nombre de la plataforma es obligatorio',
      });
    }

    const id = await plataformaModelo.crearPlataforma(nombre_plataforma);

    res.status(201).json({
      mensaje: 'Plataforma creada correctamente',
      cod_plataforma: id,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al crear plataforma',
      error: error.message,
    });
  }
};

// Edita una plataforma existente
const editarPlataforma = async (req, res) => {
  try {
    const { cod_plataforma } = req.params;
    const { nombre_plataforma } = req.body;

    if (!nombre_plataforma) {
      return res.status(400).json({
        mensaje: 'El nombre de la plataforma es obligatorio',
      });
    }

    const resultado = await plataformaModelo.editarPlataforma(
      cod_plataforma,
      nombre_plataforma
    );

    if (!resultado) {
      return res.status(404).json({
        mensaje: 'Plataforma no encontrada',
      });
    }

    res.json({
      mensaje: 'Plataforma actualizada correctamente',
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al editar plataforma',
      error: error.message,
    });
  }
};

// Elimina una plataforma
const eliminarPlataforma = async (req, res) => {
  try {
    const { cod_plataforma } = req.params;

    const resultado = await plataformaModelo.eliminarPlataforma(cod_plataforma);

    if (!resultado) {
      return res.status(404).json({
        mensaje: 'Plataforma no encontrada',
      });
    }

    res.json({
      mensaje: 'Plataforma eliminada correctamente',
    });
  } catch (error) {
    res.status(500).json({
      mensaje:
        'No se puede eliminar la plataforma porque tiene productos asociados',
      error: error.message,
    });
  }
};

module.exports = {
  obtenerPlataformas,
  crearPlataforma,
  editarPlataforma,
  eliminarPlataforma,
};