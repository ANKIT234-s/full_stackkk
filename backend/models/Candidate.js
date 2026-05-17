const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  experience: {
    type: Number,
    required: true,
  },
  bio: {
    type: String,
  },
  projects: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', CandidateSchema);
