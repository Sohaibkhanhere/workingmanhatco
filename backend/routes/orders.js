const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/stats/summary', auth, adminOnly, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const shippedOrders = await Order.countDocuments({ status: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    const monthlyRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 12 }
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      recentOrders,
      monthlyRevenue
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const { status, sort, limit, offset } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    let query = Order.find(filter).sort({ createdAt: -1 });
    if (offset) query = query.skip(parseInt(offset));
    if (limit) query = query.limit(parseInt(limit));

    const orders = await query;
    const total = await Order.countDocuments(filter);

    res.json({ orders, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { items, customer, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    let total = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ error: `Product not found: ${item.product}` });
      }

      let itemPrice = product.price;
      if (item.size && product.sizes && product.sizes.length > 0) {
        const sizeOption = product.sizes.find(s => s.name === item.size);
        if (sizeOption) {
          itemPrice = sizeOption.price;
        }
      }

      total += itemPrice * item.quantity;

      processedItems.push({
        product: product._id,
        title: product.title,
        price: itemPrice,
        quantity: item.quantity,
        size: item.size || null,
        color: item.color || null,
        image: product.images[0] || ''
      });
    }

    const order = new Order({
      items: processedItems,
      customer,
      total,
      paymentMethod: paymentMethod || 'cod',
      notes
    });

    await order.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
