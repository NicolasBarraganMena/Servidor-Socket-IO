const { request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const secret = "PAS$w0rdXT2021";

const validarJWT = async(req = request, res, next) => {

    const token = req.headers['x-token'];

    //Verificamos si viene el token en la petición
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    let _uid;
    try {
        const { uid } = jwt.verify(token, secret);
        _uid = uid
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({
            msg: 'Token no valido'
        });
    }

    const usuario = await Usuario.findById(_uid);

    if (!usuario) {
        return res.status(401).json({
            msg: 'Token no valido - usuario no existe'
        });
    }
    //Verificar si el usuario esta activo
    if (!usuario.estado) {
        return res.status(401).json({
            msg: 'Token no valido - usuario inactivo'
        });
    }

    req.usuario = usuario;

    next();
}



module.exports = {
    validarJWT
}