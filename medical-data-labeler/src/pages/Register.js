import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import axios from 'axios';
import './Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Check if fields are filled
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:3001/api/auth/register', { email, password });
      alert('Registration successful! Please log in.');
      navigate('/'); // Go back to login page after successful registration
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Register</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="register-input"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="register-input"
        />

        {error && <p className="register-error">{error}</p>}
        <button onClick={handleRegister} className="register-button" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </div>
    </div>
  );
}

export default Register;
