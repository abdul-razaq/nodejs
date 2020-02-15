const mongodb = require('mongodb');
const getDB = require('../utils/database').getDB;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  // save the user to the database
  save() {
    // grab a database connection to the mongodb database
    const db = getDB();
    return db.collection('users').insertOne(this);
  }
  // store cart items on the user model
  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(item => {
      return item.productId === product._id;
    });
    let newQuantity = 1;
    if (cartProductIndex >= 0) {
      // This means this product already exists
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    }
    const updatedCart = {
      items: [{ productId: new ObjectId(product._id), quantity: 1 }],
    };
    const db = getDB();
    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  // Find the user by ID
  static findById(userId) {
    const db = getDB();
    return db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) })
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => console.log(err));
  }
}

module.exports = User;
