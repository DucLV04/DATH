const orderService = require('../services/order.service');
const cartService = require('../services/cart.service');
const ApiResponse = require('../utils/api.response');
const logger = require('../utils/logger');

// exports.placeOrder = async (req, res) => {
//   try {
//     const userId = req.userId;
//
//     const { phone, address, paymentMethod, note } = req.body;
//
//     const cart = await cartService.getCartItems(userId);
//     if (!cart || cart.items.length === 0) {
//       return ApiResponse.badRequest(res, 'Cannot place order with an empty cart.');
//     }
//
//     const orderDetails = {
//       phone,
//       address,
//       paymentMethod,
//       note,
//     };
//
//     const order = await orderService.placeOrderTransaction(
//       userId,
//       cart.items,
//       orderDetails
//     );
//
//     return ApiResponse.created(res, 'Order placed successfully', order);
//
//   } catch (error) {
//     logger.error(`placeOrder Error: ${error.message}`);
//     return ApiResponse.serverError(res, error.message);
//   }
// };

exports.placeOrder = async (req, res) => {
    try {
        const userId = req.userId;

        const { phone, address, paymentMethod, note, selectedItems } = req.body;

        // Validate
        if (!selectedItems || selectedItems.length === 0) {
            return ApiResponse.badRequest(res, 'No selected items to checkout.');
        }

        // Lấy full cart
        const cart = await cartService.getCartItems(userId);
        if (!cart || cart.items.length === 0) {
            return ApiResponse.badRequest(res, 'Your cart is empty.');
        }

        // Filter các item user đã chọn
        const checkoutItems = cart.items.filter(item =>
            selectedItems.includes(item.product_id)
        );
        // console.log(checkoutItems)

        // Nếu user gửi id không hợp lệ
        if (checkoutItems.length !== selectedItems.length) {
            return ApiResponse.badRequest(res, 'Some selected items are not in your cart.');
        }

        const orderDetails = {
            phone,
            address,
            paymentMethod,
            note,
        };

        // Gửi chỉ những item đã chọn vào transaction
        const order = await orderService.placeOrderTransaction(
            userId,
            checkoutItems,
            orderDetails
        );

        // [TESTING ONLY] Auto-complete order after 5 seconds to allow immediate review
        setTimeout(async () => {
            try {
                logger.info(`Auto-completing order ${order.id} for testing...`);
                await orderService.updateOrderStatus(order.id, 'COMPLETED');
                logger.info(`Order ${order.id} marked as COMPLETED.`);
            } catch (err) {
                logger.error(`Failed to auto-complete order ${order.id}: ${err.message}`);
            }
        }, 5000);

        // Xóa các item đã checkout khỏi cart
        // await cartService.removeItems(selectedItems);

        return ApiResponse.created(res, 'Order placed successfully', order);

    } catch (error) {
        logger.error(`placeOrder Error: ${error.message}`);
        return ApiResponse.serverError(res, error.message);
    }
};


exports.getOrderHistory = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await orderService.getOrderHistory(userId);
        return ApiResponse.ok(res, 'Order history retrieved successfully', orders);
    } catch (error) {
        logger.error(`getOrderHistory Error: ${error.message}`);
        return ApiResponse.serverError(res, 'Failed to retrieve order history');
    }
};