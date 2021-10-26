const jwt = require('jsonwebtoken');

const secret = "PAS$w0rdXT2021";

const generarJWT = (uid = '') => {

    return new Promise((resolve, reject) => {

        const payload = { uid };
        jwt.sign(payload, secret, {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {
                console.log(err.message);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }

        });
    });
};

const comprobarJWT = (token='')=>{

    try {
        const {uid} = jwt.verify(token,secret);
        return uid;
    } catch (error) {
        return false;
    }
}
module.exports = {
    generarJWT,
    comprobarJWT
}