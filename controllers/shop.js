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
  // ADD PRODUCTS TO THE CART
  const { productId } = req.body;
  // fetch the product by the product id
  Product.findById(productId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => console.log(result))
    .catch(err => console.log(err));
  // let fetchedCart;
  // // get access to the cart
  // req.user
  //   .getCart()
  //   .then(cart => {
  //     fetchedCart = cart;
  //     // find out if the product that you want to add to the cart is already part of the cart, if it is, just increase the quantity, if not, add the cart with the quantity of one
  //     return cart.getProducts({ where: { id: productId } });
  //   })
  //   .then(products => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }
  //     let newQuantity = 1;
  //     if (product) {
  //       // If we have a product, get a quantity for this product and then change it
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return fetchedCart.addProduct(product, {
  //         through: { quantity: newQuantity },
  //       });
  //     }
  //     return Product.findByPk(productId)
  //       .then(product => {
  //         return fetchedCart.addProduct(product, {
  //           through: { quantity: newQuantity },
  //         });
  //       })
  //       .catch(err => console.log(err));
  //   })
  //   .then(() => {
  //     res.redirect('/cart');
  //   })
  //   .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  // Remove the product from the cart and not from the product itself
  const { productId } = req.body;
  req.user
    .getCart()
    .then(cart => {
      // find the product we wanna delete for this user
      return cart.getProducts({ where: { id: productId } });
    })
    .then(products => {
      const product = products[0];
      // Delete the product from the cartItem Junction table and not delete the product from the Product table
      return product.cartItem.destroy();
    })
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
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      // get access to all the products in the cart
      return cart.getProducts();
    })
    .then(products => {
      // move the product into a newly created order
      return req.user
        .createOrder()
        .then(order => {
          // Associate product to that order
          return order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  // retrieve the orders and display them on the orders page
  req.user
    .getOrders({ include: ['products'] })
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
