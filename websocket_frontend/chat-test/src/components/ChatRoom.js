import React, { useState, useEffect } from 'react';

const ChatRoom = ({ name, goHomepage, unreadMessages, setUnreadMessages, clientCount, messages, handleSendMessage }) => {
    // const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    // const [webSocket, setWebSocket] = useState(null);
    // const [clientCount, setClientCount] = useState(0);
    // const [newMessagesCount, setNewMessagesCount] = useState(0);

    // useEffect(() => {
    //     const ws = new WebSocket('ws://localhost:8080');
    //     console.log(ws)
    //     setWebSocket(ws);

    //     ws.onopen = () => {
    //         console.log('WebSocket connection established.');

    //         const authenticationMessage = {
    //             type: 'authentication',
    //             isAuthenticated: true, // Set to true if the user is logged in
    //             // Additional user information can be included here
    //         };

    //         // Send the authentication message to the backend
    //         ws.send(JSON.stringify(authenticationMessage));
    //     };

    //     ws.onmessage = (event) => {
    //         const finalMessage = JSON.parse(event.data);
    //         console.log('MESSAGE: ', finalMessage);

    //         // if (finalMessage.type === 'authenticationStatus') {
    //         //     // Handle the authentication status message
    //         //     if (finalMessage.isAuthenticated) {
    //         //         // User is logged in
    //         //         console.log('User is logged in');
    //         //         // Update the UI or perform necessary actions
    //         //     } else {
    //         //         // User is not logged in
    //         //         console.log('User is not logged in');
    //         //         // Update the UI or perform necessary actions
    //         //     }
    //         // } else
    //         if (finalMessage.type === 'clientCount') {
    //             console.log(finalMessage)
    //             const count = finalMessage.count;
    //             setClientCount(count);
    //         } else if (finalMessage.type === 'chatMessage') {
    //             const newMessage = JSON.parse(finalMessage.message);
    //             setMessages((prevMessages) => [...prevMessages, newMessage]);
    //             // if (finalMessage.sender !== name) {
    //             //     console.log('Counting unread..', unreadMessages + 1)
    //             //     setUnreadMessages((unreadMessages) => unreadMessages + 1);
    //             // }
    //         } else if (finalMessage.type === 'newMessagesCount') {
    //             const newMessage = JSON.parse(finalMessage.message);
    //             setUnreadMessages(newMessage)
    //         }
    //     };

    //     return () => {
    //         ws.close();
    //     };
    // }, []);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSend = () => {
        handleSendMessage(inputValue)
        setInputValue('');
    };

    return (
        <div className="chat-container">
            <div className="header">
                <div>
                    <div style={{ marginBottom: 10 }}>Name: {name}</div>
                    <div style={{ marginBottom: 10 }}> Users online: {clientCount}</div>
                </div>
                <div>
                    <button className="buttonStyle2" onClick={goHomepage}> BACK </button>
                </div>
            </div>
            <div className="message-container">
                {messages.map((message, index) => (
                    // <div
                    //     key={index}
                    //     className={`message ${message.sender === name ? 'client-message' : 'other-message'}`}
                    // >
                    <div key={index}>
                        <div className={`${message.sender === name ? 'client-message' : 'other-message'}`}>
                            <span className="message-sender">{`${message.sender === name ? 'Me' : message.sender}`}:</span>
                            <span className="message-content">{message.content}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="send-container">
                <div><textarea value={inputValue} onChange={handleInputChange} /></div>
                <div><button className="send-button" onClick={handleSend}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14" style={{ transform: "rotate(60deg)", color: "white" }}>
                        <path d="M3 12l18-12v24l-18-12zm2.484-1.692 9.716 6.477-9.716 6.477v-12.954z" />
                    </svg>
                </button></div>
            </div>
        </div >
    );
};

export default ChatRoom;