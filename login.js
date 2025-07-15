import React, { useState } from 'react';
import axios from 'axios';

function Login({ setUserId, switchToRegister }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const response = await axios.post('http://localhost:5050/login', { username });
        if (response.data.success && response.data.userId){
            alert('Login successful');
            localStorage.setItem('userId',response.data.userId);
            setUserId(response.data.userId);
        } else {
            setError(response.data.message || 'Login failed');
        }
    } catch(err){
        setError('Login failed. Please try again.');
    }
};
return (
<div>
    <h2>Login</h2>
    <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <button type="submit">Login</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p> Don't have an account?{' '}
            <button onClick={switchToRegister}>Register</button>
            </p>
            </div>
            );
        }
export default Login;
