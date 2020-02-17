const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');

const app = express();
// Initialize a new session store
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

// call the csrf function to initialize a csrfProtection middleware
const csrfProtection = csrf();

// We need to make sure express knows about the templating engine we want to use,
// so we use app.set to set configuration items e.g 'view engine'
app.set('view engine', 'ejs');
// let express know where to find our views
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorsController = require('./controllers/errors');
const User = require('./models/user');

const MONGODB_URI =
  'mongodb+srv://abdulrazaq:assassinscreed01@cluster0-osvnf.mongodb.net/shop';
// ?retryWrites=true&w=majority

// Import models so as to create relationships between them

// We can serve static files e.g css, js files by registering a new middleware to handle static files using express.static.
// You can also register multiple static folders middleware and express will tunnel any request down each middleware until it hits the file
app.use(express.static(path.join(__dirname, 'public')));
// Add middleware before our route handling middlewares because the parsing of the body should be done no matter where the request of the body ends up.
// Parse the incoming request body in our express app
app.use(bodyParser.urlencoded({ extended: false }));
// set up session middleware.
// set resave to false to make sure the session is not saved on every request that is done
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(csrfProtection);

// Use a middleware to store our user in the request
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      // use user data that is stored in the session to fetch a user from the database
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});
// Register a new middleware so that i can store that user in my request, so that i can use it from anywhere in my app conveniently
app.use((req, res, next) => {
  // This code will only run for incoming request
  User.findById('')
    .then(user => {
      // store the user in a request
      req.user = user;
      next();
    })
    .catch(err => {
      if (err) console.log(err);
    });
});

// Add local data needed in almost all of our views in a custom middleware
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Only routes starting with /admin will go to the adminRoutes file
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// This is a catch all middleware that returns 404
app.use(errorsController.get404);

// Setup a mongoose connection to the mongodb database
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(3000, () => {
      // listen for incoming request after mongoose has connected to the database
      console.log('Application started.');
    });
  })
  .catch(error => {
    console.log(error);
  });
