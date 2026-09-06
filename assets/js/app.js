/**
 * DeenKart Main Application Controller (app.js)
 * Coordinates routes, event listeners, search interactions, drawer toggles, PWA, and in-app back navigation.
 */

let deferredPwaPrompt = null;

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Subsystems
  UI.renderCategoriesScroller();
  UI.renderCategoriesPage();
  UI.renderHomeProducts();
  UI.renderOffersPage("all");
  UI.initOffersCountdown();
  UI.updateHeaderBadges();

  // 2. Setup PWA & Service Worker
  initPwaServiceWorker();

  // 3. Setup Hardware / Browser In-App Back Navigation (History API)
  setupInAppBackNavigation();

  // 4. Wire Up Route Changes
  window.addEventListener("deenkart:routeChanged", (e) => {
    const { path, segments, query } = e.detail;

    // Hide all view sections
    document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active"));

    // Update Bottom Navigation & Desktop Nav active classes
    const activeRouteKey = path.replace("#", "") || "home";
    document.querySelectorAll(".bottom-nav-item").forEach(item => {
      const target = item.getAttribute("data-route");
      item.classList.toggle("active", target === activeRouteKey);
    });

    document.querySelectorAll(".desktop-nav-link").forEach(link => {
      const href = link.getAttribute("href") || "";
      const isHome = (href === "#home" || href === "#") && (path === "#home" || path === "" || path === "#");
      const isMatch = href === path || href.startsWith(path + "?") || path.startsWith(href);
      link.classList.toggle("active", isHome || (href !== "#home" && href !== "#" && isMatch));
    });

    // Match views
    if (path === "#home" || path === "") {
      document.getElementById("view-home")?.classList.add("active");
    } else if (path === "#categories") {
      document.getElementById("view-categories")?.classList.add("active");
      UI.renderCategoriesPage();
    } else if (path === "#offers") {
      document.getElementById("view-offers")?.classList.add("active");
      UI.renderOffersPage();
    } else if (path === "#orders") {
      document.getElementById("view-orders")?.classList.add("active");
      UI.renderOrdersPage();
    } else if (path === "#profile") {
      document.getElementById("view-profile")?.classList.add("active");
      UI.renderProfilePage();
    } else if (path === "#wishlist") {
      document.getElementById("view-wishlist")?.classList.add("active");
      renderWishlistView();
    } else if (path === "#notifications") {
      document.getElementById("view-notifications")?.classList.add("active");
      renderNotificationsView();
    } else if (path === "#checkout") {
      document.getElementById("view-checkout")?.classList.add("active");
      UI.renderCheckout();
    } else if (path.startsWith("#order-success")) {
      document.getElementById("view-order-success")?.classList.add("active");
      const orderId = segments[1];
      UI.renderOrderSuccess(orderId);
    } else if (path === "#maintenance") {
      document.getElementById("view-maintenance")?.classList.add("active");
    } else if (path === "#category") {
      document.getElementById("view-category")?.classList.add("active");
      UI.renderCategoryDetail(query);
    } else if (path === "#search") {
      const p = new URLSearchParams(query || "");
      if (p.get("cat") && !p.get("q")) {
        Router.navigate('#category?id=' + p.get("cat"));
        return;
      }
      document.getElementById("view-search")?.classList.add("active");
      handleSearchRoute(query);
    } else {
      document.getElementById("view-home")?.classList.add("active");
    }
  });

  // 5. Search Interactions
  setupSearchEngine();

  // 6. Sidebar Drawer Controls
  setupSidebarDrawer();

  // 7. Reactive Listeners
  window.addEventListener("deenkart:cartChanged", () => UI.updateHeaderBadges());
  window.addEventListener("deenkart:wishlistChanged", () => UI.updateHeaderBadges());

  // 8. Start Router
  Router.init();
});

/**
 * PWA Service Worker & Install Prompt Registration
 */
function initPwaServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('DeenKart ServiceWorker registered'))
      .catch(err => console.warn('ServiceWorker registration error:', err));
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPwaPrompt = e;
    const banner = document.getElementById('pwa-install-banner');
    if (banner && !localStorage.getItem('deenkart_pwa_dismissed')) {
      banner.style.display = 'flex';
    }
  });
}

function triggerPwaInstall() {
  if (deferredPwaPrompt) {
    deferredPwaPrompt.prompt();
    deferredPwaPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        UI.showToast('Thank you for installing DeenKart App! 📲');
      }
      deferredPwaPrompt = null;
      dismissPwaBanner();
    });
  } else {
    UI.showToast('To install: tap browser menu (⋮) → "Add to Home screen" 📲');
  }
}

