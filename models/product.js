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

  };

  static deleteById = id => {
    
  };

  // retrieve all products from our array
  static fetchAll = callback => {
  };

  static findById = (id, callback) => {
    
  };
};
