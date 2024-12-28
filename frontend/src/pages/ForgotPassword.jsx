import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSendCode = async () => {
    try {
      //await axios.post('/api/auth/forgot-password', { email });
      setError('');
      setStep(2);
    } catch (error) {
      setError('Error sending the reset code. Please try again.');
    }
  };

  const handleVerifyCode = async () => {
    try {
      //await axios.post('/api/auth/verify-code', { email, code });
      setError('');
      setStep(3);
    } catch (error) {
      setError('Invalid code. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      //await axios.post('/api/auth/reset-password', { email, code, newPassword });
      setError('');
      setSuccessMessage('Password updated successfully! Redirecting to login...');
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      setError('Error resetting password. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
        {step === 1 && (
          <>
            <h1 className="mb-5 text-2xl font-bold text-blue-700">Forgot Password</h1>
            <p className="mb-5 text-sm text-gray-600">Enter your email address below, and we will send you a reset code to regain access to your account.</p>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 text-base border rounded border-gray-300"
            />
            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
            <button
              onClick={handleSendCode}
              className="w-full max-w-xs px-4 py-3 text-white bg-blue-600 rounded hover:bg-blue-500 transition"
            >
              Send Reset Code
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="mb-5 text-2xl font-bold text-blue-700">Enter Verification Code</h1>
            <p className="mb-5 text-sm text-gray-600">Check your email for the verification code. Enter it below to proceed.</p>
            <input
              type="text"
              placeholder="Enter the code sent to your email"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2 mb-4 text-base border rounded border-gray-300"
            />
            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
            <button
              onClick={handleVerifyCode}
              className="w-full max-w-xs px-4 py-3 text-white bg-blue-600 rounded hover:bg-blue-500 transition"
            >
              Verify Code
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="mb-5 text-2xl font-bold text-blue-700">Reset Password</h1>
            <p className="mb-5 text-sm text-gray-600">Enter your new password below and confirm it to complete the process.</p>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 mb-4 text-base border rounded border-gray-300"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 mb-4 text-base border rounded border-gray-300"
            />
            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
            {successMessage && <p className="text-green-600 text-sm mb-3">{successMessage}</p>}
            <button
              onClick={handleResetPassword}
              className="w-full max-w-xs px-4 py-3 text-white bg-blue-600 rounded hover:bg-blue-500 transition"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;