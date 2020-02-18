const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

// configure a nodemailer transporter
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: '',
    },
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    pageTitle: 'Login',
    errorMessage: message,
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
      // flash an error message into our session
      req.flash('error', 'Invalid email or password');
      // If a user with this email is not found redirect the user to the login page
      res.redirect('/login');
    }
  } catch (error) {
    console.log(error);
  }
};

exports.postLogout = (req, res, next) => {
  // destroy the currently authenticated user's session
  req.session.destroy(err => {
    // A function that gets passed to destroy that gets called when it's done destroying the session
    console.log(err);
    res.redirect('/');
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', { pageTitle: 'Signup', errorMessage: message });
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
          // send an email to the user after signing up
          transporter
            .sendMail({
              to: email,
              from: 'shop@node-complete.com',
              subject: 'Signup succeeded',
              html: '<h1>You successfully signed up</h1>',
            })
            .then(() => {
              // After signing up, and successfully sending email address to the user... redirect the user to the login page
              res.redirect('/login');
            })
            .catch(err => {
              console.log(error);
            });
        } catch (err) {
          return console.log(err);
        }
      } else {
        req.flash('error', 'Email address already in use by another user');
        res.redirect('/signup');
      }
    })
    .catch(err => {
      console.log(err);
    });
};

// Reset password
exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    pageTitle: 'Reset Password',
    errorMessage: message,
  });
};

exports.postReset = async (req, res, next) => {
  // generate password reset token using crypto node module
  crypto.randomBytes(32, (err, buffer) => {
    // callback function that will get called when it's done
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    // generate a token from the buffer
    const token = buffer.toString('hex');
    // store the token on the user that we plan to reset the password
    // with the email address that we got from the request made to this controller
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        req.flash('error', 'No account with that email was found.');
        return res.redirect('/reset');
      }
      // set the reset token on the user field
      user.resetToken = token;
      // reset token must be in milliseconds
      user.resetTokenExpiration = Date.now() + 3600000;
      await user.save();
      // Now that the resetToken has been saved to the database, send the resetToken email
      res.redirect('/');
      transporter.sendMail({
        to: req.body.email,
        from: 'shop@node-complete.com',
        subject: 'Password reset',
        html: `
          <p>You requested password reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
        `
      })
    } catch (error) {
      console.log(error);
    }
  });
};
