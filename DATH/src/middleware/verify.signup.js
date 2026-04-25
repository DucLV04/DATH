const db = require('../config/db.config');

const checkDuplicateEmail = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT id FROM users WHERE email = $1', [
      req.body.email,
    ]);
    
    if (rows.length > 0) {
      return res.status(409).send({ message: 'Failed! Email is already in use!' });
    }
    next();
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports = { checkDuplicateEmail };