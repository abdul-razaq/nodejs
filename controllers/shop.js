const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = async (req, res, next) => {
  // Used controller to use the Model to fetch some data from the database
  // We then send the data into a view i.e we use the controller to render view with the data
  const products = await Product.findAll();
  res.render('shop/product-list', { pageTitle: 'Shop', products });
};

exports.getProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findByPk(productId);
  res.render('shop/product-detail', {
    product,
    pageTitle: 'Product title',
  });
};

exports.getProductDetails = (req, res, next) => {
  res.render('shop/product-detail', { pageTitle: 'Product Detail' });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      // with the cart available, we can use it to fetch the products that are inside of it.
      return cart
        .getProducts()
        .then(products => {
          res.render('shop/cart', {
            pageTitle: 'Your Cart',
            products: products,
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  // retrieve the product id (details) from this incoming request route
  const { productId } = req.body;
  Product.findById(productId, product => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect('/cart');
  // fetch the product in our database and then add it to our cart model
};

exports.postCartDeleteProduct = (req, res, next) => {
  // Remove the product from the cart and not from the product itself
  const { productId } = req.body;
  Product.findById(productId, product => {
    Cart.deleteProduct(productId, product.price);
    res.redirect('/cart');
  });
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