function dismissPwaBanner() {
  const banner = document.getElementById('pwa-install-banner');
  if (banner) banner.style.display = 'none';
  localStorage.setItem('deenkart_pwa_dismissed', 'true');
}

/**
 * Hardware / Browser In-App Back Navigation
 */
function setupInAppBackNavigation() {
  // Store initial home history state
  if (!window.history.state) {
    window.history.replaceState({ route: '#home' }, '', '');
  }

  window.addEventListener('popstate', (e) => {
    // If modal is open, close modal first instead of navigating away
    const modal = document.getElementById("product-modal");
    if (modal && modal.classList.contains("open")) {
      UI.closeProductModal();
      return;
    }

    const drawer = document.getElementById("sidebar-backdrop");
    if (drawer && drawer.classList.contains("open")) {
      drawer.classList.remove("open");
      return;
    }

    const targetRoute = (e.state && e.state.route) ? e.state.route : window.location.hash || '#home';
    if (window.location.hash !== targetRoute) {
      window.location.hash = targetRoute;
    }
  });
}

/**
 * Search Engine & Live Filter Logic
 */
const SearchEngine = {
  currentQuery: "",
  currentCategory: "",
  currentSubFilter: "all",
  currentSort: "popular",
  baseResults: [],

  // Normalizes text by removing quotes, apostrophes, accents, hyphens and extra spaces
  normalize(str) {
    if (!str) return "";
    return String(str)
      .toLowerCase()
      .replace(/['’ʻ`\-]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  },

  // Checks if a product matches the query terms
  matches(product, query) {
    if (!query || !query.trim()) return true;
    const qNorm = this.normalize(query);
    const nameNorm = this.normalize(product.name || "");
    const catNameNorm = this.normalize(product.categoryName || "");
    const catNorm = this.normalize(product.category || "");
    const subTagNorm = this.normalize(product.subTag || "");
    const tagsNorm = Array.isArray(product.tags) 
      ? product.tags.map(t => this.normalize(t)).join(" ") 
      : "";
    const descNorm = this.normalize(product.description || "");

    // Direct substring or words match
    const words = qNorm.split(" ").filter(w => w.length > 0);
    const matchAllWords = words.every(w => 
      nameNorm.includes(w) ||
      catNameNorm.includes(w) ||
      catNorm.includes(w) ||
      subTagNorm.includes(w) ||
      tagsNorm.includes(w) ||
      descNorm.includes(w)
    );

    return matchAllWords || nameNorm.includes(qNorm) || tagsNorm.includes(qNorm);
  },

  // Filters by sub-tag (All, Arabic, Translation, Tafsir, Kids, With Cover)
  matchesSubFilter(product, filter) {
    if (!filter || filter === "all") return true;
    const filterNorm = this.normalize(filter);
    const subTagNorm = this.normalize(product.subTag || "");
    const tagsNorm = Array.isArray(product.tags) 
      ? product.tags.map(t => this.normalize(t)).join(" ") 
      : "";
    const nameNorm = this.normalize(product.name || "");

    if (subTagNorm === filterNorm) return true;
    if (tagsNorm.includes(filterNorm)) return true;
    if (nameNorm.includes(filterNorm)) return true;

    // Special mappings
    if (filter === "with-cover" && (tagsNorm.includes("cover") || tagsNorm.includes("rehal") || nameNorm.includes("rehal") || nameNorm.includes("stand"))) return true;
    if (filter === "arabic" && (tagsNorm.includes("arabic") || nameNorm.includes("arabic"))) return true;
    if (filter === "translation" && (tagsNorm.includes("translation") || nameNorm.includes("translation") || nameNorm.includes("urdu") || nameNorm.includes("english"))) return true;
    if (filter === "tafsir" && (tagsNorm.includes("tafsir") || nameNorm.includes("tafsir") || tagsNorm.includes("tarjuma"))) return true;
    if (filter === "kids" && (tagsNorm.includes("kids") || nameNorm.includes("kids") || tagsNorm.includes("child"))) return true;

    return false;
  },

  // Sorts product list based on current sort criteria
  sortProducts(products, sortType) {
    const list = [...products];
    switch (sortType) {
      case "price-low":
        return list.sort((a, b) => a.price - b.price);
      case "price-high":
        return list.sort((a, b) => b.price - a.price);
      case "rating":
        return list.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
      case "discount":
        return list.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      case "popular":
      default:
        return list.sort((a, b) => {
          if (b.bestseller && !a.bestseller) return 1;
          if (a.bestseller && !b.bestseller) return -1;
          return (b.reviewsCount || 0) - (a.reviewsCount || 0);
        });
    }
  }
};

function setupSearchEngine() {
  const desktopSearchInput = document.getElementById("desktop-search-input");
  const mobileSearchInput = document.getElementById("mobile-search-input");
  const searchDropdown = document.getElementById("search-autocomplete-box");
  const viewSearchInput = document.getElementById("view-search-input");
  const clearBtn = document.getElementById("view-search-clear-btn");

  function handleLiveInput(query) {
    if (!query || query.trim().length === 0) {
      if (searchDropdown) searchDropdown.style.display = "none";
      return;
    }

    const products = Storage.getProducts();
    const matches = products.filter(p => SearchEngine.matches(p, query)).slice(0, 5);

    if (searchDropdown) {
      if (matches.length > 0) {
        searchDropdown.innerHTML = matches.map(m => `
          <div class="autocomplete-item" onclick="Router.navigate('#search?q=${encodeURIComponent(m.name)}')">
            <div style="display:flex; align-items:center; gap:10px;">
              <i class="fa-solid fa-magnifying-glass text-muted" style="font-size:0.8rem;"></i>
              <span>${m.name}</span>
            </div>
            <i class="fa-solid fa-arrow-up-right-from-square text-muted" style="font-size:0.75rem;"></i>
          </div>
        `).join("");
        searchDropdown.style.display = "block";
      } else {
        searchDropdown.innerHTML = `
          <div style="padding:12px 16px; font-size:0.85rem; color:var(--color-charcoal-muted); display:flex; justify-content:space-between; align-items:center;">
            <span>Not in catalog: "${query}"</span>
            <button class="btn btn-outline btn-sm" style="font-size:11px; padding:3px 8px;" onclick="requestProductViaWhatsApp('${query}')">
              <i class="fa-brands fa-whatsapp text-emerald"></i> Request on WhatsApp
            </button>
          </div>
        `;
        searchDropdown.style.display = "block";
      }
    }
  }

  [desktopSearchInput, mobileSearchInput].forEach(input => {
    if (!input) return;
    input.addEventListener("input", (e) => handleLiveInput(e.target.value));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.value.trim()) {
        if (searchDropdown) searchDropdown.style.display = "none";
        Router.navigate(`#search?q=${encodeURIComponent(e.target.value.trim())}`);
      }
    });
  });

  if (viewSearchInput) {
    viewSearchInput.addEventListener("input", (e) => {
      const val = e.target.value;
      if (clearBtn) clearBtn.style.display = val.length > 0 ? "flex" : "none";
      executeSearchFilter(val);
    });
    viewSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.value.trim()) {
        Storage.addRecentSearch(e.target.value.trim());
      }
    });
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".header-search-wrap") && searchDropdown) {
      searchDropdown.style.display = "none";
    }
    const sortDropdown = document.getElementById("search-sort-dropdown");
    if (sortDropdown && !e.target.closest(".sort-menu-container")) {
      sortDropdown.classList.remove("show");
    }
    const catSortDropdown = document.getElementById("category-sort-dropdown");
    if (catSortDropdown && !e.target.closest(".sort-menu-container")) {
      catSortDropdown.classList.remove("show");
    }
  });
}

