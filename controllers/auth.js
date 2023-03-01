const { response } = require('express');
const bcrypt = require('bcryptjs')
const generarJWT = require('../helpers/jwt');
const Usuario = require('../models/Usuario');


const crearUsuario = async ( req, res = response ) => {

    const { email, password } = req.body;

    try {
        //Verificar si no existe un usuario con ese email ya registrado
        let usuario = await Usuario.findOne({ email });
        if( usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            })
        }
        
        usuario =  new Usuario(req.body);
        //hashear password
        const salt = bcrypt.genSaltSync(10);
        usuario.password = await bcrypt.hashSync( password, salt);
        
        await usuario.save();

        //! Generar jwtoken
        const token = await generarJWT( usuario.id, usuario.name);
        
         res.status(201).send({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            msg: 'Usuario creado',
            token
        })
        
        
    } catch (error) {

        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'error al crear la cuenta'
        })
    }

};

const loginUsuario = async ( req, res = response ) => {

    const {  email, password } = req.body;

    try {
        //Verificar si existe un usuario con ese correo
        let usuario = await Usuario.findOne({ email });
        if( !usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El email ingresado no existe'
            })
        }

        //Verificar si la password es correcta
        const verificarPassword = await bcrypt.compareSync( password, usuario.password)
        if( !verificarPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña es incorrecta'
            })
        }

        //!generar JWToken
        const token = await generarJWT( usuario.id, usuario.name )

        return res.status(200).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'error al iniciar sesión'
        })
    }

}

const revalidarToken = async ( req, res = response ) => {

    const { uid, name } = req;

    try {
     
      const token = await generarJWT( uid, name );  
        
     res.json({
        ok: true,
        uid, name,
        token
    })   

    } catch (error) {
        
    }

}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}