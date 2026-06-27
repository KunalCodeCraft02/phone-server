const QRCodeHistory = require('../models/QRCodeHistory');
const ActivityLog = require('../models/ActivityLog');

exports.saveQRScan = async (req, res) => {
  try {
    const { deviceId, content, location } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'content is required' });
    }

    const qr = await QRCodeHistory.create({
      user: req.user._id,
      deviceId: deviceId || 'unknown',
      content,
      location: location || {},
      timestamp: new Date(),
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'qr_scan',
      details: `Scanned QR: ${content.substring(0, 50)}`,
      deviceId: deviceId || 'unknown',
    });

    res.status(201).json({ success: true, data: qr });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQRHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const deviceId = req.query.deviceId;

    const query = { user: req.user._id };

    if (deviceId) query.deviceId = deviceId;

    if (search) {
      query.content = { $regex: search, $options: 'i' };
    }

    const total = await QRCodeHistory.countDocuments(query);
    const history = await QRCodeHistory.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: history,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteQRScan = async (req, res) => {
  try {
    const qr = await QRCodeHistory.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!qr) {
      return res.status(404).json({ success: false, message: 'QR scan not found' });
    }

    res.json({ success: true, message: 'QR scan deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
