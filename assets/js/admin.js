/**
 * DeenKart Store Admin Panel Controller (admin.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  switchAdminTab('dashboard');
  bindAdminEvents();
});

function bindAdminEvents() {
  const form = document.getElementById('product-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveProductFromModal();
    });
  }
}

function switchAdminTab(tabName) {
  const titleElem = document.getElementById('admin-page-title');
  const container = document.getElementById('admin-tab-content');

  document.querySelectorAll('.admin-menu-item').forEach(btn => {
    btn.classList.remove('active');
  });

  const activeBtn = document.querySelector(`.admin-menu-item[onclick*="${tabName}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  switch (tabName) {
    case 'dashboard':
      if (titleElem) titleElem.textContent = 'Dashboard Overview';
      renderAdminDashboard(container);
      break;
    case 'products':
      if (titleElem) titleElem.textContent = 'Islamic Products Management';
      renderAdminProducts(container);
      break;
    case 'orders':
      if (titleElem) titleElem.textContent = 'Local Orders Management';
      renderAdminOrders(container);
      break;
    case 'offers':
      if (titleElem) titleElem.textContent = 'Ramadan & Special Offers';
      renderAdminOffers(container);
      break;
  }
}

/* 1. DASHBOARD OVERVIEW */
function renderAdminDashboard(container) {
  const products = Storage.get(CONFIG.storageKeys.products, PRODUCTS_DATA);
  const orders = Storage.getOrders();
  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  container.innerHTML = `
    <!-- KPI Cards Grid -->
    <div class="admin-stats-grid">
      <div class="stat-card">
        <div>
          <div class="stat-label">Total Orders</div>
          <div class="stat-val">${orders.length}</div>
        </div>
        <div class="stat-icon"><i class="fa-solid fa-box-archive"></i></div>
      </div>

      <div class="stat-card">
        <div>
          <div class="stat-label">Total Sales</div>
          <div class="stat-val">₹${totalSales}</div>
        </div>
        <div class="stat-icon"><i class="fa-solid fa-indian-rupee-sign"></i></div>
      </div>

      <div class="stat-card">
        <div>
          <div class="stat-label">Active Products</div>
          <div class="stat-val">${products.length}</div>
        </div>
        <div class="stat-icon"><i class="fa-solid fa-book-quran"></i></div>
      </div>

      <div class="stat-card">
        <div>
          <div class="stat-label">Store Focus</div>
          <div class="stat-val" style="font-size:16px;">Shikrapur (412208)</div>
        </div>
        <div class="stat-icon"><i class="fa-solid fa-location-dot"></i></div>
      </div>
    </div>

    <!-- Recent Orders Table -->
    <div class="table-card">
      <div class="table-header">
        <h3 style="font-size: 16px; font-weight: 800;">Recent Local Orders</h3>
        <button class="btn btn-primary btn-sm" onclick="switchAdminTab('orders')">View All Orders</button>
      </div>

      <table class="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Location</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${orders.length === 0 ? `
            <tr><td colspan="7" style="text-align:center; padding: 24px; color: var(--color-charcoal-muted);">No orders placed yet.</td></tr>
          ` : orders.slice(0, 5).map(o => `
            <tr>
              <td><strong>#${o.id}</strong></td>
              <td>${o.customer ? o.customer.name : 'Customer'}<br><span style="font-size:11px; color:#6B7280;">+91 ${o.customer ? o.customer.whatsapp : ''}</span></td>
              <td>
                ${o.customer && o.customer.locationLink ? `
                  <a href="${o.customer.locationLink}" target="_blank" style="color:var(--color-emerald); font-weight:700;">
                    📍 View on Maps
                  </a>
                ` : 'Shikrapur'}
              </td>
              <td>${o.items ? o.items.length : 1} Items</td>
              <td><strong>₹${o.total}</strong></td>
              <td><span class="status-pill ${o.orderStatus.toLowerCase()}">${o.orderStatus}</span></td>
              <td>
                <button class="btn btn-outline btn-sm" onclick="window.open('${WhatsAppService.buildOrderChatUrl(o.id)}', '_blank')">
                  <i class="fa-brands fa-whatsapp text-emerald"></i> Chat
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/* 2. PRODUCTS MANAGEMENT */
function renderAdminProducts(container) {
  const products = Storage.get(CONFIG.storageKeys.products, PRODUCTS_DATA);

  container.innerHTML = `
    <div class="table-card">
      <div class="table-header">
        <h3 style="font-size: 16px; font-weight: 800;">Product Catalogue (${products.length})</h3>
        <button class="btn btn-primary btn-sm" onclick="openProductModal()">+ Add New Product</button>
      </div>

      <table class="admin-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Original</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(p => `
            <tr>
              <td style="display:flex; align-items:center; gap:12px;">
                <img src="${p.image}" style="width:38px; height:38px; object-fit:cover; border-radius:4px; border:1px solid var(--color-border);" />
                <div>
                  <strong>${p.name}</strong><br>
                  <span style="font-size:11px; color:var(--color-charcoal-muted);">${p.categoryName || p.category}</span>
                </div>
              </td>
              <td style="text-transform:capitalize;">${p.category}</td>
              <td><strong>₹${p.price}</strong></td>
              <td><span style="color:#9CA3AF; text-decoration:line-through;">₹${p.originalPrice || '-'}</span></td>
              <td><span style="font-weight:700; color:${p.stock < 10 ? 'var(--color-danger)' : 'var(--color-success)'}">${p.stock || 20} pcs</span></td>
              <td>
                <button style="border:none; background:none; cursor:pointer; font-size:15px; margin-right:8px;" onclick="editProduct('${p.id}')">✏️</button>
                <button style="border:none; background:none; cursor:pointer; font-size:15px; color:var(--color-danger);" onclick="deleteProduct('${p.id}')">🗑️</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function openProductModal(productData = null) {
  const modal = document.getElementById('product-modal-backdrop');
  const title = document.getElementById('product-modal-title');
  
  document.getElementById('p-id').value = productData ? productData.id : '';
  document.getElementById('p-name').value = productData ? productData.name : '';
  document.getElementById('p-category').value = productData ? productData.category : 'quran-translations';
  document.getElementById('p-price').value = productData ? productData.price : '';
  document.getElementById('p-original').value = productData ? (productData.originalPrice || '') : '';
  document.getElementById('p-stock').value = productData ? productData.stock : 25;
  document.getElementById('p-image').value = productData ? productData.image : '';
  document.getElementById('p-desc').value = productData ? productData.description : '';

  if (title) title.textContent = productData ? 'Edit Product' : 'Add New Islamic Product';
  if (modal) modal.style.display = 'flex';
}

function closeProductModal() {
  const modal = document.getElementById('product-modal-backdrop');
  if (modal) modal.style.display = 'none';
}

function saveProductFromModal() {
  const id = document.getElementById('p-id').value || ('prod-' + Date.now());
  const name = document.getElementById('p-name').value.trim();
  const category = document.getElementById('p-category').value;
  const price = parseInt(document.getElementById('p-price').value);
  const originalPrice = parseInt(document.getElementById('p-original').value) || (price + 200);
  const stock = parseInt(document.getElementById('p-stock').value) || 20;
  const image = document.getElementById('p-image').value.trim();
  const description = document.getElementById('p-desc').value.trim();

  let products = Storage.get(CONFIG.storageKeys.products, PRODUCTS_DATA);
  const idx = products.findIndex(p => p.id === id);

  const productObj = {
    id,
    name,
    subtitle: "Authentic Islamic product in Shikrapur",
    category,
    categoryName: category.replace(/-/g, ' ').toUpperCase(),
    price,
    originalPrice,
    discount: Math.round(((originalPrice - price) / originalPrice) * 100),
    stock,
    rating: 4.9,
    reviewsCount: 15,
    image: image || "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600&q=80",
    tags: [category, "islamic", "deen"],
    description: description || "Authentic quality item for everyday Muslim living in Shikrapur."
  };

  if (idx > -1) {
    products[idx] = productObj;
  } else {
    products.unshift(productObj);
  }

  Storage.set(CONFIG.storageKeys.products, products);
  closeProductModal();
  switchAdminTab('products');
  alert("Product saved successfully! ✓");
}

function editProduct(productId) {
  const products = Storage.get(CONFIG.storageKeys.products, PRODUCTS_DATA);
  const p = products.find(item => item.id === productId);
  if (p) openProductModal(p);
}

function deleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    let products = Storage.get(CONFIG.storageKeys.products, PRODUCTS_DATA);
    products = products.filter(p => p.id !== productId);
    Storage.set(CONFIG.storageKeys.products, products);
    switchAdminTab('products');
  }
}

