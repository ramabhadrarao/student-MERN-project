// Filename: frontend/src/components/Navbar.js
// Navbar component - Navigation bar with menu and logout

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  // Handle logout click
  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <div className="navbar-brand">
          <Link to="/dashboard">Student Management</Link>
        </div>

        {/* Navigation links */}
        <div className="navbar-menu">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link to="/students" className="nav-link">
            Students
          </Link>
          <Link to="/students/new" className="nav-link">
            Add Student
          </Link>
        </div>

        {/* User info and logout */}
        <div className="navbar-user">
          <span className="user-name">Welcome, {user?.username}</span>
          <button onClick={handleLogout} className="btn btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;