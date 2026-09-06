/**
 * DeenKart WhatsApp Order Integration
 * Formats clean, professional WhatsApp text messages and builds wa.me deep links.
 */

const WhatsAppService = {
  /**
   * Generates a unique, standardized order ID
   * Format: DK-XXXX
   */
  generateOrderId() {
    return 'DK-' + Date.now().toString(36).toUpperCase().slice(-5);
  },

  /**
   * Builds the formatted message exactly following brand specifications
   */
  buildOrderMessage(order) {
    const { id, items, subtotal, deliveryFee, discount, total, customer } = order;

    let itemsText = "";
    if (items && Array.isArray(items)) {
      items.forEach((item, index) => {
        itemsText += `${index + 1}. ${item.name} — Qty ${item.qty} — ₹${item.price * item.qty}\n`;
      });
    }

    const deliveryLine = deliveryFee === 0 ? "FREE (Orders above ₹499)" : `₹${deliveryFee}`;
    const discountLine = discount > 0 ? `-₹${discount}` : `₹0`;
    const landmarkText = customer.landmark ? customer.landmark : "N/A";
    const notesText = customer.orderNotes ? customer.orderNotes : "None";
    const locationText = customer.locationLink ? `📍 *Google Maps Location:* ${customer.locationLink}\n` : '';

    const message = 
`Assalamu Alaikum DeenKart 👋
Order ID: *${id || 'DK-ORDER'}*

👤 *Customer Details:*
Name: ${customer.name || 'Customer'}
WhatsApp: +91 ${customer.whatsapp || ''}

🛍️ *Products:*
${itemsText}Subtotal: ₹${subtotal}
Delivery Charge: ${deliveryLine}
Discount: ${discountLine}
*TOTAL AMOUNT: ₹${total}*

📍 *Delivery Address:*
House/Flat: ${customer.house || ''}
Area/Street: ${customer.area || ''}
${customer.village ? `Village/Town: ${customer.village}\n` : ''}Landmark: ${landmarkText}
Pincode: ${customer.pincode || '412208'} (Koregaon to Shirur)
${locationText}
📝 *Order Notes:*
${notesText}

Please confirm my order & send UPI payment details. JazakAllahu Khairan!
DeenKart — "Islamic Essentials for a Better Tomorrow"`;

    return message;
  },

  /**
   * Creates a WhatsApp deep link
   */
  createWhatsAppLink(order) {
    const message = this.buildOrderMessage(order);
    const encoded = encodeURIComponent(message);
    const phone = CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
    return `https://wa.me/${phone}?text=${encoded}`;
  },

  /**
   * Request a specific product via WhatsApp
   */
  buildProductRequestUrl(productQuery) {
    const message = 
`Assalamu Alaikum DeenKart Team! 🌿

I am looking for this Islamic product:
*"${productQuery}"*

Could you please check if it is available or can be arranged for delivery? JazakAllahu Khairan!`;

    const encoded = encodeURIComponent(message);
    const phone = CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
    return `https://wa.me/${phone}?text=${encoded}`;
  },

  /**
   * Direct order chat WhatsApp deep link
   */
  buildOrderChatUrl(orderId) {
    const message = `Assalamu Alaikum DeenKart Team! I have a question regarding my Order #${orderId}. Could you please update me?`;
    const encoded = encodeURIComponent(message);
    const phone = CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
    return `https://wa.me/${phone}?text=${encoded}`;
  },

  /**
   * Direct customer support WhatsApp deep link
   */
  createSupportLink(customText = "Assalamu Alaikum DeenKart Team! I need some help with my Islamic essentials shopping.") {
    const encoded = encodeURIComponent(customText);
    const phone = CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
    return `https://wa.me/${phone}?text=${encoded}`;
  },

  /**
  /**
   * Directly launches WhatsApp with order text without hijacking browser tab
   */
  sendOrder(order) {
    const message = this.buildOrderMessage(order);
    const encoded = encodeURIComponent(message);
    const phone = CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      // Instant native launch - zero delay!
      window.location.href = `whatsapp://send?phone=${phone}&text=${encoded}`;
    } else {
      // Desktop: Open WhatsApp Web in new tab
      window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`, '_blank');
    }
  },

  /**
   * Launches WhatsApp without replacing current page in browser history
   */
  launchUrl(url) {
    if (!url) return;
    try {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile && url.includes("wa.me")) {
        const parts = url.split("?");
        const phone = parts[0].replace(/[^0-9]/g, '');
        const query = parts[1] || '';
        const nativeUrl = `whatsapp://send?phone=${phone}&${query}`;
        const link = document.createElement('a');
        link.href = nativeUrl;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          if (document.body.contains(link)) document.body.removeChild(link);
        }, 500);
        return;
      }

      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error("Direct link click failed:", err);
    }
  }
};
