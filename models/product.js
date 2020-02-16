// first import mongoose
const mongoose = require('mongoose');
// next create a Schema (structure) on how your model should look like
const Schema = mongoose.Schema;
// A blueprint of how a product should look like in my application
const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});
// Then create a Product Model based on this predefined Product Schema
module.exports = mongoose.model('Product', productSchema);

// const mongodb = require('mongodb');
// // Import the database connection pool managed by sequelize
// const getDB = require('../utils/database').getDB;

// // Define Product model
// class Product {
//   // pass a userId too to the product when creating a new product
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDB();
//     let dbOp;
//     if (this._id) {
//       // We update the product
//       dbOp = db
//         .collection('products')
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       // Otherwise we create the new product
//       dbOp = db.collection('products').insertOne(this);
//     }

//     return dbOp
//       .then(result => {
//         console.log(result);
//       })
//       .catch(err => console.log(err));
//   }

//   // get my products
//   static fetchAll() {
//     const db = getDB();
//     return db
//       .collection('products')
//       .find()
//       .toArray()
//       .then(products => {
//         console.log(products);
//         return products;
//       })
//       .catch(err => console.log(err));
//   }

//   static findById(productId) {
//     const db = getDB();
//     return db
//       .collection('products')
//       .find({ _id: new mongodb.ObjectId(productId) })
//       .next()
//       .then(product => {
//         console.log(product);
//         return product;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   static deleteById(productId) {
//     const db = getDB();
//     return db
//       .collection('products')
//       .deleteOne({ _id: new mongodb.ObjectId(productId) })
//       .then(result => {
//         console.log('Product Deleted');
//       })
//       .catch(err => console.log(err));
//   }
// }

// module.exports = Product;
