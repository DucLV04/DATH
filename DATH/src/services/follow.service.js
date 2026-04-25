const db = require('../config/db.config');

// [UC05.2 - Follow User]
exports.followUser = async (followerId, sellerId) => {
  // Validation: Cannot follow yourself
  if (followerId === sellerId) {
    throw new Error('Cannot follow yourself');
  }

  // Check if seller exists and is active
  const sellerCheck = await db.query(
    'SELECT 1 FROM users WHERE id = $1 AND is_active = true',
    [sellerId]
  );
  
  if (sellerCheck.rows.length === 0) {
    throw new Error('Seller not found or inactive');
  }

  // Check if already following
  const existingFollow = await db.query(
    'SELECT 1 FROM follows WHERE follower_id = $1 AND seller_id = $2',
    [followerId, sellerId]
  );

  if (existingFollow.rows.length > 0) {
    throw new Error('Already following this user');
  }

  // Insert follow record
  const query = `
    INSERT INTO follows (follower_id, seller_id)
    VALUES ($1, $2)
    RETURNING *
  `;

  try {
    const { rows } = await db.query(query, [followerId, sellerId]);
    return rows[0];
  } catch (error) {
    // Handle constraint violations
    if (error.code === '23514') { // CHECK constraint violation (cannot follow yourself)
      throw new Error('Cannot follow yourself');
    }
    if (error.code === '23505') { // UNIQUE constraint violation
      throw new Error('Already following this user');
    }
    throw error;
  }
};

// [UC05.2 - Unfollow User]
exports.unfollowUser = async (followerId, sellerId) => {
  // Check if the follow relationship exists
  const followCheck = await db.query(
    'SELECT 1 FROM follows WHERE follower_id = $1 AND seller_id = $2',
    [followerId, sellerId]
  );

  if (followCheck.rows.length === 0) {
    throw new Error('Not following this user');
  }

  // Delete follow record
  const query = `
    DELETE FROM follows
    WHERE follower_id = $1 AND seller_id = $2
    RETURNING *
  `;

  const { rows } = await db.query(query, [followerId, sellerId]);
  return rows[0];
};

// [UC05.2 - Check if Following]
exports.isFollowing = async (followerId, sellerId) => {
  const query = `
    SELECT EXISTS(
      SELECT 1 FROM follows
      WHERE follower_id = $1 AND seller_id = $2
    ) AS is_following
  `;

  const { rows } = await db.query(query, [followerId, sellerId]);
  return rows[0].is_following;
};

// [UC05.2 - Get Follower Count]
exports.getFollowerCount = async (sellerId) => {
  const query = `
    SELECT COUNT(*) as count FROM follows WHERE seller_id = $1
  `;

  const { rows } = await db.query(query, [sellerId]);
  return parseInt(rows[0].count, 10);
};

// [UC05.2 - Get Following Count]
exports.getFollowingCount = async (followerId) => {
  const query = `
    SELECT COUNT(*) as count FROM follows WHERE follower_id = $1
  `;

  const { rows } = await db.query(query, [followerId]);
  return parseInt(rows[0].count, 10);
};

// [UC05.2 - Get User's Followers List]
exports.getFollowersList = async (sellerId, limit = 10, offset = 0) => {
  const query = `
    SELECT u.id, u.username, u.avatar_url, f.created_at
    FROM follows f
    JOIN users u ON f.follower_id = u.id
    WHERE f.seller_id = $1
    ORDER BY f.created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const { rows } = await db.query(query, [sellerId, limit, offset]);
  return rows;
};

// [UC05.2 - Get User's Following List]
exports.getFollowingList = async (followerId, limit = 10, offset = 0) => {
  const query = `
    SELECT u.id, u.username, u.avatar_url, f.created_at
    FROM follows f
    JOIN users u ON f.seller_id = u.id
    WHERE f.follower_id = $1
    ORDER BY f.created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const { rows } = await db.query(query, [followerId, limit, offset]);
  return rows;
};
