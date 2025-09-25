// Filename: frontend/src/components/Dashboard.js
// Dashboard component - Main dashboard view after login

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard({ user }) {
  // State for dashboard statistics
  const [stats, setStats] = useState({
    totalStudents: 0,
    recentStudents: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/students');
      const students = response.data.students;
      
      setStats({
        totalStudents: students.length,
        recentStudents: students.slice(0, 5) // Get last 5 students
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Welcome to Student Management System</h1>
      
      {/* User info section */}
      <div className="user-info">
        <h2>Hello, {user?.username}!</h2>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
      </div>

      {/* Statistics cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Students</h3>
          <p className="stat-number">{stats.totalStudents}</p>
        </div>
        
        <div className="stat-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <Link to="/students/new" className="btn btn-primary">
              Add New Student
            </Link>
            <Link to="/students" className="btn btn-secondary">
              View All Students
            </Link>
          </div>
        </div>
      </div>

      {/* Recent students section */}
      <div className="recent-students">
        <h3>Recently Added Students</h3>
        {stats.recentStudents.length > 0 ? (
          <table className="students-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentStudents.map(student => (
                <tr key={student._id}>
                  <td>{student.studentId}</td>
                  <td>{student.firstName} {student.lastName}</td>
                  <td>{student.email}</td>
                  <td>{student.grade}</td>
                  <td>
                    <Link to={`/students/edit/${student._id}`} className="btn-small">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No students found. <Link to="/students/new">Add your first student</Link></p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;