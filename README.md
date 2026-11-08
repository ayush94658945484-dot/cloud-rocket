# 🚀 Food Rocket — Premium Cloud Kitchen & Online Ordering Platform

A modern, responsive, production-ready full-stack website and ordering system designed for a high-volume **Cloud Kitchen & Food Delivery Brand**. Built with **React 19, TypeScript, Tailwind CSS, Node.js/Express, and SQLite/PostgreSQL-compatible relational architecture**, featuring **real-time WhatsApp Click-to-Chat Bill Automation**, coupon discounts, and an **Admin Kitchen Command Center**.

---

## 🌟 Highlights & Core Features

### 1. 🍽️ Premium Storefront & UI Experience
- **Luxury Brand Aesthetic**: Rich saffron, amber, and charcoal palette inspired by high-end gourmet dining.
- **Dynamic Menu Hierarchy**: 8 curated culinary categories (*Starters & Appetizers, Main Course Curries, Royal Biryani & Rice, Snacks & Chaat, Gourmet Fast Food, Beverages & Mocktails, Artisan Desserts, Special Combos*).
- **Interactive Dish Cards**: Real-time veg/non-veg dot indicator, bestseller tags, calorie/prep-time metadata, and live quantity steppers.
- **Search & Live Filtering**: Filter by dietary preference (Pure Veg toggle), category tabs, and sort by price or rating.
- **Detailed Dish Modal**: High-res food photography, ingredient breakdown, and add-to-cart controls.

### 2. 📱 Deep WhatsApp Ordering Automation (Configurable)
- Generates an itemized bill ticket using the official WhatsApp click-to-chat format:
  `https://wa.me/COUNTRYCODEPHONENUMBER?text=ENCODED_MESSAGE`
- Automatically encodes:
  - Customer name, mobile number, delivery address & landmark
  - Itemized dishes with individual quantities and pricing
  - Subtotal, coupon discount, delivery fee, and final payable total
  - Chef preparation instructions and cooking notes
- **Zero hardcoding**: The WhatsApp business number can be updated anytime directly inside the **Admin Dashboard Settings** and persists across the platform immediately.

### 3. 🛍️ Smart Cart & Checkout Engine
- **Slide-over Cart Drawer**: Real-time subtotal calculation, free delivery threshold progress meter, and coupon engine.
- **Dual Checkout Pathways**:
  1. **Order via WhatsApp**: Instantly logs order to the database, generates the order number, and redirects to WhatsApp with the formatted bill.
  2. **Online / Cash on Delivery**: Directly submits order into kitchen dispatch queue.
- **Estimated Delivery Counter**: Live 30-40 minute arrival estimation.

### 4. 🎟️ Offers & Discount Management
- Live coupons with percentage-off, flat discounts, minimum order threshold verification, and one-click copy buttons (`WELCOME50`, `FEAST100`, `ZAIKA20`, `FREEDEL`).

### 5. 🧑‍💼 Secure Customer Portal
- User registration and JWT-based authentication with bcrypt password hashing.
- Profile management with saved delivery addresses (Home, Office, Other).
- Order history with live order status tracking (Pending → Confirmed → Preparing → Out for Delivery → Delivered).

### 6. 👑 Kitchen Command Center (Admin Dashboard `/admin`)
- **Executive Analytics**: Total orders, today's order count, total revenue, and active tickets.
- **Menu Management**: Create, edit, delete dishes, toggle instant stock availability, and mark bestsellers.
- **Live Ticket Dispatch**: View incoming orders, update live kitchen status, and trigger direct WhatsApp contact with customers.
- **Coupon Manager**: Create percentage or flat discounts with minimum order thresholds.
- **Customer Directory**: View registered diners, phone numbers, and order histories.
- **Website & WhatsApp Settings**: Live configuration of WhatsApp phone number, brand name, delivery fees, minimum order amounts, kitchen operating hours, and social media handles.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Option A: 1-Click Launch on Windows
Simply double-click or run:
```cmd
run.bat
```
This automatically starts both the backend API and the Vite frontend dev server in parallel!

---

### Option B: Manual Terminal Execution

#### 1. Backend Server Setup
```bash
cd backend
npm install
npm run seed     # (Optional: seeds 23 dishes, coupons, demo accounts)
npm run dev      # Starts Express on http://localhost:5000
```

#### 2. Frontend Application Setup
Open a separate terminal window:
```bash
cd frontend
npm install
npm run dev      # Starts Vite UI on http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser.

---

## 🔑 Demo Access Credentials

Both accounts are pre-seeded in the database for instant testing:

| Role | Email | Password | Access / Capabilities |
| :--- | :--- | :--- | :--- |
| **Kitchen Admin** | `admin@foodrocket.com` | `admin123` | Full access to `/admin` dashboard, menu CRUD, order status, coupons, settings |
| **Customer** | `customer@gmail.com` | `customer123` | Storefront browsing, saved addresses, order history, profile |

> **Pro-Tip**: The login modal includes convenient **1-Click Demo Buttons** so you can switch between Admin and Customer with zero typing!

---

## 📂 Project Architecture

```
gym-tracker-main/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # SQLite schema with foreign keys & WAL mode
│   │   ├── controllers/
│   │   │   ├── authController.js     # User & Admin JWT auth & address CRUD
│   │   │   ├── foodController.js     # Menu CRUD & category queries
│   │   │   ├── orderController.js    # Order processing & live status tracking
│   │   │   ├── couponController.js   # Coupon validation & management
│   │   │   ├── reviewController.js   # Verified customer reviews
│   │   │   └── settingsController.js # Dynamic platform configuration
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT bearer token verification
│   │   │   └── adminMiddleware.js    # Admin authorization guard
│   │   ├── routes/                   # Modular REST API endpoints
│   │   ├── utils/
│   │   │   └── whatsappHelper.js     # Automated WhatsApp order message generator
│   │   ├── seed.js                   # Pre-populates 23 dishes, categories, coupons
│   │   └── server.js                 # Express server with CORS & rate-limiting
│   ├── .env                          # Backend environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx            # Sticky glassmorphic navbar with search & cart
│   │   │   ├── Footer.tsx            # Certifications, kitchen info & policy links
│   │   │   ├── FoodCard.tsx          # Card with veg dot, price, and stepper
│   │   │   ├── FoodDetailModal.tsx   # Ingredient breakdown and nutritional info
│   │   │   ├── CartDrawer.tsx        # Slide-over cart with free delivery meter
│   │   │   ├── AuthModal.tsx         # Sign in & 1-click demo logins
│   │   │   ├── FloatingWhatsApp.tsx  # Pulsing live WhatsApp chat bubble
│   │   │   └── ReviewSection.tsx     # Diner ratings & testimonials
│   │   ├── context/
│   │   │   ├── AuthContext.tsx       # Auth state, login/logout, profile
│   │   │   ├── CartContext.tsx       # Persistent cart, coupons, tax/delivery math
│   │   │   └── SettingsContext.tsx   # Live website & WhatsApp phone settings
│   │   ├── pages/
│   │   │   ├── HomePage.tsx          # Hero banner, categories, bestsellers, reviews
│   │   │   ├── MenuPage.tsx          # Full menu with filters, categories, search
│   │   │   ├── OffersPage.tsx        # Discount voucher hub
│   │   │   ├── CheckoutPage.tsx      # Dual checkout (WhatsApp vs Online/COD)
│   │   │   ├── OrderSuccessPage.tsx  # Celebration page with order ticket & WhatsApp link
│   │   │   ├── TrackOrderPage.tsx    # 5-step live visual order tracker
│   │   │   ├── ProfilePage.tsx       # Diner account, addresses, order history
│   │   │   ├── AboutPage.tsx         # Brand story & cloud kitchen hygiene standards
│   │   │   ├── ContactPage.tsx       # Inquiries, FAQ accordion, Google Maps info
│   │   │   ├── PoliciesPages.tsx     # Privacy, Terms & Conditions, Delivery Policy
│   │   │   └── admin/
│   │   │       ├── AdminLayout.tsx            # Sidebar navigation layout
│   │   │       ├── AdminDashboard.tsx         # KPI analytics and performance overview
│   │   │       ├── AdminFoodManagement.tsx    # Dish creation, editing, availability
│   │   │       ├── AdminOrderManagement.tsx   # Live order queue & status updater
│   │   │       ├── AdminCouponManagement.tsx  # Discount voucher CRUD
│   │   │       ├── AdminCustomerManagement.tsx# Customer spend directory
│   │   │       └── AdminSettings.tsx          # Dynamic WhatsApp number & fee controls
│   │   ├── services/
│   │   │   └── api.ts                # Typed client-side REST API wrapper
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript domain types
│   │   ├── App.tsx                   # Master routing & layout state machine
│   │   └── main.tsx                  # React 19 root bootstrap
│   ├── vite.config.ts                # Vite config with API proxy
│   └── package.json
│
├── package.json                      # Workspace root script runner
├── run.bat                           # 1-click Windows parallel launcher
└── README.md
```

---

## 🔒 Security & Data Integrity
- **Password Protection**: Passwords salted and hashed with `bcryptjs` (cost factor 10).
- **JWT Authorization**: 7-day signed JWT tokens containing user ID and role claims.
- **SQL Injection Defense**: Prepared parameterized queries used across all SQLite statements.
- **Client-Side Sanitation**: Inputs validated, prices verified on backend, coupon limits strictly checked against cart subtotal.

---

## 🌐 Production Deployment Guide
- **Frontend (Vercel / Netlify)**:
  - Build command: `npm run build`
  - Output directory: `dist`
  - Environment variable: `VITE_API_URL=https://your-backend-api.onrender.com/api`
- **Backend (Render / Railway / Fly.io)**:
  - Root directory: `backend`
  - Start command: `node src/server.js`
  - Set `PORT`, `JWT_SECRET`, and `ALLOWED_ORIGIN` in the environment settings.

