const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart_controller');

// Get user's cart
router.get('/get/:id', cartController.getCart);

// Add product to cart
router.post('/add', cartController.addToCart);

// Update product quantity in cart
router.put('/update', cartController.updateCartItem);

// Remove product from cart
router.delete('/remove/:productId', cartController.removeFromCart);

// Clear cart
router.delete('/clear', cartController.clearCart);

module.exports = router;
