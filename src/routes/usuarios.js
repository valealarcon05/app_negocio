const express = require('express');
const { crearUsuario, loginUsuario, listarUsuarios, actualizarUsuario, eliminarUsuario } = require('../controllers/usuariosController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

const router = express.Router();

// Crear Usuario (admin)
router.post('/', verificarToken, verificarRol(['admin']), crearUsuario);

// Inicio de Sesión
router.post('/login', loginUsuario);

// Listar Usuarios (admin)
router.get('/', verificarToken, verificarRol(['admin']), listarUsuarios);

// Actualizar Usuario (admin)
router.put('/:id', verificarToken, verificarRol(['admin']), actualizarUsuario);

// Eliminar Usuario (admin)
router.delete('/:id', verificarToken, verificarRol(['admin']), eliminarUsuario);

module.exports = router;

