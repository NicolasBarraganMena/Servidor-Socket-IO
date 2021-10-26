const Usuario = require('../models/usuario')
const bcryptjs = require('bcryptjs');
const { request } = require('express');


const usuariosPost = async(req, res) => {

    const { username, password } = req.body

    //#region Validaciones
    //Verifica que el request contenga el usuario
    if (!username) {
        return res.status(400).json({
            msg: "Debe enviar el usuario"
        });
    }
    //Verifica que el request contenga la contraseña
    if (!password) {
        return res.status(400).json({
            msg: "Debe enviar el password"
        });
    }
    //Verifica si ya existe usuario con ese username
    const usuarioDB = await Usuario.findOne({ username })
    if (usuarioDB) {
        return res.status(400).json({
            msg: "Ya existe usuario con ese username"
        });
    }
    //#endregion

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    const hash = bcryptjs.hashSync(password, salt);

    //preparo la data para guardar
    const dataUsuario = {
        username,
        password: hash,
        estado: true,
        friends:[],
        score:0
    }

    //Guardamos el usuario y extraemos la contraseña 
    const { password: pass, ...usuario } = await Usuario.save(dataUsuario)

    res.json({
        msg: 'POST - api',
        usuario
    })
}

const usuariosGetByUsername = async(req = request, res) => {

    // const token = req.headers['x-token'];

    // if (!token) {
    //     return res.status(401).json({
    //         msg: 'No hay token en la peticion'
    //     });
    // }

    const { username } = req.params;
    
    let usuario = await Usuario.findOne({ username })

    res.json({
        msg: 'GET - api',
        usuario
    })
}

module.exports = {
    usuariosPost,
    usuariosGetByUsername
}