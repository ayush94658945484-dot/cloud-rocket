/**
 * Generates an ultra-clean, professionally formatted WhatsApp message and direct click-to-chat URL.
 */
function generateWhatsAppOrderMessage(orderData, businessSettings = {}) {
  const brandName = businessSettings.business_name || 'Food Rocket';
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
`👑 *NEW FOOD KITCHEN ORDER*
*${brandName}*
━━━━━━━━━━━━━━━━━━━━
*Order ID:* ${orderNum}
*Date:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

👤 *CUSTOMER DETAILS:*
• *Name:* ${customerName}
• *Mobile:* ${customerPhone}
• *Delivery Address:* ${address}${landmark}
• *Instructions:* ${instructions}

🍲 *ORDER TICKET:*
${itemsText}

💰 *PAYMENT BREAKDOWN:*
• Items Subtotal: ₹${subtotal}
• Delivery Fee: ${delivery}
• Taxes & Packaging: ₹${taxes}
${Number(discount) > 0 ? `• Coupon Discount${coupon}: -₹${discount}\n` : ''}━━━━━━━━━━━━━━━━━━━━
*FINAL PAYABLE AMOUNT: ₹${total}*
• *Mode:* Cash On Delivery (COD) / UPI on Arrival

🚀 Thank you for choosing *${brandName}*! Cooked fresh, packed tamper-proof, delivered in 30 mins.`;

  const encodedMsg = encodeURIComponent(message);
  const rawPhone = (businessSettings.whatsapp_number || '919876543210').replace(/\D/g, '');
  const cleanPhone = rawPhone.startsWith('91') && rawPhone.length === 12 ? rawPhone : `91${rawPhone.slice(-10)}`;
  const directLink = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

  return {
    rawMessage: message,
    directLink,
    whatsappNumber: cleanPhone
  };
}

module.exports = { generateWhatsAppOrderMessage };
