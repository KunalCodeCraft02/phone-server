const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { registerDevice, getDevices, updateDevice, removeDevice } = require('../controllers/deviceController');

router.post('/register', protect, registerDevice);
router.get('/', protect, getDevices);
router.put('/:id', protect, updateDevice);
router.delete('/:id', protect, removeDevice);

module.exports = router;
