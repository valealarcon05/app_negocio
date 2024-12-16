const db = require('../../config/database');
const bcrypt = require('bcryptjs');

// Crear usuario
const crearUsuario = (req, res) => {
  const { usuario, contrasena } = req.body;
  const hash = bcrypt.hashSync(contrasena, 10);

  const query = `INSERT INTO usuarios (usuario, contrasena) VALUES (?, ?)`;
  db.run(query, [usuario, hash], function (err) {
    if (err) return res.status(500).send('Error al crear el usuario');
    res.status(201).send({ id: this.lastID, usuario });
  });
};

// Inicio de sesión
const loginUsuario = (req, res) => {
  const { usuario, contrasena } = req.body;
  const query = `SELECT * FROM usuarios WHERE usuario = ?`;

  db.get(query, [usuario], (err, row) => {
    if (err || !row) return res.status(401).send('Usuario no encontrado');
    const isMatch = bcrypt.compareSync(contrasena, row.contrasena);
    isMatch
      ? res.status(200).send({ mensaje: 'Inicio de sesión exitoso', usuario: row.usuario, id: row.id })
      : res.status(401).send('Contraseña incorrecta');
  });
};

module.exports = { crearUsuario, loginUsuario };
