const { Router } = require('express');
const { check } = require('express-validator')

const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');

const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();


router.post(
    '/new', 
[ 
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña debe ser de 6 caracteres minimo').isLength({ min: 6 }),
    validarCampos,

], crearUsuario )

router.post(
    '/', 
[
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña debe ser de 6 caracteres minimo').isLength({ min: 6 }),
    validarCampos,

], loginUsuario )

router.get('/renew', [ validarJWT ], revalidarToken )


module.exports = router;