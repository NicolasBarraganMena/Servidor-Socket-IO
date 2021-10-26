const { Router } = require('express');
const { usuariosPost, usuariosGetByUsername } = require('../controllers/usuarios');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/', usuariosPost);

router.get('/:username', [validarJWT], usuariosGetByUsername);

module.exports = router;