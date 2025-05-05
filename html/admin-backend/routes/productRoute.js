const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');

router.get('/product_get_all', productController.getAllProducts);
router.get('/product_Get:id', productController.getProductById);
router.post('/productCreate', productController.createProduct);
router.put('/product_update:id', productController.updateProduct);
router.delete('/product_delete:id', productController.deleteProduct);

module.exports = router;