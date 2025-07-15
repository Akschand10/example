import React, { useState } from 'react';
import axios from 'axios';

function Register({switchToLogin}){
    const [username,setUsername] = useState('');
    const [message,setMessage] = useState('');
    const handleRegister = async(e) => {
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:5050/register", { username,});
            if (response.data.success){
                setMessage("Registration successful");
                setUsername("");
            } else{
                setMessage(response.data.message || "Registration failed,Please try again");
            }
        } catch(err){
            console.error("Error in registration:",err); 
            if(err.response && err.response.data && err.response.data.message) {
                setMessage(err.response.data.message);
            } else{
                setMessage("Registration failed. Please try again");
            }}};
            return (
            <div>
                <h2>Register</h2>
                <form onSubmit={handleRegister}>
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <button type="submit">Register</button>
                    </form>
                    {message && <p>{message}</p>}
                    <button onClick={switchToLogin}>Login</button>
                    </div>
                    );
                }
export default Register;
