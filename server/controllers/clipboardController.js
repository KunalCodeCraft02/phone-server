const Clipboard = require('../models/Clipboard');
const ActivityLog = require('../models/ActivityLog');

exports.syncClipboard = async (req, res) => {
  try {
    const { deviceId, items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'items array is required' });
    }

    const operations = items.map((item) => ({
      updateOne: {
        filter: { user: req.user._id, content: item.content, deviceId: deviceId || 'unknown' },
        update: {
          $set: {
            content: item.content,
            type: item.type || 'text',
          },
        },
        upsert: true,
      },
    }));

    const result = await Clipboard.bulkWrite(operations);

    await ActivityLog.create({
      user: req.user._id,
      action: 'clipboard_sync',
      details: `Synced ${items.length} clipboard items`,
      deviceId: deviceId || 'unknown',
    });

    if (req.io) {
      req.io.to(`user:${req.user._id}`).emit('clipboard:changed', { count: items.length });
    }

    res.json({
      success: true,
      data: {
        matched: result.matchedCount,
        modified: result.modifiedCount,
        upserted: result.upsertedCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getClipboard = async (req, res) => {
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

    const total = await Clipboard.countDocuments(query);
    const clips = await Clipboard.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: clips,
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

exports.deleteClipboard = async (req, res) => {
  try {
    const clip = await Clipboard.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!clip) {
      return res.status(404).json({ success: false, message: 'Clipboard item not found' });
    }

    res.json({ success: true, message: 'Clipboard item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
