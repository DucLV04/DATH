const followService = require('../services/follow.service');

// [UC05.2 - Follow User]
exports.followUser = async (req, res) => {
  try {
    const followerId = req.userId;
    const { sellerId } = req.params;

    // Validate sellerId is a number
    if (!sellerId || isNaN(sellerId)) {
      return res.status(400).send({ message: 'Invalid seller ID' });
    }

    const follow = await followService.followUser(followerId, parseInt(sellerId, 10));

    res.status(201).send({
      message: 'Successfully followed user',
      follow
    });
  } catch (error) {
    if (error.message.includes('Cannot follow yourself') ||
        error.message.includes('Already following') ||
        error.message.includes('Seller not found')) {
      return res.status(400).send({ message: error.message });
    }
    res.status(500).send({ message: error.message });
  }
};

// [UC05.2 - Unfollow User]
exports.unfollowUser = async (req, res) => {
  try {
    const followerId = req.userId;
    const { sellerId } = req.params;

    // Validate sellerId is a number
    if (!sellerId || isNaN(sellerId)) {
      return res.status(400).send({ message: 'Invalid seller ID' });
    }

    await followService.unfollowUser(followerId, parseInt(sellerId, 10));

    res.status(200).send({
      message: 'Successfully unfollowed user'
    });
  } catch (error) {
    if (error.message.includes('Not following')) {
      return res.status(400).send({ message: error.message });
    }
    res.status(500).send({ message: error.message });
  }
};

// [UC05.2 - Check if Following]
exports.checkFollowing = async (req, res) => {
  try {
    const followerId = req.userId;
    const { sellerId } = req.params;

    // Validate sellerId is a number
    if (!sellerId || isNaN(sellerId)) {
      return res.status(400).send({ message: 'Invalid seller ID' });
    }

    const isFollowing = await followService.isFollowing(followerId, parseInt(sellerId, 10));

    res.status(200).send({
      is_following: isFollowing
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// [UC05.2 - Get Follower Count]
exports.getFollowerCount = async (req, res) => {
  try {
    const { sellerId } = req.params;

    // Validate sellerId is a number
    if (!sellerId || isNaN(sellerId)) {
      return res.status(400).send({ message: 'Invalid seller ID' });
    }

    const count = await followService.getFollowerCount(parseInt(sellerId, 10));

    res.status(200).send({
      seller_id: parseInt(sellerId, 10),
      follower_count: count
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// [UC05.2 - Get Following Count]
exports.getFollowingCount = async (req, res) => {
  try {
    const userId = req.userId;

    const count = await followService.getFollowingCount(userId);

    res.status(200).send({
      user_id: userId,
      following_count: count
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// [UC05.2 - Get Followers List]
exports.getFollowersList = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;

    // Validate inputs
    if (!sellerId || isNaN(sellerId)) {
      return res.status(400).send({ message: 'Invalid seller ID' });
    }
    if (limit < 1 || limit > 100) {
      return res.status(400).send({ message: 'Limit must be between 1 and 100' });
    }
    if (offset < 0) {
      return res.status(400).send({ message: 'Offset must be >= 0' });
    }

    const followers = await followService.getFollowersList(
      parseInt(sellerId, 10),
      limit,
      offset
    );

    res.status(200).send({
      seller_id: parseInt(sellerId, 10),
      limit,
      offset,
      followers
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// [UC05.2 - Get Following List]
exports.getFollowingList = async (req, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;

    // Validate inputs
    if (limit < 1 || limit > 100) {
      return res.status(400).send({ message: 'Limit must be between 1 and 100' });
    }
    if (offset < 0) {
      return res.status(400).send({ message: 'Offset must be >= 0' });
    }

    const following = await followService.getFollowingList(userId, limit, offset);

    res.status(200).send({
      user_id: userId,
      limit,
      offset,
      following
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
