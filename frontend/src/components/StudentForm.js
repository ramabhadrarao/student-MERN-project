// Filename: frontend/src/components/StudentForm.js
// StudentForm component - Form for adding and editing students

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function StudentForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get student ID from URL if editing
  const isEditMode = !!id; // Check if we're in edit mode

  // State for form data
  const [formData, setFormData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    grade: '',
    course: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  // State for error and loading
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchingStudent, setFetchingStudent] = useState(false);

  // Fetch student data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchStudentData();
    }
  }, [id]);

  // Function to fetch student data for editing
  const fetchStudentData = async () => {
    setFetchingStudent(true);
    try {
      const response = await axios.get(`/api/students/${id}`);
      setFormData(response.data.student);
    } catch (error) {
      console.error('Error fetching student:', error);
      alert('Failed to fetch student data');
      navigate('/students');
    } finally {
      setFetchingStudent(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Check if it's an address field
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error for this field
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.studentId) newErrors.studentId = 'Student ID is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.age) newErrors.age = 'Age is required';
    if (!formData.grade) newErrors.grade = 'Grade is required';
    if (!formData.course) newErrors.course = 'Course is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Age validation
    if (formData.age && (formData.age < 1 || formData.age > 100)) {
      newErrors.age = 'Age must be between 1 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        // Update existing student
        await axios.put(`/api/students/${id}`, formData);
        alert('Student updated successfully!');
      } else {
        // Create new student
        await axios.post('/api/students', formData);
        alert('Student added successfully!');
      }
      
      // Navigate back to students list
      navigate('/students');
    } catch (error) {
      console.error('Error saving student:', error);
      
      // Handle specific error messages
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to save student. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/students');
  };

  if (fetchingStudent) {
    return <div className="loading">Loading student data...</div>;
  }

  return (
    <div className="form-container">
      <h2>{isEditMode ? 'Edit Student' : 'Add New Student'}</h2>

      <form onSubmit={handleSubmit} className="student-form">
        {/* Basic Information Section */}
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="studentId">Student ID *</label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className={errors.studentId ? 'error' : ''}
                placeholder="e.g., STD001"
              />
              {errors.studentId && <span className="error-text">{errors.studentId}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="student@example.com"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
                placeholder="John"
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error' : ''}
                placeholder="Doe"
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age *</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={errors.age ? 'error' : ''}
                placeholder="18"
                min="1"
                max="100"
              />
              {errors.age && <span className="error-text">{errors.age}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'error' : ''}
                placeholder="+1234567890"
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
          </div>
        </div>

        {/* Academic Information Section */}
        <div className="form-section">
          <h3>Academic Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="grade">Grade *</label>
              <input
                type="text"
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className={errors.grade ? 'error' : ''}
                placeholder="e.g., 10th Grade, Year 3"
              />
              {errors.grade && <span className="error-text">{errors.grade}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="course">Course/Major *</label>
              <input
                type="text"
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                className={errors.course ? 'error' : ''}
                placeholder="e.g., Computer Science"
              />
              {errors.course && <span className="error-text">{errors.course}</span>}
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="form-section">
          <h3>Address (Optional)</h3>
          
          <div className="form-group">
            <label htmlFor="address.street">Street</label>
            <input
              type="text"
              id="address.street"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              placeholder="123 Main St"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="address.city">City</label>
              <input
                type="text"
                id="address.city"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="New York"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address.state">State</label>
              <input
                type="text"
                id="address.state"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                placeholder="NY"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address.zipCode">Zip Code</label>
              <input
                type="text"
                id="address.zipCode"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
                placeholder="10001"
              />
            </div>
          </div>
        </div>

        {/* Form buttons */}
        <div className="form-buttons">
          <button 
            type="button" 
            onClick={handleCancel} 
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditMode ? 'Update Student' : 'Add Student')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default StudentForm;