// Using Sequelize to connect to the database that uses mysql2 behind the scenes
const Sequelize = require('sequelize');

// create a new sequelize instance
const sequelize = new Sequelize('node-complete', 'root', 'toor', {
  dialect: 'mysql',
  host: 'localhost',
});

// export the database connection pool, that is managed with sequelize
module.exports = sequelize;
