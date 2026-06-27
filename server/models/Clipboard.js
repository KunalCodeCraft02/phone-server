const mongoose = require('mongoose');

const clipboardSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text',
  },
}, { timestamps: true });

clipboardSchema.index({ user: 1, createdAt: -1 });
clipboardSchema.index({ user: 1, deviceId: 1 });
clipboardSchema.index({ content: 'text' });

module.exports = mongoose.model('Clipboard', clipboardSchema);
