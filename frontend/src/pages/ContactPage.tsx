import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How fast is your cloud kitchen delivery?',
      a: 'We average 30 to 40 minutes from the moment your order ticket is received. All dishes are cooked fresh to order in synchronized batches.'
    },
    {
      q: 'Can I order directly on WhatsApp without an account?',
      a: 'Yes, absolutely! You can browse our menu, add items to your cart, and click "Order on WhatsApp". An automated bill will be created and sent to our kitchen desk without needing a mandatory account.'
    },
    {
      q: 'What packaging do you use to keep food hot and fresh?',
      a: 'We use premium multi-layer insulated thermal boxes with tamper-evident seals and food-grade heat-retaining liners so gravies never spill and fries stay crisp.'
    },
    {
      q: 'Do you take bulk party orders or corporate catering?',
      a: 'Yes! For corporate lunches, birthday celebrations, or family get-togethers, please ping our WhatsApp number with your guest count and date for exclusive party discounts.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Header with Official Food Rocket Logo */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="flex justify-center mb-1">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-white p-1 shadow-lg shadow-orange-500/20 ring-4 ring-emerald-500/40 hover:scale-105 transition-transform flex-shrink-0">
            <img 
              src="/food-rocket-logo.png" 
              alt="Food Rocket Logo" 
              className="w-full h-full object-contain rounded-full" 
            />
          </div>
        </div>
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-emerald-100 dark:from-orange-950/60 dark:to-emerald-950/60 px-4 py-1.5 rounded-full border border-orange-200 dark:border-orange-800">
          <span className="text-xs font-black uppercase tracking-wider text-orange-700 dark:text-orange-300">
            Contact Food Rocket
          </span>
          <span className="text-xs">🚀</span>
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
            Fuel Your Hunger, Fast
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          We'd Love to Hear From You
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Have a question about an order, custom catering feast, or feedback? Our culinary team is here to assist.
        </p>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">WhatsApp Orders</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Fastest 1-tap ordering & live status</p>
          <a
            href={`https://wa.me/${(settings.whatsapp_number || '919876543210').replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline block pt-1"
          >
            Chat Now ➔
          </a>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Call Support</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{settings.contact_phone || '+91 98765 43210'}</p>
          <span className="text-[11px] text-slate-400 block pt-1">11:00 AM - 11:30 PM</span>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Email Us</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{settings.contact_email || 'orders@foodrocket.com'}</p>
          <span className="text-[11px] text-slate-400 block pt-1">Response within 2 hours</span>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-xs space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Kitchen Location</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
            {settings.address || 'Cloud Culinary Hub, Sector 18, Commercial Zone, Mumbai'}
          </p>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold block pt-1">Delivery Only Hub</span>
        </div>
      </div>

      {/* Contact Form & Location Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        
        {/* Form */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700 shadow-md space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Send an Inquiry or Feedback</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">We respond to every message from our food connoisseurs.</p>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 rounded-2xl text-center space-y-2">
              <Check className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm">Message Sent Successfully!</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">Thank you for reaching out. Our culinary manager will connect with you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Message / Request</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us what you need or share your dining experience..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Visual Kitchen Map & FAQ */}
        <div className="space-y-6">
          {/* Visual Google Map Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="font-bold text-lg text-white">Central Cloud Kitchen Facility</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our state-of-the-art facility is strategically positioned in the commercial district for immediate access to express ring roads and high-density residential hubs.
            </p>
            <div className="rounded-2xl overflow-hidden h-44 bg-slate-800 relative flex items-center justify-center border border-slate-700">
              <div className="text-center p-4">
                <MapPin className="w-8 h-8 text-orange-500 mx-auto mb-2 animate-bounce" />
                <p className="text-xs font-bold text-white">{settings.address || 'Cloud Culinary Hub, Sector 18, Mumbai'}</p>
                <p className="text-[11px] text-slate-400">Serving 15km Radius with 30-Min Delivery</p>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-3.5 text-left text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? <ChevronUp className="w-4 h-4 text-orange-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {openFaq === idx && (
                    <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-900/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
