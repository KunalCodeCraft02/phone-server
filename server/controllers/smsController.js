const SMS = require('../models/SMS');
const ActivityLog = require('../models/ActivityLog');

exports.sendSMS = async (req, res) => {
  try {
    const { deviceId, sender, receiver, message } = req.body;

    if (!sender || !receiver || !message) {
      return res.status(400).json({ success: false, message: 'sender, receiver and message are required' });
    }

    const sms = await SMS.create({
      user: req.user._id,
      deviceId: deviceId || 'unknown',
      sender,
      receiver,
      message,
      direction: 'sent',
      status: 'sent',
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'sms_send',
      details: `SMS sent to ${receiver}`,
      deviceId: deviceId || 'unknown',
    });

    if (req.io) {
      req.io.to(`user:${req.user._id}`).emit('sms:received', sms);
    }

    res.status(201).json({ success: true, data: sms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSMS = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const deviceId = req.query.deviceId;
    const direction = req.query.direction;

    const query = { user: req.user._id };

    if (deviceId) query.deviceId = deviceId;
    if (direction) query.direction = direction;

    if (search) {
      query.$or = [
        { sender: { $regex: search, $options: 'i' } },
        { receiver: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await SMS.countDocuments(query);
    const smsList = await SMS.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: smsList,
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

exports.deleteSMS = async (req, res) => {
  try {
    const sms = await SMS.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!sms) {
      return res.status(404).json({ success: false, message: 'SMS not found' });
    }

    res.json({ success: true, message: 'SMS deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
