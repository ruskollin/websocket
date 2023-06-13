const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Set();
const messages = [];

wss.on('connection', (ws) => {
    clients.add(ws);

    ws.on('message', (message) => {
        //Counting clients
        clients.add(ws);
        sendClientCount();

        // Convert the received buffer to a string
        const receivedMessage = message.toString();
        console.log(receivedMessage)

        // Broadcast the message to all connected clients
        // messages.push(receivedMessage);
        // clients.forEach((client) => {
        //     if (client !== ws) {
        //         client.send(JSON.stringify(receivedMessage));
        //     }
        // });

        const messageObject = JSON.parse(receivedMessage)

        if (messageObject.hasOwnProperty('type')) {
            // 'type' property exists
            console.log(messageObject)
            if (messageObject.type === 'logout') {
                //update user count
                sendClientCount();
            } else {
                //user authentication
                console.log('User authenticated.');
            }


        }

        if (messageObject.hasOwnProperty('content')) {
            // Broadcast the message to all connected clients, including the sender
            messages.push(receivedMessage);
            const chatMessage = {
                type: 'chatMessage',
                message: receivedMessage
            };
            clients.forEach((client) => {
                client.send(JSON.stringify(chatMessage));
            });
        }
    });

    ws.on('close', () => {
        clients.delete(ws);
        sendClientCount();
    });
});

function sendClientCount() {
    const connectedClients = clients.size;
    console.log('Updating user count: ', connectedClients)
    // Create an object with the client count
    const response = {
        type: 'clientCount',
        count: connectedClients
    };

    // Convert the object to JSON string
    const responseJson = JSON.stringify(response);

    // Broadcast the client count to all connected clients
    clients.forEach((client) => {
        client.send(responseJson);
    });
}

console.log('WebSocket server started on port 8080');