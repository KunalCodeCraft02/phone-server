const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  deviceName: {
    type: String,
    required: true,
  },
  androidVersion: {
    type: String,
    default: '',
  },
  model: {
    type: String,
    default: '',
  },
  battery: {
    type: Number,
    default: 100,
  },
  storage: {
    type: String,
    default: '',
  },
  appVersion: {
    type: String,
    default: '',
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

deviceSchema.index({ user: 1 });

module.exports = mongoose.model('Device', deviceSchema);
