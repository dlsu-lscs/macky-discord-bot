const mongoose = require('../database').mongoose;

const userSchema = new mongoose.Schema({
  discord_id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
});

module.exports = mongoose.model('users', userSchema);
