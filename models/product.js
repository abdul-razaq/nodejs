const fs = require('fs');
const path = require('path');

module.exports = class Product {
  // Define the shape of a product
  constructor(title) {
    this.title = title;
  }

  save = () => {
    // save product to a file
    const filePath = path.join(
      path.dirname(process.mainModule.filename),
      'data',
      'products.json'
    );
    // store a product to this file
    // get the existing product from the file
    fs.readFile(filePath, (err, fileContent) => {
      let products = [];
      if (!err) {
        products = JSON.parse(fileContent);
      }
      products.push(this);
      // Save the data back into the file
      fs.writeFile(filePath, JSON.stringify(products), err => {
        if (err) console.log(err);
      });
    });
  };

  // retrieve all products from our array
  static fetchAll = callback => {
    const filePath = path.join(
      path.dirname(process.mainModule.filename),
      'data',
      'products.json'
    );
    fs.readFile(filePath, (err, fileContent) => {
      if (err) {
        callback([]);
      }
      callback(JSON.parse(fileContent));
    });
  };
};
