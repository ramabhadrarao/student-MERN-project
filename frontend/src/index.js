// Filename: frontend/src/index.js
// Entry point for React application

import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';

// Get the root element from HTML
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the main App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);