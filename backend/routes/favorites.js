const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    const idx = user.favorites.indexOf(productId);
    if (idx > -1) {
      user.favorites.splice(idx, 1);
      await user.save();
      res.json({ favorited: false, favorites: user.favorites });
    } else {
      user.favorites.push(productId);
      await user.save();
      res.json({ favorited: true, favorites: user.favorites });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
