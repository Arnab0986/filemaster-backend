const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const fileValidator = require('../middleware/fileValidator');

// Route for file upload and processing
router.post('/upload', fileValidator, fileController.uploadAndProcessFile);

module.exports = router;
