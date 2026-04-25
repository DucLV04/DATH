const fs = require('fs');
const logger = require('../utils/logger');

/**
 * Middleware to cleanup uploaded files on validation error
 * Should be placed AFTER validator.validate
 */
const cleanupOnValidationError = (req, res, next) => {
  // Intercept res.json to cleanup files if validation fails (400 error)
  const originalJson = res.json;

  res.json = function (data) {
    // Check if it's a validation error response (400 with errors array)
    if (res.statusCode === 400 && data.errors && Array.isArray(data.errors)) {
      // Cleanup uploaded files
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          try {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
              logger.info(`Cleaned up file due to validation error: ${file.path}`);
            }
          } catch (err) {
            logger.error(`Failed to cleanup file ${file.path}: ${err.message}`);
          }
        });
      }
      // Cleanup single uploaded file
      if (req.file) {
        try {
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
            logger.info(`Cleaned up file due to validation error: ${req.file.path}`);
          }
        } catch (err) {
          logger.error(`Failed to cleanup file ${req.file.path}: ${err.message}`);
        }
      }
    }

    // Call original json method
    return originalJson.call(this, data);
  };

  next();
};

module.exports = {
  cleanupOnValidationError
};
