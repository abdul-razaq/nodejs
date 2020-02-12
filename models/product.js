const db = require('../utils/database');

const Cart = require('./cart');

module.exports = class Product {
  // Define the shape of a product
  constructor(id, title, imageUrl, price, description) {
    // set an id to be null when a product is first created
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save = () => {
    return db.execute(
      'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.imageUrl, this.description]
    );
  };

  static findById = id => {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  };

  static deleteById = id => {};

  static fetchAll = () => {
    // retrieve all products from our database
    return db.execute('SELECT * FROM products');
  };
};
