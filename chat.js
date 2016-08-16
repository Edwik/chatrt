var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = 3000;

app.get('/',function(req,res){ //express
	//request: Son cabeceras y datos que nos enviar el navegador
	//respnse: Es todo lo que enviamos desde el servidor 
	
	//res.send('<h1>Hola Mundo!</h1>');
	res.sendFile(__dirname + '/index.html');
});

io.on('connection',function(socket){
	console.log("usuario id: %s",socket.id);

	var channel = 'universidad';

	//io.sockets.emit() == io.emit() mensaje a todos 
	//socket.broadcast.emit() mensaje a todos menos YO
	socket.broadcast.emit('message','El usuario '+socket.id+' se ha conectado!', 'System');

	socket.join(channel);

	socket.on('message',function(msj){
		//emitimos el mensaje para todos los usuario que se conecten
		//io.emit('message',msj,socket.id);
		io.sockets.in(channel).emit('message',msj,socket.id); // enviar a todos del canal
		//enviar a todos del canal menos a mi
		//socket.broadcast.to(channel).emit('message',msj,socket.id);

	});

	socket.on('disconnect',function(){
		console.log("Desconectado : %s",socket.id);
	});

	//el cambio de canal
	socket.on('change channel',function(newChannel){
		socket.leave(channel);
		socket.join(newChannel);
		channel = newChannel;
		socket.emit('change channel',newChannel);
	});
});

http.listen(PORT,function(){
	console.log('el servidor esta escuchando el puerto %s', PORT);
});
