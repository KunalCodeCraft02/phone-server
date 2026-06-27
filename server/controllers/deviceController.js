const Device = require('../models/Device');
const ActivityLog = require('../models/ActivityLog');

exports.registerDevice = async (req, res) => {
  try {
    const { deviceName, androidVersion, model, battery, storage, appVersion } = req.body;

    if (!deviceName) {
      return res.status(400).json({ success: false, message: 'deviceName is required' });
    }

    const device = await Device.create({
      user: req.user._id,
      deviceName,
      androidVersion: androidVersion || '',
      model: model || '',
      battery: battery || 100,
      storage: storage || '',
      appVersion: appVersion || '',
      lastSeen: new Date(),
      isOnline: true,
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'device_register',
      details: `Registered device: ${deviceName}`,
      deviceId: device._id.toString(),
    });

    res.status(201).json({ success: true, data: device });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.find({ user: req.user._id }).sort({ lastSeen: -1 });
    res.json({ success: true, data: devices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDevice = async (req, res) => {
  try {
    const { deviceName, androidVersion, model, battery, storage, appVersion, isOnline } = req.body;
    const device = await Device.findOne({ _id: req.params.id, user: req.user._id });

    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }

    if (deviceName) device.deviceName = deviceName;
    if (androidVersion !== undefined) device.androidVersion = androidVersion;
    if (model !== undefined) device.model = model;
    if (battery !== undefined) device.battery = battery;
    if (storage !== undefined) device.storage = storage;
    if (appVersion !== undefined) device.appVersion = appVersion;
    if (isOnline !== undefined) device.isOnline = isOnline;
    device.lastSeen = new Date();

    await device.save();

    if (req.io) {
      req.io.to(`user:${req.user._id}`).emit('device:update', device);
    }

    res.json({ success: true, data: device });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeDevice = async (req, res) => {
  try {
    const device = await Device.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }

    await ActivityLog.create({
      user: req.user._id,
      action: 'device_remove',
      details: `Removed device: ${device.deviceName}`,
      deviceId: device._id.toString(),
    });

    res.json({ success: true, message: 'Device removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
