const mongoose = require('mongoose');

const barcodeHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  deviceId: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  format: {
    type: String,
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

barcodeHistorySchema.index({ user: 1, timestamp: -1 });
barcodeHistorySchema.index({ user: 1, deviceId: 1 });
barcodeHistorySchema.index({ code: 'text' });

module.exports = mongoose.model('BarcodeHistory', barcodeHistorySchema);
