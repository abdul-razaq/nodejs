// Connect to out MySQL database from our node application
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'node-complete',
  password: 'toor',
});

module.exports = pool.promise();