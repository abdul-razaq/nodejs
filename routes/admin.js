const path = require('path');
// This route handles the creation of products
const express = require('express');

// router is like a mini express app that we can connect to our express app
const router = express.Router();

// const rootDir = require('../utils/path');

const productsController = require('../controllers/products');

router.get('/add-product', productsController.getAddProduct);

router.post('/add-product', productsController.postAddProduct);

module.exports = router;
