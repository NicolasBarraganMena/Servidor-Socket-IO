# Proyecto 1 - Sistemas interactivos distribuidos
 Servidor Node de Autenticación y WebSockets

#### Actividades del Backend
1. Crear la lógica necesaria para agregar amigos, tanto de interacción websockets como de registro en la "base de datos"
2. Cuando un cliente se conecte debe recibir la lista de amigos y cuales se encuentran en línea
3. Crear la lógica necesaria para habilitar el chat global y chat privado entre amigos
4. Crear la lógica necesaria para permitir los retos directos entre amigos
5. Crear la lógica para que un cliente pueda cancelar la búsqueda de una partida
6. Desplegar servidor a Heroku



#### Considerar los siguientes escenarios
* Si un cliente está buscando partida y se desconecta, el proceso de matchmaking debe ajustarse
* Si un cliente está en una partida y se desconecta, debería poder ingresar nuevamente al mismo room 
* Si un cliente se desconecta se debe notificar a sus amigos conectados que el usuario se desconecto
* Un mismo usuario no debería poder abrir más de una conexión websocket
* Cuando una conexión websocket es rechazada por validación de token, debe emitirse un mensaje al cliente antes de cerrar la conexión

Pueden surgir más necesidades durante el desarrollo

