const conexionBD = require('../config/conexionBD');

// Busca un usuario por correo para evitar registros duplicados
const buscarUsuarioPorCorreo = async (correo) => {
  const [filas] = await conexionBD.query(
    'SELECT * FROM usuario WHERE correo = ?',
    [correo]
  );

  return filas[0];
};

// Crea un nuevo usuario registrado
const crearUsuario = async ({
  nombre,
  apellido,
  correo,
  contrasenaEncriptada,
}) => {
  const [resultado] = await conexionBD.query(
    `INSERT INTO usuario
    (
      nombre,
      apellido,
      correo,
      contrasena,
      cod_rol,
      activo
    )
    VALUES (?, ?, ?, ?, ?, true)`,
    [
      nombre,
      apellido,
      correo,
      contrasenaEncriptada,
      3,
    ]
  );

  return resultado.insertId;
};

// Obtiene usuario completo por correo
const obtenerUsuarioPorCorreo = async (correo) => {
  const [filas] = await conexionBD.query(
    'SELECT * FROM usuario WHERE correo = ?',
    [correo]
  );

  return filas[0];
};

// Obtiene todos los usuarios para el panel admin
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
    FROM usuario
    ORDER BY cod_usuario DESC`
  );

  return filas;
};

// Cambia el rol de un usuario
// 1 = admin
// 2 = vendedor
// 3 = usuario
const cambiarRol = async (cod_usuario, cod_rol) => {
  const [resultado] = await conexionBD.query(
    `UPDATE usuario
     SET cod_rol = ?
     WHERE cod_usuario = ?`,
    [cod_rol, cod_usuario]
  );

  return resultado.affectedRows;
};

// Cambia el estado de un usuario
// activo = true  -> activo
// activo = false -> desactivado
const cambiarEstadoUsuario = async (
  cod_usuario,
  activo
) => {
  const [resultado] = await conexionBD.query(
    `UPDATE usuario
     SET activo = ?
     WHERE cod_usuario = ?`,
    [activo, cod_usuario]
  );

  return resultado.affectedRows;
};

// Crear usuario desde panel admin
const crearUsuarioAdmin = async ({
  nombre,
  correo,
  contrasena,
  cod_rol,
}) => {
  const [resultado] = await conexionBD.query(
    `INSERT INTO usuario
    (
      nombre,
      correo,
      contrasena,
      cod_rol,
      activo
    )
    VALUES (?, ?, ?, ?, true)`,
    [
      nombre,
      correo,
      contrasena,
      cod_rol,
    ]
  );

  return resultado.insertId;
};

// Eliminar usuario definitivamente
const eliminarUsuario = async (cod_usuario) => {
  const [resultado] = await conexionBD.query(
    `DELETE FROM usuario
     WHERE cod_usuario = ?`,
    [cod_usuario]
  );

  return resultado;
};

module.exports = {
  buscarUsuarioPorCorreo,
  crearUsuario,
  obtenerUsuarioPorCorreo,
  obtenerUsuarios,
  cambiarRol,
  cambiarEstadoUsuario,
  crearUsuarioAdmin,
  eliminarUsuario,
};