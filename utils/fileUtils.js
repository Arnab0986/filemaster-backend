const fs = require('fs');
const path = require('path');

const getFileSizeInBytes = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    console.error(`Error getting file size for ${filePath}:`, error);
    return 0;
  }
};

const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

const getFileNameWithoutExtension = (filename) => {
  return path.parse(filename).name;
};

module.exports = {
  getFileSizeInBytes,
  getFileExtension,
  getFileNameWithoutExtension,
};
