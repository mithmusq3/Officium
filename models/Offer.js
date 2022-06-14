const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Offer = mongoose.model('Offer', offerSchema);
module.exports = Offer;