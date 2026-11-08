import React from 'react';

interface PolicyProps {
  type: 'privacy' | 'terms' | 'delivery';
}

export const PoliciesPages: React.FC<PolicyProps> = ({ type }) => {
  if (type === 'privacy') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6 text-slate-800">
        <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Last updated: November 2026</p>
        <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-600">
          <p>At Food Rocket, accessible from our official platform, one of our main priorities is the privacy of our visitors and customers. This Privacy Policy document contains types of information that is collected and recorded by us and how we use it.</p>
          <h2 className="text-base font-bold text-slate-900 mt-4">1. Information We Collect</h2>
          <p>When you place an order via our online platform or WhatsApp integration, we collect your name, mobile contact number, delivery address, and food preferences solely for food preparation, dispatch tracking, and billing receipts.</p>
          <h2 className="text-base font-bold text-slate-900 mt-4">2. Payment Security</h2>
          <p>We do not store complete debit/credit card numbers or CVVs on our servers. Online transactions are processed through encrypted, PCI-DSS compliant payment gateways.</p>
          <h2 className="text-base font-bold text-slate-900 mt-4">3. Data Retention & Deletion</h2>
          <p>You can request deletion of your saved addresses or account data at any time by contacting our customer care department.</p>
        </div>
      </div>
    );
  }

  if (type === 'terms') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6 text-slate-800">
        <h1 className="text-3xl font-black text-slate-900">Terms & Conditions</h1>
        <p className="text-xs text-slate-400">Last updated: November 2026</p>
        <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-600">
          <p>Welcome to Food Rocket. By placing an order through our website or connected WhatsApp channel, you agree to be bound by these terms.</p>
          <h2 className="text-base font-bold text-slate-900 mt-4">1. Food Orders & Availability</h2>
          <p>All items on our menu are subject to real-time kitchen availability. While we make every attempt to ensure live inventory accuracy, seasonal fresh ingredients may occasionally run out.</p>
          <h2 className="text-base font-bold text-slate-900 mt-4">2. Pricing & Taxes</h2>
          <p>Prices listed are in Indian Rupees (INR) and include all relevant packaging. Standard 5% GST is applicable in accordance with central restaurant tax laws.</p>
          <h2 className="text-base font-bold text-slate-900 mt-4">3. Promotional Coupons</h2>
          <p>Coupons must meet minimum order values and validity dates. Only one coupon can be applied per order unless otherwise specified.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-6 text-slate-800">
      <h1 className="text-3xl font-black text-slate-900">Delivery & Refund Policy</h1>
      <p className="text-xs text-slate-400">Last updated: November 2026</p>
      <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-600">
        <h2 className="text-base font-bold text-slate-900 mt-4">1. Express Delivery Standard</h2>
        <p>Our average estimated delivery duration is 30 to 40 minutes from order ticket confirmation. Delivery times may vary during heavy rainfall, peak festival hours, or city traffic alerts.</p>
        <h2 className="text-base font-bold text-slate-900 mt-4">2. Spill-Proof Tamper Packaging</h2>
        <p>All orders are packaged in sealed, food-grade thermal containers. If your tamper seal is broken upon arrival, please do not accept the package and notify us immediately on WhatsApp.</p>
        <h2 className="text-base font-bold text-slate-900 mt-4">3. Cancellations & Instant Refunds</h2>
        <p>Orders can be cancelled free of charge if the kitchen has not yet started cooking (within 3 minutes of placement). Once cooking has commenced, full refund cannot be granted due to fresh perishable ingredients.</p>
      </div>
    </div>
  );
};

