const Contact = require('../models/Contact');
const ActivityLog = require('../models/ActivityLog');

exports.syncContacts = async (req, res) => {
  try {
    const { deviceId, contacts } = req.body;

    if (!contacts || !Array.isArray(contacts)) {
      return res.status(400).json({ success: false, message: 'contacts array is required' });
    }

    const operations = contacts.map((contact) => ({
      updateOne: {
        filter: { user: req.user._id, phone: contact.phone, deviceId: deviceId || 'unknown' },
        update: {
          $set: {
            name: contact.name,
            email: contact.email || '',
            company: contact.company || '',
            phone: contact.phone,
          },
        },
        upsert: true,
      },
    }));

    const result = await Contact.bulkWrite(operations);

    await ActivityLog.create({
      user: req.user._id,
      action: 'contact_sync',
      details: `Synced ${contacts.length} contacts`,
      deviceId: deviceId || 'unknown',
    });

    if (req.io) {
      req.io.to(`user:${req.user._id}`).emit('contact:synced', { count: contacts.length });
    }

    res.json({
      success: true,
      data: {
        matched: result.matchedCount,
        modified: result.modifiedCount,
        upserted: result.upsertedCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const deviceId = req.query.deviceId;

    const query = { user: req.user._id };

    if (deviceId) query.deviceId = deviceId;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: contacts,
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

exports.updateContact = async (req, res) => {
  try {
    const { name, phone, email, company } = req.body;
    const contact = await Contact.findOne({ _id: req.params.id, user: req.user._id });

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    if (name) contact.name = name;
    if (phone !== undefined) contact.phone = phone;
    if (email !== undefined) contact.email = email;
    if (company !== undefined) contact.company = company;

    await contact.save();

    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.exportContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user._id }).sort({ name: 1 });

    let csv = 'Name,Phone,Email,Company\n';
    contacts.forEach((contact) => {
      const name = `"${(contact.name || '').replace(/"/g, '""')}"`;
      const phone = `"${(contact.phone || '').replace(/"/g, '""')}"`;
      const email = `"${(contact.email || '').replace(/"/g, '""')}"`;
      const company = `"${(contact.company || '').replace(/"/g, '""')}"`;
      csv += `${name},${phone},${email},${company}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
