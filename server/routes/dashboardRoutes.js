const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { getStats, getRecentActivity } = require('../controllers/dashboardController');

router.get('/stats', protect, getStats);
router.get('/activity', protect, getRecentActivity);

module.exports = router;
