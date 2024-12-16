const express = require('express');
const { check, validationResult } = require('express-validator');
const { registrarProduccion, consultarProduccion } = require('../controllers/produccionController');
const verificarToken = require('../middleware/authMiddleware');

const router = express.Router();

// Registrar Producción
router.post(
  '/',
  verificarToken,
  [
    check('usuario_id').isInt().withMessage('El ID del usuario debe ser un número entero'),
    check('producto_id').isInt().withMessage('El ID del producto debe ser un número entero'),
    check('cantidad').isInt({ min: 1 }).withMessage('La cantidad debe ser al menos 1')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    next();
  },
  registrarProduccion
);

// Consultar Producción por Usuario
router.get('/:usuario_id', verificarToken, consultarProduccion);

module.exports = router;