function handleSearchRoute(queryPart) {
  const params = new URLSearchParams(queryPart || "");
  const q = params.get("q") || "";
  const cat = params.get("cat") || "";

  if (cat && !q) {
    Router.navigate('#category?id=' + encodeURIComponent(cat));
    return;
  }

  SearchEngine.currentQuery = q;
  SearchEngine.currentCategory = cat;
  SearchEngine.currentSubFilter = "all";

  const input = document.getElementById("view-search-input");
  const clearBtn = document.getElementById("view-search-clear-btn");
  if (input) {
    input.value = q;
    if (clearBtn) clearBtn.style.display = q.length > 0 ? "flex" : "none";
  }

  // Reset pills to "All"
  document.querySelectorAll(".search-subfilter-pill").forEach(p => {
    p.classList.toggle("active", p.textContent.trim().toLowerCase() === "all");
  });

  const allProducts = Storage.getProducts();
  let base = allProducts;
  if (cat) {
    base = base.filter(p => p.category === cat);
  }
  if (q) {
    Storage.addRecentSearch(q);
    base = base.filter(p => SearchEngine.matches(p, q));
  }
  SearchEngine.baseResults = base;

  renderActiveSearchResults();
  renderRecentSearches();
}

function executeSearchFilter(term) {
  SearchEngine.currentQuery = term || "";
  const allProducts = Storage.getProducts();
  let base = allProducts;
  if (SearchEngine.currentCategory) {
    base = base.filter(p => p.category === SearchEngine.currentCategory);
  }
  if (term && term.trim()) {
    base = base.filter(p => SearchEngine.matches(p, term));
  }
  SearchEngine.baseResults = base;
  renderActiveSearchResults();
}

