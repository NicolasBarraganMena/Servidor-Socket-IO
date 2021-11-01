const { comprobarJWT } = require('../helpers/generar-jwt');

const matchmaking = require('./matchmaking');
const Usuario = require('../models/usuario');
const { usuarioConectado } = require('../controllers/sockets');
const { json } = require('express');

class Sockets
{
    // Start
    constructor(io)
    {
        this.io = io;
        this.onlineUsers = [];
        this.rooms = [];
        this.socketsEvents();
        this.socketMiddlewares();
        this.lookForMatchReady();
    }

    // Server Events
    socketsEvents()
    {
        io.on('connection', async socket =>
        {
            console.log('a user connected ' + socket.uid);

            let {password, _id:uid , ...user} = await Usuario.findById(socket.uid);
            user = {id:socket.id,uid, ...user };

            this.onlineUsers.push(user);
            usuarioConectado(user.uid);

            //Saber que amigos estan enlinea y enviarlos al cliente
            const onlineFriends = user.friends.filter(f => f.online);
            //Emitir mensaje de bienvenida    
            socket.emit('onConnection', { username: user.username});
            
            //Notificar conexion a los amigos
            for (const friend of user.friends)
            {
                let connected = this.onlineUsers.find(u => u.username == friend.username);

                if(connected)
                {
                    this.io.sockets.connected[connected.id].emit('user-connected',{username:user.username});
                    console.log(connected.id);
                }
            }

            //Evento Find Match
            socket.on('findMatch',() =>
            {
                let user = this.onlineUsers.find(u => u.id == socket.id);
                console.log(`${user.username} esta buscando partida`);
                matchmaking.addPlayer(user);
            });

            //Evento Chat Global
            socket.on('chat', msg =>
            {
                let user = this.onlineUsers.find(u => u.id == socket.id);
                
                console.log(`${user.username} esta enviando un mensaje: ` + msg.message);

                this.io.emit('chat',
                {
                    username: user.username,
                    message: msg.message
                });
            });
            
            //Evento Chat Privado
            socket.on('privateChat', msg =>
            {
                let user = this.onlineUsers.find(u => u.id == socket.id);
                let targetUser = this.onlineUsers.find(u => u.username == msg.target);
                
                if (targetUser)
                {
                    console.log(`${targetUser.username} esta enviando un mensaje privado a ${targetUser}: ${msg.message}`);
                    
                    this.io.emit('privateChat',
                    {
                        username: user.username,
                        message: msg.message,
                        target: msg.target
                    });
                }
            });

            //Evento para solicitud de amistad
            socket.on('requestFriendship', username =>
            {
                let connected = this.onlineUsers.find(u => u.username == username);
                if(connected)
                {
                    //Emit friendRequest
                    console.log(connected.id);        
                }
            });

            //Evento cuando se desconecta un cliente
            socket.on('disconnect', () =>
            {
                this.onlineUsers = this.onlineUsers.filter(u => u.id != socket.id);
                /*
                AQUI DEBERIA VERIFICAR SI EL USUARIO DESCONECTADO
                ESTA BUSCANDO PARTIDA 
                */
                console.log('user disconnected');
                usuarioConectado(user.uid,false);         
            });
        });
    }
    
    socketMiddlewares()
    {
        //Validar token
        this.io.use((socket, next) =>
        {
            let {token} = socket.handshake.query;
            let uid = comprobarJWT(token);
            if(uid)
            {
                socket.uid = uid;
                return next();
            }

            //Emitir desconexion por falta de autorizacion
            console.log("reject token");
            return next(new Error("authentication error"));
        });
    }

    lookForMatchReady()
    {
        setInterval(()=>
        {
            if(matchmaking.startingMatches.length>0)
            {
                let matchReady = matchmaking.startingMatches.shift();
                console.log("Starting Match: "+matchReady.id);
                this.startMatchReady(matchReady);
            }
        }, 1000);
    }
    
    startMatchReady(match)
    {
        let room = match.id;
        for (const player of match.players)
        {
             player.room = room;
             console.log(player.id);
             this.io.sockets.connected[player.id].join(room);        
        }

        this.io.to(room).emit('matchReady',
        {
            msg:"Match Ready",
            match: match.id
        });
     }
}

module.exports = Sockets;