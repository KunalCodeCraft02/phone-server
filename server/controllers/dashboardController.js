const Photo = require('../models/Photo');
const SMS = require('../models/SMS');
const Contact = require('../models/Contact');
const FileItem = require('../models/FileItem');
const QRCodeHistory = require('../models/QRCodeHistory');
const BarcodeHistory = require('../models/BarcodeHistory');
const Clipboard = require('../models/Clipboard');
const Device = require('../models/Device');
const ActivityLog = require('../models/ActivityLog');

exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [photos, sms, contacts, files, qrCodes, barcodes, clips, devices] = await Promise.all([
      Photo.countDocuments({ user: userId }),
      SMS.countDocuments({ user: userId }),
      Contact.countDocuments({ user: userId }),
      FileItem.countDocuments({ user: userId }),
      QRCodeHistory.countDocuments({ user: userId }),
      BarcodeHistory.countDocuments({ user: userId }),
      Clipboard.countDocuments({ user: userId }),
      Device.countDocuments({ user: userId }),
    ]);

    const onlineDevices = await Device.countDocuments({ user: userId, isOnline: true });

    res.json({
      success: true,
      data: {
        photos,
        sms,
        contacts,
        files,
        qrCodes,
        barcodes,
        clipboard: clips,
        devices,
        onlineDevices,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;

    const activity = await ActivityLog.find({ user: req.user._id })
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
