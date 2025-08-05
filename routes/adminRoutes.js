// routes/adminRoutes.js - Defines the final routes for the admin panel
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminController = require('../controllers/AdminController');

// All routes in this file will be protected by the `isAuthenticated` middleware
// and require the user to be an admin.
router.use(authMiddleware.isAuthenticated);
router.use(authMiddleware.isAdmin);

// GET request to render the admin dashboard
router.get('/dashboard', adminController.renderAdminDashboard);

// GET request to render the product management page
router.get('/products', adminController.renderAdminProducts);

// GET request to render the add product form
router.get('/products/add', adminController.renderAddProduct);

// POST request to handle adding a new product
router.post('/products/add', adminController.addProduct);

// GET request to render the edit product form for a specific product
router.get('/products/edit/:id', adminController.renderEditProduct);

// POST request to handle updating a specific product
router.post('/products/edit/:id', adminController.editProduct);

// POST request to handle deleting a product
router.post('/products/delete/:id', adminController.deleteProduct);

// GET request to render the orders page
router.get('/orders', adminController.renderAdminOrders);

module.exports = router;
