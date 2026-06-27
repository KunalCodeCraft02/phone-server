const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  deviceId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  company: {
    type: String,
    default: '',
  },
}, { timestamps: true });

contactSchema.index({ user: 1, createdAt: -1 });
contactSchema.index({ user: 1, deviceId: 1 });
contactSchema.index({ name: 'text', phone: 'text', email: 'text', company: 'text' });

module.exports = mongoose.model('Contact', contactSchema);
