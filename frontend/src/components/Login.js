// Filename: frontend/src/components/Login.js
// Login component - Handles user authentication

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  // State for form mode (login or register)
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  // State for form data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  // State for error and loading
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user types
    setError('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Determine endpoint based on mode
      const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
      
      // Prepare data (login doesn't need username)
      const data = isLoginMode 
        ? { email: formData.email, password: formData.password }
        : formData;

      // Make API request
      const response = await axios.post(endpoint, data);

      if (response.data.success) {
        // Call parent component's login handler
        onLogin(response.data.token, response.data.user);
        // Navigate to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      // Display error message
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Toggle between login and register mode
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    // Reset form
    setFormData({
      username: '',
      email: '',
      password: ''
    });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isLoginMode ? 'Login' : 'Register'}</h2>
        
        {/* Display error if exists */}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Username field - only show in register mode */}
          {!isLoginMode && (
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required={!isLoginMode}
                placeholder="Enter username"
                minLength="3"
              />
            </div>
          )}

          {/* Email field */}
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email"
            />
          </div>

          {/* Password field */}
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
              minLength="6"
            />
          </div>

          {/* Submit button */}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Please wait...' : (isLoginMode ? 'Login' : 'Register')}
          </button>
        </form>

        {/* Toggle mode link */}
        <div className="toggle-mode">
          <p>
            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={toggleMode} className="link-button">
              {isLoginMode ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;