// controllers/UserController.js - Handles user registration and login logic
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Renders the registration form page (we'll create this EJS file later)
exports.renderRegisterPage = (req, res) => {
    res.render('register');
};

// Handles user registration
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).send('User with this email already exists.');
        }
        
        // Create a new user instance
        user = new User({ username, email, password });
        
        // The password hashing is handled by the pre-save hook in the User model
        await user.save();
        
        // After successful registration, redirect to the login page
        res.redirect('/login');

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Renders the login form page
exports.renderLoginPage = (req, res) => {
    res.render('login');
};

// Handles user login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid credentials.');
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials.');
        }

        // If credentials are correct, create a session
        req.session.userId = user._id;
        req.session.isAdmin = user.isAdmin;
        
        // Redirect based on user role
        if (user.isAdmin) {
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/products');
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
