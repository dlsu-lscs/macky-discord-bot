const mongoose = require('../database').mongoose;

const ConfigSchema = new mongoose.Schema({
  config: {
    type: String,
    default: 'default'
  },
  verify_message_id: {
    type: String
  },
});

module.exports = mongoose.model('config', ConfigSchema);
