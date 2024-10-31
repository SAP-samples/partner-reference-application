'use strict';
// Implementation of logo reuse functions
const fs = require('fs');
const path = require('path');

class Logo {
  static defaultLogo = '../sample_data/poetrySlamLogo.jpg';

  static encodeFileBase64(filePath = Logo.defaultLogo) {
    // Read logo image to be used in the form from the file system
    const image = fs.readFileSync(path.join(__dirname, filePath));
    return Buffer.from(image).toString('base64');
  }
}

// Publish class
module.exports = Logo;
