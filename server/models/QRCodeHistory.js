const mongoose = require('mongoose');

const qrCodeHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  deviceId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

qrCodeHistorySchema.index({ user: 1, timestamp: -1 });
qrCodeHistorySchema.index({ user: 1, deviceId: 1 });
qrCodeHistorySchema.index({ content: 'text' });

module.exports = mongoose.model('QRCodeHistory', qrCodeHistorySchema);
