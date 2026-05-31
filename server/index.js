import { createServer } from 'http';
import { Server } from 'socket.io';

const server = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello from the server!' }));
});

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('New connection.');
    socket.emit('message', 'Connected.');


    socket.on('message', (data) => {
        console.log('Received message:', data);
        socket.emit('message', `Server received: ${data}`);
    });

});

server.listen(4040, () => {
    console.log('> Socket.IO server running on http://localhost:4040.');
});
