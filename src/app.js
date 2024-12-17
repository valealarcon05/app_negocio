const express = require('express');
const cors = require('cors');
const actividadesRoutes = require('./routes/actividades');
const usuariosRoutes = require('./routes/usuarios');
const productosRoutes = require('./routes/productos');
const produccionRoutes = require('./routes/produccion');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// **Middleware de Registro de Solicitudes**
app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

// Rutas
app.use('/api/actividades', actividadesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/produccion', produccionRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Servidor funcionando!');
});

module.exports = app;
