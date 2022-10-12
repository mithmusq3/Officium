const mongoose = require('mongoose');
const mongoDB = require('mongodb');

const resumeSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    unique:true
  },
  data: {
    type: mongoose.Schema.Types.Buffer,
    required: true
  },
  contenttype: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const Resume = mongoose.model('resume', resumeSchema);
module.exports = Resume;