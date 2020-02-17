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

exports.postLogin = async (req, res, next) => {
  // extract the user's email address
  const { email, password } = req.body;
  // find a user by the email entered
  try {
    const user = await User.findOne({ email });
    if (user) {
      try {
        // if a user with this email address already exists in the database, check the password received to see it tallies with the hashedPassword stored in the database
        const passwordMatched = await bcrypt.compare(password, user.password);
        // if the entered password matches the hashed password
        if (passwordMatched) {
          // Set a session for the authenticated user if we have a matching password
          // store authentication information in the session so we can use this information in any other requests
          req.session.isLoggedIn = true;
          // Also store the user object in the session
          req.session.user = user;
          // call save to make user our session is created
          return req.session.save(err => {
            console.log(err);
            res.redirect('/');
          });
        } else {
          res.redirect('/login');
        }
      } catch (error) {
        res.redirect('/login');
      }
    } else {
      // If a user with this email is not found redirect the user to the login page
      res.redirect('/login');
    }
  } catch (error) {
    console.log(error);
  }
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
