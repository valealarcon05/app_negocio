const express = require('express');
const { check, validationResult } = require('express-validator');
const { registrarProducto, consultarProductos, consultarStock } = require('../controllers/productosController');
const verificarToken = require('../middleware/authMiddleware');

const router = express.Router();

// Registrar Producto
router.post(
  '/',
  verificarToken,
  [
    check('nombre').notEmpty().withMessage('El nombre del producto es obligatorio'),
    check('descripcion').optional().isString(),
    check('stock').optional().isInt().withMessage('El stock debe ser un número entero'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    next();
  },
  registrarProducto
);

// Consultar Productos
router.get('/', verificarToken, consultarProductos);

// Consultar Stock Total de Productos
router.get('/stock', verificarToken, consultarStock);

module.exports = router;
