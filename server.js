const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const fileRoutes = require('./routes/fileRoutes');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// Create 'uploads' and 'processed' directories if they don't exist
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const PROCESSED_DIR = path.join(__dirname, 'processed');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

if (!fs.existsSync(PROCESSED_DIR)) {
  fs.mkdirSync(PROCESSED_DIR);
}

// Middleware
app.use(cors()); // Enable CORS for all routes (can be more restrictive in production)
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(rateLimiter); // Apply rate limiting

// Serve static files from the 'processed' directory (for downloads)
app.use('/processed', express.static(PROCESSED_DIR));

// API Routes
app.use('/api/files', fileRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Filemater Pro Backend API is running!');
});

// Error handling middleware (should be last middleware)
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
