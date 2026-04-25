const express = require('express');
const router = express.Router();
const controller = require('../controllers/review.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.jwt');
const validator = require('../middleware/validator');

// [UC05.1] Get all reviews and replies
router.get(
  '/:productId',
  [
    validator.idParamRule('productId'), 
    validator.validate
  ],
  controller.getReviewsForProduct
);

// [UC05.1] Submit a new top-level review
router.post(
  '/',
  [
    verifyToken,              
    validator.reviewRules(),  
    validator.validate
  ],
  controller.submitReview
);

// [UC05.2] Submit a reply to a review
router.post(
  '/:id/reply',
  [
    verifyToken,              
    validator.idParamRule('id'), 
    validator.replyRules(),   
    validator.validate
  ],
  controller.submitReply
);

// [UC05] Delete a review
// router.delete(
//   '/:reviewId',
//   [
//     verifyToken,
//     validator.idParamRule('reviewId'),
//     validator.validate
//   ],
//   controller.deleteReview
// );

// [UC05] Update a review
router.put(
  '/:reviewId',
  [
    verifyToken,
    validator.idParamRule('reviewId'),
    validator.reviewRules(),
    validator.validate
  ],
  controller.updateReview
);

// [UC05] Get all reviews for the current user
router.get(
  '/user/all',
  [
    verifyToken
  ],
  controller.getUserReviews
);

// [UC05] Get all reviews (admin)
// router.get(
//   '/all',
//   [
//     verifyToken,
//     isAdmin
//   ],
//   controller.getAllReviews
// );

module.exports = router;