const fileProcessor = require('../services/fileProcessor');
const fs = require('fs');
const path = require('path');
const { UPLOAD_DIR, PROCESSED_DIR } = require('../utils/constants');

const uploadAndProcessFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const originalFilePath = req.file.path;
    const options = req.body; // Options like format, quality, width, height etc. will be in req.body

    console.log('Received file:', originalFilePath);
    console.log('Processing options:', options);

    const processedFilePath = await fileProcessor.processFile(originalFilePath, options);

    // Clean up the original uploaded file after processing
    fs.unlink(originalFilePath, (err) => {
      if (err) console.error('Error deleting original file:', err);
    });

    const processedFileName = path.basename(processedFilePath);
    const downloadUrl = `/processed/${processedFileName}`;

    res.status(200).json({
      success: true,
      message: 'File processed successfully!',
      downloadUrl: downloadUrl,
      fileName: processedFileName,
      fileSize: fs.statSync(processedFilePath).size, // Get size of processed file
    });
  } catch (error) {
    console.error('Error in uploadAndProcessFile:', error);
    next(error); // Pass error to error handling middleware
  }
};

module.exports = {
  uploadAndProcessFile,
};
