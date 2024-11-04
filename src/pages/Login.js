import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Basic validation to ensure email and password are not empty
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', { email, password });
      const { token, isAdmin } = response.data;

      // Store the token in local storage or a cookie
      localStorage.setItem('token', token);

      // Clear error and navigate to the appropriate dashboard
      setError('');
      if (isAdmin) {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login to Medical Labeling App</h1>
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        
        {error && <p className="login-error">{error}</p>}
        <button onClick={handleLogin} className="login-button">Login</button>
      </div>
    </div>
  );
}

export default Login;