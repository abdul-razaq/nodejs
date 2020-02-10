const path = require('path');

const express = require('express');

const router = express.Router();

const rootDir = require('../utils/path');
const adminData = require('./admin');

router.get('/', (req, res, next) => {
  const products = adminData.products;
  res.render('shop', { pageTitle: 'Shop', products });
});

module.exports = router;
