const db = require('../config/db.config');
const logger = require('../utils/logger');
const emitter = require('../events/emitter');

/**
 * [UC05.1] Creates a new top-level review.
 * Verifies that the user purchased the item they are reviewing.
 */
exports.createReview = async (reviewData) => {
  const { userId, productId, orderItemId, rating, comment } = reviewData;
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // 1. Check if user is allowed to review this item
    const orderItemQuery = `
      SELECT oi.id, o.user_id, oi.product_id
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE oi.id = $1 AND o.user_id = $2 AND oi.product_id = $3
    `;
    const orderItemResult = await client.query(orderItemQuery, [orderItemId, userId, productId]);
    
    if (orderItemResult.rows.length === 0) {
      throw new Error('Invalid purchase. You can only review items you have bought.');
    }

    // 2. Check if this order item has already been reviewed
    const existingReviewQuery = 'SELECT id FROM reviews WHERE order_item_id = $1';
    const existingReviewResult = await client.query(existingReviewQuery, [orderItemId]);

    if (existingReviewResult.rows.length > 0) {
      throw new Error('You have already reviewed this item.');
    }

    // 3. Insert the new review
    const query = `
      INSERT INTO reviews (product_id, user_id, order_item_id, rating, comment, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id, rating
    `;
    const { rows } = await client.query(query, [productId, userId, orderItemId, rating, comment]);
    const newReview = rows[0];

    // 4. Get data for the emitter payload
    const dataQuery = `
      SELECT p.name AS product_name, u.username AS reviewer_name
      FROM products p, users u
      WHERE p.id = $1 AND u.id = $2;
    `;
    const { rows: dataRows } = await client.query(dataQuery, [productId, userId]);
    
    await client.query('COMMIT');
    
    // 5. Emit the 'review.submitted' event
    const payload = {
      reviewId: newReview.id,
      productId: productId,
      rating: newReview.rating,
      productName: dataRows[0].product_name,
      reviewerName: dataRows[0].reviewer_name
    };
    emitter.emit('review.submitted', payload);
    
    logger.info(`Review ${newReview.id} submitted for product ${productId} by user ${userId}`);
    return { id: newReview.id, ...reviewData };

  } catch (error) {
    await client.query('ROLLBACK');
    logger.error(`Error in createReview: ${error.message}`);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * [UC05.2] Creates a reply to an existing review.
 */
exports.createReviewReply = async (userId, parentReviewId, comment) => {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // 1. Check if parent review exists and get its product_id
    const parentReviewQuery = 'SELECT product_id FROM reviews WHERE id = $1';
    const parentReviewResult = await client.query(parentReviewQuery, [parentReviewId]);
    
    if (parentReviewResult.rows.length === 0) {
      throw new Error('Parent review not found.');
    }
    const { product_id: productId } = parentReviewResult.rows[0];

    // 2. Insert the new reply (comment)
    const query = `
      INSERT INTO reviews (product_id, user_id, parent_review_id, comment, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id
    `;
    const { rows } = await client.query(query, [productId, userId, parentReviewId, comment]);
    const newReply = rows[0];

    // 3. Get data for the emitter payload
    const dataQuery = `
      SELECT p.name AS product_name, u.username AS replier_name
      FROM products p, users u
      WHERE p.id = $1 AND u.id = $2;
    `;
    const { rows: dataRows } = await client.query(dataQuery, [productId, userId]);

    await client.query('COMMIT');
    
    // 4. Emit the 'review.replied' event
    const payload = {
      parentReviewId: parentReviewId,
      productId: productId,
      productName: dataRows[0].product_name,
      replierName: dataRows[0].replier_name
    };
    emitter.emit('review.replied', payload);

    logger.info(`Reply ${newReply.id} posted to review ${parentReviewId} by user ${userId}`);
    return { id: newReply.id, parentReviewId, comment };

  } catch (error) {
    await client.query('ROLLBACK');
    logger.error(`Error in createReviewReply: ${error.message}`);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * [UC05.1] Fetches all reviews for a product and nests the replies.
 */
exports.fetchReviews = async (productId) => {
  const query = `
    SELECT r.*, u.username, u.avatar_url
    FROM reviews r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.product_id = $1
    ORDER BY r.created_at DESC;
  `;
  const { rows } = await db.query(query, [productId]);
  
  // Nest replies under their parents
  const reviews = [];
  const repliesById = {};

  for (const review of rows) {
    if (review.parent_review_id) {
      // This is a reply
      if (!repliesById[review.parent_review_id]) {
        repliesById[review.parent_review_id] = [];
      }
      repliesById[review.parent_review_id].push(review);
    } else {
      // This is a top-level review
      reviews.push(review);
    }
  }

  // Attach the replies to their parents
  for (const review of reviews) {
    review.replies = repliesById[review.id] || [];
  }

  return reviews;
};

exports.getReviewsForProduct = async (productId, page, limit) => {
  const offset = (page - 1) * limit;

  // 1. Get total number of top-level reviews for the product
  const totalResult = await db.query(
    'SELECT COUNT(*) FROM reviews WHERE product_id = $1 AND parent_review_id IS NULL',
    [productId]
  );
  const totalReviews = parseInt(totalResult.rows[0].count, 10);
  const totalPages = Math.ceil(totalReviews / limit);

  // 2. Get the paginated top-level reviews
  const reviewsQuery = `
    SELECT r.id, r.rating, r.comment, r.created_at, u.username, u.avatar_url
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.product_id = $1 AND r.parent_review_id IS NULL
    ORDER BY r.created_at DESC
    LIMIT $2 OFFSET $3
  `;
  const { rows: reviews } = await db.query(reviewsQuery, [productId, limit, offset]);

  // 3. For each review, get its replies
  for (const review of reviews) {
    const repliesQuery = `
      SELECT r.id, r.comment, r.created_at, u.username, u.avatar_url
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.parent_review_id = $1
      ORDER BY r.created_at ASC
    `;
    const { rows: replies } = await db.query(repliesQuery, [review.id]);
    review.replies = replies;
  }

  return {
    reviews,
    totalReviews,
    totalPages,
  };
};

exports.submitReview = async (userId, productId, rating, comment, orderItemId) => {
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  return exports.createReview({
    userId,
    productId,
    orderItemId,
    rating,
    comment,
  });
};

exports.submitReply = async (userId, parentReviewId, comment, productId) => {
  return exports.createReviewReply(userId, parentReviewId, comment, productId);
};

// exports.deleteReview = async (reviewId, userId) => {
//   const client = await db.connect();
//   try {
//     await client.query('BEGIN');

//     const reviewQuery = 'SELECT id, user_id FROM reviews WHERE id = $1';
//     const { rows } = await client.query(reviewQuery, [reviewId]);
//     const review = rows[0];

//     if (!review) {
//       throw new Error('Review not found');
//     }

//     if (review.user_id !== userId) {
//       throw new Error('Forbidden');
//     }

//     // Delete replies first
//     await client.query('DELETE FROM reviews WHERE parent_review_id = $1', [reviewId]);
//     // Delete the review
//     await client.query('DELETE FROM reviews WHERE id = $1', [reviewId]);

//     await client.query('COMMIT');
//     logger.info(`Review ${reviewId} and its replies deleted by user ${userId}`);
//   } catch (error) {
//     await client.query('ROLLBACK');
//     logger.error(`Error deleting review ${reviewId}: ${error.message}`);
//     throw error;
//   } finally {
//     client.release();
//   }
// };

exports.updateReview = async (reviewId, userId, rating, comment) => {
  const client = await db.connect();

  try {
    const reviewQuery = 'SELECT id, user_id FROM reviews WHERE id = $1';
    const { rows } = await client.query(reviewQuery, [reviewId]);
    const review = rows[0];

    if (!review) {
      throw new Error('Review not found');
    }
    if (review.user_id !== userId) {
      throw new Error('Forbidden');
    }

    const updateQuery = `
      UPDATE reviews
      SET rating = COALESCE($1, rating), comment = COALESCE($2, comment), updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;
    const { rows: updatedRows } = await client.query(updateQuery, [rating, comment, reviewId]);
    
    logger.info(`Review ${reviewId} updated by user ${userId}`);
    return updatedRows[0];
  } catch (error) {
    logger.error(`Error updating review ${reviewId}: ${error.message}`);
    throw error;
  } finally {
    client.release();
  }
};

exports.getUserReviews = async (userId, page, limit) => {
  const offset = (page - 1) * limit;

  const totalResult = await db.query('SELECT COUNT(*) FROM reviews WHERE user_id = $1', [userId]);
  const totalReviews = parseInt(totalResult.rows[0].count, 10);
  const totalPages = Math.ceil(totalReviews / limit);

  const query = `
    SELECT r.*, p.name as product_name
    FROM reviews r
    LEFT JOIN products p ON r.product_id = p.id
    WHERE r.user_id = $1
    ORDER BY r.created_at DESC
    LIMIT $2 OFFSET $3
  `;
  const { rows: reviews } = await db.query(query, [userId, limit, offset]);

  return {
    reviews,
    totalReviews,
    totalPages,
  };
};

exports.getAllReviews = async (page, limit) => {
  const offset = (page - 1) * limit;

  const totalResult = await db.query('SELECT COUNT(*) FROM reviews');
  const totalReviews = parseInt(totalResult.rows[0].count, 10);
  const totalPages = Math.ceil(totalReviews / limit);
  
  const query = `
    SELECT r.*, u.username, p.name as product_name
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    LEFT JOIN products p ON r.product_id = p.id
    ORDER BY r.created_at DESC
    LIMIT $1 OFFSET $2
  `;
  const { rows: reviews } = await db.query(query, [limit, offset]);

  return {
    reviews,
    totalReviews,
    totalPages,
  };
};