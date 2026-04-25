const productService = require('../services/product.service');
const ApiResponse = require('../utils/api.response');
const logger = require('../utils/logger');

// [UC03.1 - Create Product]
exports.createProduct = async (req, res) => {
  const fs = require('fs');
  
  try {
    const sellerId = req.userId;
    const productData = req.body;
    const imageFiles = req.files || [];
    
    // Parse hashtags from body (can be JSON array or comma-separated string)
    let hashtags = [];
    if (req.body.hashtags) {
      if (typeof req.body.hashtags === 'string') {
        hashtags = req.body.hashtags.split(',').map(tag => tag.trim()).filter(tag => tag);
      } else if (Array.isArray(req.body.hashtags)) {
        hashtags = req.body.hashtags;
      }
    }
    
    const product = await productService.createProduct(
      sellerId,
      productData,
      imageFiles,
      hashtags
    );

    // Fetch product with images and hashtags
    const productWithImages = await productService.getProductByIdWithImages(product.id);
    
    return ApiResponse.created(res, 'Product created successfully', productWithImages);
  } catch (error) {
    logger.error(`createProduct Error: ${error.message}`);
    
    // Cleanup uploaded files if product creation failed
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (err) {
          logger.error(`Failed to cleanup file ${file.path}: ${err.message}`);
        }
      });
    }
    
    return ApiResponse.serverError(res, 'Failed to create product');
  }
};

// [UC02.1 / UC02.2 - Get All Products]
exports.getAllProducts = async (req, res) => {
  try {
    // Pass query params (/api/products?search=...&category=...) to service
    const products = await productService.findAllProducts(req.query);
    return ApiResponse.ok(res, 'Products retrieved successfully', products);
  } catch (error) {
    return ApiResponse.serverError(res, 'Failed to retrieve products');
  }
};

// [UC02.1 / UC02.2 - Get My Products (User's uploaded products)]
exports.getMyProducts = async (req, res) => {
  try {
    const sellerId = req.userId;
    const products = await productService.findMyProducts(sellerId, req.query);
    return ApiResponse.ok(res, 'Your products retrieved successfully', products);
  } catch (error) {
    return ApiResponse.serverError(res, 'Failed to retrieve your products');
  }
};

// [UC02.3 - Get Product By ID]
exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductByIdWithImages(req.params.id);
    if (!product) {
      return ApiResponse.notFound(res, 'Product not found');
    }
    return ApiResponse.ok(res, 'Product retrieved successfully', product);
  } catch (error) {
    logger.error(`getProductById Error: ${error.message}`);
    return ApiResponse.serverError(res, 'Failed to retrieve product');
  }
};

// [UC03.3 - Update Product]
exports.updateProduct = async (req, res) => {
  const fs = require('fs');
  
  try {
    const productId = req.params.id;
    const userId = req.userId;
    const productData = req.body;
    const imageFiles = req.files || [];
    
    const updatedProduct = await productService.updateProductWithImages(
      productId,
      userId,
      productData,
      imageFiles
    );

    // Fetch product with images
    const productWithImages = await productService.getProductByIdWithImages(updatedProduct.id);
    
    return ApiResponse.ok(res, 'Product updated successfully', productWithImages);

  } catch (error) {
    logger.error(`updateProduct Error: ${error.message}`);
    
    // Cleanup uploaded files if update failed
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (err) {
          logger.error(`Failed to cleanup file ${file.path}: ${err.message}`);
        }
      });
    }
    
    if (error.message === 'Product not found') {
      return ApiResponse.notFound(res, error.message);
    }
    if (error.message === 'Forbidden: You are not the owner of this product.') {
      return ApiResponse.error(res, 403, error.message);
    }
    return ApiResponse.serverError(res, 'Failed to update product');
  }
};

// [UC03.2 - Delete Product]
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.userId;

    await productService.deleteProductLogically(productId, userId);
    
    return ApiResponse.ok(res, 'Product has been hidden successfully');

  } catch (error) {
    logger.error(`deleteProduct Error: ${error.message}`);
    if (error.message.includes('not found') || error.message.includes('Forbidden')) {
      return ApiResponse.error(res, 403, 'Product not found or you do not have permission.');
    }
    return ApiResponse.serverError(res, 'Failed to delete product');
  }
};

// [UC03 - Delete Product Image]
exports.deleteProductImage = async (req, res) => {
  try {
    const { productId, imageId } = req.params;
    const userId = req.userId;

    // Verify product ownership
    const product = await productService.findProductOwner(productId);
    if (!product || product.seller_id !== userId) {
      return ApiResponse.error(res, 403, 'Forbidden: You are not the owner of this product.');
    }

    await productService.deleteProductImage(imageId, productId);
    
    return ApiResponse.ok(res, 'Image deleted successfully');

  } catch (error) {
    logger.error(`deleteProductImage Error: ${error.message}`);
    return ApiResponse.serverError(res, 'Failed to delete image');
  }
};

