const mysql = require('mysql2/promise');
require('dotenv').config();

const conexionBD = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USUARIO,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NOMBRE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = conexionBD;