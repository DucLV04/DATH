const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const validator = require('../middleware/validator');
const verifySignup = require('../middleware/verify.signup');
const authJwt = require('../middleware/auth.jwt');
const { body } = require('express-validator');

// [UC01.3 - Register]
router.post(
  '/register',
  [
    validator.registerRules(),
    validator.validate,
    verifySignup.checkDuplicateEmail,
  ],
  controller.register
);

// [UC01.1 - Login]
router.post(
  '/login',
  [
    validator.loginRules(),
    validator.validate,
  ],
  controller.login
);

// (http://api.com/api/auth/verify?token=...)
router.get('/verify', controller.verifyEmail);

// [UC01.4] Forgot password: send reset link (body: { email })
router.post(
  '/forgot-password',
  [
    body('email', 'A valid email is required').isEmail().normalizeEmail(),
    validator.validate,
  ],
  controller.forgotPassword
);

// [UC01.4] Reset password: set new password (body: { token, password })
router.post(
  '/reset-password',
  [
    body('token', 'Reset token is required').notEmpty(),
    body('password', 'Password must be at least 8 characters long')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain uppercase, lowercase, number, and special character'),
    validator.validate,
  ],
  controller.resetPassword
);

// [UC01.2] Logout — protected endpoint but implementation is currently a no-op server-side
router.post('/logout', [authJwt.verifyToken], controller.logout);

// Resend verification email
router.post('/resend-verification', controller.resendVerification);

module.exports = router;