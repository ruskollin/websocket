import React, { useState, useEffect } from 'react';

const ChatRoom = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [webSocket, setWebSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080');
        setWebSocket(ws);

        ws.onopen = () => {
            console.log('WebSocket connection established.');
        };

        ws.onmessage = (event) => {
            console.log('WebSocket message event:', event);
            const receivedMessage = JSON.parse(event.data);
            console.log('Received message:', receivedMessage);
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        };

        return () => {
            ws.close();
        };
    }, []);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSendMessage = () => {
        webSocket.send(inputValue);
        setInputValue('');
    };

    return (
        <div>
            <div>
                {messages.map((message, index) => (
                    <div key={index}>{message}</div>
                ))}
            </div>
            <input type="text" value={inputValue} onChange={handleInputChange} />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default ChatRoom;