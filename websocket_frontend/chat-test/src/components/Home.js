import React from 'react';
import '../App.css';


const Home = ({ goToChat, name, goBackHome, unreadMessages }) => {
    return (
        <div>
            <div className='header'>
                <div style={{ marginBottom: 100 }}>Welcome, <strong>{name}</strong>!</div>
                <button className="buttonStyle3" onClick={goBackHome}> LOGOUT </button>
            </div>
            <h5>What to do:</h5>
            <div>
                <button className="buttonStyle2" onClick={goToChat}> Enter Chat Room <div className="notification-badge">{unreadMessages}</div> </button>
                {/* <button className="buttonStyle2" onClick={goToChat}> Enter Chat Room </button> */}
            </div>
        </div>
    );
};

export default Home;