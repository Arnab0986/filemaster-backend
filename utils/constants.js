const path = require('path');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const PROCESSED_DIR = path.join(__dirname, '..', 'processed');

module.exports = {
  UPLOAD_DIR,
  PROCESSED_DIR,
  // Add other constants as needed
};
