const express = require('express');
const router = express.Router();
const controller = require('../controllers/notification.controller');
const { verifyToken } = require('../middleware/auth.jwt');
const validator = require('../middleware/validator'); // Assuming you'll add param validation

// [UC06.1] Get all notifications for the logged-in user
// Protected route, requires a valid token
router.get(
  '/', 
  [verifyToken], 
  controller.getNotifications
);

// [UC06.2] Mark a single notification as read
// Protected route, requires a valid token
router.put(
  '/:id/read', 
  [
    verifyToken
    // You could add a validation rule here if needed:
    // validator.param('id').isInt({ gt: 0 }),
    // validator.validate
  ], 
  controller.markAsRead
);

// [UC06.2] Mark ALL notifications as read for the user
router.put(
  '/read-all',
  [verifyToken],
  controller.markAllAsRead
);

module.exports = router;