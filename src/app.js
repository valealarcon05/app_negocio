const express = require('express');
const cors = require('cors');
const productosRoutes = require('./routes/productos');

const app = express();

app.use(cors());
app.use(express.json());

// Registro de rutas
app.use('/api/productos', productosRoutes);

// Servidor
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
