const BarcodeHistory = require('../models/BarcodeHistory');
const ActivityLog = require('../models/ActivityLog');

exports.saveBarcodeScan = async (req, res) => {
  try {
    const { deviceId, code, format, location } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'code is required' });
    }

    const barcode = await BarcodeHistory.create({
      user: req.user._id,
      deviceId: deviceId || 'unknown',
      code,
      format: format || '',
      location: location || {},
      timestamp: new Date(),
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'barcode_scan',
      details: `Scanned barcode: ${code.substring(0, 50)}`,
      deviceId: deviceId || 'unknown',
    });

    res.status(201).json({ success: true, data: barcode });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBarcodeHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const deviceId = req.query.deviceId;

    const query = { user: req.user._id };

    if (deviceId) query.deviceId = deviceId;

    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { format: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await BarcodeHistory.countDocuments(query);
    const history = await BarcodeHistory.find(query)
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

exports.deleteBarcodeScan = async (req, res) => {
  try {
    const barcode = await BarcodeHistory.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!barcode) {
      return res.status(404).json({ success: false, message: 'Barcode scan not found' });
    }

    res.json({ success: true, message: 'Barcode scan deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
