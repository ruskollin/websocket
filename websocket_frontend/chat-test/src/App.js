import React, { useState } from 'react';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import './App.css';

const App = () => {
  const [name, setName] = useState(null);

  const handleNameSubmit = (name) => {
    setName(name);
  };

  const goBackHome = () => {
    console.log('logging out')
    setName(null);
  };

  return (
    <div>
      {!name ? <Login onNameSubmit={handleNameSubmit} /> : <ChatRoom name={name} goBackHome={goBackHome} />}
    </div>
  );
};

export default App;