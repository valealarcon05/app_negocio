const express = require('express');
const router = express.Router();
const { registrarActividad, consultarActividades, filtrarActividades, consultarPorRango } = require('../controllers/actividadesController');

// Ruta para obtener todas las actividades
router.get('/:usuario_id', consultarActividades);
router.get('/', filtrarActividades);
router.get('/rango', consultarPorRango);

// Ruta para agregar una nueva actividad
router.post('/', registrarActividad);

module.exports = router;