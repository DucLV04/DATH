const authService = require('../services/auth.service');

// [UC01.3]
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    await authService.registerUser(username, email, password);

    res.status(201).send({
      message: 'User registered successfully! Please check your email to verify.',
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// [UC01.1]
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken } = await authService.loginUser(email, password);

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar_url: user.avatar_url,
      created_at: user.created_at,
      accessToken: accessToken
    });
  } catch (error) {
    res.status(401).send({ message: error.message });
  }
};

// [UC01.3]
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    await authService.verifyEmailToken(token);
    res.status(200).send({ message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

// [UC01.4] Forgot password - request reset email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await authService.requestPasswordReset(email);
    // Do not reveal whether the email existed
    res.status(200).send({ message: 'If an account with that email exists, a reset link has been sent.' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// [UC01.4] Reset password using token
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    res.status(200).send({ message: 'Password has been reset successfully.' });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

// [UC01.2] Logout
exports.logout = async (req, res) => {
  try {
    const token = req.headers['x-access-token'] || req.body.token;
    await authService.logoutUser(token);
    res.status(200).send({ message: 'Logged out successfully.' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    await authService.resendVerificationUser(email);
    res.status(200).send({ message: 'Nếu tài khoản tồn tại và chưa xác thực, email mới đã được gửi.' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};