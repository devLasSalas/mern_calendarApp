const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT } = require('../middleware/validar-jwt');
const { validarCampos } = require('../middleware/validar-campos');
const { isDate } = require('../middleware/isDate');

const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');

const router = Router();

router.use( validarJWT );

router.post(
    '/',
    [
        check('title', 'Este campo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de inicio es obligatoria').custom( isDate ),
        validarCampos,
    ] 
    ,crearEvento);
router.get('/', getEventos);
router.put('/:id', actualizarEvento)
router.delete('/:id', eliminarEvento)




module.exports = router;