// Filename: backend/config/db.js
// Database configuration file - Handles MongoDB connection

const mongoose = require('mongoose');

// Function to connect to MongoDB database
const connectDB = async () => {
    try {
        // Connect to MongoDB using connection string from environment variables
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Exit process with failure code
        process.exit(1);
    }
};

module.exports = connectDB;