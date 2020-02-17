const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  // const isLoggedIn =
  //   req
  //     .get('Cookie')
  //     .split(';')[1]
  //     .trim()
  //     .split('=')[1] === true;
  res.render('auth/login', {
    pageTitle: 'Login',
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('')
    .then(user => {
      req.session.isLoggedIn = true;
      // store the currently authenticated user in the session
      req.session.user = user;
      // We may sometimes need to call save() method on req.session in scenarios where you need to be sure that your session was created before you continue
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    // A function that gets passed to destroy that gets called when it's done destroying the session
    console.log(err);
    res.redirect('/');
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', { pageTitle: 'Signup', isAuthenticated: false });
};

exports.postSignup = (req, res, next) => {
  // When a signup request hits this controller
  // We want to store a new user in the database
  const { email, password, confirmPassword } = req.body;
  // validate the user input first
  // find out if a user with this email address already exists, because we don't want any duplicate emails in our database
  // create a new user if a user with this email does not exist
  User.findOne({ email })
    .then(async userDoc => {
      if (!userDoc) {
        // create a new user object since no user with this email address exists already
        // hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ email, hashedPassword, cart: { items: [] } });
        try {
          const savedUser = await user.save();
          console.log(savedUser);
          // After signing up, redirect the user to the login page
          res.redirect('/login');
        } catch (err) {
          return console.log(err);
        }
      } else {
        res.redirect('/signup');
      }
    })
    .catch(err => {
      console.log(err);
    });
};
