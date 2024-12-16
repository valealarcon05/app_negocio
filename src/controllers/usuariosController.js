const jwt = require('jsonwebtoken'); // Importar JWT
const db = require('../../config/database');
const bcrypt = require('bcryptjs');

// Clave secreta para JWT
const JWT_SECRET = 'secreto_super_seguro';

// Crear usuario
const crearUsuario = (req, res) => {
  const { usuario, contrasena } = req.body;

  try {
    const hash = bcrypt.hashSync(contrasena, 10);
    const stmt = db.prepare('INSERT INTO usuarios (usuario, contrasena) VALUES (?, ?)');
    const result = stmt.run(usuario, hash);

    res.status(201).json({ id: result.lastInsertRowid, usuario });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT'){
      return res.status(400).json({mensaje:'El usuario ya existe. Intenta con otro nombre.'})
    }
    res.status(500).send('Error al crear el usuario: ' + err.message);
  }
};

// Inicio de sesión
const loginUsuario = (req, res) => {
  const { usuario, contrasena } = req.body;

  try {
    const stmt = db.prepare('SELECT * FROM usuarios WHERE usuario = ?');
    const row = stmt.get(usuario);

    if (!row) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    const isMatch = bcrypt.compareSync(contrasena, row.contrasena);
    if (!isMatch) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: row.id, usuario: row.usuario }, // Payload
      'secreto_super_seguro', // Clave secreta
      { expiresIn: '1h' } // Expiración del token
    );

    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token: token,
      usuario: row.usuario,
      id: row.id,
    });
  } catch (err) {
    res.status(500).send('Error en el servidor: ' + err.message);
  }
};

module.exports = { crearUsuario, loginUsuario };
