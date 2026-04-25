const express = require('express');
const router = express.Router();
const controller = require('../controllers/follow.controller');
const validator = require('../middleware/validator');
const { verifyToken } = require('../middleware/auth.jwt');

// [UC05.2 - Follow User]
// This route is PROTECTED. You must have a valid JWT.
router.post('/:sellerId/follow', [verifyToken], controller.followUser);

// [UC05.2 - Unfollow User]
// This route is PROTECTED. You must have a valid JWT.
router.delete('/:sellerId/unfollow', [verifyToken], controller.unfollowUser);

// [UC05.2 - Check if Following]
// This route is PROTECTED. You must have a valid JWT.
router.get('/:sellerId/check-follow', [verifyToken], controller.checkFollowing);

// [UC05.2 - Get Follower Count]
// This is a PUBLIC route
router.get('/:sellerId/followers-count', controller.getFollowerCount);

// [UC05.2 - Get Following Count]
// This route is PROTECTED. You must have a valid JWT.
router.get('/me/following-count', [verifyToken], controller.getFollowingCount);

// [UC05.2 - Get Followers List]
// This is a PUBLIC route
// Query params: ?limit=10&offset=0
router.get('/:sellerId/followers', controller.getFollowersList);

// [UC05.2 - Get Following List]
// This route is PROTECTED. You must have a valid JWT.
// Query params: ?limit=10&offset=0
router.get('/me/following', [verifyToken], controller.getFollowingList);
module.exports = router;