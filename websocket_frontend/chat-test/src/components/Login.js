import React, { useState } from 'react';
import '../App.css';


const Login = ({ onNameSubmit }) => {
    const [name, setName] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onNameSubmit(name);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    return (
        <div>
            <h5>Your Name?</h5>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Name"
                        required
                    />
                </div>
                <div>
                    <button type="submit" className="buttonStyle">Enter Page</button>
                </div>
            </form>
        </div>
    );
};

export default Login;