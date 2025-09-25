// Filename: backend/models/User.js
// User model - Defines the structure of user documents in MongoDB

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define user schema
const userSchema = new mongoose.Schema({
    // Username field - required and unique
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    // Email field - required and unique
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    // Password field - required
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // Don't include password in query results by default
    },
    // User role - default is 'user'
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    // Timestamp for when user was created
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving user document
userSchema.pre('save', async function(next) {
    // Only hash password if it has been modified
    if (!this.isModified('password')) {
        next();
    }
    
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export User model
const User = mongoose.model('User', userSchema);
module.exports = User;