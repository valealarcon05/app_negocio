const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Servidor funcionando con SQLite!');
});

// Crear usuario
app.post('/usuarios', (req, res) => {
  const { usuario, contrasena } = req.body;
  const hash = bcrypt.hashSync(contrasena, 10);

  const query = `INSERT INTO usuarios (usuario, contrasena) VALUES (?, ?)`;
  db.run(query, [usuario, hash], function (err) {
    if (err) {
      res.status(500).send('Error al crear el usuario');
    } else {
      res.status(201).send({ id: this.lastID, usuario });
    }
  });
});

// Ruta de Inicio de Sesión
app.post('/login', (req, res) => {
    const { usuario, contrasena } = req.body;
  
    const query = `SELECT * FROM usuarios WHERE usuario = ?`;
    db.get(query, [usuario], (err, row) => {
      if (err) {
        res.status(500).send('Error del servidor');
      } else if (!row) {
        res.status(401).send('Usuario no encontrado');
      } else {
        const isMatch = bcrypt.compareSync(contrasena, row.contrasena);
        if (isMatch) {
          res.status(200).send({
            mensaje: 'Inicio de sesión exitoso',
            usuario: row.usuario,
            id: row.id,
          });
        } else {
          res.status(401).send('Contraseña incorrecta');
        }
      }
    });
  });
 
  
// Registrar Actividad
app.post('/actividades', (req, res) => {
    const { usuario_id, tipo, descripcion } = req.body;
  
    const query = `
      INSERT INTO actividades (usuario_id, tipo, descripcion)
      VALUES (?, ?, ?)
    `;
  
    db.run(query, [usuario_id, tipo, descripcion], function (err) {
      if (err) {
        res.status(500).send('Error al registrar actividad');
      } else {
        res.status(201).send({
          mensaje: 'Actividad registrada correctamente',
          actividad_id: this.lastID,
        });
      }
    });
  });

// Consultar Actividades por Usuario
app.get('/actividades/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;

  const query = `SELECT * FROM actividades WHERE usuario_id = ?`;

  db.all(query, [usuario_id], (err, rows) => {
    if (err) {
      res.status(500).send('Error al consultar actividades');
    } else {
      res.status(200).send(rows);
    }
  });
});

// Filtrar Actividades por Tipo
app.get('/actividades', (req, res) => {
  const { tipo } = req.query;  // Consulta usando parámetros de la URL

  let query = `SELECT * FROM actividades`;
  const params = [];

  if (tipo) {
    query += ` WHERE tipo = ?`;
    params.push(tipo);  // Si hay un tipo, se agrega a la consulta
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).send('Error al filtrar actividades');
    } else {
      res.status(200).send(rows);
    }
  });
});

// Consultar Actividades por Rango de Fechas
app.get('/actividades/rango', (req, res) => {
  const { desde, hasta } = req.query;

  // Verifica que ambas fechas estén presentes
  if (!desde || !hasta) {
    return res.status(400).send('Faltan parámetros de fecha');
  }

  const query = `
    SELECT * FROM actividades 
    WHERE fecha BETWEEN ? AND ?
  `;

  db.all(query, [desde, hasta], (err, rows) => {
    if (err) {
      res.status(500).send('Error al consultar rango de actividades');
    } else {
      res.status(200).send(rows);
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
