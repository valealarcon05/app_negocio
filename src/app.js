const express = require('express');
const cors = require('cors');
const actividadesRoutes = require('./routes/actividades');
const usuariosRoutes = require('./routes/usuarios');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/actividades', actividadesRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Servidor funcionando!');
});

module.exports = app;
