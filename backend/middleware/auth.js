// Filename: backend/middleware/auth.js
// Authentication middleware - Verifies JWT tokens and protects routes

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes - verifies JWT token
const protect = async (req, res, next) => {
    let token;

    // Check if authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from header (Bearer TOKEN)
            token = req.headers.authorization.split(' ')[1];

            // Verify token using JWT secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user by ID from decoded token (exclude password)
            req.user = await User.findById(decoded.id).select('-password');

            // Continue to next middleware
            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If no token provided
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

// Middleware to check if user is admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as admin' });
    }
};

module.exports = { protect, admin };