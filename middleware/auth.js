// middleware/auth.js - Middleware to protect routes

// Middleware to check if a user is logged in
exports.isAuthenticated = (req, res, next) => {
    // If a session with userId exists, the user is authenticated
    if (req.session.userId) {
        // Proceed to the next middleware or route handler
        next();
    } else {
        // If not authenticated, redirect to the login page
        res.redirect('/login');
    }
};

// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
    // Check if the user is authenticated and if the isAdmin flag is true
    if (req.session.userId && req.session.isAdmin) {
        // Proceed to the next middleware or route handler
        next();
    } else {
        // If not an admin, send a 403 Forbidden error
        res.status(403).send('Forbidden: You do not have administrator access.');
    }
};
