const mongodb = require('mongodb');
const getDB = require('../utils/database').getDB;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email) {
    this.name = username;
    this.email = email;
  }

  // save the user to the database
  save() {
    // grab a database connection to the mongodb database
    const db = getDB();
    return db.collection('users').insertOne(this);
  }

  // Find the user by ID
  static findById(userId) {
    const db = getDB();
    return db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) })
      .then(user => {
        console.log(user);
      })
      .catch(err => console.log(err));
  }
}

module.exports = User;
