// Filename: frontend/src/components/StudentList.js
// StudentList component - Displays all students with CRUD operations

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function StudentList() {
  // State for students list
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students when search term changes
  useEffect(() => {
    const filtered = students.filter(student => 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  // Function to fetch all students
  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students');
      setStudents(response.data.students);
      setFilteredStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a student
  const handleDelete = async (id, studentName) => {
    // Confirm deletion
    if (window.confirm(`Are you sure you want to delete ${studentName}?`)) {
      try {
        await axios.delete(`/api/students/${id}`);
        // Remove student from state
        setStudents(students.filter(student => student._id !== id));
        alert('Student deleted successfully');
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading students...</div>;
  }

  return (
    <div className="student-list-container">
      <div className="list-header">
        <h2>All Students ({filteredStudents.length})</h2>
        <Link to="/students/new" className="btn btn-primary">
          Add New Student
        </Link>
      </div>

      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, ID, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Students table */}
      {filteredStudents.length > 0 ? (
        <div className="table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Grade</th>
                <th>Course</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student._id}>
                  <td>{student.studentId}</td>
                  <td>{student.firstName} {student.lastName}</td>
                  <td>{student.email}</td>
                  <td>{student.age}</td>
                  <td>{student.grade}</td>
                  <td>{student.course}</td>
                  <td>{student.phone}</td>
                  <td>
                    <div className="action-buttons">
                      <Link 
                        to={`/students/edit/${student._id}`} 
                        className="btn-small btn-edit"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(student._id, `${student.firstName} ${student.lastName}`)}
                        className="btn-small btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data">
          {searchTerm ? (
            <p>No students found matching "{searchTerm}"</p>
          ) : (
            <>
              <p>No students found.</p>
              <Link to="/students/new" className="btn btn-primary">
                Add Your First Student
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default StudentList;