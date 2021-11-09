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
        this.io.on('connection', async socket =>
        {
            console.log('A user connected ' + socket.uid);

            let {password, _id:uid, ...user} = await Usuario.findById(socket.uid);
            user = {id:socket.id, uid, ...user};

            this.onlineUsers.push(user);
            usuarioConectado(user.uid);
            
            //Emitir mensaje de bienvenida
            socket.emit('onConnection', {username: user.username});
            
            //Saber que amigos estan enlinea y enviarlos al cliente
            //const onlineFriends = user.friends.filter(f => f.online);

            //Notificar conexion a los amigos
            // for (const friend of user.friends)
            // {
            //     let connected = this.onlineUsers.find(u => u.username == friend.username);

            //     if (connected)
            //     {
            //         this.io.sockets.connected[connected.id].emit('user-connected', {username:user.username});
            //         console.log(connected.id);
            //     }
            // }

            // Rooms
            socket.join(socket.uid);

            socket.on('roomInvite', invite =>
            {
                let roomID = "party_" + user.username; // test

                console.log(invite.sender + " ha invitado a " + invite.target + " a unirse a su party (" + roomID + ")")

                this.io.emit('partyInvite',
                {
                    sender: invite.sender,
                    target: invite.target,
                    roomID: roomID
                });
            });

            socket.on('requestJoin', invite =>
            {
                console.log(invite.sender + " solicita a " + invite.target + " a unirse a su party (" + invite.roomID + ")")

                this.io.emit('requestJoin',
                {
                    sender: invite.sender,
                    target: invite.target,
                    roomID: invite.roomID
                });
            });

            socket.on('joinRoom', invite =>
            {
                console.log(invite.target + " se está intentando unir a la party de " + invite.sender + " (" + invite.roomID + ")")

                //if (user.username == invite.target)
                //{
                //    socket.join(invite.roomID);
                //    
                    this.io.emit('joinedParty',
                    {
                        sender: invite.sender,
                        target: invite.target,
                        roomID: invite.roomID
                    });
                //}
            });

            //Evento Find Match
            socket.on('findMatch', () =>
            {
                console.log(`${user.username} esta buscando partida`);

                matchmaking.addPlayer(user);
            });

            //Evento Chat Global
            socket.on('chat', msg =>
            {
                console.log(`${user.username} esta enviando un mensaje: ${msg.message}`);

                this.io.emit('chat',
                {
                    username: user.username,
                    message: msg.message
                });
            });
            
            //Evento Party Chat
            socket.on('partyChat', msg =>
            {
                console.log(`${user.username} esta enviando un mensaje por la party: ${msg.message}`);
                      
                this.io.emit('partyChat',
                {
                    username: user.username,
                    message: msg.message,
                    room: msg.room
                });
            });

            //Evento para actualizar usuarios conectados
            socket.on('updateUsers', () =>
            {
                console.log(`En la sala hay ${this.onlineUsers.length} usuario conectados`);
                this.io.emit('updateUsers',
                {
                   users: this.onlineUsers,
                });         
            });

            // //Evento para solicitud de amistad
            // socket.on('requestFriendship', username =>
            // {
            //     let connected = this.onlineUsers.find(u => u.username == username);
            //     if(connected)
            //     {
            //         //Emit friendRequest
            //         console.log(connected.id);        
            //     }
            // });

            //Evento cuando se desconecta un cliente
            socket.on('disconnect', () =>
            {
                this.onlineUsers = this.onlineUsers.filter(u => u.id != socket.id);

                /*
                AQUI DEBERIA VERIFICAR SI EL USUARIO DESCONECTADO
                ESTA BUSCANDO PARTIDA 
                */
                
                //Evento actualización lista usuarios conectados
                console.log(`En la sala hay ${this.onlineUsers.length} usuario conectados`);
                this.io.emit('updateUsers',
                {
                   users: this.onlineUsers,
                });

                console.log('user disconnected');
                usuarioConectado(user.uid, false);         
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
        setInterval(() =>
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