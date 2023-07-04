import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import Home from './components/Home';
import './App.css';

const App = () => {
  const [name, setName] = useState(null);
  const [pageView, setPageView] = useState('login')
  const [unreadMessages, setUnreadMessages] = useState(0);

  const [messages, setMessages] = useState([]);
  const [webSocket, setWebSocket] = useState(null);
  const [clientCount, setClientCount] = useState(0);
  const [newMessagesCount, setNewMessagesCount] = useState(0);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    console.log(ws)
    setWebSocket(ws);

    ws.onopen = () => {
      console.log('WebSocket connection established.');

      const authenticationMessage = {
        type: 'authentication',
        isAuthenticated: true, // Set to true if the user is logged in
        // Additional user information can be included here
      };

      // Send the authentication message to the backend
      ws.send(JSON.stringify(authenticationMessage));
    };

    ws.onmessage = (event) => {
      const finalMessage = JSON.parse(event.data);
      console.log('MESSAGE: ', finalMessage);

      // if (finalMessage.type === 'authenticationStatus') {
      //     // Handle the authentication status message
      //     if (finalMessage.isAuthenticated) {
      //         // User is logged in
      //         console.log('User is logged in');
      //         // Update the UI or perform necessary actions
      //     } else {
      //         // User is not logged in
      //         console.log('User is not logged in');
      //         // Update the UI or perform necessary actions
      //     }
      // } else
      if (finalMessage.type === 'clientCount') {
        console.log(finalMessage)
        const count = finalMessage.count;
        setClientCount(count);
      } else if (finalMessage.type === 'chatMessage') {
        const newMessage = JSON.parse(finalMessage.message);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        // if (finalMessage.sender !== name) {
        //     console.log('Counting unread..', unreadMessages + 1)
        //     setUnreadMessages((unreadMessages) => unreadMessages + 1);
        // }
      } else if (finalMessage.type === 'newMessagesCount') {
        const newMessage = JSON.parse(finalMessage.message);
        setUnreadMessages(newMessage)
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleNameSubmit = (name) => {
    setName(name);
    setPageView('home');
  };

  const goBackHome = () => {
    console.log('logging out')
    setName(null);
    setPageView('login')
  };

  const goToChat = () => {
    const message = {
      type: 'noMessages'
    };
    webSocket.send(JSON.stringify(message));
    setPageView('chat')
  };

  const goHomepage = () => {
    setPageView('home')
  };

  const handleSendMessage = (inputValue) => {
    const message = {
      content: inputValue,
      sender: name
    };

    webSocket.send(JSON.stringify(message));
  };

  return (
    <div>
      {pageView === 'login' && <Login onNameSubmit={handleNameSubmit} />}
      {pageView === 'home' && <Home goToChat={goToChat} name={name} goBackHome={goBackHome} unreadMessages={unreadMessages} />}
      {pageView === 'chat' && <ChatRoom name={name} goHomepage={goHomepage} unreadMessages={unreadMessages} setUnreadMessages={setUnreadMessages} clientCount={clientCount} messages={messages} handleSendMessage={handleSendMessage} />}
    </div>
  );
};

export default App;