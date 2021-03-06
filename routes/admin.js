const path = require('path');
// This route handles the creation of products by an admin
const express = require('express');
const { body } = require('express-validator/check');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

// router is like a mini express app that we can connect to our express app
const router = express.Router();
// we can add as many middlewares as we want as an argument to our routers, as they get executed from left to right, so any middleware we want to be executed first will be added first in the argument.
router.get('/add-product', isAuth, adminController.getAddProduct);

router.post(
  '/add-product',
  [
    body('title')
      .isAlphanumeric()
      .isLength({ min: 3 })
      .trim(),
    body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 10, max: 400 })
      .trim(),
  ],
  isAuth,
  adminController.postAddProduct
);

router.get('/products', isAuth, adminController.getAllProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post(
  '/edit-product',
  [
    body('title')
      .isAlphanumeric()
      .isLength({ min: 3 })
      .trim(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 10, max: 400 })
      .trim(),
  ],
  isAuth,
  adminController.postEditProduct
);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
