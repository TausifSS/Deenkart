/**
 * DeenKart Central Configuration
 * All key business rules, contact details, and storage identifiers are maintained here.
 */
const CONFIG = {
  storeName: "DeenKart",
  tagline: "Islamic Essentials for a Better Tomorrow",
  version: "1.0.0",
  
  // Contact & Payment Details - Store owner contact
  whatsappNumber: "919561762651", 
  supportNumberFormatted: "+91 95617 62651",
  upiId: "deenkart@upi",
  
  // Location & Delivery Constraints
  deliveryCity: "Shikrapur",
  deliveryState: "Maharashtra",
  deliveryPincode: "412208",
  deliveryNotice: "Fast delivery from Koregaon to Shirur",
  
  // Shipping & Pricing
  standardDeliveryFee: 20, // Local Shikrapur delivery ₹20
  freeDeliveryThreshold: 499, // Automatic FREE Delivery above ₹499
  defaultDiscountCode: "WELCOME10",
  defaultDiscountPercent: 10,
  
  // Feature Toggles
  maintenanceMode: false,
  
  // LocalStorage Keys
  storageKeys: {
    cart: "deenkart_cart",
    wishlist: "deenkart_wishlist",
    customer: "deenkart_customer",
    orders: "deenkart_orders",
    notifications: "deenkart_notifications",
    settings: "deenkart_settings",
    products: "deenkart_products_custom",
    offers: "deenkart_offers_custom",
    recentSearches: "deenkart_recent_searches"
  }
};

// Freeze to avoid accidental mutations
if (typeof Object.freeze === 'function') {
  Object.freeze(CONFIG.storageKeys);
}
