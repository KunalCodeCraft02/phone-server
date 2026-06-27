const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const {
  uploadFile,
  getFiles,
  downloadFile,
  deleteFile,
} = require('../controllers/fileController');

router.post('/upload', protect, upload.single('file'), uploadFile);
router.get('/', protect, getFiles);
router.get('/:id/download', protect, downloadFile);
router.delete('/:id', protect, deleteFile);

module.exports = router;
