// controllers/AdminController.js - Handles admin panel logic
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

// Renders the main admin dashboard page
exports.renderAdminDashboard = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();
        res.render('admin/dashboard', {
            totalProducts,
            totalUsers,
            isAdmin: req.session.isAdmin,
            userId: req.session.userId
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Renders the products management page
exports.renderAdminProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('admin/products', {
            products,
            isAdmin: req.session.isAdmin,
            userId: req.session.userId
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Renders the form to add a new product
exports.renderAddProduct = (req, res) => {
    res.render('admin/add-product', {
        isAdmin: req.session.isAdmin,
        userId: req.session.userId
    });
};

// Handles adding a new product via a POST request
exports.addProduct = async (req, res) => {
    const { name, description, price, imageUrl, stock } = req.body;
    try {
        const newProduct = new Product({
            name,
            description,
            price,
            imageUrl,
            stock
        });
        await newProduct.save();
        res.redirect('/admin/products');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding product.');
    }
};

// Renders the form to edit an existing product
exports.renderEditProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Product not found.');
        }
        res.render('admin/edit-product', {
            product,
            isAdmin: req.session.isAdmin,
            userId: req.session.userId
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Handles updating a product via a POST request
exports.editProduct = async (req, res) => {
    const { name, description, price, imageUrl, stock } = req.body;
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Product not found.');
        }
        product.name = name;
        product.description = description;
        product.price = price;
        product.imageUrl = imageUrl;
        product.stock = stock;
        await product.save();
        res.redirect('/admin/products');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating product.');
    }
};

// Handles deleting a product via a POST request
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/admin/products');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting product.');
    }
};

// Renders the page with a list of all orders
exports.renderAdminOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'username').populate('items.product', 'name');
        res.render('admin/orders', {
            orders,
            isAdmin: req.session.isAdmin,
            userId: req.session.userId
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
