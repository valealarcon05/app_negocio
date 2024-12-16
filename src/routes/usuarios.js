const express = require('express');
const router = express.Router();
const { crearUsuario, loginUsuario } = require('../controllers/usuariosController');

router.post('/', crearUsuario);
router.post('/login', loginUsuario);

module.exports = router;
