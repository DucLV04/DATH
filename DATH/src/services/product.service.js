const db = require('../config/db.config');
const logger = require('../utils/logger');
const emitter = require('../events/emitter');
const fs = require('fs');
const path = require('path');

// Helper function to delete file from storage
const deleteFileFromStorage = (imageUrl) => {
  try {
    const filename = path.basename(imageUrl);
    // Build path from project root: /home/rat/DATH/uploads/products/filename
    const filepath = path.join(__dirname, '../../uploads/products', filename);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      logger.info(`Deleted file from storage: ${filepath}`);
    } else {
      logger.warn(`File not found in storage: ${filepath}`);
    }
  } catch (error) {
    logger.error(`Error deleting file from storage: ${error.message}`);
  }
};



/**
 * [UC03.1 - Create Product with Images and Hashtags]
 */
exports.createProduct = async (sellerId, productData, imageFiles = [], hashtags = []) => {
  const { name, description, price, stock, category } = productData;
  const query = `
    INSERT INTO products (seller_id, name, description, price, stock, category, status)
    VALUES ($1, $2, $3, $4, $5, $6, 'active')
    RETURNING *;
  `;
  try {
    const { rows } = await db.query(query, [
      sellerId,
      name,
      description,
      price,
      stock,
      category,
    ]);
    const newProduct = rows[0];

    // Insert product images if provided
    if (imageFiles && imageFiles.length > 0) {
      await this.addProductImages(newProduct.id, imageFiles);
    }

    // Insert product hashtags if provided
    if (hashtags && hashtags.length > 0) {
      await this.addHashtagsToProduct(newProduct.id, sellerId, hashtags);
    }

    emitter.emit('product.created', newProduct);

    logger.info(`Product ${newProduct.id} created by user ${sellerId}`);
    return newProduct;

  } catch (error) {
    logger.error(`Error in createProduct: ${error.message}`);
    throw error;
  }
};

/**
 * [UC02.1 / UC02.2 - Get All Products with Seller Info (Optimized with Subqueries)]
 */
exports.findAllProducts = async (queryParams) => {
  const {
    search,
    category,
    page = 1,
    limit = 10,
    rating_min,
    rating_max,
    price_min,
    price_max,
    seller_id // Add filter by seller
  } = queryParams;

  const values = [];
  let count = 1;

  // Base query
  let query = `
        SELECT
            p.id, p.name, p.description, p.price, p.stock, p.category,
            p.average_rating, p.review_count, p.created_at,
            u.id AS seller_id, u.username AS seller_name, u.avatar_url AS seller_avatar,
            (SELECT COUNT(*) FROM follows WHERE seller_id = u.id) AS seller_followers_count,
            COALESCE((SELECT ROUND(AVG(average_rating)::numeric, 2) FROM products
                      WHERE seller_id = u.id AND status = 'active'
                        AND average_rating > 0), 0) AS seller_average_rating,
            (SELECT image_url FROM product_images WHERE product_id = p.id
             ORDER BY created_at ASC LIMIT 1) AS first_image,
      COALESCE(
        (SELECT json_agg(json_build_object('id', h.id, 'tag', h.tag) ORDER BY h.tag)
         FROM hashtags h
         JOIN product_hashtags ph ON h.id = ph.hashtag_id
         WHERE ph.product_id = p.id
        ), '[]'::json
      ) AS hashtags,
      ts_rank_cd(
        setweight(to_tsvector('english', coalesce(p.name, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(p.description, '')), 'B'),
        plainto_tsquery('english', $${count})
            ) AS rank
        FROM products p
            JOIN users u ON p.seller_id = u.id
        WHERE p.status = 'active'
    `;

  // Search
  if (search) {
    values.push(search);
    count++;
    query += ` AND (
            to_tsvector('english', coalesce(p.name, '')) ||
            to_tsvector('english', coalesce(p.description, ''))
        ) @@ plainto_tsquery('english', $1)`;
  } else {
    query = `
            SELECT
                p.id, p.name, p.description, p.price, p.stock, p.category,
                p.average_rating, p.review_count, p.created_at,
                u.id AS seller_id, u.username AS seller_name, u.avatar_url AS seller_avatar,
                (SELECT COUNT(*) FROM follows WHERE seller_id = u.id) AS seller_followers_count,
                COALESCE((SELECT ROUND(AVG(average_rating)::numeric, 2) FROM products
                          WHERE seller_id = u.id AND status = 'active'
                            AND average_rating > 0), 0) AS seller_average_rating,
                (SELECT image_url FROM product_images WHERE product_id = p.id
                 ORDER BY created_at ASC LIMIT 1) AS first_image,
          COALESCE(
            (SELECT json_agg(json_build_object('id', h.id, 'tag', h.tag) ORDER BY h.tag)
             FROM hashtags h
             JOIN product_hashtags ph ON h.id = ph.hashtag_id
             WHERE ph.product_id = p.id
            ), '[]'::json
          ) AS hashtags,
          0 AS rank
            FROM products p
                JOIN users u ON p.seller_id = u.id
            WHERE p.status = 'active'
        `;
  }

  // Seller Filter
  if (seller_id) {
    query += ` AND p.seller_id = $${count}`;
    values.push(parseInt(seller_id)); // Ensure it's an integer
    count++;
  }

  // Category filter
  if (category) {
    const categories = Array.isArray(category) ? category : [category];
    const categoryPlaceholders = categories.map(() => `$${count++}`).join(',');
    values.push(...categories);
    query += ` AND p.category IN (${categoryPlaceholders})`;
    // logger.error(`get query placeholders values: ${categoryPlaceholders} ${values} ${query}`);
  }

  //Rating Min
  if (rating_min) {
    query += ` AND p.average_rating >= $${count}`;
    values.push(Number(rating_min));
    count++;
  }

  //Rating Max
  if (rating_max) {
    query += ` AND p.average_rating <= $${count}`;
    values.push(Number(rating_max));
    count++;
  }

  //Price Min
  if (price_min) {
    query += ` AND p.price >= $${count}`;
    values.push(Number(price_min));
    count++;
  }

  //Price Max
  if (price_max) {
    query += ` AND p.price <= $${count}`;
    values.push(Number(price_max));
    count++;
  }

  // Paging
  const offset = (parseInt(page) - 1) * parseInt(limit);
  query += ` ORDER BY rank DESC, p.created_at DESC LIMIT $${count} OFFSET $${count + 1}`;
  values.push(parseInt(limit), offset);

  const { rows } = await db.query(query, values);
  return rows;
};

