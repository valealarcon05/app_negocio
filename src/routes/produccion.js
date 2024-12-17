const express = require('express');
const {
  registrarProduccion,
  consultarProduccion,
  consultarProduccionPorRango,
  consultarProduccionPorUsuarioYFechas,
  consultarProduccionPorProducto,
  eliminarProduccion,
  actualizarProduccion,
} = require('../controllers/produccionController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

const router = express.Router();

// Registrar Producción (todos los roles)
router.post(
  '/',
  verificarToken,
  verificarRol(['admin', 'empleado']),
  registrarProduccion
);

// Consultar Producción por Usuario
router.get('/:usuario_id', verificarToken, verificarRol(['admin']), consultarProduccion);

// Consultar Producción por Usuario y Rango de Fechas
router.get('/:usuario_id/filtrar', verificarToken, verificarRol(['admin']), consultarProduccionPorUsuarioYFechas);

// Consultar Producción por Producto
router.get('/producto/:producto_id', verificarToken, verificarRol(['admin']), consultarProduccionPorProducto);

// Consultar Producción por Rango de Fechas
router.get('/', verificarToken, verificarRol(['admin']), consultarProduccionPorRango);

// Eliminar Producción (solo admin)
router.delete('/:id', verificarToken, verificarRol(['admin']), eliminarProduccion);

// Actualizar Producción (solo admin)
router.put('/:id', verificarToken, verificarRol(['admin']), actualizarProduccion);

module.exports = router;
