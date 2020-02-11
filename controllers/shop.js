const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  // Used controller to use the Model to fetch some data
  Product.fetchAll(products => {
    // We then send the data into a view i.e we use the controller to render view with the data
    res.render('shop/product-list', { pageTitle: 'Shop', products });
  });
};

exports.getProductDetails = (req, res, next) => {
  res.render('shop/product-detail', { pageTitle: 'Product Detail' });
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', { pageTitle: 'Cart' });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', { pageTitle: 'Your Orders' });
};

exports.getIndex = (req, res, next) => {
  res.render('shop/index', { pageTitle: 'Welcome' });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', { pageTitle: 'Checkout' });
};