/**
 * [UC02.1 / UC02.2 - Get My Products (Products uploaded by current user)]
 */
exports.findMyProducts = async (sellerId, queryParams) => {
  const { search, category, page = 1, limit = 10 } = queryParams;
  const values = [sellerId];
  let count = 2;

  // Base query - same as findAllProducts but filtered by seller_id
  let query = `
    SELECT 
      p.id, p.name, p.description, p.price, p.stock, p.category, 
      p.average_rating, p.review_count, p.created_at,
      u.id AS seller_id, u.username AS seller_name, u.avatar_url AS seller_avatar,
      (SELECT COUNT(*) FROM follows WHERE seller_id = u.id) AS seller_followers_count,
      COALESCE((SELECT ROUND(AVG(average_rating)::numeric, 2) FROM products WHERE seller_id = u.id AND status = 'active' AND average_rating > 0), 0) AS seller_average_rating,
      (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY created_at ASC LIMIT 1) AS first_image,
      COALESCE((SELECT json_agg(json_build_object('id', h.id, 'tag', h.tag) ORDER BY h.tag) FROM hashtags h JOIN product_hashtags ph ON h.id = ph.hashtag_id WHERE ph.product_id = p.id), '[]'::json) AS hashtags,
      ts_rank_cd(
        setweight(to_tsvector('english', coalesce(p.name, '')), 'A') || 
        setweight(to_tsvector('english', coalesce(p.description, '')), 'B'), 
        plainto_tsquery('english', $${count})
      ) AS rank
    FROM products p
    JOIN users u ON p.seller_id = u.id
    WHERE p.seller_id = $1 AND p.status = 'active'
  `;

  // Search
  if (search) {
    values.push(search);
    count++;
    query += ` AND (
      to_tsvector('english', coalesce(p.name, '')) || 
      to_tsvector('english', coalesce(p.description, ''))
    ) @@ plainto_tsquery('english', $${count - 1})`;
  } else {
    // Nếu không search thì rank = 0
    query = `
      SELECT 
        p.id, p.name, p.description, p.price, p.stock, p.category, 
        p.average_rating, p.review_count, p.created_at,
        u.id AS seller_id, u.username AS seller_name, u.avatar_url AS seller_avatar,
        (SELECT COUNT(*) FROM follows WHERE seller_id = u.id) AS seller_followers_count,
        COALESCE((SELECT ROUND(AVG(average_rating)::numeric, 2) FROM products WHERE seller_id = u.id AND status = 'active' AND average_rating > 0), 0) AS seller_average_rating,
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY created_at ASC LIMIT 1) AS first_image,
        COALESCE((SELECT json_agg(json_build_object('id', h.id, 'tag', h.tag) ORDER BY h.tag) FROM hashtags h JOIN product_hashtags ph ON h.id = ph.hashtag_id WHERE ph.product_id = p.id), '[]'::json) AS hashtags,
        0 AS rank
      FROM products p
      JOIN users u ON p.seller_id = u.id
      WHERE p.seller_id = $1 AND p.status = 'active'
    `;
  }

  // Filter category (nhiều category)
  if (category) {
    const categories = Array.isArray(category) ? category : [category];
    const categoryPlaceholders = categories.map(() => `$${count++}`).join(',');
    values.push(...categories);
    query += ` AND p.category IN (${categoryPlaceholders})`;
  }

  // Paging
  const offset = (parseInt(page) - 1) * parseInt(limit);
  query += ` ORDER BY rank DESC, p.created_at DESC LIMIT $${count} OFFSET $${count + 1}`;
  values.push(parseInt(limit), offset);

  const { rows } = await db.query(query, values);

  return rows;
};

