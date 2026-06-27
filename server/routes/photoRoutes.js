const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const {
  uploadPhoto,
  getPhotos,
  getPhotoById,
  deletePhoto,
} = require('../controllers/photoController');

router.post('/upload', protect, upload.single('photo'), uploadPhoto);
router.get('/', protect, getPhotos);
router.get('/:id', protect, getPhotoById);
router.delete('/:id', protect, deletePhoto);

module.exports = router;
