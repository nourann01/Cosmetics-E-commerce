const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/authMiddleware');
const productController = require('../controllers/ProductController');
const userController = require('../controllers/userController');

router.get('/admin/users', requireAdmin, userController.getUsers);  // GET to retrieve all users
router.get('/admin/users/:id', requireAdmin, userController.getUser);  // GET to retrieve a user by ID
router.post('/admin/users', requireAdmin, userController.createUser);  // POST to create a new user
router.put('/admin/users/:id', requireAdmin, userController.updateUser);  // PUT to update a user
router.delete('/admin/users/:id', requireAdmin, userController.deleteUser);  // DELETE to remove a user

router.get('/admin/product_get_all', requireAdmin, productController.getAllProducts);  // GET to retrieve all products
router.get('/admin/product_Get:id', requireAdmin, productController.getProductById);  // GET to retrieve product by ID
router.post('/admin/productCreate', requireAdmin, productController.createProduct);  // POST to create a new product
router.put('/admin/product_update:id', requireAdmin, productController.updateProduct);  // PUT to update an existing product
router.delete('/admin/product_delete:id', requireAdmin, productController.deleteProduct);  // DELETE to remove a product


module.exports = router;