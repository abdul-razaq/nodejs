const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// We need to make sure express knows about the templating engine we want to use,
// so we use app.set to set configuration items e.g 'view engine'
app.set('view engine', 'ejs');
// let express know where to find our views
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorsController = require('./controllers/errors');
const sequelize = require('./utils/database');

// Import models so as to create relationships between them
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

// We can serve static files e.g css, js files by registering a new middleware to handle static files using express.static.
// You can also register multiple static folders middleware and express will tunnel any request down each middleware until it hits the file
app.use(express.static(path.join(__dirname, 'public')));

// Register a new middleware so that i can store that user in my request, so that i can use it from anywhere in my app conveniently
app.use((req, res, next) => {
  // This code will only run for incoming request
  User.findByPk(1)
    .then(user => {
      // store the user in a request
      req.user = user;
      next();
    })
    .catch(err => {
      if (err) console.log(err);
    });
});

// Add middleware before our route handling middlewares because the parsing of the body should be done no matter where the request of the body ends up.
// Parse the incoming request body in our express app
app.use(bodyParser.urlencoded({ extended: false }));

// Only routes starting with /admin will go to the adminRoutes file
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// This is a catch all middleware that returns 404
app.use(errorsController.get404);

// Create a relationship between our User and Product model
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
// One Cart can hold multiple products AND one Product can belong to multiple different carts. This Many-to-Many relationship is usually defined in an intermediary table, here it is CartItem
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

// make sure sequelize creates tables from our models and define their schema when our app starts.
sequelize
  .sync()
  .then(result => {
    // create a user after all of our database has been setup
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'Nivans', email: 'nivans@gmail.com' });
    }
    return user;
  })
  .then(user => {
    // create a cart for the user after he has been created
    return user.createCart();
  })
  .then(cart => {
    // start my server only when the tables have been created from our models
    app.listen(3000, () => {
      console.log('Application started.');
    });
  })
  .catch(err => {
    if (err) console.log(err);
  });
