const jwt = require('jsonwebtoken');

// Comprueba que la petición incluye un token válido.
const verificarToken = (req, res, next) => {
  try {
    const cabeceraAuth = req.headers.authorization;

    if (!cabeceraAuth) {
      return res.status(401).json({
        mensaje: 'Token no proporcionado',
      });
    }

    const token = cabeceraAuth.split(' ')[1];

    const datosUsuario = jwt.verify(token, process.env.CLAVE_JWT);

    req.usuario = datosUsuario;

    next();
  } catch (error) {
    res.status(401).json({
      mensaje: 'Token inválido o expirado',
    });
  }
};

module.exports = {
  verificarToken,
};