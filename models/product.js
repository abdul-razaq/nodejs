const fs = require('fs');
const path = require('path');

const filePath = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = callback => {
  fs.readFile(filePath, (err, fileContent) => {
    if (err) {
      callback([]);
    } else {
      callback(JSON.parse(fileContent));
    }
  });
};

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
    getProductsFromFile(products => {
      // check to see if we already have a product with this id
      if (this.id) {
        const existingProductIndex = products.findIndex(
          product => product.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        // Save the data back into the file
        fs.writeFile(filePath, JSON.stringify(updatedProducts), err => {
          if (err) console.log(err);
        });
      } else {
        // generate an id for each product object
        this.id = Math.random().toString();
        products.push(this);
        // Save the data back into the file
        fs.writeFile(filePath, JSON.stringify(products), err => {
          if (err) console.log(err);
        });
      }
    });
    // store a product to this file
    // get the existing product from the file
  };

  // retrieve all products from our array
  static fetchAll = callback => {
    getProductsFromFile(callback);
  };

  static findById = (id, callback) => {
    getProductsFromFile(products => {
      const product = products.find(product => product.id === id);
      callback(product);
    });
  };
};
