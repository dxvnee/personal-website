const socketIo = require('socket.io');

const initSocket = (server) => {
    const io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('chatMessage', (message) => {
            console.log('Received message:', message);
            socket.emit('message', `Server received: ${message}`);
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });

    return io;
};

module.exports = { initSocket };

