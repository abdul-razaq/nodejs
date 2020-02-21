const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const app = express();
// Initialize a new session store to store the session in the mongoDB Database
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

// call the csrf function to initialize a csrfProtection middleware
const csrfProtection = csrf();

// setup storage configuration engine for multer on where it will store our images and what filenames to give the images
const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    callback(null, new Date().toISOString() + '-' + file.originalname);
  },
});

// We can set file filters to multer to only allow certain types of files e.g only png, jpeg and not pdf files
const fileFilter = (req, file, callback) => {
  // call the callback with true as argument if we want to store the file
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    callback(null, true);
  } else {
    // call the callback with false as argument if we do not want to store the file
    callback(null, false);
  }
};

// We need to make sure express knows about the templating engine we want to use,
// so we use app.set to set configuration items e.g 'view engine'
app.set('view engine', 'ejs');
// let express know where to find our views
app.set('views', 'views');

// ROUTES MIDDLEWARES / CONTROLLERS
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
// Parse the incoming request body for multipart data (file)
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
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
app.use(flash());

// Register a new middleware so that i can store that user in my request, so that i can use it from anywhere in my app conveniently
// WE USE A MIDDLEWARE TO STORE THE CURRENTLY AUTHENTICATED OR LOGGED-IN USER ON THE SESSION WHICH WAS SET IN OUR POST-LOGIN CONTROLLER TO BE ABLE TO HAVE ACCESS TO THE LOGGED-IN USER AT ANYTIME
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      // use user data that is stored in the session to fetch logged-in user from the database
      req.user = user;
      next();
    })
    .catch(err => {
      throw new Error(err);
    });
});

// Add local data needed in almost all of our views in a custom middleware
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// ROUTES MIDDLEWARES / CONTROLLERS
// Only routes starting with /admin will go to the adminRoutes file
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
// This is a catch all middleware that returns 404
app.use(errorsController.get404);
// Error handling middleware, this middleware gets fired whenever we call next() in any of our controllers and passing an error argument from a catch block in it, express will immediately not pass execution to the nex middleware in line, but pass execution to this error handling middleware
app.use((error, req, res, next) => {
  res.redirect('/500');
});

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
