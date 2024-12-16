const jwt = require('jsonwebtoken');

// Middleware para verificar JWT
const verificarToken = (req, res, next) => {
  const token = req.header('Authorization');
  console.log('1. Token recibido completo:', token);

  if (!token) {
    console.log('2. No se envió un token.');
    return res.status(401).json({ mensaje: 'Acceso denegado. No hay token.' });
  }

  try {
    // Extraer la parte después de "Bearer"
    const partesToken = token.split(' ');
    console.log('3. Partes del token:', partesToken);

    if (partesToken[0] !== 'Bearer' || !partesToken[1]) {
      console.log('4. El formato del token es incorrecto.');
      return res.status(401).json({ mensaje: 'Formato de token incorrecto.' });
    }

    const tokenSinBearer = partesToken[1];
    console.log('5. Token sin Bearer:', tokenSinBearer);

    // Verificar el token
    const decoded = jwt.verify(tokenSinBearer, 'secreto_super_seguro'); // Clave secreta
    console.log('6. Token decodificado correctamente:', decoded);

    req.usuario = decoded; // Adjuntar datos del usuario al request
    next(); // Continuar al siguiente middleware/controlador
  } catch (err) {
    console.error('7. Error al verificar el token:', err.message);
    return res.status(401).json({ mensaje: 'Token inválido: ' + err.message });
  }
};

module.exports = verificarToken;
