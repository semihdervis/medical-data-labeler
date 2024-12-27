import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Register () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await axios.post('http://localhost:3001/api/auth/register', {
        email,
        password
      })
      alert('Registration successful! Please log in.')
      navigate('/') // Go back to login page after successful registration
    } catch (error) {
      setError('Registration failed. Please try again.')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      handleRegister()
    }
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-blue-100'>
      <div className='bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center'>
        <h1 className='mb-5 text-2xl font-bold text-blue-700'>Register</h1>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          className='w-full p-2 mb-4 text-base border rounded border-gray-300'
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          className='w-full p-2 mb-4 text-base border rounded border-gray-300'
        />
        <input
          type='password'
          placeholder='Confirm Password'
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          className='w-full p-2 mb-4 text-base border rounded border-gray-300'
        />
        {error && <p className='text-red-600 text-sm mb-3'>{error}</p>}
        <button
          onClick={handleRegister}
          className={`w-full max-w-xs px-4 py-3 text-white bg-blue-600 rounded ${
            loading
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-500 transition'
          }`}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        <button
          onClick={() => navigate('/')}
          className='w-full max-w-xs mt-4 text-sm text-blue-700 underline hover:text-blue-500'
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  )
}

export default Register
