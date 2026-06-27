const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { sendSMS, getSMS, deleteSMS } = require('../controllers/smsController');

router.post('/send', protect, sendSMS);
router.get('/', protect, getSMS);
router.delete('/:id', protect, deleteSMS);

module.exports = router;
