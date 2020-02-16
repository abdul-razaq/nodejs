const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = async (req, res, next) => {
  // Used controller to use the Model to fetch some data from the database
  // We then send the data into a view i.e we use the controller to render view with the data
  const products = await Product.find();
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
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      // with the cart available, we can use it to fetch the products that are inside of it.
      const products = user.cart.items;
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
    .removeFromCart(productId)
    .then(result => {
      console.log('PRODUCT DELETED');
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  // Take all the cart items and move them into an Order Table
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products: products,
      });
      order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  // retrieve the orders that belongs to the currently logged in user.
  Order.find({ 'user.userId': req.user._id })
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
