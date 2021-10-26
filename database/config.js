const jsonDB = require('../jsonDB/jsonDB');


const dbConnection = async() => {
    try {

        await jsonDB.connect();

        console.log('Base de datos online');

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }
}

module.exports = {
    dbConnection
}