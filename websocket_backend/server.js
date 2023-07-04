const WebSocket = require('ws');
require('dotenv').config()
var mysql = require('mysql')

var con = mysql.createPool({
    host: 'localhost',
    user: 'ruskin',
    password: process.env.password,
    database: 'chatdb'
})

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Set();
const messages = [];

function checkMessages() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) AS COUNT FROM chat_messages WHERE IS_NEW_MESSAGE_ = 1';
        con.query(query, (error, results) => {
            if (error) {
                console.error('Error executing query:', error);
                reject(error);
                return;
            }
            resolve(results[0].COUNT);
        });
    });
}

function readMessages() {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE chat_messages SET IS_NEW_MESSAGE_ = 0 WHERE IS_NEW_MESSAGE_ = 1';
        con.query(query, (error, results) => {
            if (error) {
                console.error('Error executing query:', error);
                return;
            }
            console.log('Rows updated:', results.affectedRows);
        });
    });
}

wss.on('connection', (ws) => {
    clients.add(ws);

    ws.on('message', (message) => {
        clients.add(ws);
        sendClientCount();

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
            console.log(messageObject)
            if (messageObject.type === 'logout') {
                sendClientCount();
            } else if (messageObject.type === 'noMessages') {
                console.log('all is read')
                readMessages()
                const countMessage = {
                    type: 'newMessagesCount',
                    message: 0
                };
                const countJson = JSON.stringify(countMessage);
                ws.send(countJson);

            } else {
                console.log('User authenticated.');
            }
        }

        if (messageObject.hasOwnProperty('content')) {
            messages.push(receivedMessage);
            const chatMessage = {
                type: 'chatMessage',
                message: receivedMessage
            };
            clients.forEach((client) => {
                client.send(JSON.stringify(chatMessage));
            });
        }

        setInterval(() => {
            checkMessages()
                .then((countMessages) => {
                    const countMessage = {
                        type: 'newMessagesCount',
                        message: countMessages
                    };
                    const countJson = JSON.stringify(countMessage);

                    if (countMessages > 0) {
                        console.log('count:', countJson);
                        clients.forEach((client) => {
                            client.send(countJson);
                        });
                    }

                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }, 1000);

    });

    ws.on('close', () => {
        clients.delete(ws);
        sendClientCount();
    });
});

function sendClientCount() {
    const connectedClients = clients.size;
    console.log('Updating user count: ', connectedClients)
    const response = {
        type: 'clientCount',
        count: connectedClients
    };

    const responseJson = JSON.stringify(response);

    clients.forEach((client) => {
        client.send(responseJson);
    });
}

console.log('WebSocket server started on port 8080');
