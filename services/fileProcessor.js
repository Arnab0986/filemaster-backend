const path = require('path');
const imageService = require('./imageService');
const audioVideoService = require('./audioVideoService');
const documentService = require('./documentService');
const { getFileExtension } = require('../utils/fileUtils');

const processFile = async (filePath, options) => {
  const ext = getFileExtension(filePath);

  // Determine file type based on extension
  if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext)) {
    return imageService.processImage(filePath, options);
  } else if (['.mp3', '.wav', '.ogg', '.mp4', '.avi', '.mov', '.mkv'].includes(ext)) {
    return audioVideoService.processAudioVideo(filePath, options);
  } else if (['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'].includes(ext)) {
    return documentService.processDocument(filePath, options);
  } else if (['.zip', '.rar', '.tar.gz'].includes(ext)) {
    // Archiving/Compression service would go here. For now, we'll just return the original path
    // or implement a basic compression if requested.
    console.warn("Archive processing not fully implemented. Returning original file path.");
    return filePath; // Placeholder
  } else {
    throw new Error('Unsupported file type for processing.');
  }
};

module.exports = {
  processFile,
};