/**
 * [UC02.3 - Get Product By ID with Seller Info (Optimized with Subqueries)]
 */
exports.findProductById = async (id) => {
  const query = `
    SELECT 
      p.id, p.name, p.description, p.price, p.stock, p.category, 
      p.average_rating, p.review_count, p.created_at,
      u.id AS seller_id, u.username AS seller_name, u.avatar_url AS seller_avatar,
      (SELECT COUNT(*) FROM follows WHERE seller_id = u.id) AS seller_followers_count,
      COALESCE((SELECT ROUND(AVG(average_rating)::numeric, 2) FROM products WHERE seller_id = u.id AND status = 'active' AND average_rating > 0), 0) AS seller_average_rating
    FROM products p
    JOIN users u ON p.seller_id = u.id
    WHERE p.id = $1 AND p.status = 'active';
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

/**
 * [UC03.3 - Update Product]
 */
exports.updateProduct = async (productId, userId, productData) => {
  const product = await this.findProductOwner(productId);

  if (!product) {
    throw new Error('Product not found');
  }
  if (product.seller_id !== userId) {
    throw new Error('Forbidden: You are not the owner of this product.');
  }

  const { name, description, price, stock, category } = productData;
  const updateQuery = `
    UPDATE products
    SET 
      name = $1, 
      description = $2, 
      price = $3, 
      stock = $4, 
      category = $5,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING *;
  `;
  try {
    const { rows } = await db.query(updateQuery, [
      name,
      description,
      price,
      stock,
      category,
      productId,
    ]);
    const updatedProduct = rows[0];

    emitter.emit('product.updated', updatedProduct);

    logger.info(`Product ${productId} updated by owner ${userId}`);
    return updatedProduct;
  } catch (error) {
    logger.error(`Error in updateProduct: ${error.message}`);
    throw error;
  }
};

/**
 * [UC03.2 - Delete Product (Hard Delete)]
 */
exports.deleteProductLogically = async (productId, userId) => {
  try {
    // First, get all images for this product to cleanup files
    const images = await this.getProductImages(productId);

    const query = `
      DELETE FROM products
      WHERE id = $1 AND seller_id = $2
      RETURNING id;
    `;

    const { rows } = await db.query(query, [productId, userId]);

    if (rows.length === 0) {
      throw new Error('Forbidden: Product not found or you are not the owner.');
    }

    const deletedProduct = rows[0];

    // Delete image files from storage
    images.forEach(image => deleteFileFromStorage(image.image_url));

    emitter.emit('product.deleted', {
      productId: deletedProduct.id
    });

    logger.info(`Product ${productId} permanently deleted by owner ${userId}`);
    return deletedProduct;
  } catch (error) {
    logger.error(`Error in deleteProductLogically: ${error.message}`);
    throw error;
  }
};


exports.findProductOwner = async (productId) => {
  const query = 'SELECT seller_id FROM products WHERE id = $1';
  const { rows } = await db.query(query, [productId]);
  return rows[0];
};

/**
 * [UC03 - Add Product Images]
 * imageFiles: Array of Express.Multer.File objects
 */
exports.addProductImages = async (productId, imageFiles) => {
  if (!imageFiles || imageFiles.length === 0) {
    return [];
  }

  const imageUrls = imageFiles.map(
    (file) => `/uploads/products/${file.filename}`
  );

  const insertQuery = `
    INSERT INTO product_images (product_id, image_url)
    VALUES ${imageUrls.map((_, index) => `($1, $${index + 2})`).join(',')}
    RETURNING *;
  `;

  try {
    const values = [productId, ...imageUrls];
    const { rows } = await db.query(insertQuery, values);

    logger.info(`Added ${rows.length} images to product ${productId}`);
    return rows;
  } catch (error) {
    logger.error(`Error in addProductImages: ${error.message}`);
    throw error;
  }
};

/**
 * [UC03 - Get Product Images]
 */
exports.getProductImages = async (productId) => {
  const query = `
    SELECT id, product_id, image_url, created_at
    FROM product_images
    WHERE product_id = $1
    ORDER BY created_at ASC;
  `;
  try {
    const { rows } = await db.query(query, [productId]);
    return rows;
  } catch (error) {
    logger.error(`Error in getProductImages: ${error.message}`);
    throw error;
  }
};

/**
 * [UC03 - Get Product By ID with Images and Seller Info (Optimized with Subqueries)]
 */
exports.getProductByIdWithImages = async (id) => {
  const query = `
    SELECT 
      p.id, p.name, p.description, p.price, p.stock, p.category, 
      p.average_rating, p.review_count, p.created_at,
      u.id AS seller_id, u.username AS seller_name, u.avatar_url AS seller_avatar,
      (SELECT COUNT(*) FROM follows WHERE seller_id = u.id) AS seller_followers_count,
      COALESCE((SELECT ROUND(AVG(average_rating)::numeric, 2) FROM products WHERE seller_id = u.id AND status = 'active' AND average_rating > 0), 0) AS seller_average_rating
    FROM products p
    JOIN users u ON p.seller_id = u.id
    WHERE p.id = $1 AND p.status = 'active';
  `;
  try {
    const { rows } = await db.query(query, [id]);
    const product = rows[0];

    if (product) {
      // Get all images for this product
      product.images = await this.getProductImages(product.id);
      // Get all hashtags for this product
      product.hashtags = await this.getProductHashtags(product.id);
    }

    return product;
  } catch (error) {
    logger.error(`Error in getProductByIdWithImages: ${error.message}`);
    throw error;
  }
};

/**
 * [UC03 - Delete Product Image]
 */
exports.deleteProductImage = async (imageId, productId) => {
  const query = `
    DELETE FROM product_images
    WHERE id = $1 AND product_id = $2
    RETURNING *;
  `;
  try {
    const { rows } = await db.query(query, [imageId, productId]);

    if (rows.length > 0) {
      // Delete file from storage
      deleteFileFromStorage(rows[0].image_url);
      logger.info(`Image ${imageId} deleted from product ${productId}`);
    }

    return rows[0];
  } catch (error) {
    logger.error(`Error in deleteProductImage: ${error.message}`);
    throw error;
  }
};

/**
 * [UC03 - Update Product with New Images]
 */
exports.updateProductWithImages = async (productId, userId, productData, imageFiles = []) => {
  const product = await this.findProductOwner(productId);

  if (!product) {
    throw new Error('Product not found');
  }
  if (product.seller_id !== userId) {
    throw new Error('Forbidden: You are not the owner of this product.');
  }

  const { name, description, price, stock, category } = productData;
  const updateQuery = `
    UPDATE products
    SET 
      name = $1, 
      description = $2, 
      price = $3, 
      stock = $4, 
      category = $5,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING *;
  `;
  try {
    const { rows } = await db.query(updateQuery, [
      name,
      description,
      price,
      stock,
      category,
      productId,
    ]);
    const updatedProduct = rows[0];

    // Add new images if provided
    if (imageFiles && imageFiles.length > 0) {
      await this.addProductImages(productId, imageFiles);
    }

    emitter.emit('product.updated', updatedProduct);

    logger.info(`Product ${productId} updated by owner ${userId}`);
    return updatedProduct;
  } catch (error) {
    logger.error(`Error in updateProductWithImages: ${error.message}`);
    throw error;
  }
};

/**
 * [UC03 - Get Product Hashtags]
 */
exports.getProductHashtags = async (productId) => {
  const query = `
    SELECT h.id, h.tag
    FROM hashtags h
    JOIN product_hashtags ph ON h.id = ph.hashtag_id
    WHERE ph.product_id = $1
    ORDER BY h.tag ASC;
  `;
  try {
    const { rows } = await db.query(query, [productId]);
    return rows;
  } catch (error) {
    logger.error(`Error in getProductHashtags: ${error.message}`);
    throw error;
  }
};

/**
 * [UC03 - Add Hashtags to Product]
 * tags: Array of hashtag strings (e.g., ['electronics', 'sale'])
 */
exports.addHashtagsToProduct = async (productId, userId, tags) => {
  // Verify ownership
  const product = await this.findProductOwner(productId);

  if (!product) {
    throw new Error('Product not found');
  }
  if (product.seller_id !== userId) {
    throw new Error('Forbidden: You are not the owner of this product.');
  }

  if (!tags || tags.length === 0) {
    return [];
  }

  // Normalize tags (lowercase, trim)
  const normalizedTags = tags.map(tag => tag.toLowerCase().trim()).filter(tag => tag.length > 0);

  try {
    // Start transaction
    await db.query('BEGIN');

    // Insert/get hashtags from hashtags table
    const hashtagIds = [];
    for (const tag of normalizedTags) {
      const hashtagQuery = `
        INSERT INTO hashtags (tag) VALUES ($1)
        ON CONFLICT (tag) DO UPDATE SET tag = EXCLUDED.tag
        RETURNING id;
      `;
      const { rows } = await db.query(hashtagQuery, [tag]);
      hashtagIds.push(rows[0].id);
    }

    // Insert product_hashtags relationships (ignore duplicates)
    for (const hashtagId of hashtagIds) {
      const productHashtagQuery = `
        INSERT INTO product_hashtags (product_id, hashtag_id)
        VALUES ($1, $2)
        ON CONFLICT (product_id, hashtag_id) DO NOTHING;
      `;
      await db.query(productHashtagQuery, [productId, hashtagId]);
    }

    await db.query('COMMIT');

    emitter.emit('product.hashtags.updated', { productId, tags: normalizedTags });
    logger.info(`Added hashtags to product ${productId}: ${normalizedTags.join(', ')}`);

    // Return hashtags with IDs
    return await this.getProductHashtags(productId);
  } catch (error) {
    await db.query('ROLLBACK');
    logger.error(`Error in addHashtagsToProduct: ${error.message}`);
    throw error;
  }
};

/**
 * [UC03 - Remove Hashtag from Product]
 */
exports.removeHashtagFromProduct = async (productId, userId, hashtagId) => {
  // Verify ownership
  const product = await this.findProductOwner(productId);

  if (!product) {
    throw new Error('Product not found');
  }
  if (product.seller_id !== userId) {
    throw new Error('Forbidden: You are not the owner of this product.');
  }

  const query = `
    DELETE FROM product_hashtags
    WHERE product_id = $1 AND hashtag_id = $2
    RETURNING *;
  `;
  try {
    const { rows } = await db.query(query, [productId, hashtagId]);

    if (rows.length > 0) {
      logger.info(`Hashtag ${hashtagId} removed from product ${productId}`);
    }

    return rows[0];
  } catch (error) {
    logger.error(`Error in removeHashtagFromProduct: ${error.message}`);
    throw error;
  }
};

/**
 * [UC03 - Delete Multiple Product Images]
 * imageIds: Array of image IDs to delete
 */
exports.deleteMultipleProductImages = async (productId, imageIds) => {
  if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
    throw new Error('Image IDs must be a non-empty array');
  }

  const placeholders = imageIds.map((_, i) => `$${i + 2}`).join(',');
  const query = `
    DELETE FROM product_images
    WHERE product_id = $1 AND id IN (${placeholders})
    RETURNING *;
  `;

  try {
    const values = [productId, ...imageIds];
    const { rows } = await db.query(query, values);

    // Delete files from storage
    rows.forEach(row => deleteFileFromStorage(row.image_url));

    logger.info(`Deleted ${rows.length} images from product ${productId}`);
    return rows;
  } catch (error) {
    logger.error(`Error in deleteMultipleProductImages: ${error.message}`);
    throw error;
  }
};

/**
 * [UC03 - Delete All Product Images]
 */
exports.deleteAllProductImages = async (productId) => {
  const query = `
    DELETE FROM product_images
    WHERE product_id = $1
    RETURNING *;
  `;

  try {
    const { rows } = await db.query(query, [productId]);

    // Delete files from storage
    rows.forEach(row => deleteFileFromStorage(row.image_url));

    logger.info(`Deleted all ${rows.length} images from product ${productId}`);
    return rows;
  } catch (error) {
    logger.error(`Error in deleteAllProductImages: ${error.message}`);
    throw error;
  }
};

/**
 * [NEW - Get All Product Categories]
 */
exports.getProductCategories = async () => {
  const categories = [
    "Phone",
    "Electronics",
    "Laptop",
    "Fashion",
    "Tablet",
    "Accessories",
    "Watch",
    "Shoes",
    "Handbag",
    "Cosmetics",
    "Health",
    "Sports",
    "Furniture",
  ];

  const categoryMap = categories.reduce((acc, category, index) => {
    acc[category] = index;
    return acc;
  }, {});

  return categoryMap;

  // return categories
};