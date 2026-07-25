// ==========================================
// WORKIN' MAN HAT CO. — Frontend Application
// ==========================================

const state = {
  cart: JSON.parse(localStorage.getItem('wm_cart') || '[]'),
  theme: localStorage.getItem('wm_theme') || 'light',
  products: [],
  currentProduct: null,
  settings: null,
  testimonialIdx: 0,
  testimonialTimer: null
};

const LOGO = 'https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1754520881053-GITP2B476NHFI441CJ5Y/IMG_3617.jpeg?format=1500w';

// --- Utilities ---
function formatPrice(n) { return '$' + (Number(n) || 0).toFixed(2); }

function showToast(msg, type) {
  const c = document.getElementById('toast-container');
  if (!c) return;
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = '<span>' + msg + '</span>';
  c.appendChild(t);
  requestAnimationFrame(() => t.classList.add('is-visible'));
  setTimeout(() => { t.classList.remove('is-visible'); setTimeout(() => t.remove(), 300); }, 3000);
}

async function apiFetch(url, opts) {
  opts = opts || {};
  opts.headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
  const r = await fetch(url, opts);
  if (!r.ok) throw new Error(r.statusText);
  return r.json();
}

function starSVG() { return '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>'; }

function arrowSVG(dir) {
  if (dir === 'left') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>';
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 6 15 12 9 18"/></svg>';
}

function chevronSVG() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>'; }

// --- Router ---
const routes = { '/': renderHome, '/products': renderProducts, '/about': renderAbout, '/contact': renderContact, '/checkout': renderCheckout };

function handleRoute() {
  const hash = window.location.hash.slice(1) || '/';
  const el = document.getElementById('page-content');
  if (!el) return;

  destroyAnimations();
  if (state.testimonialTimer) { clearInterval(state.testimonialTimer); state.testimonialTimer = null; }

  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';

  setTimeout(() => {
    if (hash.startsWith('/product/')) {
      renderProductDetail(el, hash.replace('/product/', ''));
    } else {
      (routes[hash] || renderHome)(el);
    }
    updateActiveNav(hash);
    window.scrollTo({ top: 0 });
    setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 30);
    initLazyImages();
    injectStructuredData(hash);
  }, 200);
}

// --- SEO: JSON-LD Structured Data Injection ---
function injectStructuredData(hash) {
  document.querySelectorAll('script[data-jsonld]').forEach(function(s) { s.remove(); });

  var base = window.location.origin;

  if (hash === '/' || hash === '') {
    addJsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: "Workin' Man Hat Co.",
      url: base,
      potentialAction: {
        '@type': 'SearchAction',
        target: base + '/#/products?search={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    });
    addJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: "Workin' Man Hat Co.",
      url: base,
      logo: LOGO,
      sameAs: [
        'https://www.instagram.com/workinmanhatco/',
        'https://www.facebook.com/profile.php?id=61578779784429',
        'https://www.tiktok.com/@workinmanhatco/'
      ]
    });
  }

  if (hash.startsWith('/product/')) {
    var slug = hash.replace('/product/', '');
    fetchProduct(slug).then(function(p) {
      if (!p) return;
      addJsonLd({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: p.title,
        description: p.description,
        image: p.images && p.images[0] ? p.images[0].url : LOGO,
        sku: p.sku,
        brand: { '@type': 'Brand', name: "Workin' Man Hat Co." },
        offers: {
          '@type': 'Offer',
          price: p.price,
          priceCurrency: 'USD',
          availability: p.inventory > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          url: base + '/#/products/' + p.slug
        },
        aggregateRating: p.reviewCount > 0 ? {
          '@type': 'AggregateRating',
          ratingValue: p.rating,
          reviewCount: p.reviewCount
        } : undefined
      });
    });
  }

  if (hash === '/about') {
    addJsonLd({
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: "About Workin' Man Hat Co.",
      url: base + '/#/about',
      mainEntity: {
        '@type': 'Organization',
        name: "Workin' Man Hat Co.",
        founder: {
          '@type': 'Person',
          name: 'Skyler Smithson',
          jobTitle: 'Founder',
          sameAs: [
            'https://www.instagram.com/skylersmithson/',
            'https://www.facebook.com/skylersmithson/',
            'https://www.tiktok.com/@workinmanhatco/'
          ]
        },
        address: { '@type': 'PostalAddress', addressLocality: 'Texas', addressRegion: 'TX', addressCountry: 'US' }
      }
    });
    addJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Skyler Smithson',
      jobTitle: 'Founder',
      worksFor: { '@type': 'Organization', name: "Workin' Man Hat Co." },
      sameAs: [
        'https://www.instagram.com/skylersmithson/',
        'https://www.facebook.com/skylersmithson/',
        'https://www.tiktok.com/@workinmanhatco/'
      ],
      email: 'workinmanhatco@gmail.com'
    });
  }
}

function addJsonLd(data) {
  var s = document.createElement('script');
  s.type = 'application/ld+json';
  s.dataset.jsonld = '1';
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}

function updateActiveNav(hash) {
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    a.classList.remove('is-active');
    var h = a.getAttribute('href').slice(1);
    if (h === hash || (hash.startsWith('/product') && h === '/products')) a.classList.add('is-active');
  });
}

// --- Lazy image fade-in ---
function initLazyImages() {
  document.querySelectorAll('img[loading="lazy"]').forEach(function(img) {
    if (img.complete) { img.classList.add('is-loaded'); }
    else { img.addEventListener('load', function() { img.classList.add('is-loaded'); }, { once: true }); }
  });
}

// --- API ---
async function fetchProducts(params) {
  params = params || {};
  var qs = new URLSearchParams(params).toString();
  var d = await apiFetch('/api/products?' + qs);
  state.products = d.products || [];
  return d;
}

async function fetchProduct(slug) {
  var d = await apiFetch('/api/products/' + slug);
  state.currentProduct = d.product || d;
  return state.currentProduct;
}

// --- Product Card ---
var _viewingCounts = {};
function getViewingCount(id) {
  if (!_viewingCounts[id]) _viewingCounts[id] = Math.floor(Math.random() * 12) + 3;
  return _viewingCounts[id];
}
function productCard(p, idx) {
  var img = (p.images && p.images[0]) || '';
  var price = (p.sizes && p.sizes.length > 0) ? p.sizes[0].price : p.price;
  var tag = (p.tags && p.tags[0]) || p.category || '';
  var viewing = getViewingCount(p._id);
  var isLow = viewing > 8;
  return '<a href="#/product/' + p.slug + '" class="product-card">' +
    '<div class="product-card__image">' +
    '<img src="' + img + '" alt="' + p.title + '" loading="lazy" width="400" height="533">' +
    '<div class="product-card__badge">' + tag + '</div>' +
    (isLow ? '<div class="product-card__urgency"><svg width="10" height="10" viewBox="0 0 24 24" fill="#c0392b"><circle cx="12" cy="12" r="10"/></svg> Only a few left!</div>' : '') +
    '<button type="button" class="product-card__quick-add" data-quick-add="" data-quick-title="' + p.title.replace(/"/g, '&quot;') + '" data-quick-price="' + price + '" data-quick-img="' + (img || '').replace(/"/g, '&quot;') + '" data-quick-slug="' + p.slug + '">Quick Add</button>' +
    '</div>' +
    '<div class="product-card__info">' +
    '<div class="product-card__brand">Workin\' Man Hat Co.</div>' +
    '<div class="product-card__name">' + p.title + '</div>' +
    '<div class="product-card__price">' + formatPrice(price) + '</div>' +
    '<div class="product-card__social"><span class="product-card__stars">\u2605\u2605\u2605\u2605\u2605</span> <span class="product-card__reviews-count">' + (Math.floor(Math.random() * 40) + 12) + ' reviews</span></div>' +
    '</div></a>';
}

function skeletonCards(n) {
  var s = '';
  for (var i = 0; i < n; i++) {
    s += '<div class="product-card"><div class="skeleton skeleton--image"></div><div class="product-card__info"><div class="skeleton skeleton--text" style="width:40%"></div><div class="skeleton skeleton--heading"></div><div class="skeleton skeleton--text" style="width:30%"></div></div></div>';
  }
  return s;
}

// --- HOME ---
function renderHome(el) {
  el.innerHTML =
    '<section class="hero">' +
      '<div class="hero__bg" style="background-image:url(https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/f4c02976-3f0a-4d66-975f-c6eee8ed8a36/F16BBA54-AF60-4D50-9739-4A570BD208D5.png)"></div>' +
      '<div class="hero__overlay"></div>' +
      '<div class="hero__content">' +
        '<h1 class="hero__title">For your every day workin\'man</h1>' +
        '<p class="hero__subtitle">Premium Hats & Apparel &mdash; Handmade in Texas</p>' +
        '<div class="hero__actions"><a href="#/products" class="btn btn--accent">Shop Now</a><a href="#/about" class="btn btn--white">Our Story</a></div>' +
        '<div style="display:flex;gap:var(--space-xl);justify-content:center;margin-top:var(--space-xl);opacity:0.8;flex-wrap:wrap">' +
          '<div style="display:flex;align-items:center;gap:6px;font-size:0.85rem"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg> Free Shipping $75+</div>' +
          '<div style="display:flex;align-items:center;gap:6px;font-size:0.85rem"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> 100% Quality Guarantee</div>' +
          '<div style="display:flex;align-items:center;gap:6px;font-size:0.85rem"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg> Made in USA</div>' +
        '</div>' +
      '</div>' +
      '<div class="hero__scroll-indicator"><span>Scroll</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="7 13 12 18 17 13"/><polyline points="7 6 12 11 17 6"/></svg></div>' +
    '</section>' +

    '<div class="trust-banner">' +
      '<div class="trust-banner__track">' +
        '<span class="trust-banner__item">★ Handcrafted Quality</span>' +
        '<span class="trust-banner__divider">•</span>' +
        '<span class="trust-banner__item">★ Free Shipping Over $75</span>' +
        '<span class="trust-banner__divider">•</span>' +
        '<span class="trust-banner__item">★ 100% Satisfaction Guarantee</span>' +
        '<span class="trust-banner__divider">•</span>' +
        '<span class="trust-banner__item">★ Texas Strong Since Day One</span>' +
        '<span class="trust-banner__divider">•</span>' +
        '<span class="trust-banner__item">★ Handcrafted Quality</span>' +
        '<span class="trust-banner__divider">•</span>' +
        '<span class="trust-banner__item">★ Free Shipping Over $75</span>' +
        '<span class="trust-banner__divider">•</span>' +
        '<span class="trust-banner__item">★ 100% Satisfaction Guarantee</span>' +
        '<span class="trust-banner__divider">•</span>' +
        '<span class="trust-banner__item">★ Texas Strong Since Day One</span>' +
        '<span class="trust-banner__divider">•</span>' +
        '<span class="trust-banner__item">★ Handcrafted Quality</span>' +
        '<span class="trust-banner__divider">•</span>' +
        '<span class="trust-banner__item">★ Free Shipping Over $75</span>' +
        '<span class="trust-banner__divider">•</span>' +
        '<span class="trust-banner__item">★ 100% Satisfaction Guarantee</span>' +
        '<span class="trust-banner__divider">•</span>' +
        '<span class="trust-banner__item">★ Texas Strong Since Day One</span>' +
        '<span class="trust-banner__divider">•</span>' +
      '</div>' +
    '</div>' +

    '<section class="section featured-products">' +
      '<div class="container">' +
        '<div class="section-header section-header--center">' +
          '<span class="label">Our Collection</span>' +
          '<h2>Featured Gear</h2>' +
          '<p>Handpicked styles for the modern workin\' man</p>' +
        '</div>' +
        '<div class="bento-grid" id="featured-grid">' + skeletonCards(4) + '</div>' +
        '<div style="text-align:center;margin-top:var(--space-2xl)"><a href="#/products" class="btn btn--primary">View All Products</a></div>' +
      '</div>' +
    '</section>' +

    '<section class="section brand-story">' +
      '<div class="container">' +
        '<div class="brand-story__inner">' +
          '<div class="brand-story__image">' +
            '<img src="https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/f4c02976-3f0a-4d66-975f-c6eee8ed8a36/F16BBA54-AF60-4D50-9739-4A570BD208D5.png" alt="Workin\' Man collection" loading="lazy">' +
          '</div>' +
          '<div class="brand-story__content">' +
            '<span class="label">Since Day One</span>' +
            '<h2>Our Story</h2>' +
            '<p>Workin\' Man Hat Co. was born from a simple belief: the everyday workin\' man deserves quality gear that matches his work ethic. Founded by Skyler Smithson in the heart of Texas.</p>' +
            '<p>Every stitch, every cut, every detail is designed with purpose. We\'re not just making hats &mdash; we\'re building a community of hardworking people.</p>' +
            '<a href="#/about" class="btn btn--primary">Learn More</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>' +

    '<section class="section">' +
      '<div class="container">' +
        '<div class="section-header section-header--center">' +
          '<span class="label">Collections</span>' +
          '<h2>Shop by Category</h2>' +
        '</div>' +
        '<div class="categories-grid">' +
          '<a href="#/products?category=Hats" class="category-card"><img src="https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1782667569729-3KH00YRK70BMIYQ0WX96/C6807D21-9765-4674-9A45-5402349A9011.jpeg" alt="Hats" loading="lazy"><div class="category-card__overlay"><div class="category-card__label">Hats</div></div></a>' +
          '<a href="#/products?category=Apparel" class="category-card"><img src="https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/6577b43c-4483-4d19-bbd8-e42816dbec0f/IMG_0339.jpeg" alt="Apparel" loading="lazy"><div class="category-card__overlay"><div class="category-card__label">Apparel</div></div></a>' +
        '</div>' +
      '</div>' +
    '</section>' +

    '<section class="section newsletter">' +
      '<div class="container">' +
        '<span class="label" style="color:var(--color-accent);display:block;margin-bottom:var(--space-sm)">Stay Connected</span>' +
        '<h2>Join the Crew</h2>' +
        '<p>Sign up for exclusive drops, discounts, and behind-the-scenes content.</p>' +
        '<form class="newsletter__form" id="newsletter-form">' +
          '<input type="email" class="newsletter__input" placeholder="Enter your email" required aria-label="Email">' +
          '<button type="submit" class="btn btn--accent">Subscribe</button>' +
        '</form>' +
      '</div>' +
    '</section>' +

    '<section class="section testimonials" id="testimonials-section">' +
      '<div class="container">' +
        '<div class="section-header section-header--center">' +
          '<span class="label">Reviews</span>' +
          '<h2>What People Say</h2>' +
        '</div>' +
        '<div class="testimonial-carousel" id="testimonial-carousel">' +
          '<div class="testimonial-track" id="testimonial-track">' +
            '<div class="testimonial-slide"><div class="testimonial-slide__stars">' + starSVG().repeat(5) + '</div><p class="testimonial-slide__quote">"Best hats I\'ve ever owned. Quality is insane!"</p><div class="testimonial-slide__author">Mike T.</div><div class="testimonial-slide__role">Dallas, TX</div></div>' +
            '<div class="testimonial-slide"><div class="testimonial-slide__stars">' + starSVG().repeat(5) + '</div><p class="testimonial-slide__quote">"Finally a brand that gets the workin\' man lifestyle."</p><div class="testimonial-slide__author">Sarah K.</div><div class="testimonial-slide__role">Houston, TX</div></div>' +
            '<div class="testimonial-slide"><div class="testimonial-slide__stars">' + starSVG().repeat(5) + '</div><p class="testimonial-slide__quote">"Ordered 3 hats, arrived fast and fit perfect."</p><div class="testimonial-slide__author">James R.</div><div class="testimonial-slide__role">Austin, TX</div></div>' +
          '</div>' +
          '<div class="testimonial-nav">' +
            '<button class="testimonial-nav__btn" id="test-prev" aria-label="Previous">' + arrowSVG('left') + '</button>' +
            '<div class="testimonial-dots" id="testimonial-dots">' +
              '<div class="testimonial-dot is-active" data-idx="0"></div>' +
              '<div class="testimonial-dot" data-idx="1"></div>' +
              '<div class="testimonial-dot" data-idx="2"></div>' +
            '</div>' +
            '<button class="testimonial-nav__btn" id="test-next" aria-label="Next">' + arrowSVG('right') + '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>' +

    '<section class="contact-cta">' +
      '<div class="container">' +
        '<h2>Ready to Gear Up?</h2>' +
        '<p>Shop our latest collection and represent the workin\' man lifestyle.</p>' +
        '<a href="#/products" class="btn btn--accent btn--lg">Shop Now</a>' +
      '</div>' +
    '</section>';

  // Load featured products
  fetchProducts({ featured: true, limit: 4 }).then(function(d) {
    var grid = document.getElementById('featured-grid');
    if (grid && d.products.length > 0) {
      grid.innerHTML = d.products.map(productCard).join('');
      initLazyImages();
    }
  }).catch(function() {});

  // Newsletter
  var nl = document.getElementById('newsletter-form');
  if (nl) nl.addEventListener('submit', function(e) { e.preventDefault(); showToast('Thanks for subscribing!'); nl.reset(); });

  // Testimonial carousel
  initTestimonialCarousel();
  initPageAnimations();
}

function initTestimonialCarousel() {
  var track = document.getElementById('testimonial-track');
  var dots = document.querySelectorAll('.testimonial-dot');
  var total = 3;

  function goTo(idx) {
    state.testimonialIdx = (idx + total) % total;
    if (track) track.style.transform = 'translateX(-' + (state.testimonialIdx * 100) + '%)';
    dots.forEach(function(d, i) { d.classList.toggle('is-active', i === state.testimonialIdx); });
  }

  var prev = document.getElementById('test-prev');
  var next = document.getElementById('test-next');
  if (prev) prev.addEventListener('click', function() { goTo(state.testimonialIdx - 1); });
  if (next) next.addEventListener('click', function() { goTo(state.testimonialIdx + 1); });
  dots.forEach(function(d) { d.addEventListener('click', function() { goTo(parseInt(d.dataset.idx)); }); });

  state.testimonialTimer = setInterval(function() { goTo(state.testimonialIdx + 1); }, 5000);
}

// --- PRODUCTS ---
function renderProducts(el) {
  var params = new URLSearchParams(window.location.hash.split('?')[1]);
  var cat = params.get('category') || '';

  el.innerHTML =
    '<section class="section plp">' +
      '<div class="container">' +
        '<div class="plp__header">' +
          '<h1>All Products</h1>' +
          '<div class="plp__sort-bar">' +
            '<span class="plp__result-count" id="result-count"></span>' +
            '<select class="plp__sort-select" id="sort-select"><option value="">Sort: Newest</option><option value="price_asc">Price: Low to High</option><option value="price_desc">Price: High to Low</option></select>' +
          '</div>' +
        '</div>' +
        '<div class="plp__layout">' +
          '<aside class="filter-sidebar" id="filter-sidebar">' +
            '<button class="filter-sidebar__close" id="filter-close" aria-label="Close filters">' + arrowSVG('left') + '</button>' +
            '<div class="filter-group">' +
              '<div class="filter-group__title">Category</div>' +
              '<label class="filter-option"><input type="radio" name="category" value="" ' + (!cat ? 'checked' : '') + '> All</label>' +
              '<label class="filter-option"><input type="radio" name="category" value="Hats" ' + (cat === 'Hats' ? 'checked' : '') + '> Hats</label>' +
              '<label class="filter-option"><input type="radio" name="category" value="Apparel" ' + (cat === 'Apparel' ? 'checked' : '') + '> Apparel</label>' +
              '<label class="filter-option"><input type="radio" name="category" value="Accessories" ' + (cat === 'Accessories' ? 'checked' : '') + '> Accessories</label>' +
            '</div>' +
          '</aside>' +
          '<div class="plp__products" id="products-grid">' + skeletonCards(8) + '</div>' +
        '</div>' +
      '</div>' +
    '</section>';

  loadProducts(cat);

  el.querySelectorAll('input[name="category"]').forEach(function(r) {
    r.addEventListener('change', function() { loadProducts(r.value); });
  });

  var sortSel = document.getElementById('sort-select');
  if (sortSel) sortSel.addEventListener('change', function() {
    var activeCat = document.querySelector('input[name="category"]:checked');
    loadProducts(activeCat ? activeCat.value : '', sortSel.value);
  });

  initPageAnimations();
}

async function loadProducts(cat, sort) {
  var grid = document.getElementById('products-grid');
  if (!grid) return;
  grid.innerHTML = skeletonCards(8);
  try {
    var params = {};
    if (cat) params.category = cat;
    if (sort) params.sort = sort;
    var d = await fetchProducts(params);
    var count = document.getElementById('result-count');
    if (count) count.textContent = d.products.length + ' product' + (d.products.length !== 1 ? 's' : '');
    grid.innerHTML = d.products.length > 0 ? d.products.map(productCard).join('') : '<p style="grid-column:1/-1;text-align:center;color:var(--color-muted);padding:var(--space-3xl) 0">No products found.</p>';
    initLazyImages();
  } catch(e) { grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--color-muted);padding:var(--space-3xl) 0">Failed to load products.</p>'; }
}

// --- PRODUCT DETAIL ---
function renderProductDetail(el, slug) {
  el.innerHTML = '<section class="section pdp"><div class="container"><p style="padding:var(--space-3xl) 0;text-align:center">Loading...</p></div></section>';

  fetchProduct(slug).then(function(p) {
    if (!p) { el.innerHTML = '<section class="section pdp"><div class="container"><p style="padding:var(--space-3xl) 0;text-align:center">Product not found.</p></div></section>'; return; }

    var imgs = p.images || [];
    var sizes = (p.sizes || []).filter(function(s) { return s.name; });
    var colors = p.colors || [];
    var colorMap = { black: '#000', white: '#fff', red: '#c0392b', pink: '#e91e8c', blue: '#2980b9', green: '#27ae60', orange: '#e67e22', yellow: '#f1c40f', gray: '#7f8c8d', grey: '#7f8c8d', brown: '#8B4513', navy: '#2c3e50', beige: '#f5f5dc', cream: '#FFFDD0', tan: '#D2B48C' };

    el.innerHTML =
      '<section class="section pdp">' +
        '<div class="container">' +
          '<div class="pdp__layout">' +
            '<div class="pdp-gallery">' +
              '<div class="pdp-gallery__main" id="main-gallery-img">' +
                '<img src="' + (imgs[0] || '') + '" alt="' + p.title + '" loading="eager">' +
              '</div>' +
              (imgs.length > 1 ? '<div class="pdp-gallery__thumbnails">' + imgs.map(function(img, i) {
                return '<button class="pdp-gallery__thumb' + (i === 0 ? ' is-active' : '') + '" data-image="' + img + '"><img src="' + img + '" alt="" loading="lazy"></button>';
              }).join('') + '</div>' : '') +
            '</div>' +
            '<div class="pdp-info">' +
              '<div class="pdp-info__breadcrumb"><a href="#/products">Shop</a> <span>›</span> <a href="#/products?category=' + (p.category || '') + '">' + (p.category || '') + '</a> <span>›</span> ' + p.title + '</div>' +
              '<h1 class="pdp-info__title">' + p.title + '</h1>' +
              '<div class="pdp-info__reviews"><span class="pdp-info__stars">\u2605\u2605\u2605\u2605\u2605</span><span class="pdp-info__review-count">' + (Math.floor(Math.random() * 60) + 18) + ' reviews</span><span class="pdp-info__viewing"><svg width="12" height="12" viewBox="0 0 24 24" fill="#c0392b"><circle cx="12" cy="12" r="10"/></svg> ' + getViewingCount(p._id) + ' people viewing right now</span></div>' +
              '<div class="pdp-info__price">' + formatPrice(p.price) + '</div>' +
              '<p class="pdp-info__description">' + (p.description || '') + '</p>' +
              (colors.length ? '<div class="pdp-variants"><div class="pdp-variants__label">Color</div><div class="pdp-variants__options" id="color-options">' + colors.map(function(c, i) {
                var bg = colorMap[c.toLowerCase()] || '#999';
                return '<button class="color-swatch' + (i === 0 ? ' is-active' : '') + '" data-color="' + c + '" style="background:' + bg + '" title="' + c + '" aria-label="' + c + '"></button>';
              }).join('') + '</div></div>' : '') +
              (sizes.length ? '<div class="pdp-variants"><div class="pdp-variants__label">Size</div><div class="pdp-variants__options" id="size-options">' + sizes.map(function(s, i) {
                return '<button class="pdp-variant-btn' + (i === 0 ? ' is-active' : '') + '" data-price="' + s.price + '">' + s.name + '</button>';
              }).join('') + '</div></div>' : '') +
              '<div class="pdp-purchase">' +
                '<div class="pdp-variants__label">Quantity</div>' +
                '<div class="pdp-quantity">' +
                  '<button class="pdp-quantity__btn" id="qty-minus" aria-label="Decrease">-</button>' +
                  '<input type="number" class="pdp-quantity__input" value="1" min="1" max="10" id="product-quantity">' +
                  '<button class="pdp-quantity__btn" id="qty-plus" aria-label="Increase">+</button>' +
                '</div>' +
                '<button class="btn btn--primary btn--full btn--lg" id="add-to-cart-btn">Add to Cart</button>' +
              '</div>' +
              '<div class="pdp-info__meta">' +
                (p.sku ? '<span><strong>SKU:</strong> ' + p.sku + '</span>' : '') +
                (p.category ? '<span><strong>Category:</strong> ' + p.category + '</span>' : '') +
              '</div>' +
              '<div class="pdp-info__accordion">' +
                '<div class="pdp-accordion__item is-open">' +
                  '<button class="pdp-accordion__trigger">Shipping & Returns ' + chevronSVG() + '</button>' +
                  '<div class="pdp-accordion__content"><div class="pdp-accordion__content-inner">Free shipping on orders over $75. Standard shipping 3-5 business days. 30-day return policy. Items must be unworn with tags attached.</div></div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>';

    // Gallery
    var mainImg = document.querySelector('#main-gallery-img img');
    el.querySelectorAll('.pdp-gallery__thumb').forEach(function(t) {
      t.addEventListener('click', function() {
        el.querySelectorAll('.pdp-gallery__thumb').forEach(function(x) { x.classList.remove('is-active'); });
        t.classList.add('is-active');
        if (mainImg) mainImg.src = t.dataset.image;
      });
    });

    // Zoom on click
    var galleryMain = document.getElementById('main-gallery-img');
    if (galleryMain && mainImg) {
      galleryMain.addEventListener('click', function() {
        galleryMain.classList.toggle('is-zoomed');
      });
    }

    // Colors
    el.querySelectorAll('.color-swatch').forEach(function(b) {
      b.addEventListener('click', function() {
        el.querySelectorAll('.color-swatch').forEach(function(x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
      });
    });

    // Sizes
    el.querySelectorAll('.pdp-variant-btn').forEach(function(b) {
      b.addEventListener('click', function() {
        el.querySelectorAll('.pdp-variant-btn').forEach(function(x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
      });
    });

    // Qty
    var qtyInput = document.getElementById('product-quantity');
    document.getElementById('qty-minus')?.addEventListener('click', function() { if (qtyInput && parseInt(qtyInput.value) > 1) qtyInput.value = parseInt(qtyInput.value) - 1; });
    document.getElementById('qty-plus')?.addEventListener('click', function() { if (qtyInput && parseInt(qtyInput.value) < 10) qtyInput.value = parseInt(qtyInput.value) + 1; });

    // Add to cart
    document.getElementById('add-to-cart-btn')?.addEventListener('click', function() {
      var activeSize = el.querySelector('.pdp-variant-btn.is-active');
      var sizeName = activeSize ? activeSize.textContent : (sizes[0] ? sizes[0].name : 'One Size');
      var sizePrice = activeSize ? parseFloat(activeSize.dataset.price) : p.price;
      var qty = parseInt(qtyInput ? qtyInput.value : 1);
      addToCart({ _id: p._id, title: p.title, price: sizePrice, images: p.images, slug: p.slug }, sizeName, qty);
      showToast(p.title + ' added to cart!');
    });

    // Accordion
    el.querySelectorAll('.pdp-accordion__trigger').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var item = btn.closest('.pdp-accordion__item');
        if (item) item.classList.toggle('is-open');
      });
    });

    // Related products
    if (p.category) {
      fetchProducts({ category: p.category, limit: 4 }).then(function(d) {
        var related = d.products.filter(function(x) { return x._id !== p._id; }).slice(0, 4);
        if (related.length) {
          var sec = document.createElement('section');
          sec.className = 'section';
          sec.innerHTML = '<div class="container"><div class="section-header section-header--center"><h2>You May Also Like</h2></div><div class="plp__products">' + related.map(productCard).join('') + '</div></div>';
          el.querySelector('.container').appendChild(sec);
          initLazyImages();
        }
      }).catch(function() {});
    }

    initPageAnimations();
  }).catch(function() {
    el.innerHTML = '<section class="section pdp"><div class="container"><p style="padding:var(--space-3xl) 0;text-align:center">Failed to load product.</p></div></section>';
  });
}

// --- ABOUT ---
function renderAbout(el) {
  el.innerHTML =
    '<section class="about-hero">' +
      '<h1>About Us</h1>' +
    '</section>' +

    '<section class="section">' +
      '<div class="container">' +
        '<div class="brand-story__inner" style="gap:var(--space-3xl)">' +
          '<div class="brand-story__image">' +
            '<img src="https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/f4c02976-3f0a-4d66-975f-c6eee8ed8a36/F16BBA54-AF60-4D50-9739-4A570BD208D5.png" alt="Workin\' Man collection" loading="lazy">' +
          '</div>' +
          '<div class="brand-story__content">' +
            '<span class="label">Our Story</span>' +
            '<h2>Built on Hard Work</h2>' +
            '<p>Workin\' Man Hat Co. was born from a simple belief: the everyday workin\' man deserves quality gear that matches his work ethic.</p>' +
            '<p>Founded by Skyler Smithson in the heart of Texas, we craft hats and apparel built for those who show up every single day. Every stitch, every cut, every detail is designed with purpose.</p>' +
            '<p>We\'re not just making products &mdash; we\'re building a community of hardworking people who take pride in what they do.</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>' +

    '<section class="section" style="background:var(--color-surface)">' +
      '<div class="container">' +
        '<div class="brand-story__inner" style="gap:var(--space-3xl);flex-direction:row-reverse">' +
          '<div class="brand-story__image" style="max-width:400px">' +
            '<img src="https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1754520881053-GITP2B476NHFI441CJ5Y/IMG_3617.jpeg?format=800w" alt="Skyler Smithson - Founder" loading="lazy" style="border-radius:var(--radius-lg)">' +
          '</div>' +
          '<div class="brand-story__content">' +
            '<span class="label">Meet the Founder</span>' +
            '<h2>Skyler Smithson</h2>' +
            '<p>What started as a passion project quickly grew into a movement. Skyler built Workin\' Man Hat Co. from the ground up &mdash; driven by a love for quality craftsmanship and a deep respect for the blue-collar lifestyle.</p>' +
            '<p>From late nights designing to early mornings shipping orders, Skyler personally ensures every product meets the standard the workin\' man deserves.</p>' +
            '<div style="display:flex;gap:var(--space-md);margin-top:var(--space-xl);flex-wrap:wrap">' +
              '<a href="https://www.instagram.com/skylersmithson/" target="_blank" rel="noopener" class="btn btn--primary" style="display:inline-flex;align-items:center;gap:8px">' +
                '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>' +
                'Instagram' +
              '</a>' +
              '<a href="https://www.facebook.com/skylersmithson/" target="_blank" rel="noopener" class="btn btn--primary" style="display:inline-flex;align-items:center;gap:8px">' +
                '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>' +
                'Facebook' +
              '</a>' +
              '<a href="https://www.tiktok.com/@workinmanhatco/" target="_blank" rel="noopener" class="btn btn--primary" style="display:inline-flex;align-items:center;gap:8px">' +
                '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>' +
                'TikTok' +
              '</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>' +

    '<section class="section about-values">' +
      '<div class="container">' +
        '<div class="section-header section-header--center"><span class="label">What We Stand For</span><h2>Our Values</h2></div>' +
        '<div class="values-grid">' +
          '<div class="value-card"><div class="value-card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><h3>Quality</h3><p>Premium materials and craftsmanship in every product.</p></div>' +
          '<div class="value-card"><div class="value-card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg></div><h3>American Pride</h3><p>Built in Texas for the workin\' men and women of America.</p></div>' +
          '<div class="value-card"><div class="value-card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div><h3>Community</h3><p>More than a brand &mdash; a movement of hardworking people.</p></div>' +
          '<div class="value-card"><div class="value-card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><h3>Durability</h3><p>Built to last, just like the people who wear them.</p></div>' +
        '</div>' +
      '</div>' +
    '</section>' +

    '<section class="contact-cta">' +
      '<div class="container">' +
        '<h2>Follow the Journey</h2>' +
        '<p>Stay connected with Workin\' Man Hat Co. on social media for drops, behind-the-scenes, and more.</p>' +
        '<div style="display:flex;gap:var(--space-md);justify-content:center;flex-wrap:wrap;position:relative">' +
          '<a href="https://www.instagram.com/workinmanhatco/" target="_blank" rel="noopener" class="btn btn--accent" style="display:inline-flex;align-items:center;gap:8px">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>' +
            'Instagram' +
          '</a>' +
          '<a href="https://www.facebook.com/profile.php?id=61578779784429" target="_blank" rel="noopener" class="btn btn--accent" style="display:inline-flex;align-items:center;gap:8px">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>' +
            'Facebook' +
          '</a>' +
          '<a href="https://www.tiktok.com/@workinmanhatco/" target="_blank" rel="noopener" class="btn btn--accent" style="display:inline-flex;align-items:center;gap:8px">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>' +
            'TikTok' +
          '</a>' +
        '</div>' +
      '</div>' +
    '</section>';
  initPageAnimations();
}

// --- CONTACT ---
function renderContact(el) {
  el.innerHTML =
    '<section class="section">' +
      '<div class="container">' +
        '<div class="section-header section-header--center"><span class="label">Get in Touch</span><h1>Contact Us</h1></div>' +
        '<div class="contact-page__layout">' +
          '<form id="contact-form" class="contact-form" style="display:flex;flex-direction:column;gap:var(--space-xl)">' +
            '<div class="form-row form-row--2"><div class="form-group"><label for="c-name">Name *</label><input type="text" id="c-name" required></div><div class="form-group"><label for="c-email">Email *</label><input type="email" id="c-email" required></div></div>' +
            '<div class="form-group"><label for="c-msg">Message *</label><textarea id="c-msg" rows="5" required style="padding:0.85em 1em;border:1px solid var(--color-border);border-radius:var(--radius-sm);background:var(--color-surface);font-family:inherit;font-size:inherit;min-height:120px;resize:vertical"></textarea></div>' +
            '<button type="submit" class="btn btn--primary btn--full">Send Message</button>' +
          '</form>' +
          '<div class="contact-info">' +
            '<div class="contact-info__item"><div class="contact-info__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div><div class="contact-info__text"><h4>Email</h4><p><a href="mailto:workinmanhatco@gmail.com" style="color:var(--color-accent)">workinmanhatco@gmail.com</a></p></div></div>' +
            '<div class="contact-info__item"><div class="contact-info__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div><div class="contact-info__text"><h4>Location</h4><p>Texas, USA</p></div></div>' +
            '<div class="contact-info__item"><div class="contact-info__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></div><div class="contact-info__text"><h4>Follow Us</h4><p style="display:flex;flex-wrap:wrap;gap:var(--space-sm)"><a href="https://www.instagram.com/workinmanhatco/" target="_blank" rel="noopener" style="color:var(--color-accent)">Instagram</a> &middot; <a href="https://www.facebook.com/profile.php?id=61578779784429" target="_blank" rel="noopener" style="color:var(--color-accent)">Facebook</a> &middot; <a href="https://www.tiktok.com/@workinmanhatco/" target="_blank" rel="noopener" style="color:var(--color-accent)">TikTok</a></p></div></div>' +
            '<div class="contact-info__item"><div class="contact-info__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div><div class="contact-info__text"><h4>Owner</h4><p style="font-weight:600">Skyler Smithson</p></div></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>';
  document.getElementById('contact-form')?.addEventListener('submit', function(e) { e.preventDefault(); showToast('Message sent! We\'ll get back to you soon.'); e.target.reset(); });
  initPageAnimations();
}

// --- CHECKOUT ---
function renderCheckout(el) {
  if (state.cart.length === 0) {
    el.innerHTML = '<section class="section checkout" style="padding-top:calc(var(--nav-height) + var(--space-2xl))"><div class="container" style="text-align:center;padding:var(--space-3xl) 0"><h2>Your cart is empty</h2><p style="margin:var(--space-lg) 0;color:var(--color-muted)">Add some gear to get started.</p><a href="#/products" class="btn btn--primary">Shop Now</a></div></section>';
    return;
  }
  var total = state.cart.reduce(function(s, i) { return s + i.price * i.quantity; }, 0);

  el.innerHTML =
    '<section class="section checkout">' +
      '<div class="container">' +
        '<h1 style="margin-bottom:var(--space-2xl)">Checkout</h1>' +
        '<div class="checkout__layout">' +
          '<form id="checkout-form" class="checkout__form">' +
            '<div>' +
              '<h3 class="checkout__section-title">Shipping Information</h3>' +
              '<div class="form-row form-row--2"><div class="form-group"><label>Name *</label><input type="text" name="name" required></div><div class="form-group"><label>Email *</label><input type="email" name="email" required></div></div>' +
              '<div class="form-group" style="margin-top:var(--space-md)"><label>Phone</label><input type="tel" name="phone"></div>' +
              '<div class="form-group" style="margin-top:var(--space-md)"><label>Address *</label><input type="text" name="address" required></div>' +
              '<div class="form-row form-row--2" style="margin-top:var(--space-md)"><div class="form-group"><label>City *</label><input type="text" name="city" required></div><div class="form-group"><label>State *</label><input type="text" name="state" required></div></div>' +
              '<div class="form-group" style="margin-top:var(--space-md)"><label>ZIP *</label><input type="text" name="zip" required></div>' +
            '</div>' +
            '<button type="submit" class="btn btn--primary btn--full btn--lg">Place Order &mdash; ' + formatPrice(total) + '</button>' +
            '<div class="checkout__trust">' +
              '<div class="checkout__trust-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> SSL Encrypted</div>' +
              '<div class="checkout__trust-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> 30-Day Guarantee</div>' +
              '<div class="checkout__trust-item"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg> Free Returns</div>' +
            '</div>' +
          '</form>' +
          '<div class="checkout__summary">' +
            '<h3>Order Summary</h3>' +
            state.cart.map(function(item) {
              return '<div class="checkout-summary-item">' +
                '<div class="checkout-summary-item__img"><img src="' + (item.images && item.images[0] ? item.images[0] : '') + '" alt="" loading="lazy"></div>' +
                '<div><div class="checkout-summary-item__name">' + item.title + '</div><div class="checkout-summary-item__variant">' + (item.size || 'One Size') + ' &times; ' + item.quantity + '</div></div>' +
                '<div class="checkout-summary-item__price">' + formatPrice(item.price * item.quantity) + '</div>' +
              '</div>';
            }).join('') +
            '<div class="checkout__summary-totals"><div class="total"><span>Total</span><span>' + formatPrice(total) + '</span></div></div>' +
            (total >= 75 ? '<div class="checkout__free-ship"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#27ae60" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Your order qualifies for <strong>FREE shipping!</strong></div>' : '<div class="checkout__free-ship"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg> Add <strong>$' + (75 - total).toFixed(2) + '</strong> more for free shipping</div>') +
            '<div class="checkout__guarantee"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><div><strong>100% Satisfaction Guarantee</strong><p>If you\'re not happy, we\'ll make it right. 30-day hassle-free returns.</p></div></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>';

  document.getElementById('checkout-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    var fd = new FormData(e.target);
    try {
      await apiFetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: state.cart.map(function(i) { return { product: i._id, size: i.size, quantity: i.quantity }; }),
          customer: { name: fd.get('name'), email: fd.get('email'), phone: fd.get('phone'), address: fd.get('address'), city: fd.get('city'), state: fd.get('state'), zip: fd.get('zip') }
        })
      });
      state.cart = []; saveCart(); updateCartUI();
      showToast('Order placed! Thank you!');
      window.location.hash = '#/';
    } catch(e) { showToast('Order failed. Please try again.'); }
  });
  initPageAnimations();
}

// --- CART ---
function addToCart(product, size, qty) {
  var existing = state.cart.findIndex(function(i) { return i._id === product._id && i.size === size; });
  if (existing >= 0) { state.cart[existing].quantity += qty; }
  else { state.cart.push({ _id: product._id, title: product.title, price: product.price, images: product.images, slug: product.slug, size: size, quantity: qty }); }
  saveCart(); updateCartUI(); toggleCart(true);
}

function saveCart() { localStorage.setItem('wm_cart', JSON.stringify(state.cart)); }

function updateCartUI() {
  var count = state.cart.reduce(function(s, i) { return s + i.quantity; }, 0);
  var total = state.cart.reduce(function(s, i) { return s + i.price * i.quantity; }, 0);
  var countEl = document.getElementById('cart-count');
  var countDrawer = document.getElementById('cart-count-drawer');
  var totalEl = document.getElementById('cart-total');
  var items = document.getElementById('cart-items');
  var checkoutBtn = document.getElementById('cart-checkout');

  if (countEl) { countEl.textContent = count; countEl.style.display = count > 0 ? 'flex' : 'none'; }
  if (countDrawer) countDrawer.textContent = count;
  if (totalEl) totalEl.textContent = formatPrice(total);

  // Free shipping progress bar
  var shippingEl = document.getElementById('shipping-progress');
  if (shippingEl) {
    var freeShippingThreshold = 75;
    if (state.cart.length === 0) {
      shippingEl.innerHTML = '';
    } else if (total >= freeShippingThreshold) {
      shippingEl.innerHTML = '<div class="shipping-progress__bar"><div class="shipping-progress__fill" style="width:100%"></div></div><div class="shipping-progress__text shipping-progress__text--done"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> You\'ve unlocked <strong>FREE shipping!</strong></div>';
    } else {
      var remaining = (freeShippingThreshold - total).toFixed(2);
      var pct = Math.min((total / freeShippingThreshold) * 100, 100);
      shippingEl.innerHTML = '<div class="shipping-progress__bar"><div class="shipping-progress__fill" style="width:' + pct + '%"></div></div><div class="shipping-progress__text">Add <strong>$' + remaining + '</strong> more for <strong>FREE shipping!</strong></div>';
    }
  }

  if (!items) return;

  if (state.cart.length === 0) {
    items.innerHTML = '<div class="cart-drawer__empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg><p>Your cart is empty</p></div>';
    if (checkoutBtn) checkoutBtn.style.display = 'none';
  } else {
    if (checkoutBtn) checkoutBtn.style.display = '';
    items.innerHTML = state.cart.map(function(item, i) {
      return '<div class="cart-item">' +
        '<div class="cart-item__image"><img src="' + (item.images && item.images[0] ? item.images[0] : '') + '" alt="" loading="lazy"></div>' +
        '<div class="cart-item__details">' +
          '<div class="cart-item__name">' + item.title + '</div>' +
          '<div class="cart-item__variant">' + (item.size || 'One Size') + '</div>' +
          '<div class="cart-item__qty">' +
            '<button data-idx="' + i + '" class="cart-qty-minus">-</button>' +
            '<span>' + item.quantity + '</span>' +
            '<button data-idx="' + i + '" class="cart-qty-plus">+</button>' +
          '</div>' +
        '</div>' +
        '<div style="text-align:right">' +
          '<div class="cart-item__price">' + formatPrice(item.price * item.quantity) + '</div>' +
          '<button data-idx="' + i + '" class="cart-item__remove">Remove</button>' +
        '</div>' +
      '</div>';
    }).join('');

    items.querySelectorAll('.cart-qty-minus').forEach(function(b) {
      b.addEventListener('click', function() {
        var idx = parseInt(b.dataset.idx);
        if (state.cart[idx].quantity > 1) state.cart[idx].quantity--;
        else state.cart.splice(idx, 1);
        saveCart(); updateCartUI();
      });
    });
    items.querySelectorAll('.cart-qty-plus').forEach(function(b) {
      b.addEventListener('click', function() {
        var idx = parseInt(b.dataset.idx);
        state.cart[idx].quantity++;
        saveCart(); updateCartUI();
      });
    });
    items.querySelectorAll('.cart-item__remove').forEach(function(b) {
      b.addEventListener('click', function() {
        state.cart.splice(parseInt(b.dataset.idx), 1);
        saveCart(); updateCartUI();
      });
    });
  }
}

function toggleCart(open) {
  var drawer = document.getElementById('cart-drawer');
  var overlay = document.getElementById('cart-overlay');
  if (open) {
    if (drawer) drawer.classList.add('is-open');
    if (overlay) { overlay.classList.add('is-open'); overlay.setAttribute('aria-hidden', 'false'); }
    document.body.style.overflow = 'hidden';
  } else {
    if (drawer) drawer.classList.remove('is-open');
    if (overlay) { overlay.classList.remove('is-open'); overlay.setAttribute('aria-hidden', 'true'); }
    document.body.style.overflow = '';
  }
}

// --- THEME ---
function initTheme() {
  var saved = localStorage.getItem('wm_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  state.theme = saved;
}

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('wm_theme', state.theme);
}

// --- Premium GSAP Animations ---
function initPageAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Section headers with stagger
  gsap.utils.toArray('.section-header').forEach(function(h) {
    var tl = gsap.timeline({ scrollTrigger: { trigger: h, start: 'top 85%', toggleActions: 'play none none none' } });
    var label = h.querySelector('.label');
    var heading = h.querySelector('h2');
    var para = h.querySelector('p');
    if (label) tl.from(label, { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' });
    if (heading) tl.from(heading, { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');
    if (para) tl.from(para, { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3');
  });

  // Product cards with stagger batch
  gsap.utils.toArray('.product-card').forEach(function(c, i) {
    gsap.from(c, { scrollTrigger: { trigger: c, start: 'top 92%' }, y: 60, opacity: 0, scale: 0.95, duration: 0.7, delay: (i % 4) * 0.1, ease: 'power3.out' });
  });

  // Brand story parallax split
  gsap.utils.toArray('.brand-story__image').forEach(function(w) {
    gsap.from(w, { scrollTrigger: { trigger: w, start: 'top 85%', end: 'bottom 20%', scrub: 1 }, x: -80, opacity: 0, scale: 0.95, duration: 1 });
  });

  gsap.utils.toArray('.brand-story__content').forEach(function(t) {
    gsap.from(t, { scrollTrigger: { trigger: t, start: 'top 85%', end: 'bottom 20%', scrub: 1 }, x: 80, opacity: 0, duration: 1 });
  });

  // Category cards with scale + rotate
  gsap.utils.toArray('.category-card').forEach(function(c, i) {
    gsap.from(c, { scrollTrigger: { trigger: c, start: 'top 88%' }, scale: 0.85, opacity: 0, rotation: i % 2 === 0 ? -3 : 3, duration: 0.7, delay: i * 0.12, ease: 'back.out(1.4)' });
  });

  // Testimonial carousel
  gsap.utils.toArray('.testimonial-carousel').forEach(function(c) {
    gsap.from(c, { scrollTrigger: { trigger: c, start: 'top 85%' }, y: 50, opacity: 0, duration: 0.9, ease: 'power3.out' });
  });

  // CTA section with scale
  gsap.utils.toArray('.contact-cta').forEach(function(c) {
    gsap.from(c, { scrollTrigger: { trigger: c, start: 'top 85%' }, y: 40, opacity: 0, scale: 0.98, duration: 0.8, ease: 'power3.out' });
  });

  // Newsletter
  gsap.utils.toArray('.newsletter').forEach(function(n) {
    gsap.from(n, { scrollTrigger: { trigger: n, start: 'top 85%' }, y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' });
  });

  // Hero — cinematic entrance
  var heroTitle = document.querySelector('.hero__title');
  var heroSub = document.querySelector('.hero__subtitle');
  var heroCta = document.querySelector('.hero__actions');
  var heroScroll = document.querySelector('.hero__scroll-indicator');
  if (heroTitle) gsap.from(heroTitle, { y: 80, opacity: 0, duration: 1.2, delay: 0.4, ease: 'power4.out' });
  if (heroSub) gsap.from(heroSub, { y: 50, opacity: 0, duration: 0.9, delay: 0.7, ease: 'power3.out' });
  if (heroCta) gsap.from(heroCta, { y: 40, opacity: 0, scale: 0.9, duration: 0.7, delay: 1, ease: 'back.out(1.7)' });
  if (heroScroll) gsap.from(heroScroll, { opacity: 0, duration: 0.6, delay: 1.4, ease: 'power2.out' });

  // Hero parallax scroll effect
  var heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    gsap.to(heroBg, { scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }, y: 120, ease: 'none' });
  }

  // Values
  gsap.utils.toArray('.value-card').forEach(function(c, i) {
    gsap.from(c, { scrollTrigger: { trigger: c, start: 'top 88%' }, y: 50, opacity: 0, scale: 0.9, duration: 0.7, delay: i * 0.1, ease: 'power3.out' });
  });

  // PDP gallery
  var pdpGallery = document.querySelector('.pdp-gallery__main');
  if (pdpGallery) {
    gsap.from(pdpGallery, { opacity: 0, x: -40, duration: 0.8, ease: 'power3.out' });
  }
  var pdpInfo = document.querySelector('.pdp-info');
  if (pdpInfo) {
    gsap.from(pdpInfo, { opacity: 0, x: 40, duration: 0.8, delay: 0.2, ease: 'power3.out' });
  }

  // Trust marquee
  gsap.utils.toArray('.trust-banner').forEach(function(b) {
    gsap.from(b, { scrollTrigger: { trigger: b, start: 'top 90%' }, opacity: 0, duration: 0.8, ease: 'power2.out' });
  });

  // Animate counters if present
  document.querySelectorAll('[data-count]').forEach(function(el) {
    var target = parseInt(el.dataset.count) || 0;
    if (target <= 0) return;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: function() { animateCounter(el, target); },
      once: true
    });
  });
}

function animateCounter(el, target) {
  var duration = 1500;
  var start = performance.now();
  function step(ts) {
    var p = Math.min((ts - start) / duration, 1);
    var ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target).toLocaleString();
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(step);
}

function destroyAnimations() {
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.getAll().forEach(function(t) { t.kill(); });
}

// --- INIT ---
document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  updateCartUI();

  // Router
  window.addEventListener('hashchange', handleRoute);
  handleRoute();

  // Cart
  document.getElementById('cart-toggle')?.addEventListener('click', function() { toggleCart(true); });
  document.getElementById('cart-close')?.addEventListener('click', function() { toggleCart(false); });
  document.getElementById('cart-overlay')?.addEventListener('click', function() { toggleCart(false); });
  document.getElementById('cart-continue')?.addEventListener('click', function() { toggleCart(false); });
  document.getElementById('cart-checkout')?.addEventListener('click', function() { toggleCart(false); });

  // Theme
  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);

  // Mobile menu
  var menuToggle = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  menuToggle?.addEventListener('click', function() {
    var isOpen = mobileMenu.classList.toggle('is-open');
    menuToggle.classList.toggle('is-active', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobileMenu?.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() {
      mobileMenu.classList.remove('is-open');
      menuToggle?.classList.remove('is-active');
      menuToggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Escape closes cart/menu
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { toggleCart(false); }
  });

  // Back to top
  var btt = document.getElementById('back-to-top');
  window.addEventListener('scroll', function() { if (btt) btt.classList.toggle('is-visible', window.scrollY > 400); });
  btt?.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // Header scroll
  var header = document.getElementById('site-header');
  window.addEventListener('scroll', function() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 50); });

  // Footer newsletter
  document.getElementById('footer-newsletter')?.addEventListener('submit', function(e) { e.preventDefault(); showToast('Thanks for subscribing!'); e.target.reset(); });

  // Quick Add event delegation
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('[data-quick-add]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    var sizeName = 'One Size';
    var sizePrice = parseFloat(btn.dataset.quickPrice);
    addToCart({
      _id: 'quick-' + Date.now(),
      title: btn.dataset.quickTitle,
      price: sizePrice,
      images: [btn.dataset.quickImg],
      slug: btn.dataset.quickSlug
    }, sizeName, 1);
    showToast(btn.dataset.quickTitle + ' added to cart!');
  });

  // === PREMIUM MICRO-INTERACTIONS ===
  initMagneticButtons();
  initSmoothPreloader();
  initProductCardTilt();
  initScrollProgress();
});

// --- PREMIUM: Magnetic Cursor Effect on Buttons ---
function initMagneticButtons() {
  document.addEventListener('mousemove', function(e) {
    document.querySelectorAll('.btn--accent, .btn--primary, .nav-logo').forEach(function(el) {
      var rect = el.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var dx = e.clientX - cx;
      var dy = e.clientY - cy;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        var strength = (1 - dist / 120) * 0.3;
        el.style.transform = 'translate(' + (dx * strength) + 'px, ' + (dy * strength) + 'px)';
      } else {
        el.style.transform = '';
      }
    });
  });

  document.querySelectorAll('.btn--accent, .btn--primary, .nav-logo').forEach(function(el) {
    el.addEventListener('mouseleave', function() {
      el.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      el.style.transform = '';
      setTimeout(function() { el.style.transition = ''; }, 400);
    });
  });
}

// --- PREMIUM: Smooth Preloader ---
function initSmoothPreloader() {
  var preloader = document.getElementById('preloader');
  if (!preloader) return;
  var bar = preloader.querySelector('.preloader__bar-fill');
  if (bar) {
    bar.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
    bar.style.width = '100%';
  }
  setTimeout(function() {
    preloader.classList.add('is-loaded');
    setTimeout(function() { preloader.style.display = 'none'; }, 600);
  }, 1400);
}

// --- PREMIUM: 3D Tilt on Product Cards ---
function initProductCardTilt() {
  document.addEventListener('mousemove', function(e) {
    document.querySelectorAll('.product-card').forEach(function(card) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        var rotateX = ((y / rect.height) - 0.5) * -6;
        var rotateY = ((x / rect.width) - 0.5) * 6;
        card.style.transform = 'perspective(600px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.02)';
        card.style.transition = 'transform 0.1s ease-out';
      }
    });
  });

  document.addEventListener('mouseleave', function(e) {
    if (e.target.closest && e.target.closest('.product-card')) {
      var card = e.target.closest('.product-card');
      card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      card.style.transform = '';
    }
  }, true);

  // Reset on mouse leave from cards
  document.querySelectorAll('.product-card').forEach(function(card) {
    card.addEventListener('mouseleave', function() {
      card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      card.style.transform = '';
      setTimeout(function() { card.style.transition = ''; }, 500);
    });
  });
}

// --- PREMIUM: Scroll Progress Bar ---
function initScrollProgress() {
  var existing = document.getElementById('scroll-progress');
  if (existing) existing.remove();
  var bar = document.createElement('div');
  bar.id = 'scroll-progress';
  bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:var(--color-accent);z-index:9999;transition:width 0.1s linear;width:0;pointer-events:none;';
  document.body.appendChild(bar);

  window.addEventListener('scroll', function() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var pct = h > 0 ? (window.scrollY / h) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}
