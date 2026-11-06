const bcrypt = require('bcryptjs');
const { db, initDatabase } = require('./config/db');

async function seedData() {
  await initDatabase();

  // Check if already seeded
  const userCount = await db.get('SELECT COUNT(*) as count FROM users');
  if (userCount && userCount.count > 0) {
    console.log('Database already seeded. Skipping initial seed.');
    return;
  }

  console.log('🌱 Starting database seeding with premium cloud kitchen data...');

  // 1. Create Default Admin & Customer
  const salt = await bcrypt.genSalt(10);
  const adminPass = await bcrypt.hash('admin123', salt);
  const customerPass = await bcrypt.hash('customer123', salt);

  await db.run(`
    INSERT INTO users (name, email, password_hash, phone, role) 
    VALUES 
    ('Cloud Rocket Admin', 'admin@cloudrocket.com', ?, '+919876543210', 'admin'),
    ('Aarav Sharma', 'customer@gmail.com', ?, '+919812345678', 'customer')
  `, [adminPass, customerPass]);

  // 2. Default Website Settings (100% Configurable from Admin!)
  const defaultSettings = [
    ['business_name', 'Cloud Rocket', 'Brand identity name'],
    ['tagline', 'Rocket-Fast Gourmet Flavors Delivered Hot & Fresh in 30 Mins', 'Tagline for hero banner'],
    ['whatsapp_number', '919876543210', 'Official Business WhatsApp number for orders'],
    ['contact_phone', '+91 98765 43210', 'Customer service contact number'],
    ['contact_email', 'orders@cloudrocket.com', 'Official business support email'],
    ['address', 'Cloud Culinary Hub, Kitchen Suite #4, Sector 18, Commercial Zone, Mumbai 400053', 'Physical cloud kitchen location'],
    ['opening_hours', '11:00 AM – 11:30 PM (Mon - Sun)', 'Kitchen operational timing'],
    ['delivery_charge', '40', 'Standard base delivery fee in rupees'],
    ['free_delivery_threshold', '499', 'Cart value for free delivery in rupees'],
    ['min_order_amount', '149', 'Minimum order amount in rupees'],
    ['tax_rate_percent', '5', 'Restaurant GST tax rate percentage'],
    ['instagram_url', 'https://instagram.com', 'Instagram profile URL'],
    ['facebook_url', 'https://facebook.com', 'Facebook page URL'],
    ['delivery_time_estimate', '30-40 mins', 'Estimated delivery duration']
  ];

  for (const [key, val, desc] of defaultSettings) {
    await db.run('INSERT INTO website_settings (key, value, description) VALUES (?, ?, ?)', [key, val, desc]);
  }

  // 3. Categories (8 Categories as requested)
  const categories = [
    {
      name: 'Starters & Appetizers',
      slug: 'starters',
      image_url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
      description: 'Crispy kebabs, golden bites & mouth-watering tandoori delicacies.'
    },
    {
      name: 'Main Course Curries',
      slug: 'main-course',
      image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
      description: 'Rich slow-cooked gravies infused with artisanal whole spices.'
    },
    {
      name: 'Royal Biryani & Rice',
      slug: 'rice-biryani',
      image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      description: 'Fragrant aged basmati dum biryanis layered with saffron & tender cuts.'
    },
    {
      name: 'Snacks & Chaat',
      slug: 'snacks',
      image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      description: 'Tangy, savory street snacks and quick crispy afternoon treats.'
    },
    {
      name: 'Gourmet Fast Food',
      slug: 'fast-food',
      image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      description: 'Artisanal burgers, loaded fries, cheese pizzas & stuffed wraps.'
    },
    {
      name: 'Beverages & Mocktails',
      slug: 'beverages',
      image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
      description: 'Chilled signature mojitos, thick fruit shakes and craft coolers.'
    },
    {
      name: 'Artisan Desserts',
      slug: 'desserts',
      image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
      description: 'Warm gulab jamuns, creamy rasmalai and decadent chocolate cakes.'
    },
    {
      name: 'Special Feasting Combos',
      slug: 'special-combos',
      image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      description: 'Curated meal boxes and family combos packed with maximum savings.'
    }
  ];

  const catMap = {};
  for (let i = 0; i < categories.length; i++) {
    const c = categories[i];
    const res = await db.run(`
      INSERT INTO categories (name, slug, image_url, description, display_order)
      VALUES (?, ?, ?, ?, ?)
    `, [c.name, c.slug, c.image_url, c.description, i + 1]);
    catMap[c.slug] = res.lastID;
  }

  // 4. Food Items (Authentic Dishes with Realistic Pricing & High-Res Food Photos)
  const dishes = [
    // --- Starters ---
    {
      cat: 'starters',
      name: 'Murgh Malai Tikka',
      desc: 'Boneless tender chicken marinated in rich clotted cream, cardamom, and gentle cheese grilled in clay tandoor.',
      price: 349,
      discount_price: 299,
      is_veg: 0,
      is_bestseller: 1,
      is_featured: 1,
      img: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
      prep: '20-25 mins',
      cal: 420,
      rating: 4.9
    },
    {
      cat: 'starters',
      name: 'Amritsari Paneer Tikka',
      desc: 'Fresh cottage cheese cubes tossed in stone-ground carom seed paste, bell peppers and smoked over charcoal embers.',
      price: 289,
      discount_price: 249,
      is_veg: 1,
      is_bestseller: 1,
      is_featured: 0,
      img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
      prep: '15-20 mins',
      cal: 380,
      rating: 4.8
    },
    {
      cat: 'starters',
      name: 'Crispy Dahi Ke Kebab',
      desc: 'Melt-in-mouth golden patties of hung curd seasoned with fresh coriander, green chilies, and subtle mint.',
      price: 259,
      discount_price: null,
      is_veg: 1,
      is_bestseller: 0,
      is_featured: 0,
      img: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
      prep: '15 mins',
      cal: 310,
      rating: 4.7
    },
    {
      cat: 'starters',
      name: 'Spicy Tandoori Chicken Wings',
      desc: 'Double-glazed chicken wings coated in our chef special ghost pepper tandoori marinade with garlic dip.',
      price: 329,
      discount_price: 279,
      is_veg: 0,
      is_bestseller: 0,
      is_featured: 1,
      img: 'https://images.unsplash.com/photo-1527477378408-1bc09c2a5c32?auto=format&fit=crop&w=800&q=80',
      prep: '20 mins',
      cal: 460,
      rating: 4.8
    },

    // --- Main Course Curries ---
    {
      cat: 'main-course',
      name: 'Butter Chicken Grand Cru',
      desc: 'Slow-simmered tandoori chicken simmered in a velvety sun-ripened tomato gravy finished with artisanal butter and dried fenugreek.',
      price: 399,
      discount_price: 349,
      is_veg: 0,
      is_bestseller: 1,
      is_featured: 1,
      img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
      prep: '25-30 mins',
      cal: 560,
      rating: 5.0
    },
    {
      cat: 'main-course',
      name: 'Paneer Lababdar',
      desc: 'Charred paneer chunks submerged in rich onion-tomato masala enriched with cashew paste and grated paneer shreds.',
      price: 349,
      discount_price: 299,
      is_veg: 1,
      is_bestseller: 1,
      is_featured: 1,
      img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
      prep: '20 mins',
      cal: 480,
      rating: 4.9
    },
    {
      cat: 'main-course',
      name: 'Dal Makhani Bukhara',
      desc: 'Black lentils slow cooked for 36 hours over wood embers with cream, butter and fresh tomato reduction.',
      price: 299,
      discount_price: 249,
      is_veg: 1,
      is_bestseller: 1,
      is_featured: 0,
      img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      prep: '20 mins',
      cal: 420,
      rating: 4.9
    },
    {
      cat: 'main-course',
      name: 'Kashmiri Rogan Josh',
      desc: 'Slow-cooked prime lamb shoulder simmered in authentic Kashmiri chili, fennel seeds, and ratanjyot broth.',
      price: 479,
      discount_price: 429,
      is_veg: 0,
      is_bestseller: 0,
      is_featured: 1,
      img: 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=800&q=80',
      prep: '30 mins',
      cal: 590,
      rating: 4.8
    },

    // --- Royal Biryani & Rice ---
    {
      cat: 'rice-biryani',
      name: 'Hyderabadi Dum Chicken Biryani',
      desc: 'The undisputed royalty! Aged Daawat basmati rice slow-dum cooked in sealed handi with marinated spring chicken, saffron and mint.',
      price: 369,
      discount_price: 319,
      is_veg: 0,
      is_bestseller: 1,
      is_featured: 1,
      img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      prep: '25 mins',
      cal: 620,
      rating: 5.0
    },
    {
      cat: 'rice-biryani',
      name: 'Royal Shahi Paneer Biryani',
      desc: 'Layered fragrant saffron rice, charred malai paneer cubes, golden fried onions, dried plums and roasted cashews.',
      price: 329,
      discount_price: 279,
      is_veg: 1,
      is_bestseller: 1,
      is_featured: 0,
      img: 'https://images.unsplash.com/photo-1642821373181-696a54913e9a?auto=format&fit=crop&w=800&q=80',
      prep: '20 mins',
      cal: 540,
      rating: 4.8
    },
    {
      cat: 'rice-biryani',
      name: 'Mutton Gosht Dum Biryani',
      desc: 'Tender baby goat pieces cooked on slow fire with whole spices, rose water and basmati rice, served with Mirchi Ka Salan.',
      price: 499,
      discount_price: 449,
      is_veg: 0,
      is_bestseller: 1,
      is_featured: 1,
      img: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
      prep: '30 mins',
      cal: 680,
      rating: 4.9
    },

    // --- Snacks & Chaat ---
    {
      cat: 'snacks',
      name: 'Delhi 6 Palak Patta Chaat',
      desc: 'Crispy tempura fried spinach leaves topped with spiced potatoes, sweet yogurt, date tamarind chutney and fresh pomegranate.',
      price: 199,
      discount_price: 169,
      is_veg: 1,
      is_bestseller: 1,
      is_featured: 0,
      img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      prep: '10-15 mins',
      cal: 260,
      rating: 4.8
    },
    {
      cat: 'snacks',
      name: 'Kurkure Paneer Popcorn',
      desc: 'Bite-sized fresh cottage cheese coated in seasoned crunchy flakes and served with spicy peri-peri sriracha dip.',
      price: 219,
      discount_price: null,
      is_veg: 1,
      is_bestseller: 0,
      is_featured: 0,
      img: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
      prep: '15 mins',
      cal: 340,
      rating: 4.6
    },

    // --- Gourmet Fast Food ---
    {
      cat: 'fast-food',
      name: 'The Maharaja Crispy Chicken Burger',
      desc: 'Ultra-crunchy spiced fried chicken breast fillet topped with smoked cheese, caramelized onions, jalapeños and secret burger relish on brioche bun.',
      price: 279,
      discount_price: 229,
      is_veg: 0,
      is_bestseller: 1,
      is_featured: 1,
      img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      prep: '15-20 mins',
      cal: 590,
      rating: 4.9
    },
    {
      cat: 'fast-food',
      name: 'Truffle Mushroom & Paneer Sourdough Pizza',
      desc: 'Thin crust hand-stretched artisan pizza topped with roasted wild mushrooms, herbed paneer, truffle oil and fresh mozzarella.',
      price: 389,
      discount_price: 339,
      is_veg: 1,
      is_bestseller: 0,
      is_featured: 0,
      img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      prep: '20 mins',
      cal: 650,
      rating: 4.7
    },
    {
      cat: 'fast-food',
      name: 'Peri Peri Cheesy Loaded Fries',
      desc: 'Crispy golden potato fries seasoned with hot peri peri spice, topped with warm liquid cheddar and jalapeño bits.',
      price: 189,
      discount_price: 159,
      is_veg: 1,
      is_bestseller: 1,
      is_featured: 0,
      img: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
      prep: '12 mins',
      cal: 420,
      rating: 4.8
    },

    // --- Beverages & Mocktails ---
    {
      cat: 'beverages',
      name: 'Alphonso Mango Lassi Royale',
      desc: 'Thick, velvety churned organic yogurt blended with pure Ratnagiri Alphonso pulp, finished with crushed pistachios.',
      price: 149,
      discount_price: 129,
      is_veg: 1,
      is_bestseller: 1,
      is_featured: 1,
      img: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?auto=format&fit=crop&w=800&q=80',
      prep: '5 mins',
      cal: 280,
      rating: 5.0
    },
    {
      cat: 'beverages',
      name: 'Blueberry Mint Mojito Cooler',
      desc: 'Wild mountain blueberries muddled with fresh garden mint, Persian lime, and chilled sparkling soda.',
      price: 169,
      discount_price: 139,
      is_veg: 1,
      is_bestseller: 0,
      is_featured: 0,
      img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
      prep: '5 mins',
      cal: 140,
      rating: 4.7
    },
    {
      cat: 'beverages',
      name: 'Belgian Chocolate Truffle Shake',
      desc: 'Indulgent thick shake crafted with 70% dark Belgian cocoa, vanilla ice cream, and chocolate brownie crumble.',
      price: 199,
      discount_price: 169,
      is_veg: 1,
      is_bestseller: 1,
      is_featured: 0,
      img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
      prep: '8 mins',
      cal: 480,
      rating: 4.9
    },

    // --- Artisan Desserts ---
    {
      cat: 'desserts',
      name: 'Saffron Angoori Rasmalai (2 Pcs)',
      desc: 'Delicate cottage cheese dumplings soaked in chilled saffron cardamom infused reduced milk, adorned with 24k edible gold leaf.',
      price: 179,
      discount_price: 149,
      is_veg: 1,
      is_bestseller: 1,
      is_featured: 1,
      img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
      prep: '5 mins',
      cal: 280,
      rating: 5.0
    },
    {
      cat: 'desserts',
      name: 'Molten Chocolate Nutella Lava Cake',
      desc: 'Warm baked dark chocolate soufflé cake with a gushing molten Nutella core, served with dark chocolate drizzle.',
      price: 199,
      discount_price: 169,
      is_veg: 1,
      is_bestseller: 1,
      is_featured: 0,
      img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
      prep: '8 mins',
      cal: 460,
      rating: 4.9
    },

    // --- Special Combos ---
    {
      cat: 'special-combos',
      name: 'Grand Biryani Feast Combo (Serves 2-3)',
      desc: '1x Hyderabadi Dum Chicken Biryani + 1x Murgh Malai Tikka (4 pcs) + 2x Salan & Raita + 2x Gulab Jamuns + 2x Cokes.',
      price: 899,
      discount_price: 749,
      is_veg: 0,
      is_bestseller: 1,
      is_featured: 1,
      img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      prep: '25 mins',
      cal: 1100,
      rating: 5.0
    },
    {
      cat: 'special-combos',
      name: 'Royal Shahi Vegetarian Thali Box',
      desc: 'Paneer Lababdar + Dal Bukhara + 2x Butter Naan + Jeera Rice + Salad + Mint Chutney + 1x Saffron Rasmalai.',
      price: 499,
      discount_price: 419,
      is_veg: 1,
      is_bestseller: 1,
      is_featured: 1,
      img: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
      prep: '20 mins',
      cal: 920,
      rating: 4.9
    }
  ];

  for (const d of dishes) {
    const category_id = catMap[d.cat];
    await db.run(`
      INSERT INTO food_items 
      (category_id, name, description, price, discount_price, is_veg, is_bestseller, is_featured, image_url, preparation_time, calories, rating, reviews_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      category_id,
      d.name,
      d.desc,
      d.price,
      d.discount_price,
      d.is_veg,
      d.is_bestseller,
      d.is_featured,
      d.img,
      d.prep,
      d.cal,
      d.rating,
      Math.floor(Math.random() * 40) + 12
    ]);
  }

  // 5. Promotional Coupons
  const coupons = [
    {
      code: 'WELCOME50',
      desc: '50% Flat Discount up to ₹100 on your first order',
      type: 'PERCENTAGE',
      val: 50,
      min: 199,
      max: 100
    },
    {
      code: 'FEAST100',
      desc: 'Flat ₹100 OFF on orders above ₹499',
      type: 'FLAT',
      val: 100,
      min: 499,
      max: null
    },
    {
      code: 'ROCKET20',
      desc: '20% OFF on all cloud rocket combos & curries',
      type: 'PERCENTAGE',
      val: 20,
      min: 349,
      max: 150
    },
    {
      code: 'FREEDEL',
      desc: 'Free Express Delivery across the city',
      type: 'FLAT',
      val: 40,
      min: 249,
      max: 40
    }
  ];

  for (const cp of coupons) {
    await db.run(`
      INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `, [cp.code, cp.desc, cp.type, cp.val, cp.min, cp.max]);
  }

  // 6. Verified Customer Reviews
  const reviews = [
    {
      name: 'Rohan Mehra',
      rating: 5,
      comment: 'Ordered the Dum Biryani and Butter Chicken via WhatsApp. It arrived sizzling hot in exactly 28 minutes! The aroma when opening the clay pot seal was unreal.',
      is_featured: 1
    },
    {
      name: 'Priyanka Sen',
      rating: 5,
      comment: 'Hands down the best Cloud Kitchen in Mumbai. The packaging is 100% eco-friendly and spill-proof. The Saffron Rasmalai was divine!',
      is_featured: 1
    },
    {
      name: 'Vikramaditya Roy',
      rating: 5,
      comment: 'Super seamless WhatsApp ordering experience. Sent one message and the kitchen acknowledged instantly. Five stars for food quality & hygiene.',
      is_featured: 1
    },
    {
      name: 'Ananya Gupta',
      rating: 5,
      comment: 'The Dal Bukhara tastes exactly like a 5-star luxury hotel. Thick, buttery and cooked to perfection. Ordering every weekend now!',
      is_featured: 1
    }
  ];

  for (const r of reviews) {
    await db.run('INSERT INTO reviews (user_name, rating, comment, is_featured) VALUES (?, ?, ?, ?)', [r.name, r.rating, r.comment, r.is_featured]);
  }

  // 7. Sample Initial Order (for Admin Demo)
  const sampleOrder = await db.run(`
    INSERT INTO orders (
      order_number, user_id, customer_name, customer_email, customer_phone,
      delivery_address, landmark, special_instructions,
      subtotal, discount_amount, delivery_fee, tax_amount, total_amount,
      coupon_code, payment_method, payment_status, order_status, created_at
    ) VALUES (
      'RZ-881924', 2, 'Aarav Sharma', 'customer@gmail.com', '+919812345678',
      'Flat 402, Sunshine Heights, Link Road, Andheri West', 'Near Infiniti Mall',
      'Please send extra green mint chutney and disposable cutlery',
      648, 100, 0, 27.4, 575.4,
      'FEAST100', 'WHATSAPP', 'PENDING', 'PREPARING', CURRENT_TIMESTAMP
    )
  `);

  await db.run(`
    INSERT INTO order_items (order_id, food_name, price, quantity, total_price, is_veg)
    VALUES 
    (?, 'Hyderabadi Dum Chicken Biryani', 319, 1, 319, 0),
    (?, 'Amritsari Paneer Tikka', 249, 1, 249, 1),
    (?, 'Alphonso Mango Lassi Royale', 129, 1, 129, 1)
  `, [sampleOrder.lastID, sampleOrder.lastID, sampleOrder.lastID]);

  console.log('✅ Database seeded with categories, dishes, coupons, admin, customer, reviews, and settings!');
}

module.exports = { seedData };

