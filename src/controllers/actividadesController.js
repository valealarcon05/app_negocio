const db = require('../../config/database'); 

// Registrar actividad
const registrarActividad = (req, res) => {
  const { usuario_id, tipo, descripcion } = req.body;

  try {
    const stmt = db.prepare('INSERT INTO actividades (usuario_id, tipo, descripcion) VALUES (?, ?, ?)');
    const result = stmt.run(usuario_id, tipo, descripcion);

    res.status(201).json({ mensaje: 'Actividad registrada correctamente', actividad_id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).send('Error al registrar actividad: ' + err.message);
  }
};

// Consultar actividades por usuario
const consultarActividades = (req, res) => {
  const { usuario_id } = req.params;

  try {
    const stmt = db.prepare('SELECT * FROM actividades WHERE usuario_id = ?');
    const rows = stmt.all(usuario_id);

    res.status(200).json(rows);
  } catch (err) {
    res.status(500).send('Error al consultar actividades: ' + err.message);
  }
};

// Filtrar actividades por tipo
const filtrarActividades = (req, res) => {
  const { tipo } = req.query;

  try {
    let query = 'SELECT * FROM actividades';
    const params = [];

    if (tipo) {
      query += ' WHERE tipo = ?';
      params.push(tipo);
    }

    const stmt = db.prepare(query);
    const rows = stmt.all(...params);

    res.status(200).json(rows);
  } catch (err) {
    res.status(500).send('Error al filtrar actividades: ' + err.message);
  }
};

// Consultar actividades por rango de fechas
const consultarPorRango = (req, res) => {
  const { desde, hasta } = req.query;

  if (!desde || !hasta) return res.status(400).send('Faltan parámetros de fecha');

  try {
    const stmt = db.prepare('SELECT * FROM actividades WHERE fecha BETWEEN ? AND ?');
    const rows = stmt.all(desde, hasta);

    res.status(200).json(rows);
  } catch (err) {
    res.status(500).send('Error al consultar actividades por rango: ' + err.message);
  }
};

module.exports = { registrarActividad, consultarActividades, filtrarActividades, consultarPorRango };
