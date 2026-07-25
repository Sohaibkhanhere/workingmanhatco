const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  compareAtPrice: { type: Number },
  images: [{ type: String }],
  category: { type: String, required: true, enum: ['Hats', 'Apparel', 'New Arrivals'] },
  tags: [String],
  sizes: [{
    name: String,
    price: Number,
    available: { type: Boolean, default: true }
  }],
  colors: [String],
  sku: { type: String, unique: true },
  stock: { type: Number, default: 100 },
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true }
}, { timestamps: true });

productSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
