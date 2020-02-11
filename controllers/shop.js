const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  // Used controller to use the Model to fetch some data
  Product.fetchAll(products => {
    // We then send the data into a view i.e we use the controller to render view with the data
    res.render('shop/product-list', { pageTitle: 'Shop', products });
  });
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId, product => {
    res.render('shop/product-detail', {
      product,
      pageTitle: 'Product title',
    });
  });
};

exports.getProductDetails = (req, res, next) => {
  res.render('shop/product-detail', { pageTitle: 'Product Detail' });
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  // retrieve the product id (details) from this incoming request route
  const { productId } = req.body;
  Product.findById(productId, product => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect('/cart')
  // fetch the product in our database and then add it to our cart model
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
