const { Server } = require('socket.io');

const client_list = [];

const io = new Server();
const client = io.of('/notifications');

client.on('connection', (socket) => {
	if (!client_list.find((client) => client.id == socket.id)) {
		client_list.push(socket);
	}
	socket.join(socket.handshake.query.code);

	socket.on('disconnect', () => {
		client_list.splice(
			client_list.findIndex((client) => client.id == socket.id),
			1
		);
	});
});

const socketEmits = {
	new_file_alert: (roomId, data) => {
		// io.to(roomId).emit('new_file_alert', data);
		const roomClients = client_list.filter((client) => {
			if (Array.from(client.rooms).find((id) => id === roomId)) return client;
		});
		roomClients.forEach((socket) => {
			io.to(socket.id).emit('new_file_alert', data);
		});
	},
};

exports.socketEmits = socketEmits;
exports.io = io;
