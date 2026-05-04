const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuarioModelo = require('../models/usuarioModelo');

// Registra un nuevo usuario con rol "registrado".
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena } = req.body;

    // Validación de campos obligatorios
    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({
        mensaje: 'Nombre, correo y contraseña son obligatorios',
      });
    }

    //Normalizamos el correo a minúsculas
    const correoNormalizado = correo.toLowerCase();

    // Comprobamos si ya existe un usuario con ese correo
    const usuarioExistente = await usuarioModelo.buscarUsuarioPorCorreo(correoNormalizado);

    if (usuarioExistente) {
      return res.status(409).json({
        mensaje: 'Ya existe un usuario registrado con ese correo',
      });
    }

    // Encriptamos la contraseña
    const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

    // Creamos el usuario usando el correo en minúsculas
    const codUsuario = await usuarioModelo.crearUsuario({
      nombre,
      apellido,
      correo: correoNormalizado,
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

// Login de usuario.
const loginUsuario = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Validación básica
    if (!correo || !contrasena) {
      return res.status(400).json({
        mensaje: 'Correo y contraseña son obligatorios',
      });
    }

    //Normalizamos el correo también en login
    const correoNormalizado = correo.toLowerCase();

    // Buscamos el usuario usando el correo en minúsculas
    const usuario = await usuarioModelo.obtenerUsuarioPorCorreo(correoNormalizado);

    if (!usuario) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado',
      });
    }

    // Comprobamos contraseña
    const coincide = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!coincide) {
      return res.status(401).json({
        mensaje: 'Contraseña incorrecta',
      });
    }

    // Generamos token JWT
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

// Lista todos los usuarios (solo administrador).
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioModelo.obtenerUsuarios();

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener usuarios',
      error: error.message,
    });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
  listarUsuarios,
};