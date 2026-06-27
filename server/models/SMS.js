const mongoose = require('mongoose');

const smsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  deviceId: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  direction: {
    type: String,
    enum: ['sent', 'received'],
    required: true,
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'failed'],
    default: 'sent',
  },
}, { timestamps: true });

smsSchema.index({ user: 1, createdAt: -1 });
smsSchema.index({ user: 1, deviceId: 1 });
smsSchema.index({ message: 'text' });

module.exports = mongoose.model('SMS', smsSchema);
