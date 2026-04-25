const express = require('express');
const router = express.Router();
const controller = require('../controllers/product.controller');
const { verifyToken } = require('../middleware/auth.jwt');
const validator = require('../middleware/validator');
const upload = require('../middleware/upload');
const { cleanupOnValidationError } = require('../middleware/fileCleanup');



// [UC03.1 - Create Product with Images]
router.post(
  '/', 
  [
    verifyToken,
    upload.array('images', 5),     // Parse form-data first
    cleanupOnValidationError,      // Cleanup files if validation fails
    validator.productRules(),      // Then validate
    validator.validate             
  ], 
  controller.createProduct
);

// [UC02.1 / UC02.2 - Search/Filter/List]
router.get('/', controller.getAllProducts);

// [UC02.1 / UC02.2 - Get My Products (User's uploaded products)]
router.get(
  '/my-products',
  [verifyToken],
  controller.getMyProducts
);


// [NEW - Get All Product Categories]
router.get('/categories', controller.getProductCategories);

// [UC02.3 - View Product Details with Images]
router.get(
  '/:id', 
  [
    validator.idParamRule('id'),  
    validator.validate
  ], 
  controller.getProductById
);

// [UC03 - Get Product Images]
router.get(
  '/:productId/images',
  [
    validator.idParamRule('productId'),
    validator.validate
  ],
  controller.getProductImages
);

// [UC03.3 - Update Product with New Images]
router.put(
  '/:id', 
  [
    verifyToken,
    upload.array('images', 5),     // Parse form-data first
    cleanupOnValidationError,      // Cleanup files if validation fails
    validator.idParamRule('id'),
    validator.productRules(),      // Then validate
    validator.validate
  ], 
  controller.updateProduct
);

// [UC03 - Delete Product Image]
router.delete(
  '/:productId/images/:imageId',
  [
    verifyToken,
    validator.idParamRule('productId'),
    validator.idParamRule('imageId'),
    validator.validate
  ],
  controller.deleteProductImage
);

// [UC03 - Delete Multiple Product Images]
router.delete(
  '/:productId/images',
  [
    verifyToken,
    validator.idParamRule('productId'),
    validator.validate
  ],
  controller.deleteMultipleProductImages
);

// [UC03 - Delete All Product Images]
router.delete(
  '/:productId/images-all',
  [
    verifyToken,
    validator.idParamRule('productId'),
    validator.validate
  ],
  controller.deleteAllProductImages
);

// [UC03.2 - Delete Product]
router.delete(
  '/:id', 
  [
    verifyToken,                  
    validator.idParamRule('id'),  
    validator.validate
  ], 
  controller.deleteProduct
);

// [UC03 - Add Hashtags to Product]
router.post(
  '/:productId/hashtags',
  [
    verifyToken,
    express.json(),  // Ensure body is parsed as JSON
    validator.idParamRule('productId'),
    validator.validate
  ],
  controller.addHashtags
);

// [UC03 - Get Product Hashtags]
router.get(
  '/:productId/hashtags',
  [
    validator.idParamRule('productId'),
    validator.validate
  ],
  controller.getHashtags
);

// [UC03 - Remove Hashtag from Product]
router.delete(
  '/:productId/hashtags/:hashtagId',
  [
    verifyToken,
    validator.idParamRule('productId'),
    validator.idParamRule('hashtagId'),
    validator.validate
  ],
  controller.removeHashtag
);

module.exports = router;