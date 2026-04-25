const db = require('../config/db.config');
const logger = require('../utils/logger');

/**
 * [UC06.1]
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array>} A list of notification objects.
 */
exports.fetchNotifications = async (userId) => {
  const query = `
    SELECT id, type, message, link_url, is_read, created_at
    FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;
  try {
    const { rows } = await db.query(query, [userId]);
    return rows;
  } catch (error) {
    logger.error(`Error fetching notifications for user ${userId}: ${error.message}`);
    throw new Error('Database query failed');
  }
};

/**
 * [UC06.2]
 * @param {number} notificationId - The ID of the notification.
 * @param {number} userId - The ID of the user (for security).
 */
exports.markNotificationAsRead = async (notificationId, userId) => {
  const query = `
    UPDATE notifications SET is_read = true
    WHERE id = $1 AND user_id = $2
    RETURNING id;
  `;
  try {
    const { rows } = await db.query(query, [notificationId, userId]);
    if (rows.length === 0) {
      throw new Error('Notification not found or access denied.');
    }
    return rows[0];
  } catch (error) {
    logger.error(`Error marking notification ${notificationId} as read: ${error.message}`);
    throw error;
  }
};

/**
 * [UC06.2]
 * @param {number} userId - The ID of the user.
 */
exports.markAllNotificationsAsRead = async (userId) => {
  const query = `
    UPDATE notifications SET is_read = true
    WHERE user_id = $1 AND is_read = false;
  `;
  try {
    await db.query(query, [userId]);
  } catch (error) {
    logger.error(`Error marking all notifications as read for user ${userId}: ${error.message}`);
    throw new Error('Database query failed');
  }
};

/**
 * Creates a new notification.
 * This is called by the event listener, not directly by a controller.
 * @param {number} userId - The ID of the recipient.
 * @param {string} type - The notification_type enum (e.g., 'NEW_ORDER').
 * @param {string} message - The notification text.
 * @param {string} link_url - (Optional) The URL to redirect to on click.
 */
exports.createNotification = async (userId, type, message, link_url = null) => {
  const query = `
    INSERT INTO notifications (user_id, type, message, link_url)
    VALUES ($1, $2, $3, $4)
    RETURNING id;
  `;
  try {
    const { rows } = await db.query(query, [userId, type, message, link_url]);
    logger.info(`Notification ${rows[0].id} created for user ${userId} (Type: ${type})`);
    return rows[0];
  } catch (error) {
    logger.error(`Error creating notification for user ${userId}: ${error.message}`);
  }
};