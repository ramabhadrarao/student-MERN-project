// Filename: backend/models/Student.js
// Student model - Defines the structure of student documents in MongoDB

const mongoose = require('mongoose');

// Define student schema
const studentSchema = new mongoose.Schema({
    // Student ID - unique identifier
    studentId: {
        type: String,
        required: [true, 'Student ID is required'],
        unique: true,
        trim: true
    },
    // Student's first name
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    // Student's last name
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    // Student's email
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    // Student's age
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [1, 'Age must be at least 1'],
        max: [100, 'Age must be less than 100']
    },
    // Student's grade/class
    grade: {
        type: String,
        required: [true, 'Grade is required'],
        trim: true
    },
    // Student's course/major
    course: {
        type: String,
        required: [true, 'Course is required'],
        trim: true
    },
    // Student's phone number
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    // Student's address
    address: {
        street: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            trim: true
        },
        state: {
            type: String,
            trim: true
        },
        zipCode: {
            type: String,
            trim: true
        }
    },
    // Reference to user who created this student record
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
studentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create and export Student model
const Student = mongoose.model('Student', studentSchema);
module.exports = Student;