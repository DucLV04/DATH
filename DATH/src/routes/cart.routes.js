const express = require('express');
const router = express.Router();
const controller = require('../controllers/cart.controller');
const { verifyToken } = require('../middleware/auth.jwt');
const  validator = require('../middleware/validator');

// [UC04.2] View cart

router.get(
    '/',
    [verifyToken],
    controller.getCart
);

// [UC04.1] Add to cart

router.post(
    '/',
    [
        verifyToken,
        validator.cartItemRules(),
        validator.validate
    ],
    controller.addItemToCart
)

// [FR-007] Update the quantity of a specific product in the cart

router.put(
    '/:productId',
    [
        verifyToken,
        validator.cartUpdateRules(),
        validator.validate
    ],
    controller.updateItemQuantity
)

// [FR-007] Remove a specific product from the cart

router.delete(
    '/:productId',
   [verifyToken],
   controller.removeItemFromCart
)

module.exports = router;



