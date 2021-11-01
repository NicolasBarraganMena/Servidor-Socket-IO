const Usuario = require("../models/usuario")

const registrarAmistad = async(uid1, uid2) =>
{
    const usuario1  = await Usuario.findById(uid1);
    const usuario2  = await Usuario.findById(uid2);

    usuario1.friends.push(usuario2.username);
    usuario2.friends.push(usuario1.username);

    await Usuario.save(usuario1);
    await Usuario.save(usuario2);
};

const usuarioConectado = async(uid, state = true) =>
{
    const usuario = await Usuario.findById(uid);
    usuario.online = state;
    await Usuario.save(usuario);    
};

module.exports =
{
    registrarAmistad,
    usuarioConectado
}