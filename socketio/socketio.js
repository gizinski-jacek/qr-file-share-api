const { Server } = require('socket.io');

const client_list = [];

const io = new Server();
const notifications = io.of('/notifications');

notifications.on('connection', (socket) => {
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
		notifications.to(roomId).emit('new_file_alert', data);
	},
};

exports.socketEmits = socketEmits;
exports.io = io;
