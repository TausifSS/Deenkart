/**
 * DeenKart Cart Calculation & Coupon Engine
 */

const CartService = {
  appliedCoupon: "WELCOME10", // Default active welcome promo as seen in screenshots
  appliedDiscountPercent: 10,
  deliveryMethod: "standard", // "standard" or "express"

  setDeliveryMethod(method) {
    this.deliveryMethod = method;
    Storage.dispatchStateChangeEvent("cartSummary", this.getSummary());
  },

  applyCoupon(code) {
    if (!code) return { success: false, message: "Please enter a coupon code" };
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "WELCOME10") {
      this.appliedCoupon = "WELCOME10";
      this.appliedDiscountPercent = 10;
      Storage.dispatchStateChangeEvent("cartSummary", this.getSummary());
      return { success: true, message: "Coupon WELCOME10 applied! (10% OFF)" };
    } else if (cleanCode === "RAMADAN50") {
      this.appliedCoupon = "RAMADAN50";
      this.appliedDiscountPercent = 15;
      Storage.dispatchStateChangeEvent("cartSummary", this.getSummary());
      return { success: true, message: "Ramadan special discount applied!" };
    } else {
      return { success: false, message: "Invalid promo code for Shikrapur store." };
    }
  },

  removeCoupon() {
    this.appliedCoupon = null;
    this.appliedDiscountPercent = 0;
    Storage.dispatchStateChangeEvent("cartSummary", this.getSummary());
  },

  getSummary() {
    const items = Storage.getCart();
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Discount
    let discount = 0;
    if (this.appliedCoupon && this.appliedDiscountPercent > 0 && subtotal > 0) {
      discount = Math.round((subtotal * this.appliedDiscountPercent) / 100);
    }

    // Delivery Fee calculation
    let deliveryFee = 0;
    if (subtotal > 0) {
      if (this.deliveryMethod === "express") {
        deliveryFee = CONFIG.expressDeliveryFee;
      } else {
        deliveryFee = subtotal >= CONFIG.freeDeliveryThreshold ? 0 : CONFIG.standardDeliveryFee;
      }
    }

    const total = Math.max(0, subtotal - discount + deliveryFee);
    const amountNeededForFreeShipping = Math.max(0, CONFIG.freeDeliveryThreshold - subtotal);
    const freeShippingProgress = Math.min(100, Math.round((subtotal / CONFIG.freeDeliveryThreshold) * 100));

    return {
      items,
      count,
      subtotal,
      discount,
      appliedCoupon: this.appliedCoupon,
      deliveryMethod: this.deliveryMethod,
      deliveryFee,
      total,
      isFreeShipping: deliveryFee === 0 && subtotal > 0 && this.deliveryMethod === "standard",
      amountNeededForFreeShipping,
      freeShippingProgress
    };
  }
};
