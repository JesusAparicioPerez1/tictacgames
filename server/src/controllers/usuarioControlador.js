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

// Cambia el rol de un usuario (solo accesible por administrador)
const cambiarRolUsuario = async (req, res) => {
  try {
    // ID del usuario a modificar
    const { cod_usuario } = req.params;

    // Nuevo rol que se quiere asignar
    const { cod_rol } = req.body;

    // Llamada al modelo para actualizar en BD
    await usuarioModelo.cambiarRol(cod_usuario, cod_rol);

    res.json({
      mensaje: 'Rol actualizado correctamente',
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al cambiar rol',
      error: error.message,
    });
  }
};

// Desactiva un usuario desde el panel de administración
const desactivarUsuario = async (req, res) => {
  try {
    const { cod_usuario } = req.params;

    const resultado = await usuarioModelo.desactivarUsuario(cod_usuario);

    if (!resultado) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado',
      });
    }

    res.json({
      mensaje: 'Usuario desactivado correctamente',
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al desactivar usuario',
      error: error.message,
    });
  }
};

// Cambia el estado de un usuario desde el panel de administración.
const cambiarEstadoUsuario = async (req, res) => {
  try {
    const { cod_usuario } = req.params;
    const { activo } = req.body;

    // Validamos que el campo activo sea booleano.
    if (typeof activo !== 'boolean') {
      return res.status(400).json({
        mensaje: 'El campo activo debe ser true o false',
      });
    }

    const resultado = await usuarioModelo.cambiarEstadoUsuario(
      cod_usuario,
      activo
    );

    if (!resultado) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado',
      });
    }

    res.json({
      mensaje: activo
        ? 'Usuario activado correctamente'
        : 'Usuario desactivado correctamente',
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al cambiar el estado del usuario',
      error: error.message,
    });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
  listarUsuarios,
  desactivarUsuario,
  cambiarRolUsuario,
  cambiarEstadoUsuario,
};