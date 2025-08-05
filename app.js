// app.js - Final update to include product routes
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes'); // Import product routes

const app = express();
const PORT = process.env.PORT || 3000;

const MONGODB_URI = 'mongodb+srv://hicodib899:1234567goat@cluster0.s0tztr2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// --------------------------------------------------
// MIDDLEWARE SETUP
// --------------------------------------------------

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'a-very-secret-key-for-session',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// A simple middleware to make session variables available in all EJS templates
app.use((req, res, next) => {
    res.locals.userId = req.session.userId;
    res.locals.isAdmin = req.session.isAdmin;
    next();
});

// --------------------------------------------------
// DATABASE CONNECTION
// --------------------------------------------------
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

// --------------------------------------------------
// ROUTES
// --------------------------------------------------

app.get('/', (req, res) => {
    res.render('home');
});

// Use the authentication routes
app.use(authRoutes);

// Use the admin routes, prefixing them with '/admin'
app.use('/admin', adminRoutes);

// Use the product routes
app.use(productRoutes);

// --------------------------------------------------
// SERVER START
// --------------------------------------------------
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
