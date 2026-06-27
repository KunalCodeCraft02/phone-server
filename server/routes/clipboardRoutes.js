const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { syncClipboard, getClipboard, deleteClipboard } = require('../controllers/clipboardController');

router.post('/sync', protect, syncClipboard);
router.get('/', protect, getClipboard);
router.delete('/:id', protect, deleteClipboard);

module.exports = router;
