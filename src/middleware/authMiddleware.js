const jwt = require('jsonwebtoken');

// Middleware para verificar JWT
const verificarToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. No hay token.' });
  }

  try {
    const partesToken = token.split(' ');
    if (partesToken[0] !== 'Bearer' || !partesToken[1]) {
      return res.status(401).json({ mensaje: 'Formato de token incorrecto.' });
    }

    const tokenSinBearer = partesToken[1];
    const decoded = jwt.verify(tokenSinBearer, 'secreto_super_seguro');

    req.usuario = decoded; // Adjuntar datos decodificados al request
    next(); 
  } catch (err) {
    return res.status(401).json({ mensaje: 'Token inválido: ' + err.message });
  }
};

// Middleware para verificar roles
const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    const { rol } = req.usuario;
    if (!rolesPermitidos.includes(rol)) {
      return res.status(403).json({ mensaje: 'Acceso denegado. No tienes permisos.' });
    }
    next();
  };
};

module.exports = { verificarToken, verificarRol };
