const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  deviceId: {
    type: String,
    required: true,
  },
  cloudinaryUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
  },
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },
}, { timestamps: true });

photoSchema.index({ user: 1, createdAt: -1 });
photoSchema.index({ user: 1, deviceId: 1 });
photoSchema.index({ filename: 'text' });

module.exports = mongoose.model('Photo', photoSchema);
