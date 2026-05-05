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

// Devuelve usuario completo por correo para login.
const obtenerUsuarioPorCorreo = async (correo) => {
  const [filas] = await conexionBD.query(
    'SELECT * FROM usuario WHERE correo = ?',
    [correo]
  );

  return filas[0];
};

// Obtiene todos los usuarios para el panel de administración.
const obtenerUsuarios = async () => {
  const [filas] = await conexionBD.query(
    `SELECT 
      cod_usuario,
      nombre,
      apellido,
      correo,
      cod_rol,
      fecha_registro,
      activo
    FROM usuario`
  );

  return filas;
};

// Cambia el rol de un usuario en la base de datos
// cod_rol: 1 = admin, 2 = vendedor, 3 = usuario
const cambiarRol = async (cod_usuario, cod_rol) => {
  const [resultado] = await conexionBD.query(
    'UPDATE usuario SET cod_rol = ? WHERE cod_usuario = ?',
    [cod_rol, cod_usuario]
  );

  // Devuelve el número de filas afectadas
  return resultado.affectedRows;
};

// Desactiva un usuario sin eliminarlo físicamente de la base de datos
const desactivarUsuario = async (cod_usuario) => {
  const [resultado] = await conexionBD.query(
    'UPDATE usuario SET activo = FALSE WHERE cod_usuario = ?',
    [cod_usuario]
  );

  return resultado.affectedRows;
};

// Cambia el estado de un usuario.
// activo = true  -> usuario activo
// activo = false -> usuario desactivado
const cambiarEstadoUsuario = async (cod_usuario, activo) => {
  const [resultado] = await conexionBD.query(
    'UPDATE usuario SET activo = ? WHERE cod_usuario = ?',
    [activo, cod_usuario]
  );

  return resultado.affectedRows;
};

module.exports = {
  buscarUsuarioPorCorreo,
  crearUsuario,
  obtenerUsuarioPorCorreo,
  obtenerUsuarios,
  cambiarRol,
  desactivarUsuario,
  cambiarEstadoUsuario,
};