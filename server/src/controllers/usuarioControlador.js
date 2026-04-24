const bcrypt = require('bcrypt');
const usuarioModelo = require('../models/usuarioModelo');
const jwt = require('jsonwebtoken');

// Registra un nuevo usuario con rol "registrado".
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena } = req.body;

    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({
        mensaje: 'Nombre, correo y contraseña son obligatorios',
      });
    }

    const usuarioExistente = await usuarioModelo.buscarUsuarioPorCorreo(correo);

    if (usuarioExistente) {
      return res.status(409).json({
        mensaje: 'Ya existe un usuario registrado con ese correo',
      });
    }

    const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

    const codUsuario = await usuarioModelo.crearUsuario({
      nombre,
      apellido,
      correo,
      contrasenaEncriptada,
    });

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      cod_usuario: codUsuario,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al registrar usuario',
      error: error.message,
    });
  }
};

// Login de usuario
const loginUsuario = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({
        mensaje: 'Correo y contraseña son obligatorios',
      });
    }

    const usuario = await usuarioModelo.obtenerUsuarioPorCorreo(correo);

    if (!usuario) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado',
      });
    }

    const coincide = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!coincide) {
      return res.status(401).json({
        mensaje: 'Contraseña incorrecta',
      });
    }

    const token = jwt.sign(
  {
    cod_usuario: usuario.cod_usuario,
    cod_rol: usuario.cod_rol,
  },
  process.env.CLAVE_JWT,
  { expiresIn: '2h' }
);

res.json({
  mensaje: 'Login correcto',
  token: token,
});

  } catch (error) {
    res.status(500).json({
      mensaje: 'Error en login',
      error: error.message,
    });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
};