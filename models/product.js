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
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});
// Then create a Product Model based on this predefined Product Schema
module.exports = mongoose.model('Product', productSchema);
