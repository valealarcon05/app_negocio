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
  

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
