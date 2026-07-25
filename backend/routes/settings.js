const express = require('express');
const Settings = require('../models/Settings');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/', auth, adminOnly, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
      await settings.save();
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/validate-discount', async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    const settings = await Settings.findOne();
    if (!settings) return res.status(404).json({ error: 'Settings not found' });

    const discount = settings.discounts.find(
      d => d.code.toLowerCase() === code.toLowerCase() && d.active
    );

    if (!discount) {
      return res.status(404).json({ error: 'Invalid discount code' });
    }

    if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
      return res.status(400).json({ error: 'Discount code has expired' });
    }

    if (discount.maxUses > 0 && discount.usedCount >= discount.maxUses) {
      return res.status(400).json({ error: 'Discount code has been fully redeemed' });
    }

    if (orderTotal < discount.minOrder) {
      return res.status(400).json({ error: `Minimum order $${discount.minOrder} required` });
    }

    let discountAmount = 0;
    if (discount.type === 'percentage') {
      discountAmount = (orderTotal * discount.value) / 100;
    } else {
      discountAmount = discount.value;
    }

    res.json({
      valid: true,
      code: discount.code,
      type: discount.type,
      value: discount.value,
      discountAmount: Math.round(discountAmount * 100) / 100
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
