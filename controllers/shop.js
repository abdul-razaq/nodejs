const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
  // Used controller to use the Model to fetch some data from the database
  // We then send the data into a view i.e we use the controller to render view with the data
  const products = await Product.fetchAll();
  res.render('shop/product-list', { pageTitle: 'Shop', products });
};

exports.getProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
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
    .then(products => {
      // with the cart available, we can use it to fetch the products that are inside of it.
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        products: products,
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  // ADD PRODUCTS TO THE CART
  const { productId } = req.body;
  // fetch the product by the product id
  Product.findById(productId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  // Remove the product from the cart and not from the product itself
  const { productId } = req.body;
  req.user
    .deleteItemFromCart(productId)
    .then(result => {
      console.log('PRODUCT DELETED');
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  // Take all the cart items and move them into an Order Table
  req.user
    .addOrder()
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  // retrieve the orders and display them on the orders page
  req.user
    .getOrders()
    .then(orders => {
      res.render('shop/orders', { pageTitle: 'Your Orders', orders });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  res.render('shop/index', { pageTitle: 'Welcome' });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', { pageTitle: 'Checkout' });
};
