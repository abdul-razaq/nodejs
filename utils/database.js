// Connect to a mongodb database
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

// use MongoClient to connect to our mongoDB database
const mongoConnect = callback => {
  MongoClient.connect(
    'mongodb+srv://abdulrazaq:assassinscreed01@cluster0-osvnf.mongodb.net/shop?retryWrites=true&w=majority'
  )
    .then(client => {
      console.log('Connected to MongoDB');
      _db = client.db();
      callback();
    })
    .catch(err => console.log(err));
};

const getDB = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
