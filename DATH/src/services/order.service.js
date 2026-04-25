const db = require('../config/db.config');
const logger = require('../utils/logger');
const emitter = require('../events/emitter');

/**
 * [UC04.5] 
 * @param {number} userId - The ID of the user placing the order.
 * @param {Array} cartItems - An array of cart items from cartService.getCartItems.
 * @param {object} orderDetails - An object containing { phone, address, paymentMethod, note }.
 * @returns {Promise<object>} The newly created order object.
 */
exports.placeOrderTransaction = async (userId, cartItems, orderDetails) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of cartItems) {
      const productQuery = `
        SELECT name, price, stock, status FROM products
        WHERE id = $1 FOR UPDATE
      `;
      const { rows } = await client.query(productQuery, [item.product_id]);
      const product = rows[0];

      if (!product) {
        throw new Error(`Product with ID ${item.product_id} not found.`);
      }
      if (product.status !== 'active') {
        throw new Error(`Product "${product.name}" is no longer available.`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Not enough stock for "${product.name}". Only ${product.stock} left.`);
      }

      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );

      const itemTotal = parseFloat(product.price) * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: parseFloat(product.price),
      });
    }
    const orderStatus = orderDetails.paymentMethod === 'COD' ? 'PENDING_COD' : 'PENDING_PAYMENT';

    const orderQuery = `
      INSERT INTO orders (
        user_id, total_amount, status, 
        phone_number, shipping_address, payment_method, note
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, status, total_amount, created_at
    `;

    const { rows: orderRows } = await client.query(orderQuery, [
      userId,
      totalAmount.toFixed(2),
      orderStatus,
      orderDetails.phone,
      orderDetails.address,
      orderDetails.paymentMethod,
      orderDetails.note,
    ]);
    const newOrder = orderRows[0];

    for (const itemData of orderItemsData) {
      const orderItemQuery = `
        INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
        VALUES ($1, $2, $3, $4)
      `;
      await client.query(orderItemQuery, [
        newOrder.id,
        itemData.product_id,
        itemData.quantity,
        itemData.price_at_purchase,
      ]);
    }
    logger.error(`${cartItems.map(item => item.product_id)}`)
    const deletedCartItemsQuery = `
      DELETE FROM cart_items
      WHERE user_id = $1
      AND product_id = ANY($2)
    `;

    await db.query(deletedCartItemsQuery, [userId, cartItems.map(item => item.product_id)]);

    // await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

    await client.query('COMMIT');

    logger.info(`Order ${newOrder.id} created successfully for user ${userId}`);

    emitter.emit('order.placed', { ...newOrder, user_id: userId, order_id: newOrder.id });

    return newOrder;

  } catch (e) {
    await client.query('ROLLBACK');
    logger.error(`Order placement transaction failed for user ${userId}: ${e.message}`);
    throw new Error(`Order placement failed: ${e.message}`);
  } finally {
    client.release();
  }
};

/**
 * [FR-008]
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array>} A list of order objects.
 */
exports.getOrderHistory = async (userId) => {
  const query = `
    SELECT
      o.id,
      o.total_amount,
      o.status,
      o.payment_method,
      o.created_at,
      o.phone_number,
      o.shipping_address,
      COALESCE(
        (
          SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', p.id,
              'order_item_id', oi.id,
              'name', p.name,
              'quantity', oi.quantity,
              'price_at_purchase', oi.price_at_purchase,
              'image_url', (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY id LIMIT 1)
            )
          )
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = o.id
        ),
        '[]'::json
      ) AS products
    FROM orders o
    WHERE o.user_id = $1
    ORDER BY o.created_at DESC;
  `;
  try {
    const { rows } = await db.query(query, [userId]);
    return rows;
  } catch (error) {
    logger.error(`Error fetching order history for user ${userId}: ${error.message}`);
    throw new Error('Failed to retrieve order history');
  }
};
/**
 * [UC04.4] Update Order Status
 * @param {number} orderId - The ID of the order.
 * @param {string} status - The new status.
 * @returns {Promise<object>} The updated order.
 */
exports.updateOrderStatus = async (orderId, status) => {
  const query = `
    UPDATE orders
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *;
  `;
  try {
    const { rows } = await db.query(query, [status, orderId]);
    if (rows.length === 0) {
      throw new Error('Order not found');
    }
    const updatedOrder = rows[0];
    // emitter.emit('order.status.updated', updatedOrder);
    return updatedOrder;
  } catch (error) {
    logger.error(`Error updating order status: ${error.message}`);
    throw error;
  }
};