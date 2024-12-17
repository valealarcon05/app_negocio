const jwt = require('jsonwebtoken');
const db = require('../../config/database');
const bcrypt = require('bcryptjs');

// Crear usuario
const crearUsuario = (req, res) => {
  const { usuario, contrasena, rol } = req.body;

  if (!['admin', 'empleado'].includes(rol)) {
    return res.status(400).json({ error: 'Rol inválido. Debe ser "admin" o "empleado".' });
  }

  try {
    const hash = bcrypt.hashSync(contrasena, 10);
    const stmt = db.prepare('INSERT INTO usuarios (usuario, contrasena, rol) VALUES (?, ?, ?)');
    const result = stmt.run(usuario, hash, rol);

    res.status(201).json({ id: result.lastInsertRowid, usuario });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ mensaje: 'El usuario ya existe. Intenta con otro nombre.' });
    }
    res.status(500).send('Error al crear el usuario: ' + err.message);
  }
};

// Listar todos los usuarios
const listarUsuarios = (req, res) => {
  try {
    const stmt = db.prepare('SELECT id, usuario, rol FROM usuarios');
    const usuarios = stmt.all();
    res.status(200).json(usuarios);
  } catch (err) {
    console.error('Error al listar usuarios:', err.message);
    res.status(500).json({ error: 'Error al listar usuarios.' });
  }
};

// Actualizar usuario
const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { usuario, contrasena, rol } = req.body;

  if (rol && !['admin', 'empleado'].includes(rol)) {
    return res.status(400).json({ error: 'Rol inválido. Debe ser "admin" o "empleado".' });
  }

  try {
    const usuarioExistente = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(id);

    if (!usuarioExistente) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    const hashedPassword = contrasena ? await bcrypt.hash(contrasena, 10) : usuarioExistente.contrasena;

    const stmt = db.prepare(`
      UPDATE usuarios
      SET usuario = COALESCE(?, usuario),
          contrasena = COALESCE(?, contrasena),
          rol = COALESCE(?, rol)
      WHERE id = ?
    `);
    stmt.run(usuario, hashedPassword, rol, id);

    res.status(200).json({ mensaje: 'Usuario actualizado correctamente.' });
  } catch (err) {
    console.error('Error al actualizar usuario:', err.message);
    res.status(500).json({ error: 'Error al actualizar usuario.' });
  }
};

// Eliminar usuario
const eliminarUsuario = (req, res) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare('DELETE FROM usuarios WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    res.status(200).json({ mensaje: 'Usuario eliminado correctamente.' });
  } catch (err) {
    console.error('Error al eliminar usuario:', err.message);
    res.status(500).json({ error: 'Error al eliminar usuario.' });
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
      { id: row.id, usuario: row.usuario, rol: row.rol },
      'secreto_super_seguro',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token: token,
      usuario: row.usuario,
      id: row.id,
      rol: row.rol,
    });
  } catch (err) {
    res.status(500).send('Error en el servidor: ' + err.message);
  }
};

module.exports = { crearUsuario, loginUsuario, listarUsuarios, actualizarUsuario, eliminarUsuario };
