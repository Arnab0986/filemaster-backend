const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { PROCESSED_DIR } = require('../utils/constants');

const processImage = async (filePath, options) => {
  const { format, width, height, quality, sizeInKB, sizeInMB } = options;
  const originalFileName = path.basename(filePath);
  const fileNameWithoutExt = path.parse(originalFileName).name;
  let outputFileName = `${fileNameWithoutExt}_processed`;
  let outputPath;

  let image = sharp(filePath);

  // Resize by dimensions
  if (width || height) {
    image = image.resize(width, height);
    outputFileName += `_${width || 'auto'}x${height || 'auto'}`;
  }

  // Compression by quality
  if (quality) {
    image = image.jpeg({ quality }).png({ quality }).webp({ quality });
    outputFileName += `_q${quality}`;
  }

  // Convert format
  if (format) {
    image = image.toFormat(format);
    outputFileName += `.${format}`;
  } else {
    outputFileName += path.extname(originalFileName);
  }

  outputPath = path.join(PROCESSED_DIR, outputFileName);

  // Handle resizing by file size (KB/MB) - this is more complex and iterative
  // Sharp doesn't directly support target file size, so we'd need to adjust quality/dimensions iteratively.
  // For simplicity in this initial build, we'll focus on dimension/quality based resizing.
  // A more advanced implementation would involve a loop, reducing quality/dimensions until target size is met.
  if (sizeInKB || sizeInMB) {
    console.warn("Resizing by target file size (KB/MB) is an advanced feature not fully implemented in this basic version. Focusing on dimension/quality.");
    // Placeholder for future iterative resizing logic
    // let targetBytes = sizeInKB ? sizeInKB * 1024 : sizeInMB * 1024 * 1024;
    // let currentQuality = quality || 80; // Start with a reasonable quality
    // let outputBuffer;
    // do {
    //   outputBuffer = await image.toBuffer();
    //   if (outputBuffer.length > targetBytes && currentQuality > 10) {
    //     currentQuality -= 5;
    //     image = sharp(filePath).jpeg({ quality: currentQuality }).png({ quality: currentQuality }).webp({ quality: currentQuality });
    //   }
    // } while (outputBuffer.length > targetBytes && currentQuality > 10);
    // fs.writeFileSync(outputPath, outputBuffer);
  }

  try {
    await image.toFile(outputPath);
    return outputPath;
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to process image.');
  }
};

module.exports = {
  processImage,
};
