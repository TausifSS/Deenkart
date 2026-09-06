/**
 * DeenKart UI Rendering Engine & Interactive View Components
 * Redesigned to match the reference layout, sliding cards, and simplified checkout.
 */

const UI = {
  activeSearchFilter: "All",
  activeSearchSort: "featured",

  // Toast notification
  showToast(message, icon = "fa-check") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="fa-solid ${icon} text-gold"></i><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px) scale(0.9)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  },

  // Renders a single product card matching reference image
  createProductCardHTML(product, isSlide = false) {
    const isWish = Storage.isWishlisted(product.id);
    const discountBadge = product.discount 
      ? `<span class="discount-pill-badge">-${product.discount}%</span>` 
      : '';

    const brandName = product.categoryName ? product.categoryName.split(' ')[0].toUpperCase() : 'ISLAMIC';

    return `
      <div class="product-card ${isSlide ? 'product-card-slide' : ''}" data-product-id="${product.id}">
        <div class="product-card-top" onclick="UI.openProductModal('${product.id}')">
          ${discountBadge}
          <button class="product-wishlist-btn ${isWish ? 'active' : ''}" 
                  onclick="event.stopPropagation(); UI.handleWishlistToggle('${product.id}')" 
                  aria-label="Save to Wishlist">
            <i class="${isWish ? 'fa-solid text-danger' : 'fa-regular'} fa-heart"></i>
          </button>
          <img src="${product.image}" alt="${product.name}" class="product-card-img" loading="lazy" 
               onerror="this.src='https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=400&q=80'">
        </div>
        <div class="product-card-brand">${brandName}</div>
        <h3 class="product-card-title" onclick="UI.openProductModal('${product.id}')">${product.name}</h3>
        
        <div class="product-card-pricing">
          <span class="price-current">₹${product.price}</span>
          ${product.originalPrice ? `<span class="price-original">₹${product.originalPrice}</span>` : ''}
          ${product.discount ? `<span class="discount-text">${product.discount}% OFF</span>` : ''}
        </div>

        <button class="product-add-btn" onclick="UI.handleAddToCart('${product.id}')">
          <i class="fa-solid fa-bag-shopping"></i> Add to Cart
        </button>
      </div>
    `;
  },

  // Dedicated Search Page Product Card (Exact Match to media_1788617048276.png)
  createSearchProductCardHTML(product) {
    const isWish = Storage.isWishlisted(product.id);
    const rating = product.rating || 4.8;
    const reviewCount = product.reviewsCountText || (product.reviewsCount ? (product.reviewsCount >= 1000 ? (product.reviewsCount / 1000).toFixed(1) + 'k' : product.reviewsCount) : '850');
    
    // Star display
    const fullStars = Math.floor(rating);
    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        starsHtml += '<i class="fa-solid fa-star"></i>';
      } else if (i === fullStars && (rating % 1) >= 0.5) {
        starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
      } else {
        starsHtml += '<i class="fa-regular fa-star"></i>';
      }
    }

    const discountPill = product.discount 
      ? `<span class="search-discount-badge">${product.discount}% OFF</span>` 
      : '';

    return `
      <div class="search-prod-card" data-product-id="${product.id}" data-subtag="${product.subTag || 'all'}">
        <div class="search-card-img-wrap" onclick="UI.openProductModal('${product.id}')">
          <img src="${product.image}" alt="${product.name}" class="search-card-img" loading="lazy" 
               onerror="this.src='https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=400&q=80'">
          <button class="search-card-wish-btn ${isWish ? 'active' : ''}" 
                  onclick="event.stopPropagation(); UI.handleWishlistToggle('${product.id}')" 
                  aria-label="Save to Wishlist">
            <i class="${isWish ? 'fa-solid text-danger' : 'fa-regular'} fa-heart"></i>
          </button>
        </div>

        <div class="search-card-body">
          <h3 class="search-card-title" onclick="UI.openProductModal('${product.id}')" title="${product.name}">
            ${product.name}
          </h3>

          <div class="search-card-rating">
            <span class="search-rating-stars">${starsHtml}</span>
            <span class="search-rating-val">${rating}</span>
            <span class="search-rating-count">(${reviewCount})</span>
          </div>

          <div class="search-card-pricing-row">
            <span class="search-price-curr">₹${product.price}</span>
            ${product.originalPrice ? `<span class="search-price-orig">₹${product.originalPrice}</span>` : ''}
            ${discountPill}
          </div>

          <button class="search-card-add-btn" onclick="UI.handleAddToCart('${product.id}')">
            <i class="fa-solid fa-cart-shopping"></i> Add to Cart
          </button>
        </div>
      </div>
    `;
  },

  // Render Category Scroller items (Circular rings that slide horizontally)
  renderCategoriesScroller() {
    const container = document.getElementById("categories-scroller");
    if (!container) return;

    container.innerHTML = CATEGORIES_DATA.map(cat => `
      <div class="category-slide-item" onclick="Router.navigate('#category?id=${cat.id}')">
        <div class="category-circle-ring">
          <img src="${cat.image}" alt="${cat.name}" loading="lazy">
        </div>
        <span class="category-slide-label">${cat.shortName || cat.name}</span>
      </div>
    `).join("");
  },

  // Render Categories Page Grid
  renderCategoriesPage() {
    const container = document.getElementById("categories-page-grid");
    if (!container) return;

    container.innerHTML = CATEGORIES_DATA.map(cat => `
      <div class="category-page-card" onclick="Router.navigate('#category?id=${cat.id}')" style="
        background: var(--color-white);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        overflow: hidden;
        cursor: pointer;
        transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        box-shadow: var(--shadow-sm);
      ">
        <div style="aspect-ratio: 4/3; overflow: hidden; background: #FAF9F6; position: relative;">
          <img src="${cat.image}" alt="${cat.name}" style="width:100%; height:100%; object-fit:cover; transition:transform 0.3s ease;">
        </div>
        <div style="padding: 12px 14px; display:flex; align-items:center; justify-content:space-between;">
          <div>
            <h4 style="font-size:0.92rem; font-weight:700; color:var(--color-charcoal); margin-bottom:2px;">${cat.name}</h4>
            <p style="font-size:0.75rem; color:var(--color-charcoal-muted);">${cat.itemCount}</p>
          </div>
          <i class="fa-solid fa-chevron-right text-emerald" style="font-size:0.8rem;"></i>
        </div>
      </div>
    `).join("");
  },

  // Dedicated Category Detail Page Handler
  currentCategoryDetailId: null,
  currentCategorySubFilter: "all",
  currentCategorySort: "popular",

  renderCategoryDetail(queryPart) {
    const params = new URLSearchParams(queryPart || "");
    const catId = params.get("id") || params.get("cat") || "quran-translations";
    this.currentCategoryDetailId = catId;
    this.currentCategorySubFilter = "all";

    const catInfo = CATEGORIES_DATA.find(c => c.id === catId) || {
      id: catId,
      name: "Islamic Collection",
      description: "Explore authentic Islamic essentials curated for your spiritual journey.",
      image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600&q=80",
      itemCount: "Curated Collection"
    };

    // Update Banner elements
    const breadcrumbCurrent = document.getElementById("category-breadcrumb-current");
    const heroTitle = document.getElementById("category-hero-title");
    const heroDesc = document.getElementById("category-hero-desc");
    const badgeCount = document.getElementById("category-badge-count");
    const heroImg = document.getElementById("category-hero-img");

    if (breadcrumbCurrent) breadcrumbCurrent.textContent = catInfo.name;
    if (heroTitle) heroTitle.textContent = catInfo.name;
    if (heroDesc) heroDesc.textContent = catInfo.description;
    if (badgeCount) badgeCount.textContent = catInfo.shortName || catInfo.name;
    if (heroImg && catInfo.image) {
      heroImg.src = catInfo.image;
      heroImg.alt = catInfo.name;
      heroImg.style.display = "block";
    }

    // Sub-filters for categories that have them (e.g., quran-translations)
    const subFilterBar = document.getElementById("category-subfilter-bar");
    if (subFilterBar) {
      if (catId === "quran-translations") {
        subFilterBar.style.display = "flex";
        subFilterBar.innerHTML = `
          <button class="search-subfilter-pill active" onclick="UI.applyCategorySubFilter(this, 'all')">All</button>
          <button class="search-subfilter-pill" onclick="UI.applyCategorySubFilter(this, 'arabic')">Arabic</button>
          <button class="search-subfilter-pill" onclick="UI.applyCategorySubFilter(this, 'translation')">Translation</button>
          <button class="search-subfilter-pill" onclick="UI.applyCategorySubFilter(this, 'tafsir')">Tafsir</button>
          <button class="search-subfilter-pill" onclick="UI.applyCategorySubFilter(this, 'kids')">Kids</button>
          <button class="search-subfilter-pill" onclick="UI.applyCategorySubFilter(this, 'with-cover')">With Cover</button>
        `;
      } else {
        subFilterBar.style.display = "none";
      }
    }

    this.renderCategoryProducts();
  },

  applyCategorySubFilter(pillEl, tag) {
    const bar = document.getElementById("category-subfilter-bar");
    if (bar) {
      bar.querySelectorAll(".search-subfilter-pill").forEach(p => p.classList.remove("active"));
    }
    if (pillEl) pillEl.classList.add("active");
    this.currentCategorySubFilter = tag;
    this.renderCategoryProducts();
  },

  applyCategorySort(sortType) {
    this.currentCategorySort = sortType;
    const dropdown = document.getElementById("category-sort-dropdown");
    if (dropdown) {
      dropdown.classList.remove("show");
      dropdown.querySelectorAll(".sort-dropdown-item").forEach(item => {
        item.classList.toggle("active", Boolean(item.getAttribute("onclick")?.includes(sortType)));
      });
    }
    this.renderCategoryProducts();
  },

  renderCategoryProducts() {
    const container = document.getElementById("category-products-grid");
    const countLabel = document.getElementById("category-product-count-label");
    if (!container) return;

    const allProducts = Storage.getProducts();
    const catId = this.currentCategoryDetailId;

    let items = allProducts.filter(p => 
      p.category === catId || 
      p.secondaryCategory === catId || 
      (Array.isArray(p.tags) && p.tags.includes(catId))
    );

    // Apply subtag filter if present
    if (this.currentCategorySubFilter && this.currentCategorySubFilter !== "all") {
      items = items.filter(p => {
        if (typeof SearchEngine !== "undefined" && typeof SearchEngine.matchesSubFilter === "function") {
          return SearchEngine.matchesSubFilter(p, this.currentCategorySubFilter);
        }
        return (p.subTag === this.currentCategorySubFilter) || (p.tags && p.tags.includes(this.currentCategorySubFilter));
      });
    }

    // Sort items
    if (typeof SearchEngine !== "undefined" && typeof SearchEngine.sortProducts === "function") {
      items = SearchEngine.sortProducts(items, this.currentCategorySort);
    }

    if (countLabel) {
      countLabel.textContent = `Showing ${items.length} product${items.length === 1 ? '' : 's'}`;
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding: 48px 16px; background:var(--color-white); border-radius:var(--radius-xl); border:1px solid var(--color-border);">
          <div style="font-size:3rem; margin-bottom:12px;">📦</div>
          <h3 style="font-size:1.1rem; font-weight:700; color:var(--color-charcoal); margin-bottom:6px;">New stock arriving soon!</h3>
          <p style="font-size:0.86rem; color:var(--color-charcoal-muted); margin-bottom:18px;">Looking for something specific in this category? We deliver across Koregaon to Shirur!</p>
          <button class="btn btn-primary" onclick="requestProductViaWhatsApp('Islamic Item')">
            <i class="fa-brands fa-whatsapp"></i> Request Product via WhatsApp
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(p => this.createSearchProductCardHTML(p)).join("");
  },

  // Render Horizontal Sliding Products on Home
  renderHomeProducts() {
    const products = Storage.get(CONFIG.storageKeys.products, PRODUCTS_DATA);
    const trendingContainer = document.getElementById("home-trending-products");
    const bestSellersContainer = document.getElementById("home-bestsellers-products");

    if (trendingContainer) {
      const trending = products.slice(0, 8);
      trendingContainer.innerHTML = trending.map(p => this.createProductCardHTML(p, true)).join("");
    }

    if (bestSellersContainer) {
      const best = products.filter(p => p.bestseller).concat(products.slice(4, 9));
      bestSellersContainer.innerHTML = best.slice(0, 8).map(p => this.createProductCardHTML(p, true)).join("");
    }
  },

  // Offers Page with live countdown clock
  initOffersCountdown() {
    function updateClock() {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);
      const diff = Math.max(0, midnight - now);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const hEl = document.getElementById("countdown-h");
      const mEl = document.getElementById("countdown-m");
      const sEl = document.getElementById("countdown-s");

      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
      if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
    }
    updateClock();
    setInterval(updateClock, 1000);
  },

  filterOffersCategory(element, category) {
    if (element) {
      document.querySelectorAll(".offer-cat-card").forEach(c => c.classList.remove("active"));
      element.classList.add("active");
    }
    this.renderOffersPage(category);
    const dealsEl = document.getElementById("todays-deals-section");
    if (dealsEl && !element) {
      dealsEl.scrollIntoView({ behavior: 'smooth' });
    }
  },

  renderOffersPage(filter = "all") {
    const container = document.getElementById("offers-deals-grid") || document.getElementById("offers-products-grid");
    if (!container) return;

    const products = Storage.get(CONFIG.storageKeys.products, PRODUCTS_DATA);
    let deals = [];

    if (filter === "ramadan") {
      deals = products.filter(p => p.tags.includes("ramadan") || p.tags.includes("quran") || p.tags.includes("prayer mat"));
    } else if (filter === "combo") {
      deals = products.filter(p => p.category === "gifts-combos" || p.id === "prod-ramadan-gift-hamper");
    } else if (filter === "new") {
      deals = products.filter(p => p.isNew || p.tags.includes("premium") || p.category === "attar-fragrance");
    } else if (filter === "bestsellers") {
      deals = products.filter(p => p.bestseller || p.rating >= 4.8);
    } else {
      // Default: the 4 featured deal products matching the reference screenshot exactly!
      const targetIds = ["prod-quran-english", "prod-crystal-tasbih", "prod-nida-abaya-black", "prod-oud-arab-attar"];
      deals = targetIds.map(id => products.find(p => p.id === id)).filter(Boolean);
      if (deals.length < 4) {
        deals = products.filter(p => p.discount >= 15).slice(0, 4);
      }
    }

    container.innerHTML = deals.map(p => this.createOfferDealCardHTML(p)).join("");
  },

  createOfferDealCardHTML(product) {
    const isWishlisted = Storage.isWishlisted(product.id);
    const discount = product.discount || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) || 25;
    const rating = product.rating || 4.8;
    const reviewCount = product.reviewCount || 120;

    return `
      <div class="deal-prod-card" onclick="UI.openProductModal('${product.id}')">
        <span class="deal-discount-tag">${discount}% OFF</span>
        <button class="deal-wish-btn ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation(); UI.toggleWishlist('${product.id}', this)" aria-label="Wishlist">
          <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>
        <div class="deal-thumb-box">
          <img src="${product.image}" alt="${product.name}" class="deal-thumb-img" loading="lazy">
        </div>
        <div class="deal-prod-title" title="${product.name}">${product.name}</div>
        <div class="deal-rating">★ ${rating} (${reviewCount})</div>
        <div class="deal-price-row">
          <span class="deal-price-curr">₹${product.price}</span>
          ${product.originalPrice ? `<span class="deal-price-old">₹${product.originalPrice}</span>` : ''}
        </div>
        <button class="deal-add-btn" onclick="event.stopPropagation(); CartService.addItem('${product.id}', 1); UI.showToast('Added to Cart! 🛒');">
          <i class="fa-solid fa-cart-shopping"></i> Add to Cart
        </button>
      </div>
    `;
  },

  modalSelectedQty: 1,

  changeModalQty(delta) {
    this.modalSelectedQty = Math.max(1, (this.modalSelectedQty || 1) + delta);
    const qtyVal = document.getElementById("modal-qty-val");
    if (qtyVal) qtyVal.textContent = this.modalSelectedQty;
  },

  switchModalImage(src, clickedElem) {
    const mainImg = document.getElementById("modal-main-img");
    if (mainImg) mainImg.src = src;
    document.querySelectorAll(".product-modal-thumb").forEach(t => t.classList.remove("active"));
    if (clickedElem) clickedElem.classList.add("active");
  },

  // Open Product Details Modal
  openProductModal(productId) {
    const products = Storage.get(CONFIG.storageKeys.products, PRODUCTS_DATA);
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById("product-modal");
    const content = document.getElementById("product-modal-body");
    if (!modal || !content) return;

    this.modalSelectedQty = 1;
    const isWish = Storage.isWishlisted(product.id);
    const images = product.images && product.images.length ? product.images : [product.image];
    const discount = product.discount || (product.originalPrice ? Math.round(((product.originalPrice - product.price)/product.originalPrice)*100) : 20);

    content.innerHTML = `
      <div class="product-modal-grid">
        <!-- Left Column: Media Gallery -->
        <div class="product-modal-gallery">
          <div class="product-modal-main-img-wrap">
            <span class="discount-pill-badge product-modal-badge">
              -${discount}% OFF
            </span>
            <button class="product-modal-fav-btn ${isWish ? 'active' : ''}" onclick="UI.handleWishlistToggle('${product.id}'); this.classList.toggle('active'); this.innerHTML = '<i class=\\'fa-' + (this.classList.contains('active') ? 'solid' : 'regular') + ' fa-heart\\'></i>';" aria-label="Add to Wishlist">
              <i class="fa-${isWish ? 'solid' : 'regular'} fa-heart"></i>
            </button>
            <img id="modal-main-img" src="${images[0]}" alt="${product.name}" class="product-modal-main-img">
            <span class="product-modal-img-count">
              <i class="fa-regular fa-image"></i> ${images.length} Photos
            </span>
          </div>

          ${images.length > 1 ? `
            <div class="product-modal-thumbs">
              ${images.map((img, idx) => `
                <div class="product-modal-thumb ${idx === 0 ? 'active' : ''}" onclick="UI.switchModalImage('${img}', this)">
                  <img src="${img}" alt="thumbnail ${idx+1}">
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div class="product-modal-trust-strip">
            <div class="trust-pill"><i class="fa-solid fa-bolt text-gold"></i> Fast delivery from Koregaon to Shirur</div>
            <div class="trust-pill"><i class="fa-solid fa-shield-halved text-emerald"></i> 100% Authentic & Halal Certified</div>
          </div>
        </div>

        <!-- Right Column: Details, Pricing, Qty, and Actions -->
        <div class="product-modal-info">
          <div class="product-modal-meta-top">
            <span class="product-modal-category">${product.categoryName || 'ISLAMIC ESSENTIALS'}</span>
            <div class="product-modal-stars">
              <span class="stars-gold">★★★★★</span>
              <span class="stars-label">4.9 (120+ orders)</span>
            </div>
          </div>

          <h2 class="product-modal-title">${product.name}</h2>
          ${product.subtitle ? `<p class="product-modal-subtitle">${product.subtitle}</p>` : ''}

          <div class="product-modal-pricing">
            <div class="price-row-main">
              <span class="product-modal-price">₹${product.price}</span>
              ${product.originalPrice ? `<span class="product-modal-old-price">₹${product.originalPrice}</span>` : ''}
              <span class="product-modal-save-pill">Save ₹${(product.originalPrice ? product.originalPrice - product.price : Math.round(product.price * 0.2))}</span>
            </div>
            <div class="product-modal-tax-note">Inclusive of all taxes · Cash on Delivery & UPI available</div>
          </div>

          <div class="product-modal-stock-status">
            <span class="stock-dot"></span>
            <strong>In Stock</strong> &nbsp;·&nbsp; Ready for dispatch in Shirur Taluka
          </div>

          <div class="product-modal-desc-box">
            <h4 class="desc-heading"><i class="fa-solid fa-circle-info text-emerald"></i> About This Product</h4>
            <p class="desc-text">${product.description || 'Authentic high-quality Islamic essential carefully checked and verified for quality.'}</p>
          </div>

          <!-- Quantity Selector & Action Bar -->
          <div class="product-modal-action-section">
            <div class="product-modal-qty-row">
              <span class="qty-label">Select Quantity:</span>
              <div class="product-modal-qty-control">
                <button type="button" class="qty-btn" onclick="UI.changeModalQty(-1)" aria-label="Decrease quantity">−</button>
                <span id="modal-qty-val" class="qty-display">1</span>
                <button type="button" class="qty-btn" onclick="UI.changeModalQty(1)" aria-label="Increase quantity">+</button>
              </div>
            </div>

            <div class="product-modal-cta-buttons">
              <button class="btn btn-outline product-modal-cart-btn" onclick="UI.handleAddToCart('${product.id}', UI.modalSelectedQty); UI.closeProductModal();">
                <i class="fa-solid fa-bag-shopping"></i> Add to Cart
              </button>
              <button class="btn btn-primary product-modal-wa-btn" onclick="UI.instantOrderWhatsApp('${product.id}', UI.modalSelectedQty);">
                <i class="fa-brands fa-whatsapp"></i> Order on WhatsApp ⚡
              </button>
            </div>
          </div>

        </div>
      </div>
    `;

    modal.classList.add("open");
  },

  instantOrderWhatsApp(productId, qty = 1) {
    this.handleAddToCart(productId, qty || 1);
    this.closeProductModal();
    Router.navigate("#checkout");
  },

  closeProductModal() {
    const modal = document.getElementById("product-modal");
    if (modal) modal.classList.remove("open");
  },

  handleAddToCart(productId, qty = 1) {
    const products = Storage.get(CONFIG.storageKeys.products, PRODUCTS_DATA);
    const product = products.find(p => p.id === productId);
    if (!product) return;
    Storage.addToCart(product, qty);
    this.showToast(`Added "${product.name.slice(0, 20)}..." to Cart ✓`);
    this.updateHeaderBadges();
  },

  handleWishlistToggle(productId) {
    const { added } = Storage.toggleWishlist(productId);
    const products = Storage.get(CONFIG.storageKeys.products, PRODUCTS_DATA);
    const product = products.find(p => p.id === productId);
    const name = product ? product.name.slice(0, 20) : "Product";

    if (added) {
      this.showToast(`Saved "${name}..." to Wishlist ❤️`);
    } else {
      this.showToast(`Removed from Wishlist`);
    }

    this.updateHeaderBadges();
    document.querySelectorAll(`.product-card[data-product-id="${productId}"] .product-wishlist-btn`).forEach(btn => {
      btn.classList.toggle("active", added);
      btn.innerHTML = `<i class="${added ? 'fa-solid' : 'fa-regular'} fa-heart"></i>`;
    });
  },

  updateHeaderBadges() {
    const cartSummary = CartService.getSummary();
    const wishlist = Storage.getWishlist();

    document.querySelectorAll(".cart-badge-count").forEach(el => {
      el.textContent = cartSummary.count;
      el.style.display = cartSummary.count > 0 ? "flex" : "none";
    });

    document.querySelectorAll(".wishlist-badge-count").forEach(el => {
      el.textContent = wishlist.length;
      el.style.display = wishlist.length > 0 ? "flex" : "none";
    });
  },

  // ==========================================
  // CUSTOM BRANDED POPUPS & LOCATION PICKER
  // ==========================================
  showCustomModal({ title = "Notice", message = "", icon = "fa-solid fa-circle-check", iconColor = "var(--color-emerald)", confirmText = "OK", onConfirm = null }) {
    const modal = document.getElementById("custom-alert-modal");
    const titleEl = document.getElementById("custom-alert-title");
    const msgEl = document.getElementById("custom-alert-msg");
    const iconEl = document.getElementById("custom-alert-icon");
    const actionsEl = document.getElementById("custom-alert-actions");

    if (!modal) {
      alert(message || title);
      return;
    }

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;
    if (iconEl) {
      iconEl.innerHTML = `<i class="${icon}" style="color:${iconColor}; font-size:2.4rem;"></i>`;
    }
    if (actionsEl) {
      actionsEl.innerHTML = `
        <button type="button" class="btn btn-primary" style="flex:1; border-radius:var(--radius-full); padding:11px;" onclick="UI.closeCustomModal(); ${onConfirm ? 'UI._onCustomConfirm()' : ''}">
          ${confirmText}
        </button>
      `;
    }
    this._customConfirmHandler = onConfirm;
    modal.classList.add("open");
  },

  _onCustomConfirm() {
    if (typeof this._customConfirmHandler === 'function') {
      this._customConfirmHandler();
    }
    this._customConfirmHandler = null;
  },

  closeCustomModal() {
    const modal = document.getElementById("custom-alert-modal");
    if (modal) modal.classList.remove("open");
  },

  detectCurrentLocation() {
    this.openLocationModal();
  },

  openLocationModal() {
    const modal = document.getElementById("location-picker-modal");
    if (modal) {
      const badge = document.getElementById("gps-status-badge");
      if (badge) {
        badge.textContent = "Detect";
        badge.style.background = "#E0F2FE";
        badge.style.color = "#0369A1";
      }
      modal.classList.add("open");
    }
  },

  closeLocationModal() {
    const modal = document.getElementById("location-picker-modal");
    if (modal) modal.classList.remove("open");
  },

  triggerGpsDetection() {
    const badge = document.getElementById("gps-status-badge");
    if (badge) {
      badge.textContent = "Locating...";
      badge.style.background = "#FEF3C7";
      badge.style.color = "#B45309";
    }

    if (!navigator.geolocation) {
      this.showCustomModal({
        title: "GPS Not Supported",
        message: "Your browser doesn't support automatic geolocation. Please choose your village from the quick buttons below.",
        icon: "fa-solid fa-triangle-exclamation",
        iconColor: "#F59E0B"
      });
      return;
    }

    const onLocationSuccess = (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
      const input = document.getElementById("checkout-location-link");
      if (input) input.value = mapsUrl;

      Storage.saveCustomer({ locationLink: mapsUrl });

      if (badge) {
        badge.textContent = "Locked ✓";
        badge.style.background = "#DCFCE7";
        badge.style.color = "#15803D";
      }

      this.showToast("📍 Location locked successfully!");
      setTimeout(() => this.closeLocationModal(), 600);
    };

    const onLocationFail = (err) => {
      console.warn("High accuracy geolocation failed, trying standard accuracy:", err);
      navigator.geolocation.getCurrentPosition(
        onLocationSuccess,
        () => {
          if (badge) {
            badge.textContent = "Retry / Pick Village";
            badge.style.background = "#FEE2E2";
            badge.style.color = "#DC2626";
          }
          this.showCustomModal({
            title: "GPS Permission Notice",
            message: "Unable to retrieve device GPS. Please enable Location in phone settings, or simply tap your village name below.",
            icon: "fa-solid fa-location-crosshairs",
            iconColor: "#F59E0B"
          });
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 120000 }
      );
    };

    navigator.geolocation.getCurrentPosition(
      onLocationSuccess,
      onLocationFail,
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 60000 }
    );
  },

  selectQuickVillage(village, pincode) {
    const villageInput = document.getElementById("checkout-village");
    const pincodeInput = document.getElementById("checkout-pincode");
    const locationInput = document.getElementById("checkout-location-link");

    if (villageInput) villageInput.value = village;
    if (pincodeInput && pincode) pincodeInput.value = pincode;

    const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(village + ', Shirur, Maharashtra')}`;
    if (locationInput) locationInput.value = mapsUrl;

    Storage.saveCustomer({
      village: village,
      pincode: pincode || "412208",
      locationLink: mapsUrl
    });

    this.closeLocationModal();
    this.showToast(`📍 Location set to ${village}!`);
  },

  applyManualLocation() {
    const manualVal = document.getElementById("manual-modal-loc-input")?.value.trim();
    if (!manualVal) {
      this.showToast("Please paste a valid Google Maps link!");
      return;
    }
    const locationInput = document.getElementById("checkout-location-link");
    if (locationInput) locationInput.value = manualVal;
    Storage.saveCustomer({ locationLink: manualVal });
    this.closeLocationModal();
    this.showToast("Location saved! 📍");
  },

  filterOrdersTab(btnElement, filterStatus) {
    if (btnElement) {
      document.querySelectorAll(".order-filter-pill").forEach(p => p.classList.remove("active"));
      btnElement.classList.add("active");
    }
    this.renderOrdersPage(filterStatus);
  },

  renderOrdersPage(filterStatus = "all") {
    const container = document.getElementById("my-orders-list");
    if (!container) return;

    let orders = Storage.getOrders();
    if (filterStatus && filterStatus !== "all" && filterStatus !== "All Orders") {
      const target = filterStatus.toLowerCase();
      orders = orders.filter(o => {
        const s = (o.orderStatus || "").toLowerCase();
        if (target === "pending") return s === "pending";
        if (target === "processing") return s === "processing" || s === "out for delivery" || s === "shipped";
        if (target === "delivered") return s === "delivered";
        if (target === "cancelled") return s === "cancelled";
        return s === target;
      });
    }

    if (!orders || orders.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding: 48px 16px; background:var(--color-white); border-radius:18px; border:1px solid #EEF2F6; margin-bottom:16px;">
          <div style="font-size:2.8rem; margin-bottom:10px;">📦</div>
          <h3 style="font-size:1.1rem; font-weight:800; color:var(--color-charcoal); margin-bottom:4px;">No Orders Found</h3>
          <p style="font-size:0.84rem; color:var(--color-charcoal-muted); margin-bottom:18px;">You have no orders matching this filter.</p>
          <button class="btn btn-primary btn-sm" style="border-radius:var(--radius-full);" onclick="Router.navigate('#home')">Explore Essentials</button>
        </div>
      `;
      return;
    }

    container.innerHTML = orders.map(order => {
      const firstItem = (order.items && order.items[0]) ? order.items[0] : {
        name: "Islamic Essential Product",
        price: order.total || 499,
        image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=300&q=80"
      };

      const status = (order.orderStatus || "Pending").toLowerCase();
      let badgeClass = "badge-pending";
      let statusIcon = '<i class="fa-regular fa-clock"></i>';
      let statusNote = order.statusNote || "Waiting for confirmation";
      let noteClass = "";
      let actionLabel = order.actionLabel || "View Details";
      let actionHandler = `UI.openOrderDetailsModal('${order.id}')`;

      if (status === "delivered") {
        badgeClass = "badge-delivered";
        statusIcon = '<i class="fa-regular fa-circle-check"></i>';
        statusNote = order.statusNote || "Alhamdulillah! 🎉";
        actionLabel = "Buy Again";
        actionHandler = `UI.reorderItems('${order.id}')`;
      } else if (status === "out for delivery" || status === "out-for-delivery") {
        badgeClass = "badge-out-for-delivery";
        statusIcon = '<i class="fa-solid fa-truck-fast"></i>';
        statusNote = order.statusNote || "Arriving Today";
        noteClass = "highlight-blue";
        actionLabel = "Track Order";
        actionHandler = `UI.openOrderTrackingModal('${order.id}')`;
      } else if (status === "processing" || status === "shipped") {
        badgeClass = "badge-processing";
        statusIcon = '<i class="fa-solid fa-box-archive"></i>';
        statusNote = order.statusNote || "Preparing your order";
        actionLabel = "View Details";
        actionHandler = `UI.openOrderDetailsModal('${order.id}')`;
      } else if (status === "cancelled") {
        badgeClass = "badge-cancelled";
        statusIcon = '<i class="fa-regular fa-circle-xmark"></i>';
        statusNote = order.statusNote || "Order was cancelled";
        actionLabel = "View Details";
        actionHandler = `UI.openOrderDetailsModal('${order.id}')`;
      } else if (status === "pending") {
        badgeClass = "badge-pending";
        statusIcon = '<i class="fa-regular fa-clock"></i>';
        statusNote = order.statusNote || "Waiting for confirmation";
        actionLabel = "Cancel Order";
        actionHandler = `UI.cancelOrderPrompt('${order.id}')`;
      }

      const metaText = order.itemCountText || `${order.items ? order.items.length : 1} item • ₹${order.total}`;

      return `
        <div class="order-ref-card" onclick="UI.openOrderDetailsModal('${order.id}')">
          <div class="order-ref-thumb">
            <img src="${firstItem.image}" alt="${firstItem.name}" class="order-ref-img" loading="lazy">
          </div>
          <div class="order-ref-info">
            <div class="order-ref-num">Order #${order.id}</div>
            <div class="order-ref-title">${firstItem.name}</div>
            <div class="order-ref-meta">${metaText}</div>
            <div class="order-ref-date">${order.date || 'Recent'}</div>
          </div>
          <div class="order-ref-right">
            <div class="order-ref-status-row">
              <span class="order-ref-status-badge ${badgeClass}">
                ${statusIcon} ${order.orderStatus}
              </span>
              <i class="fa-solid fa-chevron-right order-ref-chevron"></i>
            </div>
            <div class="order-ref-note ${noteClass}">${statusNote}</div>
            <button class="order-ref-btn ${actionLabel === 'Cancel Order' ? 'btn-cancel' : ''}" 
                    onclick="event.stopPropagation(); ${actionHandler}">
              ${actionLabel}
            </button>
          </div>
        </div>
      `;
    }).join("");
  },

  openOrderTrackingModal(orderId) {
    const order = Storage.getOrderById(orderId);
    if (!order) return;

    const modal = document.getElementById("order-modal");
    const body = document.getElementById("order-modal-body");
    if (!modal || !body) return;

    const isDelivered = (order.orderStatus || "").toLowerCase() === "delivered";

    body.innerHTML = `
      <div class="order-modal-head">
        <div>
          <span style="font-size:0.75rem; color:#64748B; font-weight:600;">TRACK ORDER</span>
          <h3 class="order-modal-title">#${order.id}</h3>
        </div>
        <span class="order-ref-status-badge badge-out-for-delivery" style="padding:4px 12px; font-size:0.8rem;">
          <i class="fa-solid fa-truck-fast"></i> ${order.orderStatus}
        </span>
      </div>

      <div style="background:#F8FAFC; border:1px solid #EEF2F6; border-radius:14px; padding:12px; margin-bottom:16px;">
        <div style="font-size:0.8rem; color:#64748B;">Estimated Delivery:</div>
        <div style="font-size:0.95rem; font-weight:800; color:var(--color-emerald);">Today by 8:00 PM • Shikrapur Local Express</div>
      </div>

      <div class="order-timeline">
        <div class="timeline-step completed">
          <div class="timeline-dot"><i class="fa-solid fa-check"></i></div>
          <div class="timeline-step-title">Order Placed & Confirmed</div>
          <div class="timeline-step-desc">${order.date || 'Earlier'} • Order verified by DeenKart store</div>
        </div>

        <div class="timeline-step completed">
          <div class="timeline-dot"><i class="fa-solid fa-check"></i></div>
          <div class="timeline-step-title">Packed with Care & Barakah</div>
          <div class="timeline-step-desc">Quality checked and bubble-wrapped</div>
        </div>

        <div class="timeline-step ${isDelivered ? 'completed' : 'current'}">
          <div class="timeline-dot"><i class="fa-solid fa-truck"></i></div>
          <div class="timeline-step-title">Out for Delivery (Koregaon to Shirur)</div>
          <div class="timeline-step-desc">Our delivery partner is on the way (PIN: 412208)</div>
        </div>

        <div class="timeline-step ${isDelivered ? 'completed' : ''}">
          <div class="timeline-dot"><i class="fa-solid fa-house"></i></div>
          <div class="timeline-step-title">Delivered to Doorstep</div>
          <div class="timeline-step-desc">Doorstep delivery completed</div>
        </div>
      </div>

      <div style="display:flex; gap:10px; margin-top:20px;">
        <a href="${WhatsAppService.buildOrderChatUrl(order.id)}" target="_blank" class="btn btn-primary" style="flex:1; border-radius:var(--radius-full);">
          <i class="fa-brands fa-whatsapp"></i> Chat with Delivery Agent
        </a>
      </div>
    `;

    modal.classList.add("active");
  },

  openOrderDetailsModal(orderId) {
    const order = Storage.getOrderById(orderId);
    if (!order) return;

    const modal = document.getElementById("order-modal");
    const body = document.getElementById("order-modal-body");
    if (!modal || !body) return;

    const statusBadgeClass = (order.orderStatus || 'pending').toLowerCase().replace(/\s+/g, '-');

    body.innerHTML = `
      <div class="order-modal-head">
        <div>
          <span style="font-size:0.75rem; color:#64748B; font-weight:600;">ORDER DETAILS</span>
          <h3 class="order-modal-title">#${order.id}</h3>
        </div>
        <span class="order-ref-status-badge badge-${statusBadgeClass}">
          ${order.orderStatus}
        </span>
      </div>

      <div style="margin-bottom:14px;">
        <div style="font-size:0.75rem; color:#94A3B8; text-transform:uppercase; font-weight:700; margin-bottom:8px;">Items in this Order</div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${(order.items || []).map(item => `
            <div style="display:flex; align-items:center; gap:12px; background:#F8FAFC; border:1px solid #EEF2F6; border-radius:12px; padding:10px;">
              <img src="${item.image}" alt="${item.name}" style="width:48px; height:48px; object-fit:contain; border-radius:8px; background:#fff; padding:2px;">
              <div style="flex:1; min-width:0;">
                <div style="font-size:0.85rem; font-weight:700; color:var(--color-charcoal);">${item.name}</div>
                <div style="font-size:0.78rem; color:#64748B;">Qty: ${item.qty || 1} • ₹${item.price}</div>
              </div>
              <div style="font-size:0.92rem; font-weight:800; color:var(--color-charcoal);">₹${(item.price || 0) * (item.qty || 1)}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="background:#F8FAFC; border:1px solid #EEF2F6; border-radius:14px; padding:14px; margin-bottom:16px;">
        <div style="font-size:0.75rem; color:#94A3B8; text-transform:uppercase; font-weight:700; margin-bottom:6px;">Delivery Address</div>
        <div style="font-size:0.86rem; font-weight:700; color:var(--color-charcoal);">${order.deliveryAddress?.name || 'Customer'}</div>
        <div style="font-size:0.8rem; color:#64748B; margin-top:2px;">
          ${order.deliveryAddress?.house || 'Flat No.'}, ${order.deliveryAddress?.area || 'Area / Street'}, ${order.deliveryAddress?.city || 'Shikrapur'} - 412208
        </div>
        <div style="font-size:0.78rem; color:var(--color-emerald); font-weight:600; margin-top:4px;">
          <i class="fa-solid fa-phone"></i> ${order.deliveryAddress?.phone || '+91 98765 00000'}
        </div>
      </div>

      <div style="border-top:1px solid #EEF2F6; padding-top:12px; margin-bottom:18px;">
        <div style="display:flex; justify-content:space-between; font-size:0.84rem; color:#64748B; margin-bottom:4px;">
          <span>Subtotal:</span>
          <span>₹${order.subtotal || order.total}</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.84rem; color:#64748B; margin-bottom:6px;">
          <span>Delivery (Koregaon to Shirur):</span>
          <span style="color:var(--color-emerald); font-weight:600;">FREE</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:1.05rem; font-weight:800; color:var(--color-charcoal);">
          <span>Total Paid:</span>
          <span style="color:var(--color-emerald);">₹${order.total}</span>
        </div>
      </div>

      <div style="display:flex; gap:10px;">
        <button class="btn btn-outline" style="flex:1; border-radius:var(--radius-full);" onclick="UI.reorderItems('${order.id}'); UI.closeOrderModal();">
          <i class="fa-solid fa-arrows-rotate"></i> Buy Again
        </button>
        <a href="${WhatsAppService.buildOrderChatUrl(order.id)}" target="_blank" class="btn btn-primary" style="flex:1; border-radius:var(--radius-full);">
          <i class="fa-brands fa-whatsapp"></i> Order Support
        </a>
      </div>
    `;

    modal.classList.add("active");
  },

  closeOrderModal() {
    const modal = document.getElementById("order-modal");
    if (modal) modal.classList.remove("active");
  },

  cancelOrderPrompt(orderId) {
    if (confirm(`Are you sure you want to cancel Order #${orderId}?`)) {
      const orders = Storage.getOrders();
      const order = orders.find(o => o.id === orderId);
      if (order) {
        order.orderStatus = "Cancelled";
        order.statusNote = "Order was cancelled";
        order.actionLabel = "View Details";
        Storage.set(CONFIG.storageKeys.orders, orders);
        this.showToast(`Order #${orderId} has been cancelled.`);
        this.renderOrdersPage("all");
      }
    }
  },

  reorderItems(orderId) {
    const order = Storage.getOrderById(orderId);
    if (!order || !order.items) return;
    order.items.forEach(item => {
      Storage.addToCart(item, item.qty || 1);
    });
    this.showToast("Items added to cart! Proceeding to checkout...");
    Router.navigate("#checkout");
  },

  renderProfilePage() {
    const customer = Storage.getCustomer();
    const orders = Storage.getOrders();
    const wishlist = Storage.getWishlist();

    const nameEl = document.getElementById("profile-name");
    const phoneEl = document.getElementById("profile-phone");
    const emailEl = document.getElementById("profile-email");
    const ordersCountEl = document.getElementById("profile-orders-count");
    const wishCountEl = document.getElementById("profile-wishlist-count");
    const addressCountEl = document.getElementById("profile-address-count");
    const rewardPointsEl = document.getElementById("profile-reward-points");

    const name = customer.name ? customer.name.trim() : "Your Name";
    if (nameEl) nameEl.textContent = name;
    if (phoneEl) phoneEl.textContent = customer.whatsapp ? `+91 ${customer.whatsapp}` : "+91 98765 43210";
    if (emailEl) emailEl.textContent = customer.email ? customer.email : "Add email address";
    if (ordersCountEl) ordersCountEl.textContent = orders.length;
    if (wishCountEl) wishCountEl.textContent = wishlist.length;
    if (addressCountEl) addressCountEl.textContent = (customer.house || customer.area) ? 1 : 0;
    if (rewardPointsEl) rewardPointsEl.textContent = orders.length * 20;

    const initial = (name && name !== "Your Name") ? name.charAt(0).toUpperCase() : "Y";
    document.querySelectorAll(".profile-avatar-circle").forEach(el => {
      el.textContent = initial;
    });

    const sidebarName = document.getElementById("sidebar-user-name");
    if (sidebarName) sidebarName.textContent = name;
    const sidebarInitial = document.getElementById("sidebar-user-initial");
    if (sidebarInitial) sidebarInitial.textContent = initial;
  },

  openEditProfileModal() {
    const customer = Storage.getCustomer();
    const nameInput = document.getElementById("edit-profile-name");
    const phoneInput = document.getElementById("edit-profile-phone");
    const emailInput = document.getElementById("edit-profile-email");
    const houseInput = document.getElementById("edit-profile-house");
    const areaInput = document.getElementById("edit-profile-area");
    const villageInput = document.getElementById("edit-profile-village");
    const landmarkInput = document.getElementById("edit-profile-landmark");
    const pincodeInput = document.getElementById("edit-profile-pincode");

    if (nameInput) nameInput.value = customer.name || "";
    if (phoneInput) phoneInput.value = customer.whatsapp || "";
    if (emailInput) emailInput.value = customer.email || "";
    if (houseInput) houseInput.value = customer.house || "";
    if (areaInput) areaInput.value = customer.area || "";
    if (villageInput) villageInput.value = customer.village || "";
    if (landmarkInput) landmarkInput.value = customer.landmark || "";
    if (pincodeInput) pincodeInput.value = customer.pincode || "412208";

    const modal = document.getElementById("edit-profile-modal");
    if (modal) modal.classList.add("open");
  },

  closeEditProfileModal() {
    const modal = document.getElementById("edit-profile-modal");
    if (modal) modal.classList.remove("open");
  },

  saveProfile() {
    const name = document.getElementById("edit-profile-name")?.value.trim() || "";
    const phone = document.getElementById("edit-profile-phone")?.value.trim() || "";
    const email = document.getElementById("edit-profile-email")?.value.trim() || "";
    const house = document.getElementById("edit-profile-house")?.value.trim() || "";
    const area = document.getElementById("edit-profile-area")?.value.trim() || "";
    const village = document.getElementById("edit-profile-village")?.value.trim() || "";
    const landmark = document.getElementById("edit-profile-landmark")?.value.trim() || "";
    const pincode = document.getElementById("edit-profile-pincode")?.value.trim() || "412208";

    if (!name || !phone) {
      this.showCustomModal({
        title: "Missing Information",
        message: "Please enter your Full Name and WhatsApp phone number!",
        icon: "fa-solid fa-triangle-exclamation",
        iconColor: "#F59E0B"
      });
      return;
    }

    const updatedCustomer = {
      name,
      whatsapp: phone,
      email,
      house,
      area,
      village,
      landmark,
      pincode: pincode,
      city: village || "Shikrapur"
    };

    Storage.saveCustomer(updatedCustomer);
    this.renderProfilePage();
    this.renderCheckout();
    this.closeEditProfileModal();
    this.showToast("Profile & Address updated successfully! ✨");
  },

  _checkoutInputsBound: false,
  bindCheckoutInputSync() {
    if (this._checkoutInputsBound) return;
    this._checkoutInputsBound = true;
    const fields = [
      { id: "checkout-name", key: "name" },
      { id: "checkout-phone", key: "whatsapp" },
      { id: "checkout-house", key: "house" },
      { id: "checkout-area", key: "area" },
      { id: "checkout-village", key: "village" },
      { id: "checkout-landmark", key: "landmark" },
      { id: "checkout-pincode", key: "pincode" },
      { id: "checkout-location-link", key: "locationLink" },
      { id: "checkout-notes", key: "orderNotes" }
    ];
    fields.forEach(({ id, key }) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", () => {
          const val = el.value.trim();
          Storage.saveCustomer({ [key]: val });
        });
      }
    });
  },

  // Simplified Checkout: ONLY Address & Order Summary (NO UPI CARD!)
  renderCheckout() {
    const customer = Storage.getCustomer();
    const summary = CartService.getSummary();

    const nameInput = document.getElementById("checkout-name");
    const phoneInput = document.getElementById("checkout-phone");
    const houseInput = document.getElementById("checkout-house");
    const areaInput = document.getElementById("checkout-area");
    const villageInput = document.getElementById("checkout-village");
    const landmarkInput = document.getElementById("checkout-landmark");
    const pincodeInput = document.getElementById("checkout-pincode");
    const locationInput = document.getElementById("checkout-location-link");

    if (nameInput) nameInput.value = customer.name || "";
    if (phoneInput) phoneInput.value = customer.whatsapp || "";
    if (houseInput) houseInput.value = customer.house || "";
    if (areaInput) areaInput.value = customer.area || "";
    if (villageInput) villageInput.value = customer.village || "";
    if (landmarkInput) landmarkInput.value = customer.landmark || "";
    if (pincodeInput) pincodeInput.value = customer.pincode || "412208";
    if (locationInput) locationInput.value = customer.locationLink || "";

    this.bindCheckoutInputSync();

    const subtotalEl = document.getElementById("checkout-subtotal");
    const discountEl = document.getElementById("checkout-discount");
    const deliveryEl = document.getElementById("checkout-delivery");
    const totalEl = document.getElementById("checkout-total");
    const freeProgressBar = document.getElementById("free-shipping-bar");
    const freeProgressText = document.getElementById("free-shipping-text");

    if (subtotalEl) subtotalEl.textContent = `₹${summary.subtotal}`;
    if (discountEl) discountEl.textContent = summary.discount > 0 ? `-₹${summary.discount}` : `₹0`;
    if (deliveryEl) deliveryEl.textContent = summary.deliveryFee === 0 ? "FREE" : `₹${summary.deliveryFee}`;
    if (totalEl) totalEl.textContent = `₹${summary.total}`;

    if (freeProgressBar) freeProgressBar.style.width = `${summary.freeShippingProgress}%`;
    if (freeProgressText) {
      if (summary.amountNeededForFreeShipping > 0) {
        freeProgressText.textContent = `Add ₹${summary.amountNeededForFreeShipping} more for FREE Delivery (Koregaon to Shirur)!`;
      } else {
        freeProgressText.textContent = `🎉 You unlocked FREE Delivery from Koregaon to Shirur!`;
      }
    }

    const itemsContainer = document.getElementById("checkout-order-items");
    if (itemsContainer) {
      if (summary.items.length === 0) {
        itemsContainer.innerHTML = `<p style="color:var(--color-charcoal-muted); font-size:0.9rem; padding:12px 0;">Your cart is empty. <a href="#home" class="text-emerald font-bold">Shop now</a></p>`;
      } else {
        itemsContainer.innerHTML = summary.items.map(item => `
          <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--color-border-subtle);">
            <div style="display:flex; align-items:center; gap:12px;">
              <img src="${item.image}" alt="${item.name}" style="width:48px; height:48px; object-fit:cover; border-radius:var(--radius-sm); border:1px solid var(--color-border);">
              <div>
                <h5 style="font-size:0.88rem; font-weight:700; color:var(--color-charcoal); margin-bottom:2px;">${item.name}</h5>
                <p style="font-size:0.75rem; color:var(--color-charcoal-muted);">Qty: ${item.qty} × ₹${item.price}</p>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
              <div style="display:inline-flex; align-items:center; border:1px solid var(--color-border); border-radius:var(--radius-sm); background:var(--color-white); overflow:hidden;">
                <button style="padding:4px 8px; font-weight:700; color:var(--color-charcoal); border:none; background:none; cursor:pointer;" onclick="UI.adjustCartItem('${item.id}', -1)">-</button>
                <span style="padding:0 8px; font-size:0.85rem; font-weight:700;">${item.qty}</span>
                <button style="padding:4px 8px; font-weight:700; color:var(--color-charcoal); border:none; background:none; cursor:pointer;" onclick="UI.adjustCartItem('${item.id}', 1)">+</button>
              </div>
              <div style="font-weight:700; font-size:0.92rem; min-width:55px; text-align:right;">₹${item.price * item.qty}</div>
            </div>
          </div>
        `).join('');
      }
    }
  },

  adjustCartItem(productId, delta) {
    Storage.updateCartQty(productId, delta);
    this.renderCheckout();
    this.updateHeaderBadges();
  },

  // In-App Direct Checkout (No WhatsApp Redirect)
  executePlaceOrder() {
    const summary = CartService.getSummary();
    if (summary.items.length === 0) {
      this.showCustomModal({
        title: "Your Cart is Empty",
        message: "Please add products to your cart before proceeding to checkout.",
        icon: "fa-solid fa-bag-shopping",
        iconColor: "var(--color-emerald)",
        confirmText: "Explore Products",
        onConfirm: () => Router.navigate("#home")
      });
      return;
    }

    const name = document.getElementById("checkout-name")?.value.trim();
    const phone = document.getElementById("checkout-phone")?.value.trim();
    const house = document.getElementById("checkout-house")?.value.trim();
    const area = document.getElementById("checkout-area")?.value.trim();
    const village = document.getElementById("checkout-village")?.value.trim() || "";
    const landmark = document.getElementById("checkout-landmark")?.value.trim() || "";
    const pincode = document.getElementById("checkout-pincode")?.value.trim() || CONFIG.deliveryPincode;
    const notes = document.getElementById("checkout-notes")?.value.trim() || "";
    const locationLink = document.getElementById("checkout-location-link")?.value.trim() || "";

    if (!name || !phone || !house || !area || !village) {
      this.showCustomModal({
        title: "Incomplete Address",
        message: "Please fill in your Name, Phone Number, House/Flat, Area, and Village/Town so our rider can deliver smoothly.",
        icon: "fa-solid fa-triangle-exclamation",
        iconColor: "#F59E0B"
      });
      return;
    }

    if (!locationLink) {
      this.showToast("📍 Please select your Village or detect GPS location!");
      this.openLocationModal();
      return;
    }

    const customer = {
      name,
      whatsapp: phone,
      house,
      area,
      village,
      landmark,
      locationLink,
      pincode: pincode,
      city: village || CONFIG.deliveryCity,
      orderNotes: notes
    };

    const orderId = WhatsAppService.generateOrderId();
    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      items: summary.items,
      subtotal: summary.subtotal,
      deliveryFee: summary.deliveryFee,
      discount: summary.discount,
      total: summary.total,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Payment on Delivery",
      orderStatus: "Order Placed",
      customer: customer
    };

    // Save order locally and navigate directly to order success (No WhatsApp redirect!)
    Storage.saveCustomer(customer);
    Storage.saveOrder(newOrder);
    Storage.clearCart();
    UI.updateHeaderBadges();
    Router.navigate(`#order-success/${orderId}`);
  },

  executeWhatsAppOrder() {
    return this.executePlaceOrder();
  },

  renderOrderSuccess(orderId) {
    const order = Storage.getOrderById(orderId);
    const idEl = document.getElementById("success-order-id");
    const totalEl = document.getElementById("success-order-total");

    if (idEl) idEl.textContent = orderId || "DK-XXXX";
    if (totalEl && order) totalEl.textContent = `₹${order.total}`;
  }
};

function toggleCategorySortDropdown(event) {
  if (event) event.stopPropagation();
  const dropdown = document.getElementById("category-sort-dropdown");
  if (dropdown) dropdown.classList.toggle("show");
}

window.toggleCategorySortDropdown = toggleCategorySortDropdown;
window.applyCategorySort = (sortType) => UI.applyCategorySort(sortType);
