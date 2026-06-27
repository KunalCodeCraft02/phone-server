const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  syncContacts,
  getContacts,
  updateContact,
  deleteContact,
  exportContacts,
} = require('../controllers/contactController');

router.post('/sync', protect, syncContacts);
router.get('/', protect, getContacts);
router.put('/:id', protect, updateContact);
router.delete('/:id', protect, deleteContact);
router.get('/export/csv', protect, exportContacts);

module.exports = router;
