const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  tittle: {
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
  },
  adminid: {
    type: mongoose.Schema.Types.ObjectId
  }
}, { timestamps: true });

const Offer = mongoose.model('Offer', offerSchema);
module.exports = Offer;