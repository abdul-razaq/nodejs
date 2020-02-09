const express = require('express');

const app = express();

// use allows us to add a new middleware function.
app.use((req, res, next) => {
  // This function we pass to 'use' will be executed for every incoming request.
  console.log('In the middleware');
  // next function allows the request to be tunneled down to the next middlware function in line.
  next();
});

app.use((req, res, next) => {
  console.log('In another middleware');
  res.send('<h1>Hello from Express!</h1>');
});

app.listen(3000, () => {
  console.log('Application started.');
});
