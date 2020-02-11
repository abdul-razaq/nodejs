// const path = require('path');

const express = require('express');

const router = express.Router();

// const rootDir = require('../utils/path');
const shopController = require('../controllers/shop');

router.get('/', shopController.getIndex);

router.get('/cart', shopController.getCart);

router.get('/orders', shopController.getOrders);

router.get('/products', shopController.getProducts);

router.get('/checkout', shopController.getCheckout);

module.exports = router;