function clearSearchInput() {
  const input = document.getElementById("view-search-input");
  const clearBtn = document.getElementById("view-search-clear-btn");
  if (input) {
    input.value = "";
    input.focus();
  }
  if (clearBtn) clearBtn.style.display = "none";
  executeSearchFilter("");
}

function applySearchSubFilter(pillEl, filterTag) {
  document.querySelectorAll(".search-subfilter-pill").forEach(p => p.classList.remove("active"));
  if (pillEl) pillEl.classList.add("active");
  SearchEngine.currentSubFilter = filterTag;
  renderActiveSearchResults();
}

function toggleSortDropdown(event) {
  if (event) event.stopPropagation();
  const dropdown = document.getElementById("search-sort-dropdown");
  if (dropdown) {
    dropdown.classList.toggle("show");
  }
}

function applySearchSort(sortType) {
  SearchEngine.currentSort = sortType;
  const dropdown = document.getElementById("search-sort-dropdown");
  if (dropdown) {
    dropdown.classList.remove("show");
    dropdown.querySelectorAll(".sort-dropdown-item").forEach(item => {
      const isTarget = item.getAttribute("onclick")?.includes(sortType);
      item.classList.toggle("active", Boolean(isTarget));
    });
  }
  renderActiveSearchResults();
}

function renderActiveSearchResults() {
  let filtered = SearchEngine.baseResults.filter(p => 
    SearchEngine.matchesSubFilter(p, SearchEngine.currentSubFilter)
  );

  filtered = SearchEngine.sortProducts(filtered, SearchEngine.currentSort);

  const queryLabel = SearchEngine.currentQuery || (SearchEngine.currentCategory ? "Category" : "All Products");
  renderSearchResults(filtered, queryLabel);
}

function renderSearchResults(items, queryLabel) {
  const container = document.getElementById("search-results-grid");
  const countEl = document.getElementById("search-results-count");
  if (countEl) {
    if (!SearchEngine.currentQuery) {
      countEl.textContent = `Showing ${items.length} products`;
    } else {
      countEl.textContent = `Showing ${items.length} results for "${SearchEngine.currentQuery}"`;
    }
  }

  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 48px 16px; background:var(--color-white); border-radius:var(--radius-xl); border:1px solid var(--color-border);">
        <div style="font-size:3rem; margin-bottom:12px;">🔍</div>
        <h3 style="font-size:1.1rem; font-weight:700; color:var(--color-charcoal); margin-bottom:6px;">No products found for "${queryLabel}"</h3>
        <p style="font-size:0.86rem; color:var(--color-charcoal-muted); margin-bottom:18px;">Can't find what you are looking for? We can arrange it for you in Shikrapur!</p>
        <button class="btn btn-primary" onclick="requestProductViaWhatsApp('${queryLabel}')">
          <i class="fa-brands fa-whatsapp"></i> Request Product via WhatsApp
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(p => UI.createSearchProductCardHTML(p)).join("");
}

function requestProductViaWhatsApp(query) {
  const url = WhatsAppService.buildProductRequestUrl(query || "Islamic Essential");
  window.open(url, "_blank");
}

function renderRecentSearches() {
  const container = document.getElementById("recent-searches-list");
  if (!container) return;
  const recent = Storage.getRecentSearches();

  if (recent.length === 0) {
    container.innerHTML = `<span style="font-size:0.8rem; color:var(--color-charcoal-muted);">No recent searches</span>`;
    return;
  }

  container.innerHTML = recent.map(r => `
    <span class="search-tag-chip" onclick="executeSearchFilter('${r}')">
      ${r}
      <i class="fa-solid fa-xmark remove-search-tag" onclick="event.stopPropagation(); removeRecent('${r}')"></i>
    </span>
  `).join("");
}

