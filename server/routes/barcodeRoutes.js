const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { saveBarcodeScan, getBarcodeHistory, deleteBarcodeScan } = require('../controllers/barcodeController');

router.post('/scan', protect, saveBarcodeScan);
router.get('/', protect, getBarcodeHistory);
router.delete('/:id', protect, deleteBarcodeScan);

module.exports = router;
