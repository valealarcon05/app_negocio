const db = require('../../config/database');

// Registrar actividad
const registrarActividad = (req, res) => {
  const { usuario_id, tipo, descripcion } = req.body;
  const query = `INSERT INTO actividades (usuario_id, tipo, descripcion) VALUES (?, ?, ?)`;

  db.run(query, [usuario_id, tipo, descripcion], function (err) {
    if (err) return res.status(500).send('Error al registrar actividad');
    res.status(201).send({ mensaje: 'Actividad registrada correctamente', actividad_id: this.lastID });
  });
};

// Consultar actividades por usuario
const consultarActividades = (req, res) => {
  const { usuario_id } = req.params;
  const query = `SELECT * FROM actividades WHERE usuario_id = ?`;

  db.all(query, [usuario_id], (err, rows) => {
    if (err) return res.status(500).send('Error al consultar actividades');
    res.status(200).send(rows);
  });
};

// Filtrar actividades por tipo
const filtrarActividades = (req, res) => {
  const { tipo } = req.query;
  let query = `SELECT * FROM actividades`;
  const params = [];

  if (tipo) {
    query += ` WHERE tipo = ?`;
    params.push(tipo);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).send('Error al filtrar actividades');
    res.status(200).send(rows);
  });
};

// Consultar actividades por rango de fechas
const consultarPorRango = (req, res) => {
  const { desde, hasta } = req.query;
  if (!desde || !hasta) return res.status(400).send('Faltan parámetros de fecha');

  const query = `SELECT * FROM actividades WHERE fecha BETWEEN ? AND ?`;
  db.all(query, [desde, hasta], (err, rows) => {
    if (err) return res.status(500).send('Error al consultar rango de actividades');
    res.status(200).send(rows);
  });
};

module.exports = { registrarActividad, consultarActividades, filtrarActividades, consultarPorRango };
