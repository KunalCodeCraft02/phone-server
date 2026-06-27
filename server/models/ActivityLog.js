const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    default: '',
  },
  deviceId: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

activityLogSchema.index({ user: 1, timestamp: -1 });
activityLogSchema.index({ user: 1, action: 1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
