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
const db = require('./utils/database');

// We can serve static files e.g css, js files by registering a new middleware to handle static files using express.static.
// You can also register multiple static folders middleware and express will tunnel any request down each middleware until it hits the file
app.use(express.static(path.join(__dirname, 'public')));

// Add middleware before our route handling middlewares because the parsing of the body should be done no matter where the request of the body ends up.
// Parse the incoming request body in our express app
app.use(bodyParser.urlencoded({ extended: false }));

// Only routes starting with /admin will go to the adminRoutes file
app.use('/admin', adminRoutes);
app.use(shopRoutes);

db.execute('SELECT * FROM products')
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    if (err) console.log(err);
  });

// This is a catch all middleware that returns 404
app.use(errorsController.get404);

app.listen(3000, () => {
  console.log('Application started.');
});
