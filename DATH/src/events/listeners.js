const emitter = require('./emitter');
const notificationService = require('../services/notification.service');
const db = require('../config/db.config');
const logger = require('../utils/logger');

function registerListeners() {
  logger.info('Event listeners registered.');

  // --- 1. On Order Placed ---
  emitter.on('order.placed', async (order) => {
    try {
      // 1. Notify the Buyer who placed the order
      await notificationService.createNotification(
        order.user_id,
        'ORDER_STATUS_UPDATE',
        `Your order #${order.id} has been placed successfully!`,
        `/orders/${order.id}`
      );

      // 2. Notify the Seller(s) involved
      const sellerQuery = `
        SELECT DISTINCT p.seller_id, u.username AS seller_name
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN users u ON p.seller_id = u.id
        WHERE oi.order_id = $1;
      `;
      const { rows: sellers } = await db.query(sellerQuery, [order.id]);

      for (const seller of sellers) {
        await notificationService.createNotification(
          seller.seller_id,
          'NEW_ORDER',
          `You have a new order! Order #${order.id} is waiting for confirmation.`,
          `/seller/orders/${order.id}`
        );
      }
    } catch (error) {
      logger.error(`Failed to process 'order.placed' event for order ${order.id}: ${error.message}`);
    }
  });

  // --- 2. On New Product Created ---
  emitter.on('product.created', async (product) => {
    try {
      // 1. Get the seller's username
      const userQuery = `SELECT username FROM users WHERE id = $1;`;
      const { rows: users } = await db.query(userQuery, [product.seller_id]);
      const sellerName = users[0] ? users[0].username : 'A seller';

      // 2. Find all users who follow this seller
      const followersQuery = `SELECT follower_id FROM follows WHERE seller_id = $1;`;
      const { rows: followers } = await db.query(followersQuery, [product.seller_id]);

      // 3. Create a notification for each follower
      for (const follower of followers) {
        await notificationService.createNotification(
          follower.follower_id,
          'NEW_PRODUCT_FROM_SELLER',
          `${sellerName} just posted a new item: ${product.name}`,
          `/products/${product.id}`
        );
      }
    } catch (error) {
      logger.error(`Failed to process 'product.created' event for product ${product.id}: ${error.message}`);
    }
  });

  emitter.on('product.status.changed', async (payload) => {
    const { productId, newStatus } = payload;

    if (newStatus === 'inactive') {
      try {
        const deleteQuery = `DELETE FROM cart_items WHERE product_id = $1 RETURNING user_id;`;
        const { rows: deletedItems } = await db.query(deleteQuery, [productId]);

        if (deletedItems.length > 0) {
          logger.info(`Product ${productId} was hidden. Removed it from ${deletedItems.length} user carts.`);

          // Notify users whose carts were affected
          const uniqueUserIds = [...new Set(deletedItems.map(item => item.user_id))];
          for (const userId of uniqueUserIds) {
            await notificationService.createNotification(
              userId,
              'SYSTEM',
              'An item in your cart has become unavailable and was removed.',
              '/cart'
            );
          }
        }
      } catch (error) {
        logger.error(`Failed to clean up carts for hidden product ${productId}: ${error.message}`);
      }
    }
  });

  emitter.on('product.updated', async (product) => {
    try {
      const productId = product.id;
      const productName = product.name;

      logger.info(`Product ${productId} was updated. Notifying users with this item in their cart.`);

      // 1. Find all users who have this item in their cart
      const cartQuery = `SELECT DISTINCT user_id FROM cart_items WHERE product_id = $1;`;
      const { rows: usersInCart } = await db.query(cartQuery, [productId]);

      if (usersInCart.length === 0) {
        logger.info(`No users had product ${productId} in their cart. No notifications sent.`);
        return;
      }

      // 2. Create a notification for each affected user
      for (const item of usersInCart) {
        await notificationService.createNotification(
          item.user_id,
          'SYSTEM',
          `An item in your cart, '${productName}', has been updated by the seller.`,
          `/products/${productId}`
        );
      }

      logger.info(`Sent ${usersInCart.length} notifications for product ${productId} update.`);

    } catch (error) {
      logger.error(`Failed to process 'product.updated' event for product ${product.id}: ${error.message}`);
    }
  });

  // --- 3. On New Review Submitted ---
  emitter.on('review.submitted', async (reviewData) => {
    // reviewData should contain { reviewId, productId, rating, productName, reviewerName }
    try {
      // 1. Find the seller of the product
      const productQuery = `SELECT seller_id FROM products WHERE id = $1;`;
      const { rows } = await db.query(productQuery, [reviewData.productId]);
      const seller = rows[0];

      if (seller) {
        // 2. Notify the seller
        await notificationService.createNotification(
          seller.seller_id,
          'NEW_REVIEW',
          `${reviewData.reviewerName} left a ${reviewData.rating}-star review on your product: ${reviewData.productName}`,
          `/products/${reviewData.productId}#review-${reviewData.reviewId}`
        );
      }
    } catch (error) {
      logger.error(`Failed to process 'review.submitted' event for review ${reviewData.reviewId}: ${error.message}`);
    }
  });

  // --- 4. On Review Replied ---
  emitter.on('review.replied', async (replyData) => {
    // replyData should contain { parentReviewId, replierName, productId, productName }
    try {
      // 1. Find the user_id of the person who wrote the parent review/comment
      const parentReviewQuery = `SELECT user_id FROM reviews WHERE id = $1;`;
      const { rows } = await db.query(parentReviewQuery, [replyData.parentReviewId]);
      const originalPoster = rows[0];

      if (originalPoster && originalPoster.user_id) {
        // 2. Notify the original poster
        await notificationService.createNotification(
          originalPoster.user_id,
          'MENTION',
          `${replyData.replierName} replied to your comment on: ${replyData.productName}`,
          `/products/${replyData.productId}#review-${replyData.parentReviewId}`
        );
      }
    } catch (error) {
      logger.error(`Failed to process 'review.replied' event for parent review ${replyData.parentReviewId}: ${error.message}`);
    }
  });
}

registerListeners();

