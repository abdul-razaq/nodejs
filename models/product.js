const mongodb = require('mongodb');
// Import the database connection pool managed by sequelize
const getDB = require('../utils/database').getDB;

// Define Product model
class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id;
  }

  save() {
    const db = getDB();
    let dbOp;
    if (this._id) {
      // We update the product
      dbOp = db
        .collection('products')
        .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
    } else {
      // Otherwise we create the new product
      dbOp = db.collection('products').insertOne(this);
    }

    return;
    dbOp
      .then(result => {
        console.log(result);
      })
      .catch(err => console.log(err));
  }

  // get my products
  static fetchAll() {
    const db = getDB();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(err => console.log(err));
  }

  static findById(productId) {
    const db = getDB();
    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectId(productId) })
      .next()
      .then(product => {
        console.log(product);
        return product;
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = Product;
