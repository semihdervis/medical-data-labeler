import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      setMessage('If an account with that email exists, a password reset link has been sent.');
      setError('');
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('Failed to process your request. Please try again later.');
      setMessage('');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleForgotPassword();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h1 className="mb-5 text-2xl font-bold text-blue-700">
          Forgot Your Password?
        </h1>
        <p className="mb-4 text-sm text-gray-600">
          Enter your email address and we will send you a link to reset your password.
        </p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-2 mb-4 text-base border rounded border-gray-300"
        />
        {message && <p className="text-green-600 text-sm mb-3">{message}</p>}
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <button
          onClick={handleForgotPassword}
          className="w-full max-w-xs px-4 py-3 text-white bg-blue-600 rounded hover:bg-blue-500 transition"
        >
          Send Reset Link
        </button>
        <button
          onClick={() => navigate("/")}
          className="w-full max-w-xs mt-4 text-sm text-blue-700 underline hover:text-blue-500"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
