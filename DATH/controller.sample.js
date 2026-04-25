// Before:
// res.status(200).send({ id: user.id, ... });
// res.status(401).send({ message: error.message });

// After:
const ApiResponse = require('../utils/api.response');
const authService = require('../services/auth.service');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken } = await authService.loginUser(email, password);

    const data = {
      id: user.id,
      username: user.username,
      accessToken: accessToken,
    };
    // Standardized success response
    return ApiResponse.ok(res, 'Login successful', data);
  } catch (error) {
    // Standardized error response
    return ApiResponse.unauthorized(res, error.message);
  }
};


//<------------------------------------->

// Before:
// console.log('User logged in:', user.email);
// console.error('Error in login:', error.message);

// After:
const logger = require('../utils/logger'); // Import the logger
const db = require('../config/db.config');
// ... other imports

exports.loginUser = async (email, password) => {
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0) {
      logger.warn(`Login attempt failed: User not found with email ${email}`);
      throw new Error('User not found.');
    }
    
    const user = rows[0];
    
    // ... password check
    
    logger.info(`User login successful: ${user.email} (ID: ${user.id})`);
    
    // ... create token
    return { user, accessToken: token };

  } catch (error) {
    logger.error(`Error in loginUser for ${email}: ${error.message}`);
    throw error; // Re-throw the error for the controller
  }
};