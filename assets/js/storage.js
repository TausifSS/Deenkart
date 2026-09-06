/**
 * DeenKart LocalStorage State Management
 * Clean encapsulation for cart, wishlist, orders, customer profile, and settings.
 */

const Storage = {
  // Generic Helpers
  get(key, defaultValue = null) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : defaultValue;
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error writing to localStorage key "${key}":`, e);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  },

  // Products Catalog Management
  getProducts() {
    const custom = this.get(CONFIG.storageKeys.products, null);
    if (!custom || !Array.isArray(custom) || custom.length === 0) {
      return PRODUCTS_DATA;
    }
    const map = new Map();
    PRODUCTS_DATA.forEach(p => map.set(p.id, p));
    custom.forEach(p => {
      const base = map.get(p.id) || {};
      map.set(p.id, { ...base, ...p });
    });
    return Array.from(map.values());
  },

  // Cart Management
  getCart() {
    return this.get(CONFIG.storageKeys.cart, [
      // Seed with 1 initial sample item for realistic UI preview
      {
        id: "prod-quran-english",
        name: "The Noble Qur'an (English Translation)",
        price: 599,
        originalPrice: 799,
        qty: 1,
        image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=300&q=80"
      }
    ]);
  },

  saveCart(cartItems) {
    this.set(CONFIG.storageKeys.cart, cartItems);
    this.dispatchStateChangeEvent("cart", cartItems);
  },

  addToCart(product, qty = 1) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      cart[existingIndex].qty += qty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        qty: qty,
        image: product.image
      });
    }
    this.saveCart(cart);
    return cart;
  },

  updateCartQty(productId, delta) {
    let cart = this.getCart();
    const item = cart.find(i => i.id === productId);
    if (!item) return cart;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== productId);
    }
    this.saveCart(cart);
    return cart;
  },

  removeFromCart(productId) {
    const cart = this.getCart().filter(item => item.id !== productId);
    this.saveCart(cart);
    return cart;
  },

  clearCart() {
    this.saveCart([]);
  },

  // Wishlist Management
  getWishlist() {
    return this.get(CONFIG.storageKeys.wishlist, ["prod-quran-english", "prod-crystal-tasbih"]);
  },

  saveWishlist(wishlistIds) {
    this.set(CONFIG.storageKeys.wishlist, wishlistIds);
    this.dispatchStateChangeEvent("wishlist", wishlistIds);
  },

  toggleWishlist(productId) {
    let wishlist = this.getWishlist();
    let added = false;
    if (wishlist.includes(productId)) {
      wishlist = wishlist.filter(id => id !== productId);
    } else {
      wishlist.push(productId);
      added = true;
    }
    this.saveWishlist(wishlist);
    return { wishlist, added };
  },

  isWishlisted(productId) {
    return this.getWishlist().includes(productId);
  },

  // Customer Profile (No-login convenience persistence)
  getCustomer() {
    const defaultCustomer = {
      name: "",
      email: "",
      whatsapp: "",
      house: "",
      area: "",
      landmark: "",
      pincode: "412208",
      city: "Shikrapur",
      locationLink: "",
      orderNotes: ""
    };
    const saved = this.get(CONFIG.storageKeys.customer, null);
    if (!saved || saved.name === "Tausif Shaikh" || saved.email === "tausifshaikh06@gmail.com") {
      return defaultCustomer;
    }
    return { ...defaultCustomer, ...saved };
  },

  saveCustomer(customerData) {
    const current = this.getCustomer();
    const updated = { ...current, ...customerData };
    this.set(CONFIG.storageKeys.customer, updated);
    this.dispatchStateChangeEvent("customer", updated);
    return updated;
  },

  clearCustomer() {
    this.remove(CONFIG.storageKeys.customer);
    this.dispatchStateChangeEvent("customer", null);
  },

  // Orders Management
  getOrders() {
    const orders = this.get(CONFIG.storageKeys.orders, []);
    // Filter out old demo dummy orders if any exist in localStorage
    const realOrders = Array.isArray(orders) 
      ? orders.filter(o => o && o.id && !o.id.startsWith("DK-2025") && !o.id.startsWith("DK1023"))
      : [];
    if (orders && realOrders.length !== orders.length) {
      this.set(CONFIG.storageKeys.orders, realOrders);
    }
    return realOrders;
  },

  saveOrder(newOrder) {
    const orders = this.getOrders();
    orders.unshift(newOrder); // Most recent first
    this.set(CONFIG.storageKeys.orders, orders);
    this.dispatchStateChangeEvent("orders", orders);
    return orders;
  },

  getOrderById(orderId) {
    const orders = this.getOrders();
    return orders.find(o => o.id === orderId);
  },

  // Notifications
  getNotifications() {
    const notifs = this.get(CONFIG.storageKeys.notifications, null);
    if (!notifs) {
      this.set(CONFIG.storageKeys.notifications, INITIAL_NOTIFICATIONS);
      return INITIAL_NOTIFICATIONS;
    }
    return notifs;
  },

  markNotificationsRead() {
    const notifs = this.getNotifications().map(n => ({ ...n, read: true }));
    this.set(CONFIG.storageKeys.notifications, notifs);
    this.dispatchStateChangeEvent("notifications", notifs);
  },

  // Recent Searches
  getRecentSearches() {
    return this.get(CONFIG.storageKeys.recentSearches, ["Qur'an", "Tasbih", "Attar", "Hijab", "Prayer Mat"]);
  },

  addRecentSearch(term) {
    if (!term || !term.trim()) return;
    const clean = term.trim();
    let list = this.getRecentSearches().filter(t => t.toLowerCase() !== clean.toLowerCase());
    list.unshift(clean);
    if (list.length > 8) list = list.slice(0, 8);
    this.set(CONFIG.storageKeys.recentSearches, list);
  },

  removeRecentSearch(term) {
    const list = this.getRecentSearches().filter(t => t !== term);
    this.set(CONFIG.storageKeys.recentSearches, list);
    return list;
  },

  clearRecentSearches() {
    this.set(CONFIG.storageKeys.recentSearches, []);
  },

  // Global Change Event Dispatcher for reactive UI updates
  dispatchStateChangeEvent(name, detail) {
    window.dispatchEvent(new CustomEvent(`deenkart:${name}Changed`, { detail }));
  }
};
