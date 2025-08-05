// routes/productRoutes.js - Defines the final routes for users
const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');
const authMiddleware = require('../middleware/auth');

// GET request to render the page with all products
router.get('/products', productController.renderProductsPage);

// GET request to render the details page for a specific product
router.get('/products/:id', productController.renderProductDetails);

// POST request to add a product to the cart. This route requires authentication.
router.post('/cart/add', authMiddleware.isAuthenticated, productController.addToCart);

// POST request to remove an item from the cart.
router.post('/cart/remove', authMiddleware.isAuthenticated, productController.removeFromCart);

// GET request to render the shopping cart page. This route requires authentication.
router.get('/cart', authMiddleware.isAuthenticated, productController.renderCartPage);

// GET request to render the checkout page.
router.get('/checkout', authMiddleware.isAuthenticated, productController.renderCheckoutPage);

// POST request to place an order.
router.post('/checkout', authMiddleware.isAuthenticated, productController.placeOrder);

module.exports = router;
