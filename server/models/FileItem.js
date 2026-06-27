const mongoose = require('mongoose');

const fileItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  deviceId: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  originalName: {
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
  mimeType: {
    type: String,
  },
  size: {
    type: Number,
  },
  folder: {
    type: String,
    default: '/',
  },
}, { timestamps: true });

fileItemSchema.index({ user: 1, createdAt: -1 });
fileItemSchema.index({ user: 1, deviceId: 1 });
fileItemSchema.index({ user: 1, folder: 1 });
fileItemSchema.index({ originalName: 'text' });

module.exports = mongoose.model('FileItem', fileItemSchema);
