// backend/models/Channel.js
const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true, trim: true },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Channel', channelSchema);
