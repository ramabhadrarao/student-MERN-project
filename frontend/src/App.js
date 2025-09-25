// Filename: frontend/src/App.js
// Main App component - Handles routing and authentication state

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Import components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import Navbar from './components/Navbar';

function App() {
  // State for authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Function to check authentication status
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      // Set axios default header with token
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      // Get user data
      getUserData();
    }
    setLoading(false);
  };

  // Function to get user data
  const getUserData = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error getting user data:', error);
      // If error, logout user
      handleLogout();
    }
  };

  // Function to handle login
  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsAuthenticated(true);
    setUser(userData);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
  };

  // Show loading message while checking auth
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        {/* Show navbar only when authenticated */}
        {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
        
        <Routes>
          {/* Login Route */}
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to="/dashboard" />
              )
            } 
          />

          {/* Protected Routes - Redirect to login if not authenticated */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? (
                <Dashboard user={user} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />

          <Route 
            path="/students" 
            element={
              isAuthenticated ? (
                <StudentList />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />

          <Route 
            path="/students/new" 
            element={
              isAuthenticated ? (
                <StudentForm />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />

          <Route 
            path="/students/edit/:id" 
            element={
              isAuthenticated ? (
                <StudentForm />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />

          {/* Default Route */}
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;