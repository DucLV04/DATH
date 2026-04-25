const notificationService = require('../services/notification.service');
const ApiResponse = require('../utils/api.response');
const logger = require('../utils/logger');

// [UC06.1] Get all notifications for the current user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.fetchNotifications(req.userId);
    
    // [UC06.1 - Alternate Flow]
    if (notifications.length === 0) {
      return ApiResponse.ok(res, 'You have no new notifications.', []);
    }
    
    return ApiResponse.ok(res, 'Notifications retrieved successfully', notifications);
  } catch (error) {
    logger.error(`getNotifications Error: ${error.message}`);
    return ApiResponse.serverError(res, 'Failed to retrieve notifications');
  }
};

// [UC06.2] Mark a single notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    await notificationService.markNotificationAsRead(id, userId);
    return ApiResponse.ok(res, 'Notification marked as read');
  } catch (error) {
    logger.error(`markAsRead Error: ${error.message}`);
    if (error.message.includes('not found')) {
      return ApiResponse.notFound(res, error.message);
    }
    return ApiResponse.serverError(res, 'Failed to mark notification as read');
  }
};

// [UC06.2] Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    await notificationService.markAllNotificationsAsRead(userId);
    return ApiResponse.ok(res, 'All notifications marked as read');
  } catch (error) {
    logger.error(`markAllAsRead Error: ${error.message}`);
    return ApiResponse.serverError(res, 'Failed to mark all notifications as read');
  }
};