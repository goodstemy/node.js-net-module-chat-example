const net = require('net');
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const client = new net.Socket();

let myId;

rl.on('line', input => {
	client.write(JSON.stringify({
		id: myId,
		message: input,
	}));

	readline.moveCursor(process.stdout, 0, -2);
	readline.clearScreenDown(process.stdout); 
});

rl.on('close', function() {
    console.log('\nBYE BYE !!!');
    process.exit(0);
});

client.on('data', rawMessage => {
	try {
		const messageObject = JSON.parse(rawMessage);

		const {type, id} = messageObject;

		switch (type) {
			case 'friendship':
				myId = id;

				break;
			case 'message':
				const {message} = messageObject;

				console.log(`User #${id} said: ${message}`);

				break;
			default:
		}
	} catch (err) {
		console.error('Got unexpeted message type:', err);
	}
});


client.connect(3000, 'localhost', () => {
	console.log('Connected to chat');
});