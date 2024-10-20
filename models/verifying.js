const mongoose = require('../database').mongoose;

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  status: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('verifying', userSchema);
