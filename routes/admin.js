const path = require('path');
// This route handles the creation of products
const express = require('express');

// router is like a mini express app that we can connect to our express app
const router = express.Router();

const rootDir = require('../utils/path');

router.get('/add-product', (req, res, next) => {
  res
    .status(200)
    .sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

router.post('/add-product', (req, res, next) => {
  console.log(req.body);
  // Redirect and log the incoming data to the console
  res.redirect('/');
});

module.exports = router;
