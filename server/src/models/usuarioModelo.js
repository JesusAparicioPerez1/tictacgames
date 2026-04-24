const conexionBD = require('../config/conexionBD');

// Busca un usuario por correo para evitar registros duplicados.
const buscarUsuarioPorCorreo = async (correo) => {
  const [filas] = await conexionBD.query(
    'SELECT * FROM usuario WHERE correo = ?',
    [correo]
  );

  return filas[0];
};

// Crea un nuevo usuario con rol de usuario registrado.
const crearUsuario = async ({ nombre, apellido, correo, contrasenaEncriptada }) => {
  const [resultado] = await conexionBD.query(
    `INSERT INTO usuario (nombre, apellido, correo, contrasena, cod_rol)
     VALUES (?, ?, ?, ?, ?)`,
    [nombre, apellido, correo, contrasenaEncriptada, 3]
  );

  return resultado.insertId;
};

// Devuelve usuario completo por correo (para login)
const obtenerUsuarioPorCorreo = async (correo) => {
  const [filas] = await conexionBD.query(
    'SELECT * FROM usuario WHERE correo = ?',
    [correo]
  );

  return filas[0];
};

module.exports = {
  buscarUsuarioPorCorreo,
  crearUsuario,
  obtenerUsuarioPorCorreo,
};