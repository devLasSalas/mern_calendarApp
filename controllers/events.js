const { response } = require('express');
const { findById } = require('../models/Evento');
const Evento = require('../models/Evento');


const crearEvento = async (req, res = response) => {

    const evento = new Evento( req.body );

    try {
        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        res.status(201).json({
            ok: true,
            evento: eventoGuardado,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
};

const getEventos = async (req, res = response) => {

    try {

        const eventos = await Evento.find()
                                            .populate('user', 'name')

        res.json({
            ok: true,
            eventos,
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
};


const actualizarEvento = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );
        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            })
        }
        //Verificar si el id del que creo el evento es el mismo que lo va editar
        if( evento.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para editar este evento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }
        const eventoGuardado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true });

        res.json({
            ok: true,
            evento: eventoGuardado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
    
};

const eliminarEvento = async (req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );
        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            })
        }
        //Verificar si el id del que creo el evento es el mismo que lo va editar
        if( evento.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para editar este evento'
            })
        }

      await Evento.findByIdAndDelete( eventoId );

        res.json({ ok: true })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}