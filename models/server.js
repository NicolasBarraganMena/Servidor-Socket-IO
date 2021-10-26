const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const cors = require('cors');
const Sockets = require('./sockets');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.paths = {
            auth: '/api/auth',
            users: '/api/usuarios'
        }
        
        //Http server
        this.server = http.createServer(this.app);

        //Configurar sockets
        this.io = socketio(this.server);

    }
    async conectarDB() {
        await dbConnection();
    }
    middlewares(){
        //directorio estatico
        this.app.use(express.static(path.resolve(__dirname,'../public')));

        //CORS
        this.app.use(cors());

          //lectura y el parse del body
          this.app.use(express.json());
    }
    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.users, require('../routes/usuarios'));
    }

    configurarSockets(){
        new Sockets(this.io);
    }

    execute(){        
        //Conectarme a base de datos
        this.conectarDB();
        //Iniciaizar los middlewares
        this.middlewares();
        //Rutas de la aplicacion
        this.routes();
        //Inicializar los sockets
        this.configurarSockets();

        //Inicializar Server
        this.server.listen(this.port, () => {
            console.log('listening on *:'+this.port);
        });
    }

}

module.exports = Server;