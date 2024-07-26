const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;

// In-memory data store
let changes = [];

// Simple authentication middleware
const authMiddleware = (req, res, next) => {
    const auth = { login: 'admin', password: 'password' }; // Change this to your own credentials

    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (login && password && login === auth.login && password === auth.password) {
        return next();
    }

    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Authentication required.');
};

// Save change endpoint (protected)
app.post('/save-change', authMiddleware, (req, res) => {
    const change = req.body;
    changes.push(change);
    io.emit('change', change); // Emit the change to all connected clients
    res.status(200).send({ success: true });
});

// Get changes endpoint
app.get('/get-changes', (req, res) => {
    res.status(200).send(changes);
});

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.emit('initialize', changes); // Send initial changes to new client

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
