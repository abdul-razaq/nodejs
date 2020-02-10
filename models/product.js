const products = [];

module.exports = class Product {
  // Define the shape of a product
  constructor(title) {
    this.title = title;
  }

  save = () => {
    products.push(this);
  };

  // retrieve all products from our array
  static fetchAll = () => {
    return products
  };
};
