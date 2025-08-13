const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { PROCESSED_DIR } = require('../utils/constants');

// Ensure ffmpeg is installed and accessible in your system's PATH
// For Windows, you might need to download ffmpeg binaries and add them to PATH.
// For Linux/macOS, you can usually install via package manager (e.g., `sudo apt install ffmpeg` or `brew install ffmpeg`).

const processAudioVideo = (filePath, options) => {
  return new Promise((resolve, reject) => {
    const { format, bitrate, resolution, compress } = options;
    const originalFileName = path.basename(filePath);
    const fileNameWithoutExt = path.parse(originalFileName).name;
    let outputFileName = `${fileNameWithoutExt}_processed`;
    let outputPath;

    let command = ffmpeg(filePath);

    // Set output format
    if (format) {
      command = command.toFormat(format);
      outputFileName += `.${format}`;
    } else {
      outputFileName += path.extname(originalFileName);
    }

    outputPath = path.join(PROCESSED_DIR, outputFileName);

    // Set bitrate for compression/quality adjustment
    if (bitrate) {
      command = command.audioBitrate(bitrate).videoBitrate(bitrate);
      outputFileName += `_br${bitrate}`;
    }

    // Set resolution for video resizing
    if (resolution) {
      command = command.size(resolution);
      outputFileName += `_res${resolution}`;
    }

    // Basic compression (e.g., lower quality, faster encoding)
    if (compress) {
      command = command.addOption('-crf', '28'); // Constant Rate Factor for video compression
      outputFileName += `_comp`;
    }

    command
      .output(outputPath)
      .on('end', () => {
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('Error processing audio/video:', err);
        reject(new Error('Failed to process audio/video.'));
      })
      .run();
  });
};

module.exports = {
  processAudioVideo,
};