/* 3. ORDERS MANAGEMENT */
function renderAdminOrders(container) {
  const orders = Storage.getOrders();

  container.innerHTML = `
    <div class="table-card">
      <div class="table-header">
        <h3 style="font-size: 16px; font-weight: 800;">All Customer Orders (${orders.length})</h3>
      </div>

      <table class="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Delivery Address</th>
            <th>Location GPS</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map(o => `
            <tr>
              <td><strong>#${o.id}</strong></td>
              <td>${o.date || 'Recent'}</td>
              <td><strong>${o.customer ? o.customer.name : 'Customer'}</strong><br><small>+91 ${o.customer ? o.customer.whatsapp : ''}</small></td>
              <td>${o.customer ? `${o.customer.house}, ${o.customer.area}` : 'Shikrapur'}</td>
              <td>
                ${o.customer && o.customer.locationLink ? `
                  <a href="${o.customer.locationLink}" target="_blank" class="btn btn-outline btn-sm" style="padding:4px 8px; font-size:11px;">
                    📍 Open Maps
                  </a>
                ` : '<span style="color:#9CA3AF;">Live on WhatsApp</span>'}
              </td>
              <td><strong>₹${o.total}</strong></td>
              <td>
                <select onchange="updateOrderStatus('${o.id}', this.value)" style="padding:4px 8px; font-size:11px; border-radius:4px; font-weight:700;">
                  <option value="Order Placed" ${o.orderStatus==='Order Placed'?'selected':''}>Order Placed</option>
                  <option value="Processing" ${o.orderStatus==='Processing'?'selected':''}>Processing</option>
                  <option value="Shipped" ${o.orderStatus==='Shipped'?'selected':''}>Shipped</option>
                  <option value="Delivered" ${o.orderStatus==='Delivered'?'selected':''}>Delivered</option>
                  <option value="Cancelled" ${o.orderStatus==='Cancelled'?'selected':''}>Cancelled</option>
                </select>
              </td>
              <td>
                <button class="btn btn-primary btn-sm" onclick="window.open('${WhatsAppService.buildOrderChatUrl(o.id)}', '_blank')">
                  WhatsApp
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function updateOrderStatus(orderId, newStatus) {
  let orders = Storage.getOrders();
  const o = orders.find(item => item.id === orderId);
  if (o) {
    o.orderStatus = newStatus;
    Storage.set(CONFIG.storageKeys.orders, orders);
    alert(`Order #${orderId} status updated to: ${newStatus}`);
  }
}

/* 4. OFFERS MANAGEMENT */
function renderAdminOffers(container) {
  container.innerHTML = `
    <div class="table-card">
      <div class="table-header">
        <h3 style="font-size: 16px; font-weight: 800;">Promotions & Coupons</h3>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
        <div style="background:var(--color-soft-green); border:1px solid var(--color-soft-green-border); border-radius:var(--radius-md); padding:16px;">
          <h4>Active Coupon: WELCOME10</h4>
          <p style="font-size:12px; color:var(--color-charcoal-muted); margin:4px 0 10px;">10% flat discount on first order for Shikrapur residents.</p>
          <span class="status-pill delivered">Active</span>
        </div>

        <div style="background:var(--color-soft-gold); border:1px solid var(--color-border); border-radius:var(--radius-md); padding:16px;">
          <h4>Active Coupon: RAMADAN50</h4>
          <p style="font-size:12px; color:var(--color-charcoal-muted); margin:4px 0 10px;">15% seasonal special for prayer mats & attars.</p>
          <span class="status-pill delivered">Active</span>
        </div>
      </div>
    </div>
  `;
}
