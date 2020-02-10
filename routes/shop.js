const path = require('path');

const express = require('express');

const router = express.Router();

// const rootDir = require('../utils/path');
const productsController = require('../controllers/products');

router.get('/', productsController.getProducts);

module.exports = router;
