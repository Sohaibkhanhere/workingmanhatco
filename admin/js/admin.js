// ==========================================
// WORKIN' MAN HAT CO. - Admin Panel
// ==========================================
// Vanilla JS SPA for e-commerce administration
// Owner: Skyler Smithson | workinmanhatco@gmail.com
// ==========================================

// --- State ---
const state = {
  token: localStorage.getItem('wm_admin_token'),
  user: null,
  currentPage: 'dashboard',
  products: { data: [], total: 0, page: 1, limit: 10, search: '', category: '', sort: 'newest' },
  orders: { data: [], total: 0, page: 1, limit: 10, filter: '', search: '' },
  settings: null,
  editingProduct: null,
  editingOrder: null,
  media: [],
  selectedProducts: new Set(),
  selectedOrders: new Set(),
  refreshInterval: null,
  toastQueue: []
};

// --- API Layer ---
async function api(url, options = {}) {
  const headers = { ...options.headers };
  if (state.token) headers['Authorization'] = `Bearer ${state.token}`;
  if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';

  try {
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
      logout();
      showToast('Session expired. Please log in again.', 'error');
      throw new Error('Session expired');
    }
    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(err.message || `HTTP ${response.status}`);
    }
    if (response.status === 204) return null;
    return await response.json();
  } catch (e) {
    if (e.message !== 'Session expired' && e.name !== 'AbortError') {
      showToast(e.message, 'error');
    }
    throw e;
  }
}

// --- Authentication ---
async function login(email, password) {
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) { loginBtn.disabled = true; loginBtn.textContent = 'Signing in...'; }
  try {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    state.token = data.token;
    state.user = data.user;
    localStorage.setItem('wm_admin_token', data.token);
    showAdmin();
    showToast(`Welcome back, ${state.user.name || 'Admin'}!`, 'success');
    navigate('dashboard');
  } catch (e) {
    // handled by api()
  } finally {
    if (loginBtn) { loginBtn.disabled = false; loginBtn.textContent = 'Sign In'; }
  }
}

function logout() {
  state.token = null;
  state.user = null;
  state.selectedProducts.clear();
  state.selectedOrders.clear();
  localStorage.removeItem('wm_admin_token');
  if (state.refreshInterval) { clearInterval(state.refreshInterval); state.refreshInterval = null; }
  showLogin();
}

async function checkAuth() {
  if (!state.token) { showLogin(); return false; }
  try {
    const data = await api('/api/auth/me');
    state.user = data.user;
    showAdmin();
    return true;
  } catch {
    showLogin();
    return false;
  }
}

function isAdmin() {
  return state.user && state.user.role === 'admin';
}

function requireAdmin() {
  if (!isAdmin()) {
    showToast('You do not have permission to perform this action.', 'error');
    return false;
  }
  return true;
}

// --- Navigation ---
function navigate(page) {
  state.currentPage = page;
  document.querySelectorAll('.admin-section').forEach(s => {
    s.style.display = 'none';
    s.classList.remove('section-active');
  });
  const section = document.getElementById(`section-${page}`);
  if (section) {
    section.style.display = 'block';
    section.classList.add('section-active');
  }
  updateSidebarActive(page);
  updateBreadcrumb(page);
  switch (page) {
    case 'dashboard': renderDashboard(); break;
    case 'products': renderProducts(); break;
    case 'orders': renderOrders(); break;
    case 'content': renderContent(); break;
    case 'media': renderMedia(); break;
    case 'settings': renderSettings(); break;
    default: renderDashboard();
  }
}

function showLogin() {
  const loginView = document.getElementById('login-view');
  const adminView = document.getElementById('admin-view');
  if (loginView) loginView.style.display = 'flex';
  if (adminView) adminView.style.display = 'none';
}

function showAdmin() {
  const loginView = document.getElementById('login-view');
  const adminView = document.getElementById('admin-view');
  if (loginView) loginView.style.display = 'none';
  if (adminView) adminView.style.display = 'flex';
  if (state.user) {
    const nameEl = document.getElementById('admin-user-name');
    const roleEl = document.getElementById('admin-user-role');
    if (nameEl) nameEl.textContent = state.user.name || state.user.email;
    if (roleEl) roleEl.textContent = state.user.role || 'admin';
  }
}

function updateSidebarActive(page) {
  document.querySelectorAll('.nav-item').forEach(item => {
    const isActive = item.dataset.page === page;
    item.classList.toggle('active', isActive);
    if (isActive) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
}

function updateBreadcrumb(page) {
  const breadcrumb = document.getElementById('breadcrumb');
  if (!breadcrumb) return;
  const labels = {
    dashboard: 'Dashboard', products: 'Products', orders: 'Orders',
    content: 'Content', media: 'Media Library', settings: 'Settings'
  };
  breadcrumb.innerHTML = `<span class="breadcrumb-item">Admin</span><span class="breadcrumb-sep">/</span><span class="breadcrumb-current">${labels[page] || page}</span>`;
}

function initSidebar() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(item.dataset.page);
      const sidebar = document.getElementById('sidebar');
      if (sidebar && window.innerWidth < 768) sidebar.classList.remove('open');
    });
  });

  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', sidebar.classList.contains('open'));
    });
  }

  const contentArea = document.getElementById('admin-content');
  if (contentArea) {
    contentArea.addEventListener('click', () => {
      if (sidebar && window.innerWidth < 768) sidebar.classList.remove('open');
    });
  }

  window.addEventListener('resize', debounce(() => {
    if (window.innerWidth >= 768 && sidebar) sidebar.classList.remove('open');
  }, 200));
}

// --- Dashboard ---
async function renderDashboard() {
  const container = document.getElementById('dashboard-content');
  if (!container) return;
  container.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading dashboard...</p></div>';

  try {
    const data = await api('/api/orders/stats/summary');
    container.innerHTML = `
      <div class="stats-grid">${renderStatsCards(data)}</div>
      <div class="dashboard-grid">
        <div class="dashboard-card dashboard-card-wide">
          <div class="card-header">
            <h3>Recent Orders</h3>
            <a href="#" class="card-link" onclick="navigate('orders');return false;">View All</a>
          </div>
          <div id="recent-orders-table">${renderRecentOrders(data.recentOrders || [])}</div>
        </div>
        <div class="dashboard-card">
          <div class="card-header">
            <h3>Monthly Revenue</h3>
          </div>
          <div id="revenue-chart">${renderRevenueChart(data.monthlyRevenue || [])}</div>
        </div>
      </div>
      <div class="quick-actions">
        <h3>Quick Actions</h3>
        <div class="action-buttons">
          <button class="btn btn-primary" onclick="openAddProduct()">
            <span class="btn-icon-left">+</span> New Product
          </button>
          <button class="btn btn-secondary" onclick="navigate('orders')">
            <span class="btn-icon-left">&#128230;</span> View Orders
          </button>
          <button class="btn btn-secondary" onclick="navigate('content')">
            <span class="btn-icon-left">&#9998;</span> Edit Content
          </button>
          <button class="btn btn-secondary" onclick="navigate('media')">
            <span class="btn-icon-left">&#128247;</span> Media Library
          </button>
        </div>
      </div>`;

    container.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count) || 0;
      animateCountUp(el, target);
    });
  } catch {
    container.innerHTML = `
      <div class="error-state">
        <p>Failed to load dashboard data.</p>
        <button class="btn btn-primary" onclick="renderDashboard()">Retry</button>
      </div>`;
  }
}

function renderStatsCards(data) {
  const cards = [
    { label: 'Total Revenue', value: data.totalRevenue || 0, format: 'price', icon: '&#128176;', color: '#27ae60' },
    { label: 'Total Orders', value: data.totalOrders || 0, format: 'number', icon: '&#128230;', color: '#3498db' },
    { label: 'Pending Orders', value: data.pendingOrders || 0, format: 'number', icon: '&#9203;', color: '#f39c12' },
    { label: 'Delivered', value: data.deliveredOrders || 0, format: 'number', icon: '&#9989;', color: '#2ecc71' }
  ];

  return cards.map(c => `
    <div class="stat-card" style="border-left: 4px solid ${c.color}">
      <div class="stat-icon" style="color: ${c.color}">${c.icon}</div>
      <div class="stat-info">
        <span class="stat-value" data-count="${c.value}" data-format="${c.format}">
          ${c.format === 'price' ? '$0.00' : '0'}
        </span>
        <span class="stat-label">${c.label}</span>
      </div>
    </div>`).join('');
}

