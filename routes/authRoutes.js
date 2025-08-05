// routes/authRoutes.js - Defines the routes for user authentication
const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

// GET request to render the registration page
router.get('/register', userController.renderRegisterPage);

// POST request to handle user registration form submission
router.post('/register', userController.registerUser);

// GET request to render the login page
router.get('/login', userController.renderLoginPage);

// POST request to handle user login form submission
router.post('/login', userController.loginUser);

// GET request to log out the user by destroying the session
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.redirect('/login');
    });
});

module.exports = router;
