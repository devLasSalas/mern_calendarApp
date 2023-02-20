const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = ( req, res = response, next) => {

    //? x-token  - Headers
    const token = req.header('x-token')
    //Si no hay token return
    if( !token ){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        })
    }
    //En caso de que haya un token
    try {

        const { uid, name } = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        )
        
        req.uid = uid;
        req.name = name;

        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        })
    }
    


    next();
}

module.exports = {
    validarJWT
}