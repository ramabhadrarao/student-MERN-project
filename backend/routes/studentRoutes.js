// Filename: backend/routes/studentRoutes.js
// Student routes - Handles CRUD operations for students

const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');

// All routes are protected - user must be logged in

// @route   GET /api/students
// @desc    Get all students created by the logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        // Find all students created by the current user
        const students = await Student.find({ createdBy: req.user._id })
            .sort({ createdAt: -1 }); // Sort by newest first

        res.json({
            success: true,
            count: students.length,
            students
        });
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/students/:id
// @desc    Get single student by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        // Find student by ID and ensure it was created by current user
        const student = await Student.findOne({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({
            success: true,
            student
        });
    } catch (error) {
        console.error('Get student error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/students
// @desc    Create new student
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        // Add current user as creator
        const studentData = {
            ...req.body,
            createdBy: req.user._id
        };

        // Create new student
        const student = await Student.create(studentData);

        res.status(201).json({
            success: true,
            student
        });
    } catch (error) {
        console.error('Create student error:', error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ 
                message: `A student with this ${field} already exists` 
            });
        }
        
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        // Find and update student (only if created by current user)
        const student = await Student.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user._id },
            req.body,
            { new: true, runValidators: true } // Return updated document and run validators
        );

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({
            success: true,
            student
        });
    } catch (error) {
        console.error('Update student error:', error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ 
                message: `A student with this ${field} already exists` 
            });
        }
        
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/students/:id
// @desc    Delete student
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        // Find and delete student (only if created by current user)
        const student = await Student.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;