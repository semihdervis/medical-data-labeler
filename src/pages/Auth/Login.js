// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthStyles.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    navigate(email === 'admin' ? '/admin-dashboard' : '/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login to Medical Labeling App</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />
        {error && <p className="auth-error">{error}</p>}
        <button onClick={handleLogin} className="auth-button">Login</button>
        
        {/* Switch to Register button */}
        <button onClick={() => navigate('/register')} className="auth-toggle-button">
          Don't have an account? Register
        </button>
      </div>
    </div>
  );
}

export default Login;
