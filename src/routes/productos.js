const express = require('express');
const { check, validationResult } = require('express-validator');
const {
  registrarProducto,
  consultarProductos,
  consultarStock,
  actualizarProducto,
  eliminarProducto,
} = require('../controllers/productosController');
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

// Actualizar Producto
router.put(
  '/:id',
  verificarToken,
  [
    check('nombre').optional().isString(),
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
  actualizarProducto
);

// Eliminar Producto
router.delete('/:id', verificarToken, eliminarProducto);

module.exports = router;
const express = require('express');
const { check, validationResult } = require('express-validator');
const {
  registrarProducto,
  consultarProductos,
  consultarStock,
  actualizarProducto,
  eliminarProducto,
} = require('../controllers/productosController');
const verificarToken = require('../middleware/authMiddleware');

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

// Actualizar Producto
router.put(
  '/:id',
  verificarToken,
  [
    check('nombre').optional().isString(),
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
  actualizarProducto
);

// Eliminar Producto
router.delete('/:id', verificarToken, eliminarProducto);

module.exports = router;
