const reviewService = require('../services/review.service');
const ApiResponse = require('../utils/api.response');
const logger = require('../utils/logger');

/**
 * [UC05.1 - Get Reviews for Product]
 */
exports.getReviewsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const result = await reviewService.getReviewsForProduct(productId, page, limit);
    
    return ApiResponse.ok(res, 'Reviews retrieved successfully', result);
  } catch (error) {
    logger.error(`getReviewsForProduct Error: ${error.message}`);
    return ApiResponse.serverError(res, 'Failed to retrieve reviews');
  }
};

/**
 * [UC05.1 - Submit Review]
 */
exports.submitReview = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, rating, comment, orderItemId } = req.body;

    // Validate inputs
    if (!productId || !rating) {
      return ApiResponse.error(res, 400, 'Product ID and rating are required');
    }

    const review = await reviewService.submitReview(
      userId,
      productId,
      rating,
      comment,
      orderItemId
    );

    return ApiResponse.created(res, 'Review submitted successfully', review);
  } catch (error) {
    logger.error(`submitReview Error: ${error.message}`);
    
    if (error.message.includes('Rating must be')) {
      return ApiResponse.error(res, 400, error.message);
    }
    if (error.message.includes('Invalid order item')) {
      return ApiResponse.error(res, 400, error.message);
    }

    return ApiResponse.serverError(res, 'Failed to submit review');
  }
};

/**
 * [UC05.2 - Submit Reply to Review]
 */
exports.submitReply = async (req, res) => {
  try {
    const userId = req.userId;
    const { id: parentReviewId } = req.params;
    const { comment, productId } = req.body;

    // Validate inputs
    if (!comment) {
      return ApiResponse.error(res, 400, 'Comment is required');
    }

    const reply = await reviewService.submitReply(
      userId,
      parentReviewId,
      comment,
      productId
    );

    return ApiResponse.created(res, 'Reply submitted successfully', reply);
  } catch (error) {
    logger.error(`submitReply Error: ${error.message}`);
    
    if (error.message.includes('Parent review not found')) {
      return ApiResponse.notFound(res, error.message);
    }

    return ApiResponse.serverError(res, 'Failed to submit reply');
  }
};

/**
 * [UC05 - Update Review]
 */
exports.updateReview = async (req, res) => {
  try {
    const userId = req.userId;
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    if (!rating && !comment) {
      return ApiResponse.error(res, 400, 'At least rating or comment is required');
    }

    const updated = await reviewService.updateReview(reviewId, userId, rating, comment);

    return ApiResponse.ok(res, 'Review updated successfully', updated);
  } catch (error) {
    logger.error(`updateReview Error: ${error.message}`);
    
    if (error.message.includes('Review not found')) {
      return ApiResponse.notFound(res, error.message);
    }
    if (error.message.includes('Forbidden')) {
      return ApiResponse.error(res, 403, error.message);
    }

    return ApiResponse.serverError(res, 'Failed to update review');
  }
};

/**
 * [UC05 - Get User's Reviews]
 */
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10 } = req.query;

    const result = await reviewService.getUserReviews(userId, page, limit);

    return ApiResponse.ok(res, 'User reviews retrieved successfully', result);
  } catch (error) {
    logger.error(`getUserReviews Error: ${error.message}`);
    return ApiResponse.serverError(res, 'Failed to retrieve user reviews');
  }
};

/**
 * [UC05 - Get All Reviews (admin)]
 */
exports.getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const result = await reviewService.getAllReviews(page, limit);

    return ApiResponse.ok(res, 'All reviews retrieved successfully', result);
  } catch (error) {
    logger.error(`getAllReviews Error: ${error.message}`);
    return ApiResponse.serverError(res, 'Failed to retrieve reviews');
  }
};