function removeRecent(term) {
  Storage.removeRecentSearch(term);
  renderRecentSearches();
}

// Global window exposure for inline onclick attributes
window.clearSearchInput = clearSearchInput;
window.applySearchSubFilter = applySearchSubFilter;
window.toggleSortDropdown = toggleSortDropdown;
window.applySearchSort = applySearchSort;
window.executeSearchFilter = executeSearchFilter;

/**
 * Mobile Sidebar Drawer Controls
 */
function setupSidebarDrawer() {
  const backdrop = document.getElementById("sidebar-backdrop");
  const openBtn = document.getElementById("open-sidebar-btn");
  const closeBtn = document.getElementById("close-sidebar-btn");

  if (openBtn && backdrop) {
    openBtn.addEventListener("click", () => backdrop.classList.add("open"));
  }

  if (closeBtn && backdrop) {
    closeBtn.addEventListener("click", () => backdrop.classList.remove("open"));
  }

  if (backdrop) {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) backdrop.classList.remove("open");
    });
  }

  document.querySelectorAll(".sidebar-nav-item a").forEach(link => {
    link.addEventListener("click", () => {
      if (backdrop) backdrop.classList.remove("open");
    });
  });
}

/**
 * Wishlist View Renderer
 */
function renderWishlistView() {
  const container = document.getElementById("wishlist-products-grid");
  if (!container) return;

  const products = Storage.get(CONFIG.storageKeys.products, PRODUCTS_DATA);
  const wishlistIds = Storage.getWishlist();
  const wishProducts = products.filter(p => wishlistIds.includes(p.id));

  if (wishProducts.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 48px 16px; background:var(--color-white); border-radius:var(--radius-xl); border:1px solid var(--color-border);">
        <div style="font-size:3rem; color:var(--color-charcoal-muted); margin-bottom:12px;">🤍</div>
        <h3 style="font-size:1.1rem; font-weight:700; color:var(--color-charcoal); margin-bottom:6px;">Your Wishlist is Empty</h3>
        <p style="font-size:0.86rem; color:var(--color-charcoal-muted); margin-bottom:18px;">Tap the heart icon on any product to save it for later.</p>
        <button class="btn btn-primary" onclick="Router.navigate('#home')">Explore Products</button>
      </div>
    `;
    return;
  }

  container.innerHTML = wishProducts.map(p => UI.createProductCardHTML(p)).join("");
}

/**
 * Notifications View Renderer
 */
function renderNotificationsView() {
  const container = document.getElementById("notifications-list");
  if (!container) return;

  const notifs = Storage.getNotifications();
  container.innerHTML = notifs.map(n => `
    <div style="background:var(--color-white); border:1px solid var(--color-border); border-radius:var(--radius-lg); padding:16px; margin-bottom:12px; display:flex; gap:14px; align-items:flex-start;">
      <div style="width:40px; height:40px; border-radius:var(--radius-full); background:var(--color-soft-green); color:var(--color-emerald); display:flex; align-items:center; justify-content:center; font-size:1.1rem; flex-shrink:0;">
        <i class="fa-solid fa-bell"></i>
      </div>
      <div>
        <h4 style="font-size:0.95rem; font-weight:700; color:var(--color-charcoal); margin-bottom:4px;">${n.title}</h4>
        <p style="font-size:0.85rem; color:var(--color-charcoal-muted); margin-bottom:6px; line-height:1.5;">${n.message}</p>
        <span style="font-size:0.72rem; color:var(--color-gold); font-weight:600;">${n.time}</span>
      </div>
    </div>
  `).join("");
}

/**
 * Delivery Information Modal Alert
 */
function showDeliveryInfo() {
  alert("📍 DeenKart Shikrapur Delivery Information:\n\n• Delivery Area: Exclusively within Shikrapur, Maharashtra (PIN: 412208)\n• Delivery Charges: ₹20 standard fee\n• Free Delivery: Automatic FREE delivery on orders above ₹499\n• Timing: Same-day delivery for orders placed before 3 PM\n• Live Location: Please share your GPS / Google Maps pin for direct doorstep arrival.");
}

/**
 * Clear All Local Data
 */
function handleClearProfile() {
  if (confirm("Are you sure you want to clear all your saved cart, address, and orders on this device?")) {
    localStorage.clear();
    UI.showToast("All stored data cleared.");
    setTimeout(() => window.location.reload(), 300);
  }
}