// [UC03 - Get Product Images]
exports.getProductImages = async (req, res) => {
  try {
    const { productId } = req.params;

    const images = await productService.getProductImages(productId);
    
    return ApiResponse.ok(res, 'Product images retrieved successfully', images);

  } catch (error) {
    logger.error(`getProductImages Error: ${error.message}`);
    return ApiResponse.serverError(res, 'Failed to retrieve product images');
  }
};

// [UC03 - Add Hashtags to Product]
exports.addHashtags = async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.userId;
    let hashtags = [];

    if (req.body && req.body.hashtags) {
      const hashtagInput = req.body.hashtags;
      
      // If it's a string (form-data sends as string)
      if (typeof hashtagInput === 'string') {
        // Try to parse as JSON array first
        try {
          hashtags = JSON.parse(hashtagInput);
          if (!Array.isArray(hashtags)) {
            hashtags = hashtagInput.split(',').map(tag => tag.trim()).filter(tag => tag);
          }
        } catch (e) {
          // If not JSON, treat as comma-separated string
          hashtags = hashtagInput.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
      } else if (Array.isArray(hashtagInput)) {
        hashtags = hashtagInput;
      }
    }

    if (!hashtags || hashtags.length === 0) {
      return ApiResponse.error(res, 400, 'Hashtags must be a non-empty array or comma-separated string');
    }

    const result = await productService.addHashtagsToProduct(productId, userId, hashtags);
    
    return ApiResponse.ok(res, 'Hashtags added successfully', result);

  } catch (error) {
    logger.error(`addHashtags Error: ${error.message}`);
    if (error.message === 'Product not found') {
      return ApiResponse.notFound(res, error.message);
    }
    if (error.message.includes('Forbidden')) {
      return ApiResponse.error(res, 403, error.message);
    }
    return ApiResponse.serverError(res, 'Failed to add hashtags');
  }
};

// [UC03 - Get Product Hashtags]
exports.getHashtags = async (req, res) => {
  try {
    const { productId } = req.params;

    const hashtags = await productService.getProductHashtags(productId);
    
    return ApiResponse.ok(res, 'Product hashtags retrieved successfully', hashtags);

  } catch (error) {
    logger.error(`getHashtags Error: ${error.message}`);
    return ApiResponse.serverError(res, 'Failed to retrieve hashtags');
  }
};

// [UC03 - Remove Hashtag from Product]
exports.removeHashtag = async (req, res) => {
  try {
    const { productId, hashtagId } = req.params;
    const userId = req.userId;

    await productService.removeHashtagFromProduct(productId, userId, hashtagId);
    
    return ApiResponse.ok(res, 'Hashtag removed successfully');

  } catch (error) {
    logger.error(`removeHashtag Error: ${error.message}`);
    if (error.message === 'Product not found') {
      return ApiResponse.notFound(res, error.message);
    }
    if (error.message.includes('Forbidden')) {
      return ApiResponse.error(res, 403, error.message);
    }
    return ApiResponse.serverError(res, 'Failed to remove hashtag');
  }
};

// [UC03 - Delete Multiple Product Images]
exports.deleteMultipleProductImages = async (req, res) => {
  try {
    const { productId } = req.params;
    const { imageIds } = req.body;
    const userId = req.userId;

    // Verify product ownership
    const product = await productService.findProductOwner(productId);
    if (!product || product.seller_id !== userId) {
      return ApiResponse.error(res, 403, 'Forbidden: You are not the owner of this product.');
    }

    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return ApiResponse.error(res, 400, 'Image IDs must be a non-empty array');
    }

    const deletedImages = await productService.deleteMultipleProductImages(productId, imageIds);
    
    return ApiResponse.ok(res, `${deletedImages.length} images deleted successfully`, deletedImages);

  } catch (error) {
    logger.error(`deleteMultipleProductImages Error: ${error.message}`);
    return ApiResponse.serverError(res, 'Failed to delete images');
  }
};

// [UC03 - Delete All Product Images]
exports.deleteAllProductImages = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;

    // Verify product ownership
    const product = await productService.findProductOwner(productId);
    if (!product || product.seller_id !== userId) {
      return ApiResponse.error(res, 403, 'Forbidden: You are not the owner of this product.');
    }

    const deletedImages = await productService.deleteAllProductImages(productId);
    
    return ApiResponse.ok(res, `All ${deletedImages.length} images deleted successfully`, deletedImages);

  } catch (error) {
    logger.error(`deleteAllProductImages Error: ${error.message}`);
    return ApiResponse.serverError(res, 'Failed to delete all images');
  }
};

// [NEW - Get All Product Categories]
exports.getProductCategories = async (req, res) => {
  try {
    const categories = await productService.getProductCategories();
    return ApiResponse.ok(res, 'Product categories retrieved successfully', categories);
  } catch (error) {
    logger.error(`getProductCategories Error: ${error.message}`);
    return ApiResponse.serverError(res, 'Failed to retrieve product categories');
  }
};