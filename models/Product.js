// models/Product.js - Defines the Product model and schema
const mongoose = require('mongoose');

// Define the Product schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0 // Price cannot be a negative number
    },
    imageUrl: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        default: 0,
        min: 0 // Stock cannot be a negative number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create and export the Product model
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
