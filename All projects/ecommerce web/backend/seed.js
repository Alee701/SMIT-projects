const mongoose = require('mongoose');
const Product = require('../models/product');
require('dotenv').config();

const sampleProducts = [
    {
        name: "Smartphone",
        description: "Latest model with all the new features.",
        price: 699,
        category: "Electronics",
        imageUrl: "https://via.placeholder.com/150"
    },
    {
        name: "Laptop",
        description: "High performance laptop.",
        price: 999,
        category: "Electronics",
        imageUrl: "https://via.placeholder.com/150"
    },
    {
        name: "Headphones",
        description: "Noise cancelling headphones.",
        price: 199,
        category: "Electronics",
        imageUrl: "https://via.placeholder.com/150"
    },
    {
        name: "Book",
        description: "A captivating novel.",
        price: 19,
        category: "Books",
        imageUrl: "https://via.placeholder.com/150"
    },
    {
        name: "T-shirt",
        description: "Comfortable cotton t-shirt.",
        price: 29,
        category: "Clothing",
        imageUrl: "https://via.placeholder.com/150"
    },
    {
        name: "Jeans",
        description: "Stylish denim jeans.",
        price: 49,
        category: "Clothing",
        imageUrl: "https://via.placeholder.com/150"
    },
    {
        name: "Sneakers",
        description: "Comfortable and stylish sneakers.",
        price: 89,
        category: "Clothing",
        imageUrl: "https://via.placeholder.com/150"
    },
    {
        name: "Watch",
        description: "Luxury wristwatch.",
        price: 299,
        category: "Accessories",
        imageUrl: "https://via.placeholder.com/150"
    },
    {
        name: "Backpack",
        description: "Durable and spacious backpack.",
        price: 59,
        category: "Accessories",
        imageUrl: "https://via.placeholder.com/150"
    },
    {
        name: "Sunglasses",
        description: "Stylish sunglasses.",
        price: 99,
        category: "Accessories",
        imageUrl: "https://via.placeholder.com/150"
    }
];

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        return Product.insertMany(sampleProducts);
    })
    .then(() => {
        console.log('Sample products added');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });