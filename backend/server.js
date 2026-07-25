require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const settingsRoutes = require('./routes/settings');
const favoritesRoutes = require('./routes/favorites');
const mediaRoutes = require('./routes/media');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), {
  maxAge: '30d',
  immutable: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/media', mediaRoutes);

// SEO: robots.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${req.protocol}://${req.get('host')}/sitemap.xml`);
});

// SEO: sitemap.xml
app.get('/sitemap.xml', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const products = await Product.find({ active: true }).select('slug updatedAt');
    const host = `${req.protocol}://${req.get('host')}`;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${host}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${host}/#/products</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>${host}/#/about</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>${host}/#/contact</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`;

    products.forEach(p => {
      xml += `\n  <url><loc>${host}/#/product/${p.slug}</loc><lastmod>${p.updatedAt.toISOString().split('T')[0]}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
    });

    xml += '\n</urlset>';
    res.type('application/xml');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Error generating sitemap');
  }
});

// JSON-LD structured data endpoint
app.get('/api/schema/:type', async (req, res) => {
  try {
    const Settings = require('./models/Settings');
    const settings = await Settings.findOne() || {};
    const { type } = req.params;

    if (type === 'person') {
      return res.json({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Skyler Smithson',
        url: `${req.protocol}://${req.get('host')}`,
        jobTitle: 'Founder',
        worksFor: {
          '@type': 'Organization',
          name: "Workin' Man Hat Co."
        },
        sameAs: [
          'https://www.instagram.com/skylersmithson/',
          'https://www.facebook.com/skylersmithson/',
          'https://www.tiktok.com/@workinmanhatco/'
        ],
        email: 'workinmanhatco@gmail.com',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Texas',
          addressRegion: 'TX',
          addressCountry: 'US'
        }
      });
    }

    if (type === 'organization') {
      return res.json({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: settings.siteName || "Workin' Man Hat Co.",
        url: `${req.protocol}://${req.get('host')}`,
        logo: settings.logo,
        description: settings.seo?.metaDescription,
        email: settings.contact?.email,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Texas',
          addressRegion: 'TX',
          addressCountry: 'US'
        },
        sameAs: Object.values(settings.social || {}).filter(Boolean)
      });
    }

    if (type === 'website') {
      return res.json({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: settings.siteName || "Workin' Man Hat Co.",
        url: `${req.protocol}://${req.get('host')}`,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${req.protocol}://${req.get('host')}/#/products?search={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      });
    }

    if (type === 'product') {
      const slug = req.query.slug;
      if (!slug) return res.status(400).json({ error: 'slug query param required' });
      const Product = require('./models/Product');
      const product = await Product.findOne({ slug, active: true });
      if (!product) return res.status(404).json({ error: 'Product not found' });
      return res.json({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: product.images?.[0]?.url,
        sku: product.sku,
        brand: {
          '@type': 'Brand',
          name: "Workin' Man Hat Co."
        },
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'USD',
          availability: product.inventory > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          url: `${req.protocol}://${req.get('host')}/#/products/${product.slug}`
        },
        aggregateRating: product.reviewCount > 0 ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount
        } : undefined
      });
    }

    if (type === 'localbusiness') {
      return res.json({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: settings.siteName || "Workin' Man Hat Co.",
        image: settings.logo,
        description: settings.seo?.metaDescription,
        url: `${req.protocol}://${req.get('host')}`,
        email: settings.contact?.email,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Texas',
          addressRegion: 'TX',
          addressCountry: 'US'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: settings.seo?.geo?.latitude || 31.0,
          longitude: settings.seo?.geo?.longitude || -100.0
        },
        sameAs: Object.values(settings.social || {}).filter(Boolean)
      });
    }

    res.status(404).json({ error: 'Schema type not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const adminPath = path.join(__dirname, '..', 'admin');
const frontendPath = path.join(__dirname, '..', 'frontend');

app.use('/admin', express.static(adminPath));
app.use(express.static(frontendPath));

app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(adminPath, 'index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

async function start() {
  let mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || mongoUri.includes('localhost')) {
    console.log('Starting in-memory database...');
    const memDir = path.join('C:\\Users\\Sohaib_LPTP_SSD\\AppData\\Local\\Temp', 'mongo-mem');
    const mongod = await MongoMemoryServer.create({
      instance: { dbDir: memDir }
    });
    mongoUri = mongod.getUri();
  }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  const Product = require('./models/Product');
  const count = await Product.countDocuments();
  if (count === 0) {
    const { seed } = require('./seed/seedCombined');
    await seed();
  } else {
    console.log(`Database has ${count} products. Skipping seed.`);
  }

  app.listen(PORT, () => {
    console.log('');
    console.log('==================================================');
    console.log("  Workin' Man Hat Co. is live!");
    console.log('==================================================');
    console.log(`  Store:   http://localhost:${PORT}`);
    console.log(`  Admin:   http://localhost:${PORT}/admin`);
    console.log(`  Login:   admin@workinman.com / admin123`);
    console.log('==================================================');
  });
}

start().catch(err => {
  console.error('Failed to start:', err);
  process.exit(1);
});
