const net = require('net');

let sockets = new Set();
let idCounter = 0;
let server;

function broadcastMessage(message) {
	for (let socket of sockets) {
		socket.write(message);
	}
}

function listenSocketData(data) {
	try {
		const messageObject = JSON.parse(data);

		const {id, message} = messageObject;

		const messageToSend = JSON.stringify({
			id,
			message,
			type: 'message',
		});

		broadcastMessage(messageToSend);
	} catch (err) {
		console.error('Got unexpeted message type:', err);
	}

	server.getConnections((err, connections) => {
		if (err) {
			return console.error(err);
		}

		console.log('connections:', connections);
	});
}

server = net.createServer((socket) => {
	console.log('new connection');

	const message = JSON.stringify({
		type: 'friendship',
		id: idCounter,
	});

	socket.write(message, () => {
		sockets.add(socket);

		socket.on('data', listenSocketData);
		socket.on('end', () => {
			console.log('client disconnected');

			sockets.delete(socket)
		});
	});


	idCounter++;
}).on('error', (err) => {
  console.error(err);
});

server.listen({port: 3000}, () => {
  console.log('opened server on', server.address());
});