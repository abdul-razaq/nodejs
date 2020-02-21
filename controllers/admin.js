// Admin related products controller
const Product = require('../models/product');
const mongodb = require('../utils/database');

const { validationResult } = require('express-validator/check');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    editing: false,
    hasError: false,
  });
};

exports.postAddProduct = async (req, res, next) => {
  // grab the id of the user which is currently logged in that is now stored in the req.user property
  const { _id } = req.user;
  const { title, price, description } = req.body;
  const image = req.file;

  const errors = validationResult(req);

  // check if multer declined the image
  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      editing: false,
      hasError: true,
      product: {
        title,
        price,
        description,
      },
      errorMessage: 'Attached file is not an image.',
      validationErrors: [],
    });
  }
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      editing: false,
      hasError: true,
      product: {
        title,
        price,
        description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  const imageUrl = image.path;
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
        hasError: false,
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const { productId } = req.body;
  const { title, price, description } = req.body;
  const image = req.file;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      editing: true,
      hasError: true,
      product: {
        title,
        price,
        description,
        productId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Product.findById(productId)
    .then(product => {
      // check to see if the product being edited is owned or created by the currently logged in user
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = title;
      product.price = price;
      // check to see if the image returned from req.file from multer is not undefined, if it is not save the path of that image
      if (image) {
        product.imageUrl = image.path;
      }
      product.description = description;
      return product.save().then(result => {
        console.log('UPDATED PRODUCT');
        res.redirect('/admin/products');
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getAllProducts = async (req, res, next) => {
  // Find all Products that only belong to the currently logged in / authenticated user.
  const products = await Product.find({ userId: req.user._id });
  res.render('admin/products', {
    pageTitle: 'All Products',
    products,
    hasError: false,
  });
};

exports.postDeleteProduct = async (req, res, next) => {
  const { productId } = req.body;
  // Delete a product that belongs to the currently logged in user, we use deleteOne instead of findByIdAndRemove so that we can apply filter
  await Product.deleteOne({ _id: productId, userId: req.user._id });
  console.log('PRODUCT DESTROYED');
  res.redirect('/admin/products');
};
