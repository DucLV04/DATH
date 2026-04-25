const { body, validationResult, param } = require('express-validator');

const registerRules = () => {
  return [
    body('username', 'Username is required').notEmpty(),
    body('email', 'A valid email is required').isEmail().normalizeEmail(),
    body('password', 'Password must be at least 8 characters long')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  ];
};

const loginRules = () => {
  return [
    body('email', 'A valid email is required').isEmail().normalizeEmail(),
    body('password', 'Password is required').notEmpty(),
  ];
};


const cartItemRules = () => {
  return [
    body('productId', 'A valid Product ID is required')
      .notEmpty()
      .isInt({ gt: 0 })
      .withMessage('Product ID must be a positive number'),

    body('quantity', 'A valid quantity is required')
      .notEmpty()
      .isInt({ gt: 0 })
      .withMessage('Quantity must be a positive number'),
  ];
};

const cartUpdateRules = () => {
  return [
    param('productId', 'Product ID in URL must be a valid number')
      .isInt({ gt: 0 })
      .withMessage('Product ID must be a positive number'),

    body('quantity', 'A valid quantity is required')
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage('Quantity must be a number (0 or greater)'),
  ];
};

const placeOrderRules = () => {
  return [
    body('phone', 'A valid phone number is required')
      .notEmpty()
      .matches(/^0\d{9}$/)
      .withMessage('Phone must be 10 digits starting with 0'),

    body('address', 'A valid shipping address is required')
      .notEmpty()
      .isString()
      .isLength({ min: 20, max: 500 })
      .matches(/[a-zA-Z0-9]/)
      .withMessage('Address must be detailed (min 20 chars)'),

    body('paymentMethod', 'A valid payment method is required')
      .notEmpty()
      .isIn(['COD', 'ONLINE'])
      .withMessage("Payment method must be 'COD' or 'ONLINE'"),

    body('note', 'Note must be a string')
      .optional()
      .isString(),
  ];
};

const productRules = () => {
  return [
    body('name', 'Product name is required')
      .notEmpty()
      .isString()
      .trim()
      .isLength({ min: 3 })
      .withMessage('Product name must be at least 3 characters long'),

    body('price', 'A valid price is required')
      .notEmpty()
      .isDecimal({ decimal_digits: '2' })
      .withMessage('Price must be a valid decimal (e.g., 19.99)'),

    body('stock', 'Stock must be a valid number (0 or greater)')
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage('Stock must be a positive integer'),

    body('description', 'Description must be a string')
      .optional()
      .isString()
      .trim(),

    body('category', 'Category must be a string')
      .optional()
      .isString()
      .trim(),
  ];
};


const idParamRule = (paramName = 'id') => {
  return [
    param(paramName, 'A valid ID is required in the URL')
      .isInt({ gt: 0 })
      .withMessage('ID must be a positive integer'),
  ];
};

const reviewRules = () => {
  return [
    body('productId', 'A valid Product ID is required')
      .isInt({ gt: 0 })
      .withMessage('Product ID must be a positive integer'),

    body('orderItemId', 'A valid Order Item ID is required')
      .isInt({ gt: 0 })
      .withMessage('Order Item ID must be a positive integer'),

    body('rating', 'A rating (1-5) is required')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be an integer between 1 and 5'),

    body('comment', 'A comment is required')
      .notEmpty()
      .isString()
      .trim()
      .isLength({ min: 10 })
      .withMessage('Comment must be at least 10 characters long'),
  ];
};

const replyRules = () => {
  return [
    body('comment', 'A comment is required')
      .notEmpty()
      .isString()
      .trim()
      .isLength({ min: 0 })
      .withMessage('Comment must be at least 2 characters long'),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ errors: errors.array() });
};

const updateProfileRules = () => {
  return [
    body('username', 'Username must be a string between 3 and 50 characters')
      .optional()
      .isString()
      .trim()
      .isLength({ min: 3, max: 50 }),

    body('avatar_url', 'Avatar URL must be a string')
      .optional()
      .isString()
      .trim(),
  ];
};

module.exports = {
  registerRules,
  loginRules,
  cartItemRules,
  cartUpdateRules,
  placeOrderRules,
  productRules,
  idParamRule,
  reviewRules,
  replyRules,
  validate,
  updateProfileRules,
};