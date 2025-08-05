// controllers/ProductController.js - Handles user-facing product and cart logic
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

// Renders the page showing all available products
exports.renderProductsPage = async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('products', {
            products,
            isAdmin: req.session.isAdmin,
            userId: req.session.userId
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Renders a page with detailed information about a single product
exports.renderProductDetails = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Product not found.');
        }
        res.render('product-details', {
            product,
            isAdmin: req.session.isAdmin,
            userId: req.session.userId
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Handles adding a product to the user's cart
exports.addToCart = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const { productId } = req.body;
    const userId = req.session.userId;

    try {
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const productIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (productIndex > -1) {
            cart.items[productIndex].quantity += 1;
        } else {
            cart.items.push({ product: productId, quantity: 1 });
        }
        await cart.save();
        res.redirect('/cart');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding item to cart.');
    }
};

// Renders the user's shopping cart page
exports.renderCartPage = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const userId = req.session.userId;

    try {
        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart) {
            return res.render('cart', {
                cart: { items: [] },
                totalPrice: 0,
                isAdmin: req.session.isAdmin,
                userId: req.session.userId
            });
        }

        let totalPrice = 0;
        cart.items.forEach(item => {
            if (item.product) {
                totalPrice += item.product.price * item.quantity;
            }
        });

        res.render('cart', {
            cart,
            totalPrice,
            isAdmin: req.session.isAdmin,
            userId: req.session.userId
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Handles removing an item from the cart
exports.removeFromCart = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const { productId } = req.body;
    const userId = req.session.userId;

    try {
        const cart = await Cart.findOne({ user: userId });
        if (cart) {
            cart.items = cart.items.filter(item => item.product.toString() !== productId);
            await cart.save();
        }
        res.redirect('/cart');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error removing item from cart.');
    }
};

// Renders the checkout page with cart details
exports.renderCheckoutPage = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const userId = req.session.userId;
    try {
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.redirect('/cart');
        }

        let totalPrice = 0;
        cart.items.forEach(item => {
            if (item.product) {
                totalPrice += item.product.price * item.quantity;
            }
        });

        res.render('checkout', {
            cart,
            totalPrice,
            isAdmin: req.session.isAdmin,
            userId: req.session.userId
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Handles processing the checkout and creating an order
exports.placeOrder = async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    const userId = req.session.userId;

    try {
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.redirect('/cart');
        }

        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            priceAtTimeOfPurchase: item.product.price
        }));

        let totalPrice = 0;
        orderItems.forEach(item => {
            totalPrice += item.priceAtTimeOfPurchase * item.quantity;
        });

        const newOrder = new Order({
            user: userId,
            items: orderItems,
            totalPrice
        });

        await newOrder.save();

        cart.items = [];
        await cart.save();

        res.render('order-confirmation', {
            order: newOrder,
            isAdmin: req.session.isAdmin,
            userId: req.session.userId
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error placing order.');
    }
};
