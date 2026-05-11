const conexionBD = require('../config/conexionBD');

// Obtiene todas las plataformas
const obtenerPlataformas = async () => {

  const [filas] = await conexionBD.query(`
    SELECT *
    FROM plataforma
    ORDER BY nombre_plataforma ASC
  `);

  return filas;
};

// Obtiene una plataforma por ID
const obtenerPlataformaPorId = async (cod_plataforma) => {

  const [filas] = await conexionBD.query(
    `
    SELECT *
    FROM plataforma
    WHERE cod_plataforma = ?
    `,
    [cod_plataforma]
  );

  return filas[0];
};

// Crea una nueva plataforma
const crearPlataforma = async (nombre_plataforma) => {

  const [resultado] = await conexionBD.query(
    `
    INSERT INTO plataforma (nombre_plataforma)
    VALUES (?)
    `,
    [nombre_plataforma]
  );

  return resultado.insertId;
};

// Edita una plataforma
const editarPlataforma = async (
  cod_plataforma,
  nombre_plataforma
) => {

  const [resultado] = await conexionBD.query(
    `
    UPDATE plataforma
    SET nombre_plataforma = ?
    WHERE cod_plataforma = ?
    `,
    [
      nombre_plataforma,
      cod_plataforma,
    ]
  );

  return resultado.affectedRows;
};

// Elimina una plataforma
const eliminarPlataforma = async (cod_plataforma) => {

  const [resultado] = await conexionBD.query(
    `
    DELETE FROM plataforma
    WHERE cod_plataforma = ?
    `,
    [cod_plataforma]
  );

  return resultado.affectedRows;
};

module.exports = {
  obtenerPlataformas,
  obtenerPlataformaPorId,
  crearPlataforma,
  editarPlataforma,
  eliminarPlataforma,
};