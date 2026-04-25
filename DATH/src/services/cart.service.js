const db = require('../config/db.config');
const logger = require('../utils/logger');

/**
 * [UC04.1, 7.4.1] 
 * @param {number} userId - The ID of the user adding to the cart.
 * @param {number} productId - The ID of the product to add.
 * @param {number} quantity - The quantity to add.
 * @returns {Promise<object>} The newly created or updated cart item.
 */
exports.addItem = async (userId, productId, quantity) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    
    const productQuery = `
      SELECT stock, status FROM products 
      WHERE id = $1 FOR UPDATE
    `;
    const { rows: productRows } = await client.query(productQuery, [productId]);
    
    if (productRows.length === 0) {
      throw new Error('Product not found.');
    }
    
    const product = productRows[0];

    if (product.status !== 'active') {
      throw new Error('Product is unavailable.');
    }

    if (product.stock < quantity) {
      throw new Error(`Not enough stock. Only ${product.stock} items available.`);
    }

    const upsertQuery = `
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, product_id)
      DO UPDATE SET quantity = cart_items.quantity + $3
      RETURNING *
    `;
    
    const { rows } = await client.query(upsertQuery, [userId, productId, quantity]);
    
    await client.query('COMMIT');
    logger.info(`Item ${productId} added to cart for user ${userId}`);
    return rows[0];

  } catch (e) {
    await client.query('ROLLBACK');
    logger.error(`addItem transaction failed: ${e.message}`);
    throw e;
  } finally {
    client.release();
  }
};

/**
 * [UC04.2] 
 * @param {number} userId - The ID of the user.
 * @returns {Promise<object>} An object containing the list of items and the grand total.
 */
exports.getCartItems = async (userId) => {
  const query = `
    SELECT 
      c.product_id,
      c.quantity,
      p.name,
      p.price,
      p.stock,
      p.status,
      (c.quantity * p.price) AS subtotal
    FROM cart_items c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = $1
    ORDER BY p.name;
  `;
  const { rows } = await db.query(query, [userId]);
  
  const grandTotal = rows.reduce((total, item) => total + parseFloat(item.subtotal), 0);
  
  return {
    items: rows,
    grandTotal: grandTotal.toFixed(2),
  };
};

/**
 * [FR-007] 
 * @param {number} userId - The ID of the user.
 * @param {number} productId - The ID of the product to update.
 * @param {number} quantity - The new quantity to set.
 * @returns {Promise<object>} The updated cart item.
 */
exports.updateItemQuantity = async (userId, productId, quantity) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    
    const productQuery = `
      SELECT stock FROM products 
      WHERE id = $1 FOR UPDATE
    `;
    const { rows: productRows } = await client.query(productQuery, [productId]);
    
    if (productRows.length === 0) throw new Error('Product not found.');
    
    if (productRows[0].stock < quantity) {
      throw new Error(`Not enough stock. Only ${productRows[0].stock} items available.`);
    }

    const updateQuery = `
      UPDATE cart_items 
      SET quantity = $1 
      WHERE user_id = $2 AND product_id = $3
      RETURNING *
    `;
    const { rows } = await client.query(updateQuery, [quantity, userId, productId]);
    
    if (rows.length === 0) throw new Error('Item not found in cart.');

    await client.query('COMMIT');
    logger.info(`Cart item ${productId} updated to quantity ${quantity} for user ${userId}`);
    return rows[0];

  } catch (e) {
    await client.query('ROLLBACK');
    logger.error(`updateItemQuantity transaction failed: ${e.message}`);
    throw e;
  } finally {
    client.release();
  }
};

/**
 * [FR-007] 
 * @param {number} userId - The ID of the user.
 * @param {number} productId - The ID of the product to remove.
 * @returns {Promise<object>} The cart item that was deleted.
 */
exports.removeItem = async (userId, productId) => {
  const query = `
    DELETE FROM cart_items 
    WHERE user_id = $1 AND product_id = $2
    RETURNING *
  `;
  const { rows } = await db.query(query, [userId, productId]);
  
  if (rows.length === 0) {
    logger.warn(`Attempted to remove non-existent cart item ${productId} for user ${userId}`);
    throw new Error('Item not found in cart.');
  }
  
  logger.info(`Cart item ${productId} removed for user ${userId}`);
  return rows[0];
};