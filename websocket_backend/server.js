const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Set();
const messages = [];

wss.on('connection', (ws) => {
    clients.add(ws);

    ws.on('message', (message) => {
        // Convert the received buffer to a string
        const receivedMessage = message.toString();
        console.log(receivedMessage)
        // Broadcast the message to all connected clients
        messages.push(receivedMessage);
        clients.forEach((client) => {
            if (client !== ws) {
                client.send(receivedMessage);
            }
        });
    });

    ws.on('close', () => {
        clients.delete(ws);
    });
});
console.log('WebSocket server started on port 8080');