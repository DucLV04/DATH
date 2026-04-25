const cartService = require('../services/cart.service');
const ApiResponse = require('../utils/api.response');
const logger = require('../utils/logger');

exports.getCart = async (req, res) => {
    try {
        const userId = req.userId;
        const cart = await cartService.getCartItems(userId);

        if (!cart || cart.items.length === 0) {
            return ApiResponse.ok(res, 'Cart is empty', { items: [], grandTotal: 0 });
        }

        return ApiResponse.ok(res, 'Cart retrieved successfully', cart);
    } catch (error) {
        logger.error(`getCart Error: ${error.message}`);
        return ApiResponse.serverError(res, 'Failed to retrieve cart');

    }
}

// [UC04.1] Add an item to the cart

exports.addItemToCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity < 1) {
            return ApiResponse.badRequest(res, 'Invalid input: productId and a valid quantity are required.');
        }

        const updatedCartItem = await cartService.addItem(userId, productId, parseInt(quantity));
        return ApiResponse.created(res, 'Item added to cart', updatedCartItem);

    } catch (error) {
        logger.error(`addItemToCart Error: ${error.message}`);
        if (error.message.includes('unavailable') || error.message.includes('stock')) {
            return ApiResponse.badRequest(res, error.message);
        }
        return ApiResponse.serverError(res, 'Failed to add item to cart');
    }
}

exports.updateItemQuantity = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId } = req.params;
        const { quantity } = req.body;
        await cartService.updateItemQuantity(userId, productId, quantity);
        return ApiResponse.ok(res, 'Updated item quanity');
        
    } catch (error) {
        logger.error(`updateItemQuantity Error: ${error.message}`);
        return ApiResponse.serverError(res, 'Failed to update item quantity');
        
    }
}

// [FR-007] Remove an item from the cart

exports.removeItemFromCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId } = req.params;
        await cartService.removeItem(userId, productId);
        return ApiResponse.ok(res, 'Item removed from cart');
    } catch (error) {
        logger.error(`removeItemFromCart Error: ${error.message}`);
        return ApiResponse.serverError(res, 'Failed to remove item from cart');
    }

}