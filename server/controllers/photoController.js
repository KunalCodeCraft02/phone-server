const fs = require('fs');
const path = require('path');
const Photo = require('../models/Photo');
const cloudinary = require('../config/cloudinary');
const ActivityLog = require('../models/ActivityLog');

exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const { deviceId } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'devicecloud/photos',
      resource_type: 'auto',
    });

    fs.unlinkSync(req.file.path);

    const photo = await Photo.create({
      user: req.user._id,
      deviceId: deviceId || 'unknown',
      cloudinaryUrl: result.secure_url,
      publicId: result.public_id,
      filename: req.file.originalname,
      size: result.bytes,
      width: result.width,
      height: result.height,
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'photo_upload',
      details: `Uploaded photo: ${req.file.originalname}`,
      deviceId: deviceId || 'unknown',
    });

    if (req.io) {
      req.io.to(`user:${req.user._id}`).emit('photo:uploaded', photo);
    }

    res.status(201).json({ success: true, data: photo });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPhotos = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const deviceId = req.query.deviceId;

    const query = { user: req.user._id };

    if (deviceId) {
      query.deviceId = deviceId;
    }

    if (search) {
      query.filename = { $regex: search, $options: 'i' };
    }

    const total = await Photo.countDocuments(query);
    const photos = await Photo.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: photos,
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

exports.getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findOne({ _id: req.params.id, user: req.user._id });

    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    res.json({ success: true, data: photo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findOne({ _id: req.params.id, user: req.user._id });

    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    await cloudinary.uploader.destroy(photo.publicId);
    await Photo.findByIdAndDelete(photo._id);

    await ActivityLog.create({
      user: req.user._id,
      action: 'photo_delete',
      details: `Deleted photo: ${photo.filename}`,
      deviceId: photo.deviceId,
    });

    res.json({ success: true, message: 'Photo deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
