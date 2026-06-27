const fs = require('fs');
const path = require('path');
const FileItem = require('../models/FileItem');
const cloudinary = require('../config/cloudinary');
const ActivityLog = require('../models/ActivityLog');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const { deviceId, folder } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `devicecloud/files${folder ? '/' + folder : ''}`,
      resource_type: 'auto',
    });

    fs.unlinkSync(req.file.path);

    const fileItem = await FileItem.create({
      user: req.user._id,
      deviceId: deviceId || 'unknown',
      filename: result.public_id.split('/').pop(),
      originalName: req.file.originalname,
      cloudinaryUrl: result.secure_url,
      publicId: result.public_id,
      mimeType: req.file.mimetype,
      size: result.bytes,
      folder: folder || '/',
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'file_upload',
      details: `Uploaded file: ${req.file.originalname}`,
      deviceId: deviceId || 'unknown',
    });

    res.status(201).json({ success: true, data: fileItem });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const deviceId = req.query.deviceId;
    const folder = req.query.folder;

    const query = { user: req.user._id };

    if (deviceId) query.deviceId = deviceId;
    if (folder) query.folder = folder;

    if (search) {
      query.originalName = { $regex: search, $options: 'i' };
    }

    const total = await FileItem.countDocuments(query);
    const files = await FileItem.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: files,
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

exports.downloadFile = async (req, res) => {
  try {
    const file = await FileItem.findOne({ _id: req.params.id, user: req.user._id });

    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    res.redirect(file.cloudinaryUrl);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const file = await FileItem.findOne({ _id: req.params.id, user: req.user._id });

    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    await cloudinary.uploader.destroy(file.publicId, { resource_type: 'auto' });
    await FileItem.findByIdAndDelete(file._id);

    await ActivityLog.create({
      user: req.user._id,
      action: 'file_delete',
      details: `Deleted file: ${file.originalName}`,
      deviceId: file.deviceId,
    });

    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
