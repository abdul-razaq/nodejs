const path = require('path');
// This route handles the creation of products
const express = require('express');

// router is like a mini express app that we can connect to our express app
const router = express.Router();

// const rootDir = require('../utils/path');

const adminController = require('../controllers/admin');

router.get('/add-product', adminController.getAddProduct);

router.post('/add-product', adminController.postAddProduct);

router.get('/products', adminController.getAllProducts);

router.get('/edit-product/:productId', adminController.getEditProduct);

// router.post('/edit-product', adminController.postEditProduct);

// router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;
