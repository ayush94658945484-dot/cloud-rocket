/**
 * Generates an ultra-clean, professionally formatted WhatsApp message and direct click-to-chat URL.
 */
function generateWhatsAppOrderMessage(orderData, businessSettings = {}) {
  const brandName = businessSettings.business_name || 'Cloud Rocket';
  const orderNum = orderData.order_number || `#ROCKET-${Date.now().toString().slice(-5)}`;
  
  const customerName = orderData.customer_name || 'Customer';
  const customerPhone = orderData.customer_phone || '';
  const address = orderData.delivery_address || '';
  const landmark = orderData.landmark ? ` (${orderData.landmark})` : '';
  const instructions = orderData.special_instructions ? orderData.special_instructions.trim() : 'None';

  let itemsText = '';
  if (Array.isArray(orderData.items) && orderData.items.length > 0) {
    itemsText = orderData.items.map(item => {
      const type = item.is_veg ? '🟢 Veg' : '🔴 Non-Veg';
      const itemTotal = (Number(item.price) * Number(item.quantity)).toFixed(2);
      return `• ${item.quantity}x ${item.food_name || item.name} [${type}] @ ₹${Number(item.price).toFixed(2)} = ₹${itemTotal}`;
    }).join('\n');
  }

  const subtotal = Number(orderData.subtotal || 0).toFixed(2);
  const discount = Number(orderData.discount_amount || 0).toFixed(2);
  const delivery = Number(orderData.delivery_fee || 0) === 0 ? 'FREE' : `₹${Number(orderData.delivery_fee).toFixed(2)}`;
  const taxes = Number(orderData.tax_amount || 0).toFixed(2);
  const total = Number(orderData.total_amount || 0).toFixed(2);
  const coupon = orderData.coupon_code ? ` (${orderData.coupon_code})` : '';

  const message = 
`👑 *NEW CLOUD KITCHEN ORDER*
*${brandName}*
━━━━━━━━━━━━━━━━━━━━
*Order ID:* ${orderNum}
*Date:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

👤 *CUSTOMER DETAILS:*
• *Name:* ${customerName}
• *Mobile:* ${customerPhone}
• *Delivery Address:* ${address}${landmark}

📦 *ITEMS ORDERED:*
${itemsText}

💰 *BILLING SUMMARY:*
• Item Subtotal: ₹${subtotal}
• Discount${coupon}: -₹${discount}
• Delivery Fee: ${delivery}
• Taxes & Packaging: ₹${taxes}
━━━━━━━━━━━━━━━━━━━━
👉 *FINAL PAYABLE AMOUNT: ₹${total}*
━━━━━━━━━━━━━━━━━━━━
📝 *Cooking / Delivery Instructions:*
${instructions}

🙏 *Please confirm my order and share live preparation status!*`;

  // Clean phone number (strip +, spaces, dashes)
  let rawPhone = businessSettings.whatsapp_number || '919876543210';
  let cleanPhone = rawPhone.replace(/[^0-9]/g, '');
  // Default to India (91) if 10-digit number without country code
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  return {
    rawMessage: message,
    encodedMessage,
    whatsappUrl,
    targetPhone: cleanPhone
  };
}

module.exports = { generateWhatsAppOrderMessage };

