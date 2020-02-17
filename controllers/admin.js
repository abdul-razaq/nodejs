// Admin related products controller
const Product = require('../models/product');
const mongodb = require('../utils/database');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postAddProduct = async (req, res, next) => {
  // grab the id of the user which is currently logged in that is now stored in the req.user property
  const { _id } = req.user;
  const { title, imageUrl, price, description } = req.body;
  // create a new product from our mongoose Product model and immediately save it to the database
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: _id,
  });
  product
    .save()
    .then(result => {
      console.log('Created product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      if (err) console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  // grab the product we wanna edit and pass in the information into this view
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const { productId } = req.params;
  // Get products that are only created by the currently logged in user in order to edit them
  Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        editing: editMode,
        product,
        isAuthenticated: req.isLoggedIn        
      });
    })
    .catch(err => {
      if (err) console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const { productId } = req.body;
  const { title, price, imageUrl, description } = req.body;
  Product.findById(productId)
    .then(product => {
      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;
      return product.save();
    })
    .then(result => {
      console.log('UPDATED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => {
      if (err) console.log(err);
    });
};

exports.getAllProducts = async (req, res, next) => {
  // Find all Products that only belong to the currently logged in user
  const products = await Product.find();
  res.render('admin/products', { pageTitle: 'All Products', products, isAuthenticated: req.isLoggedIn });
};

exports.postDeleteProduct = async (req, res, next) => {
  const { productId } = req.body;
  // Delete a product that belongs to the currently logged in user
  await Product.findByIdAndRemove(productId);
  console.log('PRODUCT DESTROYED');
  res.redirect('/admin/products');
};
