import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, isAdmin, projects} = response.data;
      
      

      // Store the token and role in local storage
      localStorage.setItem('token', token);
      localStorage.setItem('role', isAdmin ? 'admin' : 'doctor');
      localStorage.setItem('projects', JSON.stringify(projects));

      // Clear error and navigate to the appropriate dashboard
      setError('');
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/doctor');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h1 className="mb-5 text-2xl font-bold text-blue-700">
          Login to Medical Labeling App
        </h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-2 mb-4 text-base border rounded border-gray-300"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-2 mb-4 text-base border rounded border-gray-300"
        />
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full max-w-xs px-4 py-3 text-white bg-blue-600 rounded hover:bg-blue-500 transition"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="w-full max-w-xs mt-4 text-sm text-blue-700 underline hover:text-blue-500"
        >
          Don't have an account? Register
        </button>
      </div>
    </div>
  );
}

export default Login;
