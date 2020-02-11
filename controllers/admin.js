// Admin related products controller
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', { pageTitle: 'Add Product' });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect('/');
};

exports.editProduct = (req, res, next) => {
  res.render('admin/edit-product', { pageTitle: 'Admin | Edit Product' });
};

exports.getAllProducts = (req, res, next) => {
  res.render('admin/products', { pageTitle: 'All Products' });
};
