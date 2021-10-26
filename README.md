# Proyecto 1 - Sistemas interactivos distribuidos
 Servidor Node de Autenticación y WebSockets
 
#### Integrantes
Nicolas Barragan Mena
Juan Camilo Quintero
Santiago Mosquera
Pedro Pablo Mosquera

####Objetivos
1. Crear la lógica necesaria para agregar amigos a un party
2. Cuando un cliente se conecte debe recibir la lista de amigos y cuales se encuentran en línea
3. Crear la lógica necesaria para habilitar el chat global y chat privado entre miembros de un party
4. Crear la lógica para que un cliente pueda cancelar la búsqueda de una partida
5. Desplegar servidor a Heroku

#### Considerar los siguientes escenarios
* Si un cliente está buscando partida y se desconecta, el proceso de matchmaking debe ajustarse
* Si un cliente está en una partida y se desconecta, debería poder ingresar nuevamente al mismo room 
* Si un cliente se desconecta se debe notificar a sus amigos conectados que el usuario se desconecto
* Un mismo usuario no debería poder abrir más de una conexión websocket
* Cuando una conexión websocket es rechazada por validación de token, debe emitirse un mensaje al cliente antes de cerrar la conexión
