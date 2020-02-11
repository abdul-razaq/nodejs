// Admin related products controller
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', { pageTitle: 'Add Product' });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(title, imageUrl, price, description);
  product.save();
  res.redirect('/');
};

exports.editProduct = (req, res, next) => {
  res.render('admin/edit-product', { pageTitle: 'Admin | Edit Product' });
};

exports.getAllProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', { pageTitle: 'All Products', products });
  });
};
