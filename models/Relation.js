const mongoose = require('mongoose');

const relationSchema = new mongoose.Schema({
  
  postadminid: {
    type: mongoose.Schema.Types.ObjectId
  },
  offerid: {
    type: mongoose.Schema.Types.ObjectId
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId
  },
  username: {
    type: String
  }
}, { timestamps: true });

const Relation = mongoose.model('Relation', relationSchema);
module.exports = Relation;