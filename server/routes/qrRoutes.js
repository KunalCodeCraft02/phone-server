const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { saveQRScan, getQRHistory, deleteQRScan } = require('../controllers/qrController');

router.post('/scan', protect, saveQRScan);
router.get('/', protect, getQRHistory);
router.delete('/:id', protect, deleteQRScan);

module.exports = router;
