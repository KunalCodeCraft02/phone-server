const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  deviceId: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  speed: {
    type: Number,
    default: 0,
  },
  accuracy: {
    type: Number,
  },
  battery: {
    type: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

locationSchema.index({ user: 1, timestamp: -1 });
locationSchema.index({ user: 1, deviceId: 1 });

module.exports = mongoose.model('Location', locationSchema);
