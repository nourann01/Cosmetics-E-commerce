const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_Controller');
const { requireAuth } = require('../middleware/authMiddleware');
const cartController = require('../controllers/cart_controller');
const orderController = require('../controllers/checkout_controller');
const productController = require('../controllers/ProductController');

router.get('/profile', requireAuth, userController.getUserProfile);

router.get('/cart/get/:id', cartController.getCart);
router.post('/cart/add', cartController.addToCart);
router.put('/cart/update', cartController.updateCartItem);
router.delete('/cart/remove/:productId', cartController.removeFromCart);
router.delete('/cart/clear', cartController.clearCart);

router.post('/checkout', orderController.createOrder);

router.get('/products/filter', productController.filterProducts);
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);



module.exports = router;