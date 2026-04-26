// Comprueba si el usuario tiene uno de los roles permitidos.
const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    const codRolUsuario = req.usuario.cod_rol;

    if (!rolesPermitidos.includes(codRolUsuario)) {
      return res.status(403).json({
        mensaje: 'No tienes permisos para acceder a esta ruta',
      });
    }

    next();
  };
};

module.exports = {
  verificarRol,
};