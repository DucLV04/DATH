const express = require('express');
const router = express.Router();
const controller = require('../controllers/order.controller');
const { verifyToken } = require('../middleware/auth.jwt');
const validator = require('../middleware/validator');

// [UC04.5 - Place Order]
// This is a highly sensitive, protected route.
router.post(
  '/', 
  [
    verifyToken,
    validator.placeOrderRules(), 
    validator.validate           
  ], 
  controller.placeOrder
);

router.get(
    '/',
    [
        verifyToken,
    ],
    controller.getOrderHistory
);

module.exports = router;