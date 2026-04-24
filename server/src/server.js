require('dotenv').config();

const app = require('./app');

const puerto = process.env.PUERTO || 3000;

app.listen(puerto, () => {
  console.log(`Servidor iniciado en http://localhost:${puerto}`);
});