const db = require('../config/db.config');
const config = require('../config/auth.config');
const emailService = require('./email.service'); // Mock service
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// We'll store a HASH of the reset token in the DB columns
// Columns expected in `users` table: password_reset_token (VARCHAR), password_reset_expires (TIMESTAMPTZ)

exports.registerUser = async (username, email, password) => {
  const hashedPassword = bcrypt.hashSync(password, config.bcryptRounds);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Check if email already exists
  const checkQuery = 'SELECT id FROM users WHERE email = $1';
  const checkRes = await db.query(checkQuery, [email]);
  if (checkRes.rows.length > 0) {
    throw new Error('Email này đã được sử dụng. Vui lòng chọn email khác.');
  }

  const query = `
    INSERT INTO users (username, email, password_hash, email_verification_token, is_active)
    VALUES ($1, $2, $3, $4, false)
    RETURNING id, email
  `;

  try {
    const { rows } = await db.query(query, [
      username,
      email,
      hashedPassword,
      verificationToken,
    ]);

    // Send verification email
    await emailService.sendVerificationEmail(rows[0].email, verificationToken);

    return rows[0];
  } catch (error) {
    throw new Error('Could not register user. ' + error.message);
  }
};

exports.loginUser = async (email, password) => {
  const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  if (rows.length === 0) throw new Error('User not found.');

  const user = rows[0];

  const passwordIsValid = bcrypt.compareSync(password, user.password_hash);
  if (!passwordIsValid) throw new Error('Invalid password.');

  if (!user.is_active) throw new Error('Account not verified. Please check your email.');

  const token = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: config.expiresIn,
  });

  return { user, accessToken: token };
};

exports.verifyEmailToken = async (token) => {
  // Enforce 1-hour expiry based on created_at (no schema change required)
  const query = `
    UPDATE users
    SET is_active = true,
        email_verification_token = NULL
    WHERE email_verification_token = $1
      AND created_at > NOW() - INTERVAL '1 hour'
    RETURNING id
  `;

  const { rows } = await db.query(query, [token]);
  if (rows.length === 0) {
    throw new Error('Invalid or expired verification token.');
  }
  return rows[0];
};

// [UC01.4] Request password reset (send email with token)
exports.requestPasswordReset = async (email) => {
  // Always succeed (do not leak whether email exists)
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  try {
    // Look up user by email; if not found, return silently
    const { rows } = await db.query('SELECT id, email FROM users WHERE email = $1', [email]);
    if (rows.length === 0) return true;

    const user = rows[0];

    // Store hashed token and expiry in DB
    const updateQuery = `
      UPDATE users
      SET password_reset_token = $1,
          password_reset_expires = $2
      WHERE id = $3
      RETURNING id, email
    `;
    const res = await db.query(updateQuery, [tokenHash, expiresAt, user.id]);

    if (res.rows.length === 0) return true;

    // Send password reset email with the PLAIN token (so user can submit it)
    await emailService.sendPasswordResetEmail(user.email, token);

    return true;
  } catch (error) {
    console.error('requestPasswordReset error:', error);
    throw new Error('Could not process password reset request.');
  }
};

// [UC01.4] Reset password using token
exports.resetPassword = async (token, newPassword) => {
  try {
    // Hash provided token and look up matching user whose token hasn't expired
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const selectQuery = `
      SELECT id FROM users
      WHERE password_reset_token = $1
        AND password_reset_expires > NOW()
      LIMIT 1
    `;
    const { rows } = await db.query(selectQuery, [tokenHash]);

    if (rows.length === 0) {
      throw new Error('Invalid or expired reset token.');
    }

    const userId = rows[0].id;

    const hashedPassword = bcrypt.hashSync(newPassword, config.bcryptRounds);
    const updateQuery = `
      UPDATE users
      SET password_hash = $1,
          password_reset_token = NULL,
          password_reset_expires = NULL
      WHERE id = $2
      RETURNING id
    `;
    const res = await db.query(updateQuery, [hashedPassword, userId]);

    if (res.rows.length === 0) throw new Error('User not found.');
    return res.rows[0];
  } catch (error) {
    console.error('resetPassword error:', error);
    throw new Error(error.message || 'Could not reset password.');
  }
};

// [UC01.2] Logout — with JWT this is typically handled client-side by deleting the token.
// We provide a server endpoint for symmetry. If token revocation is desired, implement a blacklist table.
exports.logoutUser = async (token) => {
  // No-op for now. If you want token revocation, create a `revoked_tokens` table and insert token + expiry here.
  return true;
};

exports.resendVerificationUser = async (email) => {
  const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  if (rows.length === 0) return true; // Security: do not reveal user existence

  const user = rows[0];
  if (user.is_active) return true; // Already verified, pretend success

  // Generate new token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  await db.query('UPDATE users SET email_verification_token = $1 WHERE id = $2', [verificationToken, user.id]);

  await emailService.sendVerificationEmail(user.email, verificationToken);

  return true;
};