function renderRecentOrders(orders) {
  if (!orders.length) {
    return '<div class="empty-state"><p>No recent orders yet.</p></div>';
  }
  return `
    <table class="data-table data-table-compact">
      <thead>
        <tr>
          <th>Order</th>
          <th>Customer</th>
          <th>Total</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${orders.map(o => `<tr>
          <td>
            <a href="#" onclick="openOrderDetail('${o._id || o.id}');return false;" class="link-primary">
              #${o.orderNumber || (o._id || o.id).slice(-6).toUpperCase()}
            </a>
          </td>
          <td>${escapeHtml(o.customerName || o.shippingAddress?.name || 'N/A')}</td>
          <td class="text-right">${formatPrice(o.total || 0)}</td>
          <td><span class="status-badge status-${o.status}">${capitalizeFirst(o.status)}</span></td>
          <td class="text-muted">${formatDate(o.createdAt)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

function renderRevenueChart(monthlyData) {
  if (!monthlyData.length) {
    return '<div class="empty-state"><p>No revenue data available.</p></div>';
  }
  const max = Math.max(...monthlyData.map(m => m.revenue || 0), 1);
  return `
    <div class="bar-chart">
      ${monthlyData.map(m => {
        const pct = ((m.revenue || 0) / max * 100).toFixed(1);
        return `
          <div class="bar-group">
            <div class="bar-value">${formatPrice(m.revenue || 0)}</div>
            <div class="bar-track">
              <div class="bar" style="height: ${pct}%" title="${formatPrice(m.revenue || 0)}"></div>
            </div>
            <span class="bar-label">${m.month || 'N/A'}</span>
          </div>`;
      }).join('')}
    </div>`;
}

function animateCountUp(el, target) {
  const duration = 1200;
  const format = el.dataset.format || 'number';
  const start = performance.now();

  const step = (timestamp) => {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    if (format === 'price') {
      el.textContent = formatPrice(current);
    } else {
      el.textContent = current.toLocaleString();
    }

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = format === 'price' ? formatPrice(target) : target.toLocaleString();
      el.classList.add('count-complete');
    }
  };

  requestAnimationFrame(step);
}

// --- Products ---
async function renderProducts(page = 1) {
  const container = document.getElementById('products-content');
  if (!container) return;
  state.products.page = page;
  state.selectedProducts.clear();

  container.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading products...</p></div>';

  try {
    const params = new URLSearchParams({
      limit: state.products.limit,
      offset: (page - 1) * state.products.limit,
      search: state.products.search,
      category: state.products.category,
      sort: state.products.sort
    });
    const data = await api(`/api/products?${params}`);
    state.products.data = data.products || [];
    state.products.total = data.total || 0;

    container.innerHTML = `
      <div class="section-header">
        <div class="section-title-area">
          <h2>Products</h2>
          <span class="section-count">${state.products.total} total</span>
        </div>
        <div class="header-actions">
          <div class="search-box">
            <input type="text" id="product-search" placeholder="Search products..." 
                   value="${escapeHtml(state.products.search)}" class="form-input" aria-label="Search products">
          </div>
          <select id="product-category-filter" class="form-select" aria-label="Filter by category">
            <option value="">All Categories</option>
            <option value="hats" ${state.products.category === 'hats' ? 'selected' : ''}>Hats</option>
            <option value="caps" ${state.products.category === 'caps' ? 'selected' : ''}>Caps</option>
            <option value="beanies" ${state.products.category === 'beanies' ? 'selected' : ''}>Beanies</option>
            <option value="accessories" ${state.products.category === 'accessories' ? 'selected' : ''}>Accessories</option>
          </select>
          <select id="product-sort" class="form-select" aria-label="Sort products">
            <option value="newest" ${state.products.sort === 'newest' ? 'selected' : ''}>Newest</option>
            <option value="oldest" ${state.products.sort === 'oldest' ? 'selected' : ''}>Oldest</option>
            <option value="price-asc" ${state.products.sort === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
            <option value="price-desc" ${state.products.sort === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
            <option value="name" ${state.products.sort === 'name' ? 'selected' : ''}>Name A-Z</option>
          </select>
          <button class="btn btn-primary" onclick="openAddProduct()" aria-label="Add new product">
            + Add Product
          </button>
        </div>
      </div>
      <div id="products-bulk-actions" class="bulk-actions" style="display: none">
        <span class="bulk-count"><span id="bulk-product-count">0</span> selected</span>
        <button class="btn btn-danger btn-sm" onclick="bulkDeleteProducts()">Delete Selected</button>
        <button class="btn btn-secondary btn-sm" onclick="clearProductSelection()">Clear Selection</button>
      </div>
      <div class="table-wrapper">${renderProductsTable(state.products.data)}</div>
      <div id="products-pagination" class="pagination-container"></div>`;

    initProductEventListeners();
    renderGenericPagination(
      document.getElementById('products-pagination'),
      state.products.total,
      page,
      state.products.limit,
      renderProducts
    );
  } catch {
    container.innerHTML = `
      <div class="error-state">
        <p>Failed to load products.</p>
        <button class="btn btn-primary" onclick="renderProducts()">Retry</button>
      </div>`;
  }
}

function renderProductsTable(products) {
  if (!products.length) {
    return `
      <div class="empty-state">
        <div class="empty-icon">&#128230;</div>
        <p>No products found.</p>
        <button class="btn btn-primary" onclick="openAddProduct()">Create your first product</button>
      </div>`;
  }

  return `
    <table class="data-table" id="products-table">
      <thead>
        <tr>
          <th class="th-checkbox">
            <input type="checkbox" id="select-all-products" aria-label="Select all products" onchange="toggleAllProducts(this.checked)">
          </th>
          <th>Image</th>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Status</th>
          <th class="th-actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        ${products.map(p => {
          const id = p._id || p.id;
          const thumbnail = (p.images && p.images[0]) || '/images/placeholder.png';
          return `<tr class="${state.selectedProducts.has(id) ? 'row-selected' : ''}" data-id="${id}">
            <td class="td-checkbox">
              <input type="checkbox" class="product-checkbox" value="${id}" 
                     ${state.selectedProducts.has(id) ? 'checked' : ''}
                     onchange="toggleProductSelection('${id}', this.checked)" aria-label="Select product">
            </td>
            <td>
              <img src="${escapeHtml(thumbnail)}" alt="${escapeHtml(p.name)}" class="table-thumb" 
                   onerror="this.src='/images/placeholder.png'" loading="lazy">
            </td>
            <td>
              <div class="product-name-cell">
                <span class="product-name">${escapeHtml(p.name)}</span>
                ${p.sku ? `<span class="text-muted text-sm">SKU: ${escapeHtml(p.sku)}</span>` : ''}
              </div>
            </td>
            <td><span class="badge badge-category">${escapeHtml(p.category || 'Uncategorized')}</span></td>
            <td class="text-right">
              ${p.comparePrice && p.comparePrice > p.price ? 
                `<span class="text-muted text-line-through">${formatPrice(p.comparePrice)}</span> ` : ''}
              <strong>${formatPrice(p.price || 0)}</strong>
            </td>
            <td class="text-center">
              <span class="stock-indicator ${getStockClass(p.stock)}">${p.stock != null ? p.stock : 'N/A'}</span>
            </td>
            <td>
              <span class="status-badge status-${p.active !== false ? 'active' : 'inactive'}">
                ${p.active !== false ? 'Active' : 'Draft'}
              </span>
            </td>
            <td class="actions-cell">
              <div class="action-group">
                <button class="btn-icon" onclick="openEditProduct('${id}')" title="Edit product" aria-label="Edit ${escapeHtml(p.name)}">
                  &#9998;
                </button>
                <button class="btn-icon btn-danger" onclick="deleteProduct('${id}')" title="Delete product" aria-label="Delete ${escapeHtml(p.name)}">
                  &#10005;
                </button>
              </div>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

function initProductEventListeners() {
  const searchInput = document.getElementById('product-search');
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      state.products.search = e.target.value;
      renderProducts(1);
    }, 350));
    searchInput.focus();
  }

  const categoryFilter = document.getElementById('product-category-filter');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', (e) => {
      state.products.category = e.target.value;
      renderProducts(1);
    });
  }

  const sortSelect = document.getElementById('product-sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.products.sort = e.target.value;
      renderProducts(1);
    });
  }
}

function toggleProductSelection(id, checked) {
  if (checked) state.selectedProducts.add(id);
  else state.selectedProducts.delete(id);
  updateBulkActionsUI('products');
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (row) row.classList.toggle('row-selected', checked);
}

function toggleAllProducts(checked) {
  const checkboxes = document.querySelectorAll('.product-checkbox');
  checkboxes.forEach(cb => {
    cb.checked = checked;
    const id = cb.value;
    if (checked) state.selectedProducts.add(id);
    else state.selectedProducts.delete(id);
    const row = cb.closest('tr');
    if (row) row.classList.toggle('row-selected', checked);
  });
  updateBulkActionsUI('products');
}

function clearProductSelection() {
  state.selectedProducts.clear();
  document.querySelectorAll('.product-checkbox').forEach(cb => { cb.checked = false; });
  const selectAll = document.getElementById('select-all-products');
  if (selectAll) selectAll.checked = false;
  document.querySelectorAll('tr.row-selected').forEach(r => r.classList.remove('row-selected'));
  updateBulkActionsUI('products');
}

async function bulkDeleteProducts() {
  const count = state.selectedProducts.size;
  if (!count) return;
  showConfirm(`Delete ${count} product(s)? This action cannot be undone.`, async () => {
    const ids = [...state.selectedProducts];
    let deleted = 0;
    for (const id of ids) {
      try {
        await api(`/api/products/${id}`, { method: 'DELETE' });
        deleted++;
      } catch { /* individual failure, continue */ }
    }
    showToast(`Deleted ${deleted} of ${count} products`, deleted === count ? 'success' : 'warning');
    clearProductSelection();
    renderProducts(state.products.page);
  });
}

function renderGenericPagination(container, total, currentPage, limit, onPageChange) {
  if (!container) return;
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) { container.innerHTML = ''; return; }

  let html = '<div class="pagination" role="navigation" aria-label="Pagination">';

  html += `<button class="btn-page" ${currentPage <= 1 ? 'disabled' : ''} 
           onclick="event.preventDefault()" data-page="${currentPage - 1}" aria-label="Previous page">‹ Prev</button>`;

  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  if (endPage - startPage < maxVisible - 1) startPage = Math.max(1, endPage - maxVisible + 1);

  if (startPage > 1) {
    html += `<button class="btn-page" data-page="1">1</button>`;
    if (startPage > 2) html += '<span class="page-ellipsis">...</span>';
  }

  for (let i = startPage; i <= endPage; i++) {
    html += `<button class="btn-page ${i === currentPage ? 'active' : ''}" 
             data-page="${i}" ${i === currentPage ? 'aria-current="page"' : ''}>${i}</button>`;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) html += '<span class="page-ellipsis">...</span>';
    html += `<button class="btn-page" data-page="${totalPages}">${totalPages}</button>`;
  }

  html += `<button class="btn-page" ${currentPage >= totalPages ? 'disabled' : ''} 
           data-page="${currentPage + 1}" aria-label="Next page">Next ›</button>`;

  const showing = Math.min((currentPage - 1) * limit + 1, total);
  const to = Math.min(currentPage * limit, total);
  html += `<span class="pagination-info">Showing ${showing}-${to} of ${total}</span>`;
  html += '</div>';

  container.innerHTML = html;

  container.querySelectorAll('.btn-page[data-page]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const page = parseInt(btn.dataset.page);
      if (page && page !== currentPage && !btn.disabled) onPageChange(page);
    });
  });
}

function openAddProduct() {
  if (!requireAdmin()) return;
  state.editingProduct = { mode: 'add', data: {} };
  populateProductModal({});
  const title = document.getElementById('product-modal-title');
  if (title) title.textContent = 'Add New Product';
  openModal('product-modal');
}

async function openEditProduct(id) {
  if (!requireAdmin()) return;
  try {
    let product = state.products.data.find(p => (p._id || p.id) === id);
    if (!product) product = await api(`/api/products/${id}`);
    state.editingProduct = { mode: 'edit', data: product };
    populateProductModal(product);
    const title = document.getElementById('product-modal-title');
    if (title) title.textContent = 'Edit Product';
    openModal('product-modal');
  } catch { /* handled */ }
}

function populateProductModal(p) {
  const form = document.getElementById('product-form');
  if (!form) return;

  form.querySelector('#product-name').value = p.name || '';
  form.querySelector('#product-slug').value = p.slug || '';
  form.querySelector('#product-description').value = p.description || '';
  form.querySelector('#product-price').value = p.price || '';
  form.querySelector('#product-compare-price').value = p.comparePrice || '';
  form.querySelector('#product-category').value = p.category || '';
  form.querySelector('#product-sku').value = p.sku || '';
  form.querySelector('#product-stock').value = p.stock ?? '';
  form.querySelector('#product-active').checked = p.active !== false;

  const sizesContainer = form.querySelector('#sizes-container');
  if (sizesContainer) {
    sizesContainer.innerHTML = '';
    (p.sizes || []).forEach(s => addSizeRow(s.size, s.stock));
  }

  const colorsContainer = form.querySelector('#color-tags');
  if (colorsContainer) {
    colorsContainer.innerHTML = '';
    (p.colors || []).forEach(c => addColorTag(c));
  }

  const imagesContainer = form.querySelector('#image-urls');
  if (imagesContainer) {
    imagesContainer.innerHTML = '';
    (p.images || []).forEach(url => addImageUrl(url));
  }

  form.querySelector('#seo-title').value = p.seoTitle || '';
  form.querySelector('#seo-description').value = p.seoDescription || '';

  updateImagePreviews(p.images || []);
}

function updateImagePreviews(images) {
  const previewContainer = document.getElementById('image-preview-container');
  if (!previewContainer) return;
  if (!images.length) {
    previewContainer.innerHTML = '';
    return;
  }
  previewContainer.innerHTML = images.map(url => `
    <div class="image-preview-item">
      <img src="${escapeHtml(url)}" alt="Product image preview" onerror="this.parentElement.style.display='none'">
    </div>`).join('');
}

async function saveProduct() {
  const form = document.getElementById('product-form');
  if (!form) return;

  const name = form.querySelector('#product-name').value.trim();
  const price = parseFloat(form.querySelector('#product-price').value);

  if (!name) {
    showToast('Product name is required', 'error');
    form.querySelector('#product-name').focus();
    return;
  }
  if (isNaN(price) || price < 0) {
    showToast('Please enter a valid price', 'error');
    form.querySelector('#product-price').focus();
    return;
  }

  const sizes = [];
  form.querySelectorAll('.size-row').forEach(row => {
    const size = row.querySelector('.size-input')?.value.trim();
    const stock = parseInt(row.querySelector('.size-stock')?.value) || 0;
    if (size) sizes.push({ size, stock });
  });

  const colors = [];
  form.querySelectorAll('.color-tag').forEach(tag => {
    if (tag.dataset.color) colors.push(tag.dataset.color);
  });

  const images = [];
  form.querySelectorAll('.image-url-input').forEach(inp => {
    const val = inp.value.trim();
    if (val) images.push(val);
  });

  const product = {
    name,
    slug: form.querySelector('#product-slug').value.trim(),
    description: form.querySelector('#product-description').value.trim(),
    price,
    comparePrice: parseFloat(form.querySelector('#product-compare-price').value) || 0,
    category: form.querySelector('#product-category').value,
    sku: form.querySelector('#product-sku').value.trim(),
    stock: parseInt(form.querySelector('#product-stock').value) || 0,
    active: form.querySelector('#product-active').checked,
    sizes,
    colors,
    images,
    seoTitle: form.querySelector('#seo-title').value.trim(),
    seoDescription: form.querySelector('#seo-description').value.trim()
  };

  const saveBtn = form.querySelector('button[type="submit"]');
  if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving...'; }

  try {
    if (state.editingProduct?.mode === 'edit') {
      const id = state.editingProduct.data._id || state.editingProduct.data.id;
      await api(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(product) });
      showToast('Product updated successfully', 'success');
    } else {
      await api('/api/products', { method: 'POST', body: JSON.stringify(product) });
      showToast('Product created successfully', 'success');
    }
    closeModal('product-modal');
    renderProducts(state.editingProduct?.mode === 'edit' ? state.products.page : 1);
  } catch { /* handled by api() */ }
  finally {
    if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save Product'; }
  }
}

async function deleteProduct(id) {
  if (!requireAdmin()) return;
  showConfirm('Are you sure you want to delete this product? This cannot be undone.', async () => {
    try {
      await api(`/api/products/${id}`, { method: 'DELETE' });
      showToast('Product deleted successfully', 'success');
      renderProducts(state.products.page);
    } catch { /* handled */ }
  });
}

function addSizeRow(size = '', stock = '') {
  const container = document.getElementById('sizes-container');
  if (!container) return;
  const row = document.createElement('div');
  row.className = 'size-row';
  row.innerHTML = `
    <input type="text" class="form-input size-input" placeholder="e.g., S, M, L, XL" value="${escapeHtml(String(size))}" aria-label="Size name">
    <input type="number" class="form-input size-stock" placeholder="Qty" value="${stock}" min="0" aria-label="Size stock quantity">
    <button type="button" class="btn-icon btn-danger btn-sm" onclick="this.parentElement.remove()" title="Remove size" aria-label="Remove size row">✕</button>`;
  container.appendChild(row);
  row.querySelector('.size-input').focus();
}

function removeSizeRow(index) {
  const container = document.getElementById('sizes-container');
  if (container?.children[index]) container.children[index].remove();
}

function addColorTag(color = null) {
  const container = document.getElementById('color-tags');
  if (!container) return;
  const input = document.getElementById('color-input');
  const value = color || input?.value?.trim();
  if (!value) return;

  const existing = [...container.querySelectorAll('.color-tag')].some(t => t.dataset.color === value);
  if (existing) { showToast('Color already added', 'warning'); return; }

  const tag = document.createElement('span');
  tag.className = 'color-tag';
  tag.dataset.color = value;
  tag.innerHTML = `
    <span class="color-swatch" style="background: ${escapeHtml(value)}"></span>
    <span class="color-label">${escapeHtml(value)}</span>
    <button type="button" class="color-tag-remove" onclick="this.parentElement.remove()" title="Remove color" aria-label="Remove color ${escapeHtml(value)}">✕</button>`;
  container.appendChild(tag);
  if (input && !color) { input.value = ''; input.focus(); }
}

function removeColorTag(index) {
  const container = document.getElementById('color-tags');
  if (container?.children[index]) container.children[index].remove();
}

function addImageUrl(url = '') {
  const container = document.getElementById('image-urls');
  if (!container) return;
  const row = document.createElement('div');
  row.className = 'image-url-row';
  row.innerHTML = `
    <input type="url" class="form-input image-url-input" placeholder="https://example.com/image.jpg" 
           value="${escapeHtml(url)}" aria-label="Image URL" onchange="previewNewImage(this.value)">
    <button type="button" class="btn-icon btn-danger btn-sm" onclick="this.parentElement.remove()" title="Remove image" aria-label="Remove image URL">✕</button>`;
  container.appendChild(row);
  if (!url) row.querySelector('.image-url-input').focus();
}

function removeImageUrl(index) {
  const container = document.getElementById('image-urls');
  if (container?.children[index]) container.children[index].remove();
}

function previewNewImage(url) {
  if (!url) return;
  const preview = document.getElementById('image-preview-container');
  if (!preview) return;
  const div = document.createElement('div');
  div.className = 'image-preview-item';
  div.innerHTML = `<img src="${escapeHtml(url)}" alt="Preview" onerror="this.parentElement.remove()">`;
  preview.appendChild(div);
}

function toggleSeoSection() {
  const section = document.getElementById('seo-section');
  const toggle = document.getElementById('seo-toggle');
  if (section) {
    const isCollapsed = section.classList.toggle('collapsed');
    if (toggle) toggle.textContent = isCollapsed ? '▸ SEO Settings' : '▾ SEO Settings';
  }
}

function generateSlug(title) {
  const slug = title
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const slugInput = document.getElementById('product-slug');
  if (slugInput && !slugInput.dataset.manualEdit) slugInput.value = slug;
}

function getStockClass(stock) {
  if (stock == null) return 'stock-na';
  if (stock === 0) return 'stock-out';
  if (stock <= 5) return 'stock-low';
  return 'stock-ok';
}

// --- Orders ---
async function renderOrders(page = 1) {
  const container = document.getElementById('orders-content');
  if (!container) return;
  state.orders.page = page;
  state.selectedOrders.clear();

  container.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading orders...</p></div>';

  try {
    const params = new URLSearchParams({
      limit: state.orders.limit,
      offset: (page - 1) * state.orders.limit
    });
    if (state.orders.filter) params.set('status', state.orders.filter);
    if (state.orders.search) params.set('search', state.orders.search);

    const data = await api(`/api/orders?${params}`);
    state.orders.data = data.orders || [];
    state.orders.total = data.total || 0;

    const statuses = [
      { value: '', label: 'All Statuses' },
      { value: 'pending', label: 'Pending' },
      { value: 'processing', label: 'Processing' },
      { value: 'shipped', label: 'Shipped' },
      { value: 'delivered', label: 'Delivered' },
      { value: 'cancelled', label: 'Cancelled' }
    ];

    container.innerHTML = `
      <div class="section-header">
        <div class="section-title-area">
          <h2>Orders</h2>
          <span class="section-count">${state.orders.total} total</span>
        </div>
        <div class="header-actions">
          <div class="search-box">
            <input type="text" id="order-search" placeholder="Search orders..." 
                   value="${escapeHtml(state.orders.search)}" class="form-input" aria-label="Search orders">
          </div>
          <select id="order-status-filter" class="form-select" aria-label="Filter by status">
            ${statuses.map(s => `<option value="${s.value}" ${state.orders.filter === s.value ? 'selected' : ''}>${s.label}</option>`).join('')}
          </select>
          <button class="btn btn-secondary" onclick="renderOrders(state.orders.page)" title="Refresh orders">
            &#8635; Refresh
          </button>
        </div>
      </div>
      <div id="orders-bulk-actions" class="bulk-actions" style="display: none">
        <span class="bulk-count"><span id="bulk-order-count">0</span> selected</span>
        <button class="btn btn-secondary btn-sm" onclick="clearOrderSelection()">Clear Selection</button>
      </div>
      <div class="table-wrapper">${renderOrdersTable(state.orders.data)}</div>
      <div id="orders-pagination" class="pagination-container"></div>`;

    initOrderEventListeners();
    renderGenericPagination(
      document.getElementById('orders-pagination'),
      state.orders.total,
      page,
      state.orders.limit,
      renderOrders
    );
  } catch {
    container.innerHTML = `
      <div class="error-state">
        <p>Failed to load orders.</p>
        <button class="btn btn-primary" onclick="renderOrders()">Retry</button>
      </div>`;
  }
}

function renderOrdersTable(orders) {
  if (!orders.length) {
    return `
      <div class="empty-state">
        <div class="empty-icon">&#128230;</div>
        <p>No orders found.</p>
      </div>`;
  }

  return `
    <table class="data-table" id="orders-table">
      <thead>
        <tr>
          <th class="th-checkbox">
            <input type="checkbox" id="select-all-orders" aria-label="Select all orders" onchange="toggleAllOrders(this.checked)">
          </th>
          <th>Order #</th>
          <th>Customer</th>
          <th>Items</th>
          <th>Total</th>
          <th>Status</th>
          <th>Date</th>
          <th class="th-actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        ${orders.map(o => {
          const id = o._id || o.id;
          const orderNum = o.orderNumber || id.slice(-6).toUpperCase();
          return `<tr class="${state.selectedOrders.has(id) ? 'row-selected' : ''}" data-id="${id}">
            <td class="td-checkbox">
              <input type="checkbox" class="order-checkbox" value="${id}"
                     ${state.selectedOrders.has(id) ? 'checked' : ''}
                     onchange="toggleOrderSelection('${id}', this.checked)" aria-label="Select order ${orderNum}">
            </td>
            <td>
              <a href="#" onclick="openOrderDetail('${id}');return false;" class="link-primary">
                #${orderNum}
              </a>
            </td>
            <td>
              <div class="customer-cell">
                <span>${escapeHtml(o.customerName || o.shippingAddress?.name || 'N/A')}</span>
                ${o.email ? `<span class="text-muted text-sm">${escapeHtml(o.email)}</span>` : ''}
              </div>
            </td>
            <td class="text-center">${(o.items || []).length}</td>
            <td class="text-right"><strong>${formatPrice(o.total || 0)}</strong></td>
            <td><span class="status-badge status-${o.status}">${capitalizeFirst(o.status)}</span></td>
            <td class="text-muted">${formatDate(o.createdAt)}</td>
            <td class="actions-cell">
              <div class="action-group">
                <button class="btn-icon" onclick="openOrderDetail('${id}')" title="View order details" aria-label="View order ${orderNum}">
                  &#128065;
                </button>
              </div>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

function initOrderEventListeners() {
  const searchInput = document.getElementById('order-search');
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      state.orders.search = e.target.value;
      renderOrders(1);
    }, 350));
  }

  const statusFilter = document.getElementById('order-status-filter');
  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      state.orders.filter = e.target.value;
      renderOrders(1);
    });
  }
}

function toggleOrderSelection(id, checked) {
  if (checked) state.selectedOrders.add(id);
  else state.selectedOrders.delete(id);
  updateBulkActionsUI('orders');
  const row = document.querySelector(`#orders-table tr[data-id="${id}"]`);
  if (row) row.classList.toggle('row-selected', checked);
}

function toggleAllOrders(checked) {
  document.querySelectorAll('.order-checkbox').forEach(cb => {
    cb.checked = checked;
    if (checked) state.selectedOrders.add(cb.value);
    else state.selectedOrders.delete(cb.value);
    const row = cb.closest('tr');
    if (row) row.classList.toggle('row-selected', checked);
  });
  updateBulkActionsUI('orders');
}

function clearOrderSelection() {
  state.selectedOrders.clear();
  document.querySelectorAll('.order-checkbox').forEach(cb => { cb.checked = false; });
  const selectAll = document.getElementById('select-all-orders');
  if (selectAll) selectAll.checked = false;
  document.querySelectorAll('#orders-table tr.row-selected').forEach(r => r.classList.remove('row-selected'));
  updateBulkActionsUI('orders');
}

function updateBulkActionsUI(type) {
  const selection = type === 'products' ? state.selectedProducts : state.selectedOrders;
  const container = document.getElementById(`${type}-bulk-actions`);
  const countEl = document.getElementById(`bulk-${type === 'products' ? 'product' : 'order'}-count`);
  if (container) container.style.display = selection.size > 0 ? 'flex' : 'none';
  if (countEl) countEl.textContent = selection.size;
}

async function openOrderDetail(id) {
  try {
    const order = await api(`/api/orders/${id}`);
    state.editingOrder = order;
    renderOrderDetailModal(order);
    openModal('order-modal');
  } catch { /* handled */ }
}

function renderOrderDetailModal(order) {
  const content = document.getElementById('order-detail-content');
  if (!content) return;

  const orderNum = order.orderNumber || (order._id || order.id).slice(-6).toUpperCase();
  const timeline = renderStatusTimeline(order.status);

  content.innerHTML = `
    <div class="order-detail">
      <div class="order-header">
        <h3>Order #${orderNum}</h3>
        <span class="status-badge status-${order.status} status-lg">${capitalizeFirst(order.status)}</span>
      </div>

      <div class="order-info-grid">
        <div class="order-info-card">
          <h4>Order Information</h4>
          <div class="info-list">
            <div class="info-row">
              <span class="info-label">Date:</span>
              <span class="info-value">${formatDateTime(order.createdAt)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Payment:</span>
              <span class="info-value">${escapeHtml(order.paymentMethod || 'N/A')}</span>
            </div>
            ${order.trackingNumber ? `
            <div class="info-row">
              <span class="info-label">Tracking:</span>
              <span class="info-value">${escapeHtml(order.trackingNumber)}</span>
            </div>` : ''}
          </div>
        </div>

        <div class="order-info-card">
          <h4>Customer</h4>
          <div class="info-list">
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span class="info-value">${escapeHtml(order.customerName || order.shippingAddress?.name || 'N/A')}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${escapeHtml(order.email || 'N/A')}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value">${escapeHtml(order.phone || 'N/A')}</span>
            </div>
          </div>
        </div>

        <div class="order-info-card">
          <h4>Shipping Address</h4>
          <address class="address-block">
            ${escapeHtml(order.shippingAddress?.street || 'N/A')}<br>
            ${escapeHtml(order.shippingAddress?.city || '')}${order.shippingAddress?.city && order.shippingAddress?.state ? ', ' : ''}
            ${escapeHtml(order.shippingAddress?.state || '')} ${escapeHtml(order.shippingAddress?.zip || '')}
          </address>
        </div>

        <div class="order-info-card">
          <h4>Order Summary</h4>
          <div class="summary-list">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>${formatPrice(order.subtotal || 0)}</span>
            </div>
            <div class="summary-row">
              <span>Shipping:</span>
              <span>${formatPrice(order.shippingCost || 0)}</span>
            </div>
            <div class="summary-row">
              <span>Tax:</span>
              <span>${formatPrice(order.tax || 0)}</span>
            </div>
            ${order.discount ? `
            <div class="summary-row text-success">
              <span>Discount:</span>
              <span>-${formatPrice(order.discount)}</span>
            </div>` : ''}
            <div class="summary-row summary-total">
              <span>Total:</span>
              <span>${formatPrice(order.total || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="order-items-section">
        <h4>Order Items</h4>
        <table class="data-table data-table-compact">
          <thead>
            <tr>
              <th>Product</th>
              <th>Size/Color</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${(order.items || []).map(item => `
              <tr>
                <td>
                  <div class="item-info">
                    ${item.image ? `<img src="${escapeHtml(item.image)}" alt="" class="item-thumb">` : ''}
                    <span>${escapeHtml(item.name || 'Product')}</span>
                  </div>
                </td>
                <td class="text-muted">
                  ${[item.size, item.color].filter(Boolean).join(' / ') || '-'}
                </td>
                <td class="text-center">${item.quantity || 1}</td>
                <td class="text-right">${formatPrice(item.price || 0)}</td>
                <td class="text-right"><strong>${formatPrice((item.price || 0) * (item.quantity || 1))}</strong></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>

      <div class="order-progress-section">
        <h4>Order Progress</h4>
        <div class="status-timeline">${timeline}</div>
      </div>

      <div class="order-actions-section">
        <div class="status-update-form">
          <label for="order-status-select" class="form-label">Update Status:</label>
          <div class="status-update-row">
            <select id="order-status-select" class="form-select">
              ${['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s =>
                `<option value="${s}" ${order.status === s ? 'selected' : ''}>${capitalizeFirst(s)}</option>`
              ).join('')}
            </select>
            <input type="text" id="order-tracking-input" class="form-input" 
                   placeholder="Tracking number (optional)" value="${escapeHtml(order.trackingNumber || '')}">
            <button class="btn btn-primary" onclick="updateOrderStatus('${order._id || order.id}')">
              Update Order
            </button>
          </div>
        </div>
      </div>

      ${order.notes ? `
      <div class="order-notes-section">
        <h4>Notes</h4>
        <p class="order-notes">${escapeHtml(order.notes)}</p>
      </div>` : ''}
    </div>`;
}

function renderStatusTimeline(status) {
  const steps = [
    { key: 'pending', label: 'Pending', icon: '&#128203;' },
    { key: 'processing', label: 'Processing', icon: '&#9881;' },
    { key: 'shipped', label: 'Shipped', icon: '&#128666;' },
    { key: 'delivered', label: 'Delivered', icon: '&#9989;' }
  ];

  if (status === 'cancelled') {
    return `<div class="timeline-cancelled">
      <span class="timeline-cancel-icon">&#10060;</span>
      <span>Order Cancelled</span>
    </div>`;
  }

  const currentIdx = steps.findIndex(s => s.key === status);
  if (currentIdx === -1) return '';

  return `
    <div class="timeline-steps">
      ${steps.map((step, i) => {
        let cls = 'timeline-step';
        if (i < currentIdx) cls += ' completed';
        else if (i === currentIdx) cls += ' current';
        return `
          <div class="${cls}">
            <div class="step-connector"></div>
            <div class="step-content">
              <span class="step-icon">${step.icon}</span>
              <span class="step-label">${step.label}</span>
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

async function updateOrderStatus(id) {
  const select = document.getElementById('order-status-select');
  const trackingInput = document.getElementById('order-tracking-input');
  if (!select) return;

  const status = select.value;
  const trackingNumber = trackingInput?.value.trim() || '';

  try {
    await api(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, trackingNumber })
    });
    showToast('Order updated successfully', 'success');
    closeModal('order-modal');
    renderOrders(state.orders.page);
  } catch { /* handled */ }
}

function filterOrders(status) {
  state.orders.filter = status;
  renderOrders(1);
}

// --- Content ---
async function renderContent() {
  const container = document.getElementById('content-content');
  if (!container) return;
  container.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading content...</p></div>';

  try {
    const settings = await api('/api/settings');
    state.settings = settings;

    container.innerHTML = `
      <div class="section-header">
        <h2>Homepage Content</h2>
        <p class="section-description">Manage the content displayed on your storefront homepage.</p>
      </div>
      <form id="content-form" class="settings-form">
        <fieldset class="form-fieldset">
          <legend>Hero Section</legend>
          <div class="form-group">
            <label for="content-hero-title" class="form-label">Hero Title</label>
            <input type="text" id="content-hero-title" class="form-input" 
                   value="${escapeHtml(settings.heroTitle || '')}" placeholder="Welcome to Workin' Man Hat Co.">
          </div>
          <div class="form-group">
            <label for="content-hero-subtitle" class="form-label">Hero Subtitle</label>
            <input type="text" id="content-hero-subtitle" class="form-input" 
                   value="${escapeHtml(settings.heroSubtitle || '')}" placeholder="Quality hats for hardworking people">
          </div>
          <div class="form-group">
            <label for="content-hero-image" class="form-label">Hero Image URL</label>
            <input type="url" id="content-hero-image" class="form-input" 
                   value="${escapeHtml(settings.heroImage || '')}" placeholder="https://...">
            ${settings.heroImage ? `
              <div class="image-preview-small">
                <img src="${escapeHtml(settings.heroImage)}" alt="Hero preview" onerror="this.parentElement.style.display='none'">
              </div>` : ''}
          </div>
        </fieldset>

        <fieldset class="form-fieldset">
          <legend>About Us</legend>
          <div class="form-group">
            <label for="content-about" class="form-label">About Text</label>
            <textarea id="content-about" class="form-textarea" rows="4" 
                      placeholder="Tell your story...">${escapeHtml(settings.aboutText || '')}</textarea>
          </div>
        </fieldset>

        <fieldset class="form-fieldset">
          <legend>Featured Section</legend>
          <div class="form-group">
            <label for="content-featured-title" class="form-label">Featured Products Title</label>
            <input type="text" id="content-featured-title" class="form-input" 
                   value="${escapeHtml(settings.featuredTitle || '')}" placeholder="Our Best Sellers">
          </div>
        </fieldset>

        <fieldset class="form-fieldset">
          <legend>Testimonials</legend>
          <div id="testimonials-container">${renderTestimonials(settings.testimonials || [])}</div>
          <button type="button" class="btn btn-secondary" onclick="addTestimonial()">
            + Add Testimonial
          </button>
        </fieldset>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Save Content</button>
          <button type="button" class="btn btn-secondary" onclick="renderContent()">Discard Changes</button>
        </div>
      </form>`;

    document.getElementById('content-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      saveContent();
    });
  } catch {
    container.innerHTML = `
      <div class="error-state">
        <p>Failed to load content settings.</p>
        <button class="btn btn-primary" onclick="renderContent()">Retry</button>
      </div>`;
  }
}

function renderTestimonials(testimonials) {
  if (!testimonials.length) {
    return '<p class="empty-state small">No testimonials added yet.</p>';
  }
  return testimonials.map((t, i) => `
    <div class="testimonial-row" data-index="${i}">
      <div class="testimonial-fields">
        <input type="text" class="form-input testimonial-name" placeholder="Customer name" 
               value="${escapeHtml(t.name || '')}" aria-label="Testimonial author name">
        <input type="text" class="form-input testimonial-text" placeholder="What they said..." 
               value="${escapeHtml(t.text || '')}" aria-label="Testimonial text">
        <select class="form-select testimonial-rating" aria-label="Rating">
          ${[5,4,3,2,1].map(n => `<option value="${n}" ${t.rating === n ? 'selected' : ''}>${'★'.repeat(n)}${'☆'.repeat(5-n)}</option>`).join('')}
        </select>
      </div>
      <button type="button" class="btn-icon btn-danger btn-sm" onclick="removeTestimonial(${i})" title="Remove testimonial">
        ✕
      </button>
    </div>`).join('');
}

function addTestimonial() {
  const container = document.getElementById('testimonials-container');
  if (!container) return;

  const empty = container.querySelector('.empty-state');
  if (empty) empty.remove();

  const idx = container.querySelectorAll('.testimonial-row').length;
  const div = document.createElement('div');
  div.className = 'testimonial-row';
  div.dataset.index = idx;
  div.innerHTML = `
    <div class="testimonial-fields">
      <input type="text" class="form-input testimonial-name" placeholder="Customer name" aria-label="Testimonial author name">
      <input type="text" class="form-input testimonial-text" placeholder="What they said..." aria-label="Testimonial text">
      <select class="form-select testimonial-rating" aria-label="Rating">
        <option value="5">★★★★★</option>
        <option value="4">★★★★☆</option>
        <option value="3">★★★☆☆</option>
      </select>
    </div>
    <button type="button" class="btn-icon btn-danger btn-sm" onclick="this.closest('.testimonial-row').remove()" title="Remove testimonial">✕</button>`;
  container.appendChild(div);
  div.querySelector('.testimonial-name').focus();
}

function removeTestimonial(index) {
  const container = document.getElementById('testimonials-container');
  if (!container) return;
  const rows = container.querySelectorAll('.testimonial-row');
  if (rows[index]) {
    rows[index].remove();
    if (!container.querySelector('.testimonial-row')) {
      container.innerHTML = '<p class="empty-state small">No testimonials added yet.</p>';
    }
  }
}

async function saveContent() {
  const form = document.getElementById('content-form');
  if (!form) return;

  const testimonials = [];
  form.querySelectorAll('.testimonial-row').forEach(row => {
    const name = row.querySelector('.testimonial-name')?.value.trim();
    const text = row.querySelector('.testimonial-text')?.value.trim();
    const rating = parseInt(row.querySelector('.testimonial-rating')?.value) || 5;
    if (name && text) testimonials.push({ name, text, rating });
  });

  const content = {
    heroTitle: form.querySelector('#content-hero-title').value.trim(),
    heroSubtitle: form.querySelector('#content-hero-subtitle').value.trim(),
    heroImage: form.querySelector('#content-hero-image').value.trim(),
    aboutText: form.querySelector('#content-about').value.trim(),
    featuredTitle: form.querySelector('#content-featured-title').value.trim(),
    testimonials
  };

  const saveBtn = form.querySelector('button[type="submit"]');
  if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving...'; }

  try {
    await api('/api/settings', { method: 'PUT', body: JSON.stringify(content) });
    showToast('Content saved successfully', 'success');
  } catch { /* handled */ }
  finally {
    if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save Content'; }
  }
}

// --- Media ---
async function renderMedia() {
  const container = document.getElementById('media-content');
  if (!container) return;
  container.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading media library...</p></div>';

  try {
    const data = await api('/api/media');
    state.media = data.media || [];

    container.innerHTML = `
      <div class="section-header">
        <div class="section-title-area">
          <h2>Media Library</h2>
          <span class="section-count">${state.media.length} files</span>
        </div>
      </div>
      <div id="upload-zone" class="upload-zone" role="region" aria-label="File upload area">
        <div class="upload-zone-content">
          <div class="upload-icon">&#128228;</div>
          <p>Drag &amp; drop images here</p>
          <p class="text-muted">or</p>
          <label for="file-input" class="btn btn-secondary upload-browse-btn">Browse Files</label>
          <input type="file" id="file-input" accept="image/*" multiple hidden>
          <p class="upload-hint text-muted">Supports JPG, PNG, GIF, WebP up to 10MB</p>
        </div>
        <div id="upload-progress" class="upload-progress" style="display: none"></div>
      </div>
      <div id="media-grid" class="media-grid">${renderMediaGrid(state.media)}</div>`;

    initDragDrop();
    document.getElementById('file-input')?.addEventListener('change', handleFileSelect);
  } catch {
    container.innerHTML = `
      <div class="error-state">
        <p>Failed to load media library.</p>
        <button class="btn btn-primary" onclick="renderMedia()">Retry</button>
      </div>`;
  }
}

function renderMediaGrid(files) {
  if (!files.length) {
    return `
      <div class="empty-state">
        <p>No media files uploaded yet.</p>
      </div>`;
  }

  return files.map(f => `
    <div class="media-item" data-filename="${escapeHtml(f.filename)}">
      <div class="media-image-wrapper">
        <img src="${escapeHtml(f.url)}" alt="${escapeHtml(f.filename)}" loading="lazy"
             onerror="this.parentElement.classList.add('media-error')">
      </div>
      <div class="media-overlay">
        <button class="btn-icon media-action" onclick="previewMedia('${escapeHtml(f.url)}')" title="Preview" aria-label="Preview image">
          &#128065;
        </button>
        <button class="btn-icon media-action" onclick="copyUrl('${escapeHtml(f.url)}')" title="Copy URL" aria-label="Copy image URL">
          &#128203;
        </button>
        <button class="btn-icon btn-danger media-action" onclick="deleteMedia('${escapeHtml(f.filename)}')" title="Delete" aria-label="Delete image">
          &#10005;
        </button>
      </div>
      <div class="media-info">
        <span class="media-filename" title="${escapeHtml(f.filename)}">${escapeHtml(f.filename)}</span>
      </div>
    </div>`).join('');
}

function initDragDrop() {
  const zone = document.getElementById('upload-zone');
  if (!zone) return;

  ['dragenter', 'dragover'].forEach(evt => {
    zone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      zone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(evt => {
    zone.addEventListener(evt, () => zone.classList.remove('drag-over'));
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = [...e.dataTransfer.files].filter(f => f.type.startsWith('image/'));
    if (files.length) {
      files.forEach(f => uploadFile(f));
    } else {
      showToast('Only image files are supported.', 'warning');
    }
  });
}

function handleFileSelect(e) {
  const files = [...e.target.files];
  files.forEach(f => uploadFile(f));
  e.target.value = '';
}

let uploadQueue = [];
let uploading = false;

async function uploadFile(file) {
  if (file.size > 10 * 1024 * 1024) {
    showToast(`${file.name} is too large (max 10MB).`, 'error');
    return;
  }

  uploadQueue.push(file);
  if (!uploading) processUploadQueue();
}

async function processUploadQueue() {
  if (uploading || !uploadQueue.length) return;
  uploading = true;

  const progressEl = document.getElementById('upload-progress');
  if (progressEl) progressEl.style.display = 'block';

  while (uploadQueue.length) {
    const file = uploadQueue[0];
    const formData = new FormData();
    formData.append('image', file);

    if (progressEl) {
      progressEl.innerHTML = `<p>Uploading ${file.name}...</p>`;
    }

    try {
      await api('/api/media/upload', { method: 'POST', body: formData });
      showToast(`${file.name} uploaded successfully`, 'success');
      uploadQueue.shift();
    } catch {
      showToast(`Failed to upload ${file.name}`, 'error');
      uploadQueue.shift();
    }
  }

  uploading = false;
  if (progressEl) {
    progressEl.style.display = 'none';
    progressEl.innerHTML = '';
  }

  renderMedia();
}

function previewMedia(url) {
  openModal('preview-modal');
  const previewImg = document.getElementById('preview-modal-image');
  if (previewImg) previewImg.src = url;
}

function copyUrl(url) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(url)
      .then(() => showToast('URL copied to clipboard', 'success'))
      .catch(() => fallbackCopy(url));
  } else {
    fallbackCopy(url);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showToast('URL copied to clipboard', 'success');
  } catch {
    showToast('Failed to copy URL', 'error');
  }
  document.body.removeChild(textarea);
}

async function deleteMedia(filename) {
  showConfirm(`Delete "${filename}"? This cannot be undone.`, async () => {
    try {
      await api(`/api/media/${filename}`, { method: 'DELETE' });
      showToast('Media file deleted', 'success');
      const item = document.querySelector(`.media-item[data-filename="${filename}"]`);
      if (item) {
        item.classList.add('media-deleting');
        setTimeout(() => renderMedia(), 300);
      } else {
        renderMedia();
      }
    } catch { /* handled */ }
  });
}

// --- Settings ---
async function renderSettings() {
  const container = document.getElementById('settings-content');
  if (!container) return;
  container.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading settings...</p></div>';

  try {
    const settings = await api('/api/settings');
    state.settings = settings;

    const c = (key, fallback = '') => escapeHtml(settings[key] || fallback);

    container.innerHTML = `
      <div class="section-header">
        <h2>Site Settings</h2>
        <p class="section-description">Configure your store's identity, appearance, and policies.</p>
      </div>
      <form id="settings-form" class="settings-form">

        <fieldset class="form-fieldset">
          <legend>Site Identity</legend>
          <div class="form-row">
            <div class="form-group">
              <label for="set-site-name" class="form-label">Site Name</label>
              <input type="text" id="set-site-name" class="form-input" value="${c('site-name', "Workin' Man Hat Co.")}">
            </div>
            <div class="form-group">
              <label for="set-tagline" class="form-label">Tagline</label>
              <input type="text" id="set-tagline" class="form-input" value="${c('tagline')}" 
                     placeholder="Quality hats for hardworking people">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="set-logo" class="form-label">Logo URL</label>
              <input type="url" id="set-logo" class="form-input" value="${c('logo')}" placeholder="https://...">
              ${settings.logo ? `<div class="image-preview-small"><img src="${c('logo')}" alt="Logo preview" onerror="this.parentElement.style.display='none'"></div>` : ''}
            </div>
            <div class="form-group">
              <label for="set-favicon" class="form-label">Favicon URL</label>
              <input type="url" id="set-favicon" class="form-input" value="${c('favicon')}" placeholder="https://...">
            </div>
          </div>
        </fieldset>

        <fieldset class="form-fieldset">
          <legend>Brand Colors</legend>
          <div class="color-pickers-grid">
            <div class="color-picker-group">
              <label for="set-color-primary" class="form-label">Primary</label>
              <div class="color-input-wrap">
                <input type="color" id="set-color-primary" class="color-picker" value="${settings.primaryColor || '#c8a96e'}">
                <span class="color-value">${settings.primaryColor || '#c8a96e'}</span>
              </div>
            </div>
            <div class="color-picker-group">
              <label for="set-color-secondary" class="form-label">Secondary</label>
              <div class="color-input-wrap">
                <input type="color" id="set-color-secondary" class="color-picker" value="${settings.secondaryColor || '#1a1a1a'}">
                <span class="color-value">${settings.secondaryColor || '#1a1a1a'}</span>
              </div>
            </div>
            <div class="color-picker-group">
              <label for="set-color-accent" class="form-label">Accent</label>
              <div class="color-input-wrap">
                <input type="color" id="set-color-accent" class="color-picker" value="${settings.accentColor || '#8b7355'}">
                <span class="color-value">${settings.accentColor || '#8b7355'}</span>
              </div>
            </div>
            <div class="color-picker-group">
              <label for="set-color-bg" class="form-label">Background</label>
              <div class="color-input-wrap">
                <input type="color" id="set-color-bg" class="color-picker" value="${settings.backgroundColor || '#ffffff'}">
                <span class="color-value">${settings.backgroundColor || '#ffffff'}</span>
              </div>
            </div>
          </div>
          <div id="color-preview-bar" class="color-preview-bar">
            <div class="preview-swatch" style="background: ${settings.primaryColor || '#c8a96e'}">Primary</div>
            <div class="preview-swatch" style="background: ${settings.secondaryColor || '#1a1a1a'}; color: white">Secondary</div>
            <div class="preview-swatch" style="background: ${settings.accentColor || '#8b7355'}">Accent</div>
          </div>
        </fieldset>

        <fieldset class="form-fieldset">
          <legend>Typography</legend>
          <div class="form-row">
            <div class="form-group">
              <label for="set-font-heading" class="form-label">Heading Font</label>
              <input type="text" id="set-font-heading" class="form-input" value="${c('headingFont', 'Georgia')}">
            </div>
            <div class="form-group">
              <label for="set-font-body" class="form-label">Body Font</label>
              <input type="text" id="set-font-body" class="form-input" value="${c('bodyFont', 'system-ui')}">
            </div>
          </div>
        </fieldset>

        <fieldset class="form-fieldset">
          <legend>Social Media</legend>
          <div class="form-row">
            <div class="form-group"><label for="set-instagram" class="form-label">Instagram</label>
              <input type="url" id="set-instagram" class="form-input" value="${c('instagram')}" placeholder="https://instagram.com/...">
            </div>
            <div class="form-group"><label for="set-facebook" class="form-label">Facebook</label>
              <input type="url" id="set-facebook" class="form-input" value="${c('facebook')}" placeholder="https://facebook.com/...">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group"><label for="set-twitter" class="form-label">Twitter / X</label>
              <input type="url" id="set-twitter" class="form-input" value="${c('twitter')}" placeholder="https://x.com/...">
            </div>
            <div class="form-group"><label for="set-tiktok" class="form-label">TikTok</label>
              <input type="url" id="set-tiktok" class="form-input" value="${c('tiktok')}" placeholder="https://tiktok.com/@...">
            </div>
          </div>
        </fieldset>

        <fieldset class="form-fieldset">
          <legend>Contact Information</legend>
          <div class="form-row">
            <div class="form-group"><label for="set-email" class="form-label">Email</label>
              <input type="email" id="set-email" class="form-input" value="${c('contactEmail', 'workinmanhatco@gmail.com')}">
            </div>
            <div class="form-group"><label for="set-phone" class="form-label">Phone</label>
              <input type="tel" id="set-phone" class="form-input" value="${c('phone')}" placeholder="(555) 123-4567">
            </div>
          </div>
          <div class="form-group">
            <label for="set-address" class="form-label">Business Address</label>
            <textarea id="set-address" class="form-textarea" rows="2">${c('address')}</textarea>
          </div>
        </fieldset>

        <fieldset class="form-fieldset">
          <legend>SEO</legend>
          <div class="form-group">
            <label for="set-meta-title" class="form-label">Meta Title</label>
            <input type="text" id="set-meta-title" class="form-input" value="${c('metaTitle')}">
          </div>
          <div class="form-group">
            <label for="set-meta-description" class="form-label">Meta Description</label>
            <textarea id="set-meta-description" class="form-textarea" rows="2">${c('metaDescription')}</textarea>
          </div>
        </fieldset>

        <fieldset class="form-fieldset">
          <legend>Policies</legend>
          <div class="form-group">
            <label for="set-privacy" class="form-label">Privacy Policy</label>
            <textarea id="set-privacy" class="form-textarea" rows="3">${c('privacyPolicy')}</textarea>
          </div>
          <div class="form-group">
            <label for="set-terms" class="form-label">Terms of Service</label>
            <textarea id="set-terms" class="form-textarea" rows="3">${c('termsOfService')}</textarea>
          </div>
          <div class="form-group">
            <label for="set-returns" class="form-label">Return Policy</label>
            <textarea id="set-returns" class="form-textarea" rows="3">${c('returnPolicy')}</textarea>
          </div>
        </fieldset>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Save All Settings</button>
          <button type="button" class="btn btn-secondary" onclick="renderSettings()">Discard Changes</button>
        </div>
      </form>`;

    document.getElementById('settings-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      saveSettings();
    });
    initColorPickers();
  } catch {
    container.innerHTML = `
      <div class="error-state">
        <p>Failed to load settings.</p>
        <button class="btn btn-primary" onclick="renderSettings()">Retry</button>
      </div>`;
  }
}

async function saveSettings() {
  const form = document.getElementById('settings-form');
  if (!form) return;

  const getValue = (id) => form.querySelector(`#${id}`)?.value.trim() || '';
  const getColor = (id) => form.querySelector(`#${id}`)?.value || '';

  const settings = {
    siteName: getValue('set-site-name'),
    tagline: getValue('set-tagline'),
    logo: getValue('set-logo'),
    favicon: getValue('set-favicon'),
    primaryColor: getColor('set-color-primary'),
    secondaryColor: getColor('set-color-secondary'),
    accentColor: getColor('set-color-accent'),
    backgroundColor: getColor('set-color-bg'),
    headingFont: getValue('set-font-heading'),
    bodyFont: getValue('set-font-body'),
    instagram: getValue('set-instagram'),
    facebook: getValue('set-facebook'),
    twitter: getValue('set-twitter'),
    tiktok: getValue('set-tiktok'),
    contactEmail: getValue('set-email'),
    phone: getValue('set-phone'),
    address: getValue('set-address'),
    metaTitle: getValue('set-meta-title'),
    metaDescription: getValue('set-meta-description'),
    privacyPolicy: getValue('set-privacy'),
    termsOfService: getValue('set-terms'),
    returnPolicy: getValue('set-returns')
  };

  const saveBtn = form.querySelector('button[type="submit"]');
  if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving...'; }

  try {
    await api('/api/settings', { method: 'PUT', body: JSON.stringify(settings) });
    state.settings = { ...state.settings, ...settings };
    showToast('Settings saved successfully', 'success');
  } catch { /* handled */ }
  finally {
    if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save All Settings'; }
  }
}

function initColorPickers() {
  document.querySelectorAll('.color-picker').forEach(picker => {
    picker.addEventListener('input', (e) => {
      const value = e.target.value;
      const display = picker.closest('.color-input-wrap')?.querySelector('.color-value');
      if (display) display.textContent = value;
      updateColorPreview();
    });
  });
}

function updateColorPreview() {
  const root = document.documentElement;
  const colors = {
    'set-color-primary': '--color-primary',
    'set-color-secondary': '--color-secondary',
    'set-color-accent': '--color-accent',
    'set-color-bg': '--color-bg'
  };

  const previewBar = document.getElementById('color-preview-bar');
  const swatches = previewBar?.querySelectorAll('.preview-swatch');

  Object.entries(colors).forEach(([inputId, cssVar]) => {
    const value = document.getElementById(inputId)?.value;
    if (value) root.style.setProperty(cssVar, value);
  });

  if (swatches?.length >= 3) {
    swatches[0].style.background = document.getElementById('set-color-primary')?.value || '#c8a96e';
    swatches[1].style.background = document.getElementById('set-color-secondary')?.value || '#1a1a1a';
    swatches[2].style.background = document.getElementById('set-color-accent')?.value || '#8b7355';
  }
}

// --- Modals ---
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('active');
  modal.style.display = 'flex';
  requestAnimationFrame(() => modal.classList.add('modal-visible'));
  document.body.style.overflow = 'hidden';

  const focusable = modal.querySelector('input, select, textarea, button:not(.modal-close)');
  if (focusable) setTimeout(() => focusable.focus(), 100);
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('modal-visible');
  setTimeout(() => {
    modal.classList.remove('active');
    modal.style.display = 'none';
    if (!document.querySelector('.modal.active')) {
      document.body.style.overflow = '';
    }
  }, 200);
}

function showConfirm(message, onConfirm) {
  const modal = document.getElementById('confirm-modal');
  const msgEl = document.getElementById('confirm-message');
  const confirmBtn = document.getElementById('confirm-btn');
  const cancelBtn = document.getElementById('cancel-btn');

  if (!modal || !msgEl || !confirmBtn) return;

  msgEl.textContent = message;
  openModal('confirm-modal');

  const cleanup = () => {
    confirmBtn.removeEventListener('click', handleConfirm);
    cancelBtn?.removeEventListener('click', handleCancel);
  };

  const handleConfirm = async () => {
    cleanup();
    closeModal('confirm-modal');
    try { await onConfirm(); } catch { /* handled */ }
  };

  const handleCancel = () => {
    cleanup();
    closeModal('confirm-modal');
  };

  confirmBtn.addEventListener('click', handleConfirm);
  cancelBtn?.addEventListener('click', handleCancel);
}

function closeModalOnBackdrop(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modalId);
  });
}

// --- Toast ---
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icons = { success: '&#10004;', error: '&#10060;', warning: '&#9888;', info: '&#8505;' };
  const icon = icons[type] || icons.info;

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
    <button class="toast-close" onclick="this.parentElement.remove()" aria-label="Dismiss">&times;</button>`;

  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('toast-visible'));

  const dismissTimeout = setTimeout(() => dismissToast(toast), type === 'error' ? 5000 : 3500);
  toast.addEventListener('mouseenter', () => clearTimeout(dismissTimeout));
  toast.addEventListener('mouseleave', () => setTimeout(() => dismissToast(toast), 1500));
}

function dismissToast(toast) {
  if (!toast?.parentElement) return;
  toast.classList.remove('toast-visible');
  toast.classList.add('toast-exit');
  setTimeout(() => toast.remove(), 300);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.setAttribute('role', 'status');
  container.setAttribute('aria-live', 'polite');
  document.body.appendChild(container);
  return container;
}

// --- Utilities ---
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return dateStr; }
}

function formatDateTime(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit'
    });
  } catch { return dateStr; }
}

function formatPrice(num) {
  return `$${(parseFloat(num) || 0).toFixed(2)}`;
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(str) {
  if (str == null) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(str).replace(/[&<>"']/g, c => map[c]);
}

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function throttle(fn, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// --- Keyboard Shortcuts ---
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (!state.user) return;
    const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
    if (isInput) {
      if (e.key === 'Escape') document.activeElement.blur();
      return;
    }

    if (e.altKey) {
      switch (e.key) {
        case '1': e.preventDefault(); navigate('dashboard'); break;
        case '2': e.preventDefault(); navigate('products'); break;
        case '3': e.preventDefault(); navigate('orders'); break;
        case '4': e.preventDefault(); navigate('content'); break;
        case '5': e.preventDefault(); navigate('media'); break;
        case '6': e.preventDefault(); navigate('settings'); break;
        case 'n': e.preventDefault(); openAddProduct(); break;
      }
    }

    if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const search = document.querySelector('#product-search, #order-search');
      if (search) search.focus();
    }
  });
}

// --- Init ---
document.addEventListener('DOMContentLoaded', async () => {
  // Login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value?.trim();
      const password = document.getElementById('login-password')?.value;
      if (email && password) login(email, password);
      else showToast('Please enter email and password', 'warning');
    });
  }

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    showConfirm('Are you sure you want to log out?', logout);
  });

  // Sidebar
  initSidebar();

  // Modal close buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) closeModal(modal.id);
    });
  });

  // Escape closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModals = document.querySelectorAll('.modal.active');
      if (activeModals.length) {
        closeModal(activeModals[activeModals.length - 1].id);
      }
    }
  });

  // Product form
  const productForm = document.getElementById('product-form');
  if (productForm) {
    productForm.addEventListener('submit', (e) => { e.preventDefault(); saveProduct(); });

    const nameInput = productForm.querySelector('#product-name');
    if (nameInput) {
      nameInput.addEventListener('input', (e) => {
        if (!state.editingProduct?.data?.slug && !productForm.querySelector('#product-slug')?.dataset.manualEdit) {
          generateSlug(e.target.value);
        }
      });
    }

    const slugInput = productForm.querySelector('#product-slug');
    if (slugInput) {
      slugInput.addEventListener('input', () => { slugInput.dataset.manualEdit = 'true'; });
    }
  }

  // Product modal dynamic fields
  document.getElementById('add-size-btn')?.addEventListener('click', () => addSizeRow());
  document.getElementById('add-color-btn')?.addEventListener('click', () => addColorTag());
  document.getElementById('add-image-btn')?.addEventListener('click', () => addImageUrl());

  const colorInput = document.getElementById('color-input');
  if (colorInput) {
    colorInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); addColorTag(); }
    });
  }

  // SEO toggle
  document.getElementById('seo-toggle')?.addEventListener('click', toggleSeoSection);

  // Init modals with backdrop close
  ['product-modal', 'order-modal', 'confirm-modal', 'preview-modal'].forEach(closeModalOnBackdrop);

  // Keyboard shortcuts
  initKeyboardShortcuts();

  // Auth check
  const authenticated = await checkAuth();
  if (authenticated) navigate('dashboard');
});