const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteName: { type: String, default: "Workin' Man Hat Co." },
  tagline: { type: String, default: "For your every day workin'man" },
  logo: { type: String, default: 'https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1754520881053-GITP2B476NHFI441CJ5Y/IMG_3617.jpeg?format=1500w' },
  favicon: { type: String, default: '' },
  colors: {
    primary: { type: String, default: '#000000' },
    secondary: { type: String, default: '#E1DCC9' },
    accent: { type: String, default: '#412D15' },
    background: { type: String, default: '#E1DCC9' },
    text: { type: String, default: '#000000' },
    darkBg: { type: String, default: '#000000' },
    darkSurface: { type: String, default: '#1F150C' },
    darkText: { type: String, default: '#E1DCC9' }
  },
  tax: {
    rate: { type: Number, default: 8.25 },
    enabled: { type: Boolean, default: true },
    label: { type: String, default: 'Sales Tax' }
  },
  shipping: {
    freeThreshold: { type: Number, default: 75 },
    flatRate: { type: Number, default: 8.99 },
    enabled: { type: Boolean, default: true }
  },
  discounts: [{
    code: { type: String, required: true },
    type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    value: { type: Number, required: true },
    minOrder: { type: Number, default: 0 },
    maxUses: { type: Number, default: -1 },
    usedCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    expiresAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
  }],
  promos: [{
    title: { type: String, required: true },
    description: { type: String, default: '' },
    discountCode: { type: String, default: '' },
    bannerText: { type: String, default: '' },
    active: { type: Boolean, default: true },
    startsAt: { type: Date },
    endsAt: { type: Date }
  }],
  social: {
    instagram: { type: String, default: 'https://www.instagram.com/workinmanhatco/' },
    facebook: { type: String, default: 'https://www.facebook.com/profile.php?id=61578779784429' },
    tiktok: { type: String, default: 'https://www.tiktok.com/@workinmanhatco/' },
    youtube: { type: String, default: '' },
    twitter: { type: String, default: '' }
  },
  contact: {
    email: { type: String, default: 'workinmanhatco@gmail.com' },
    phone: { type: String, default: '' },
    address: { type: String, default: 'Texas, USA' }
  },
  seo: {
    metaTitle: { type: String, default: "Workin' Man Hat Co. | Hats & Apparel for the Everyday Workin' Man" },
    metaDescription: { type: String, default: "Premium hats and apparel built on hard work, American pride, and quality craftsmanship." },
    ogImage: { type: String, default: '' },
    keywords: { type: String, default: 'workin man, hats, caps, american made, apparel' },
    geoRegion: { type: String, default: 'US-TX' },
    geoPlacename: { type: String, default: 'Texas' },
    geoPosition: { type: String, default: '31.0;-100.0' },
    icbm: { type: String, default: '31.0, -100.0' }
  },
  policies: {
    shipping: { type: String, default: 'Free shipping on orders over $75. Standard shipping 3-5 business days.' },
    returns: { type: String, default: '30-day return policy. Items must be unworn with tags attached.' },
    privacy: { type: String, default: '' },
    terms: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
