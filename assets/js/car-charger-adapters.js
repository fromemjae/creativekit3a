/* ============================================================
   car-charger-adapters.js / items-page.js
   Dynamic product variants and item details engine for CreativeKit 3A.
   Renders hero banner, filter tabs, variant cards, and related products
   across ALL 8 categories without bouncing or broken links.
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     CATEGORY DATA CATALOG (Shared definitions across site)
     ============================================================ */
  const CATEGORY_CATALOG = {
    'accessories-gadgets': {
      name: 'Accessories & Gadgets',
      subcats: [
        { key: 'car', label: 'Car Accessories' },
        { key: 'computer', label: 'Computer Accessories' },
        { key: 'desk', label: 'Desk Accessories' },
        { key: 'mobile', label: 'Mobile Accessories' },
        { key: 'gadgets', label: 'Gadgets' },
      ],
      products: [
        { id: 1, name: 'Car Charger Adapters', price: 'As low as ₱85.00', img: 'assets/images/car-charger-adapters.png', url: '/product/car-charger-adapter', subcat: 'car' },
        { id: 2, name: 'Car Organizers & Holders', price: 'As low as ₱120.00', img: 'assets/images/car-organizer.png', url: '/product/car-organizers', subcat: 'car' },
        { id: 3, name: 'Dash Cams', price: 'As low as ₱450.00', img: 'assets/images/dash-cam.png', url: '/product/car-dashcams', subcat: 'car' },
        { id: 4, name: 'Audio Accessories', price: 'As low as ₱95.00', img: 'assets/images/audio-accessories.png', url: '/product/computer-audio', subcat: 'computer' },
        { id: 5, name: 'Mouse & Mouse Pads', price: 'As low as ₱75.00', img: 'assets/images/mouse-pad.png', url: '/product/computer-mouse', subcat: 'computer' },
        { id: 7, name: 'Desk Organizers & Pen Holders', price: 'As low as ₱95.00', img: 'assets/images/desk-organizer.png', url: '/product/desk-organizers', subcat: 'desk' },
        { id: 8, name: 'Clocks & Timepieces', price: 'As low as ₱220.00', img: 'assets/images/wooven-clock.png', url: '/product/desk-clocks', subcat: 'desk' },
        { id: 9, name: 'Mobile Power Banks', price: 'As low as ₱350.00', img: 'assets/images/mobile-powerbank.png', url: '/product/mobile-powerbanks', subcat: 'mobile' },
        { id: 10, name: 'Mobile Stands', price: 'As low as ₱65.00', img: 'assets/images/mobile-stand.png', url: '/product/mobile-stands', subcat: 'mobile' },
        { id: 11, name: 'Portable Fans', price: 'As low as ₱180.00', img: 'assets/images/portable-fan.png', url: '/product/gadgets-portable-fans', subcat: 'gadgets' },
        { id: 12, name: 'Power Banks', price: 'As low as ₱380.00', img: 'assets/images/power-banks.png', url: '/product/gadgets-powerbanks', subcat: 'gadgets' },
      ]
    },
    'apparel': {
      name: 'Apparel',
      subcats: [
        { key: 'caps', label: 'Caps' },
        { key: 'jackets', label: 'Jackets' },
        { key: 'shirts', label: 'Shirts' },
      ],
      products: [
        { id: 1, name: 'Baseball Cap', price: 'As low as ₱180.00', img: 'assets/images/baseball-cap.png', url: '/product/cap-baseball/', subcat: 'caps' },
        { id: 2, name: 'Bucket Hat', price: 'As low as ₱190.00', img: 'assets/images/baseball-cap.png', url: '/product/cap-bucket-hat/', subcat: 'caps' },
        { id: 3, name: 'Bomber Jackets', price: 'As low as ₱650.00', img: 'assets/images/bomber-jacket.png', url: '/product/jacket-bomber/', subcat: 'jackets' },
        { id: 4, name: 'Corporate Jackets', price: 'As low as ₱720.00', img: 'assets/images/corporate-jacket.png', url: '/product/jackets-corporate/', subcat: 'jackets' },
        { id: 5, name: 'Hoodies', price: 'As low as ₱480.00', img: 'assets/images/bomber-jacket.png', url: '/product/jacket-hoodies/', subcat: 'jackets' },
        { id: 6, name: 'Varsity Jackets', price: 'As low as ₱800.00', img: 'assets/images/corporate-jacket.png', url: '/product/jacket-varsity-jackets/', subcat: 'jackets' },
        { id: 7, name: 'Collared Shirt', price: 'As low as ₱280.00', img: 'assets/images/collared-shirt.png', url: '/product/shirt-collared/', subcat: 'shirts' },
        { id: 8, name: 'Dri Fit Shirt', price: 'As low as ₱250.00', img: 'assets/images/collared-shirt.png', url: '/product/shirt-dri-fit/', subcat: 'shirts' },
        { id: 9, name: 'Round Neck Shirt', price: 'As low as ₱220.00', img: 'assets/images/collared-shirt.png', url: '/product/shirt-round-neck/', subcat: 'shirts' },
      ]
    },
    'bags-pouches': {
      name: 'Bags & Pouches',
      subcats: [
        { key: 'backpacks', label: 'Backpacks' },
        { key: 'ecobags', label: 'Eco Bags' },
        { key: 'laptop', label: 'Laptop Bags' },
        { key: 'tote', label: 'Tote Bags' },
        { key: 'travel', label: 'Travel Bags' },
        { key: 'lunch', label: 'Lunch Bags' },
        { key: 'organizer', label: 'Organizer Pouches' },
      ],
      products: [
        { id: 1, name: 'Computer Backpacks', price: 'As low as ₱480.00', img: 'assets/images/laptop-backpack.png', url: '/product/backpacks-computer/', subcat: 'backpacks' },
        { id: 2, name: 'Sports Backpacks', price: 'As low as ₱420.00', img: 'assets/images/laptop-backpack.png', url: '/product/backpacks-sports/', subcat: 'backpacks' },
        { id: 3, name: 'Travel Backpacks', price: 'As low as ₱550.00', img: 'assets/images/laptop-backpack.png', url: '/product/backpacks-travel/', subcat: 'backpacks' },
        { id: 4, name: 'Foldable Shopping Totes', price: 'As low as ₱95.00', img: 'assets/images/eco-bag.png', url: '/product/ecobags-shopping-tote/', subcat: 'ecobags' },
        { id: 5, name: 'Non Woven Shopping Bags', price: 'As low as ₱75.00', img: 'assets/images/eco-bag.png', url: '/product/ecobags-non-woven/', subcat: 'ecobags' },
        { id: 6, name: 'Laptop Backpacks', price: 'As low as ₱520.00', img: 'assets/images/laptop-backpack.png', url: '/product/laptop-backpack/', subcat: 'laptop' },
        { id: 7, name: 'Laptop Shoulder Bags', price: 'As low as ₱450.00', img: 'assets/images/laptop-backpack.png', url: '/product/laptop-shoulder-bag/', subcat: 'laptop' },
        { id: 8, name: 'Classic Zip Totes', price: 'As low as ₱120.00', img: 'assets/images/tote-bag.png', url: '/product/tote-bag-classic-zip/', subcat: 'tote' },
        { id: 9, name: 'Foldable Totes', price: 'As low as ₱95.00', img: 'assets/images/tote-bag.png', url: '/product/tote-bag-foldable-zip/', subcat: 'tote' },
        { id: 10, name: 'Duffel Travel Bags', price: 'As low as ₱680.00', img: 'assets/images/laptop-backpack.png', url: '/product/travel-bag-duffel/', subcat: 'travel' },
      ]
    },
    'drinkware': {
      name: 'Drinkware',
      subcats: [
        { key: 'tumbler', label: 'Tumblers & Flasks' },
        { key: 'mugs', label: 'Mugs & Cups' },
        { key: 'bottles', label: 'Water Bottles' },
        { key: 'eco', label: 'Eco-Friendly' },
      ],
      products: [
        { id: 1, name: 'Bamboo Tumblers', price: 'As low as ₱220.00', img: 'assets/images/bamboo-tumbler.png', url: '/product/tumbler-bamboo/', subcat: 'tumbler' },
        { id: 2, name: 'Insulated & Double-Walled', price: 'As low as ₱280.00', img: 'assets/images/stainless-tumbler.png', url: '/product/tumbler-insulated/', subcat: 'tumbler' },
        { id: 3, name: 'Stainless Steel Tumblers', price: 'As low as ₱310.00', img: 'assets/images/stainless-tumbler.png', url: '/product/tumbler-stainless/', subcat: 'tumbler' },
        { id: 4, name: 'Ceramic Mugs', price: 'As low as ₱95.00', img: 'assets/images/ceramic-mug.png', url: '/product/mugs-ceramic/', subcat: 'mugs' },
        { id: 5, name: 'Coffee Mugs', price: 'As low as ₱110.00', img: 'assets/images/ceramic-mug.png', url: '/product/mugs-coffee/', subcat: 'mugs' },
        { id: 6, name: 'Travel Mugs with Lids', price: 'As low as ₱195.00', img: 'assets/images/stainless-tumbler.png', url: '/product/mugs-travel-mugs/', subcat: 'mugs' },
        { id: 7, name: 'Sports Bottles', price: 'As low as ₱140.00', img: 'assets/images/stainless-tumbler.png', url: '/product/water-bottle-sports/', subcat: 'bottles' },
        { id: 8, name: 'Bamboo Drinkware', price: 'As low as ₱195.00', img: 'assets/images/bamboo-tumbler.png', url: '/product/eco-friendly-bamboo/', subcat: 'eco' },
      ]
    },
    'giftset': {
      name: 'Gift Set',
      subcats: [
        { key: 'corporate', label: 'Corporate' },
        { key: 'lifestyle', label: 'Lifestyle' },
        { key: 'wellness', label: 'Health & Wellness' },
      ],
      products: [
        { id: 1, name: 'Desk Essentials Gift Sets', price: 'Ask for Quote', img: 'assets/images/desk-gift-set.png', url: '/product/gift-set-desk-essentials/', subcat: 'corporate' },
        { id: 2, name: 'Employee Onboarding Sets', price: 'Ask for Quote', img: 'assets/images/onboarding-set.png', url: '/product/gift-set-employee-onboarding/', subcat: 'corporate' },
        { id: 3, name: 'Sustainable Gift Sets', price: 'Ask for Quote', img: 'assets/images/onboarding-set.png', url: '/product/gift-set-sustainable/', subcat: 'lifestyle' },
        { id: 4, name: 'Work From Home Gift Sets', price: 'Ask for Quote', img: 'assets/images/desk-gift-set.png', url: '/product/gift-set-work-from-home/', subcat: 'corporate' },
      ]
    },
    'home-living': {
      name: 'Home Living',
      subcats: [
        { key: 'kitchen', label: 'Kitchen & Dining' },
        { key: 'personal', label: 'Personal Care' },
        { key: 'outdoor', label: 'Outdoor & Lifestyle' },
      ],
      products: [
        { id: 1, name: 'Cleaning Essentials', price: 'Ask for Quote', img: 'assets/images/desk-organizer.png', url: '/product/home-living-cleaning-essentials/', subcat: 'kitchen' },
        { id: 2, name: 'Cutlery Sets', price: 'Ask for Quote', img: 'assets/images/bamboo-tumbler.png', url: '/product/home-living-cutlery-sets/', subcat: 'kitchen' },
        { id: 3, name: 'Outdoor Chairs', price: 'Ask for Quote', img: 'assets/images/laptop-backpack.png', url: '/product/home-living-outdoor-chairs/', subcat: 'outdoor' },
        { id: 4, name: 'Personal Care', price: 'Ask for Quote', img: 'assets/images/desk-organizer.png', url: '/product/home-living-personal-care/', subcat: 'personal' },
      ]
    },
    'pen-paper': {
      name: 'Pen & Paper',
      subcats: [
        { key: 'pen', label: 'Pens' },
        { key: 'paper', label: 'Paper & Notebooks' },
      ],
      products: [
        { id: 1, name: 'Bamboo Pens', price: 'As low as ₱35.00', img: 'assets/images/bamboo-pen.png', url: '/product/pen-bamboo/', subcat: 'pen' },
        { id: 2, name: 'Metal Pens', price: 'As low as ₱55.00', img: 'assets/images/bamboo-pen.png', url: '/product/pen-metal/', subcat: 'pen' },
        { id: 3, name: 'Multi-Functional Pens', price: 'As low as ₱75.00', img: 'assets/images/bamboo-pen.png', url: '/product/pen-multi-functional/', subcat: 'pen' },
        { id: 4, name: 'Custom Notebooks & Journals', price: 'As low as ₱95.00', img: 'assets/images/custom-notebook.png', url: '/product/paper-notebooks-journals', subcat: 'paper' },
        { id: 5, name: 'Custom Desk Calendars', price: 'As low as ₱120.00', img: 'assets/images/custom-notebook.png', url: '/product/paper-desk-calendars/', subcat: 'paper' },
      ]
    },
    'pu-leather': {
      name: 'PU Leather',
      subcats: [
        { key: 'wallets', label: 'Wallets & Cases' },
        { key: 'organizers', label: 'Organizers & Bags' },
        { key: 'keychains', label: 'Keychains & Tags' },
      ],
      products: [
        { id: 1, name: 'Wallets', price: 'As low as ₱195.00', img: 'assets/images/leather-wallet.png', url: '/product/pu-leather-wallets/', subcat: 'wallets' },
        { id: 2, name: 'Card Cases', price: 'As low as ₱120.00', img: 'assets/images/leather-wallet.png', url: '/product/pu-leather-card-cases/', subcat: 'wallets' },
        { id: 3, name: 'Desk Mats', price: 'As low as ₱220.00', img: 'assets/images/mouse-pad.png', url: '/product/pu-leather-desk-mats/', subcat: 'organizers' },
        { id: 4, name: 'Organizers', price: 'As low as ₱175.00', img: 'assets/images/desk-organizer.png', url: '/product/pu-leather-organizers/', subcat: 'organizers' },
        { id: 5, name: 'Keychains', price: 'As low as ₱65.00', img: 'assets/images/leather-keychain.png', url: '/product/pu-leather-keychains/', subcat: 'keychains' },
      ]
    }
  };

  /* ============================================================
     CURATED RICH ITEMS DATA
     ============================================================ */
  const ITEMS_DATA = {
    'accessories-gadgets': {
      'car-charger-adapter': {
        name:    'Car Charger Adapters',
        eyebrow: 'Car Accessories',
        price:   'As low as ₱85.00',
        heroImg: 'assets/images/car-charger-adapters.png',
        desc:    'Custom-branded car charger adapters — ideal for corporate giveaways, events, and daily commute branding. Available in single-port, dual-port, and fast-charge variants.',
        variantTypes: [
          { key: 'single', label: 'Single Port' },
          { key: 'dual',   label: 'Dual Port'   },
          { key: 'fast',   label: 'Fast Charge' },
        ],
        items: [
          { id: 1, name: 'Single USB-A Car Charger', specs: '5V / 2.1A • USB-A • Compact body', price: 'As low as ₱85.00', img: 'assets/images/1.png', badge: 'Best Seller', variantType: 'single', url: '/product/car-charger-single-usba/' },
          { id: 2, name: 'Single USB-C Car Charger', specs: '5V / 3A • USB-C Fast • Overheat protection', price: 'As low as ₱95.00', img: 'assets/images/usb-c-adapter.png', badge: 'New', variantType: 'single', url: '/product/car-charger-single-usbc/' },
          { id: 3, name: 'Dual Port USB-A Charger', specs: '2x USB-A • 3.1A Total • LED ring glow', price: 'As low as ₱110.00', img: 'assets/images/dual-usb-adapter.png', badge: 'Popular', variantType: 'dual', url: '/product/car-charger-dual-usba/' },
          { id: 4, name: 'Dual USB-A + Type-C Fast Charger', specs: 'Quick Charge 3.0 + 20W PD • Dual port', price: 'As low as ₱165.00', img: 'assets/images/car-charger-adapters.png', badge: 'Premium', variantType: 'fast', url: '/product/car-charger-dual-fast/' },
        ]
      },
      'car-organizers': {
        name:    'Car Organizers & Holders',
        eyebrow: 'Car Accessories',
        price:   'As low as ₱120.00',
        heroImg: 'assets/images/car-organizer.png',
        desc:    'Keep vehicle interiors neat and your brand constantly in view with seat-back organizers, console trays, and custom phone mounts.',
        variantTypes: [
          { key: 'seatback', label: 'Seat-Back' },
          { key: 'console',  label: 'Console' },
          { key: 'mount',    label: 'Phone Mount' }
        ],
        items: [
          { id: 1, name: 'Seat-Back 5-Pocket Organizer', specs: 'Durable 600D Oxford • Tablet sleeve • Easy clean', price: 'As low as ₱120.00', img: 'assets/images/car-organizer.png', badge: 'Best Seller', variantType: 'seatback', url: '/product/car-organizer-seatback/' },
          { id: 2, name: 'Console Armrest Organizer Tray', specs: 'PU Leather • Multiple coin and card slots', price: 'As low as ₱145.00', img: 'assets/images/car-organizer.png', badge: '', variantType: 'console', url: '/product/car-organizer-console/' },
          { id: 3, name: 'Magnetic Auto Air Vent Mount', specs: '360° Rotating Ball • Heavy-duty neodymium magnets', price: 'As low as ₱110.00', img: 'assets/images/car-organizer.png', badge: 'New', variantType: 'mount', url: '/product/car-organizer-mount/' }
        ]
      },
      'car-dashcams': {
        name:    'Dash Cams',
        eyebrow: 'Car Accessories',
        price:   'As low as ₱450.00',
        heroImg: 'assets/images/dash-cam.png',
        desc:    'High-definition automotive video recorders customizable with corporate boot-screen logos and packaging.',
        variantTypes: [
          { key: '1080p', label: 'Full HD 1080p' },
          { key: 'dual',  label: 'Dual Lens' }
        ],
        items: [
          { id: 1, name: '1080p Wide-Angle Dash Cam', specs: '1080p Full HD • 140° Lens • Loop recording', price: 'As low as ₱450.00', img: 'assets/images/dash-cam.png', badge: 'Best Seller', variantType: '1080p', url: '/product/dashcam-1080p/' },
          { id: 2, name: 'Dual Lens Front & Rear Dash Cam', specs: 'Dual 1080p + 720p • Night Vision • G-Sensor', price: 'As low as ₱680.00', img: 'assets/images/dash-cam.png', badge: 'Premium', variantType: 'dual', url: '/product/dashcam-dual/' }
        ]
      },
      'mobile-powerbanks': {
        name:    'Mobile Power Banks',
        eyebrow: 'Tech Essentials',
        price:   'As low as ₱350.00',
        heroImg: 'assets/images/mobile-powerbank.png',
        desc:    'High-capacity branded power banks to keep your clients and employees powered through their busiest days.',
        variantTypes: [
          { key: 'slim', label: 'Slim 10,000mAh' },
          { key: 'fast', label: 'Fast Charge 20,000mAh' }
        ],
        items: [
          { id: 1, name: 'Slim 10,000mAh Power Bank', specs: 'Dual USB + Type-C • LED indicator • Aluminum alloy shell', price: 'As low as ₱350.00', img: 'assets/images/mobile-powerbank.png', badge: 'Best Seller', variantType: 'slim', url: '/product/pbk-10000/' },
          { id: 2, name: '20,000mAh 22.5W Fast Charge Bank', specs: 'PD 20W + QC 3.0 • Digital percentage display', price: 'As low as ₱550.00', img: 'assets/images/power-banks.png', badge: 'New', variantType: 'fast', url: '/product/pbk-20000/' }
        ]
      }
    },

    'apparel': {
      'jackets-corporate': {
        name:    'Corporate Jackets',
        eyebrow: 'Apparel & Outerwear',
        price:   'As low as ₱720.00',
        heroImg: 'assets/images/corporate-jacket.png',
        desc:    'Professional corporate outerwear designed for Philippine corporate events, field teams, and executive gifts. Features embroidery or silk-screen branding.',
        variantTypes: [
          { key: 'windbreaker', label: 'Windbreakers' },
          { key: 'fleece',      label: 'Fleece Lined' },
          { key: 'waterproof',  label: 'Waterproof Pro' }
        ],
        items: [
          { id: 1, name: 'Executive Light Windbreaker', specs: 'Microfiber outer • Water-repellent • Custom chest embroidery', price: 'As low as ₱720.00', img: 'assets/images/corporate-jacket.png', badge: 'Best Seller', variantType: 'windbreaker', url: '/product/jackets-corporate-windbreaker/' },
          { id: 2, name: 'Fleece-Lined Team Jacket', specs: 'Thermal fleece interior • Ribbed cuffs • Side zip pockets', price: 'As low as ₱850.00', img: 'assets/images/corporate-jacket.png', badge: 'Popular', variantType: 'fleece', url: '/product/jackets-corporate-fleece/' },
          { id: 3, name: 'All-Weather Waterproof Jacket', specs: 'Seam-sealed • Packable hood • Breathable inner mesh', price: 'As low as ₱980.00', img: 'assets/images/corporate-jacket.png', badge: 'Premium', variantType: 'waterproof', url: '/product/jackets-corporate-waterproof/' }
        ]
      },
      'jacket-bomber': {
        name:    'Bomber Jackets',
        eyebrow: 'Apparel & Outerwear',
        price:   'As low as ₱650.00',
        heroImg: 'assets/images/bomber-jacket.png',
        desc:    'Modern streetwear-inspired corporate bomber jackets crafted from premium twill and satin materials with custom embroidered patches.',
        variantTypes: [
          { key: 'classic', label: 'Classic Twill' },
          { key: 'satin',   label: 'Executive Satin' }
        ],
        items: [
          { id: 1, name: 'Classic Twill Bomber Jacket', specs: 'Poly-cotton twill • Antique brass zipper • Dual snap pockets', price: 'As low as ₱650.00', img: 'assets/images/bomber-jacket.png', badge: 'Best Seller', variantType: 'classic', url: '/product/jacket-bomber-classic/' },
          { id: 2, name: 'Premium Satin Flight Bomber', specs: 'High-density satin • Contrast orange lining • Arm utility pocket', price: 'As low as ₱780.00', img: 'assets/images/bomber-jacket.png', badge: 'New', variantType: 'satin', url: '/product/jacket-bomber-satin/' }
        ]
      },
      'cap-baseball': {
        name:    'Baseball Cap',
        eyebrow: 'Headwear & Accessories',
        price:   'As low as ₱180.00',
        heroImg: 'assets/images/baseball-cap.png',
        desc:    'Structured 6-panel cotton twill caps with curved visors and adjustable brass buckle closures, perfect for promotional events.',
        variantTypes: [
          { key: 'twill',   label: 'Heavy Twill' },
          { key: 'trucker', label: 'Trucker Mesh' }
        ],
        items: [
          { id: 1, name: '6-Panel Cotton Twill Cap', specs: '100% Cotton twill • 3D Puff or flat embroidery • Brass closure', price: 'As low as ₱180.00', img: 'assets/images/baseball-cap.png', badge: 'Best Seller', variantType: 'twill', url: '/product/cap-baseball-twill/' },
          { id: 2, name: 'Classic Trucker Mesh Cap', specs: 'Structured foam front • Breathable mesh back • Snapback strap', price: 'As low as ₱160.00', img: 'assets/images/baseball-cap.png', badge: 'Popular', variantType: 'trucker', url: '/product/cap-baseball-trucker/' }
        ]
      }
    },

    'bags-pouches': {
      'laptop-backpack': {
        name:    'Laptop Backpacks',
        eyebrow: 'Bags & Carry',
        price:   'As low as ₱520.00',
        heroImg: 'assets/images/laptop-backpack.png',
        desc:    'Ergonomic corporate backpacks equipped with cushioned laptop compartments, anti-theft hidden pockets, and external USB charging pass-through.',
        variantTypes: [
          { key: 'business', label: 'Business Slim' },
          { key: 'travel',   label: 'Travel Large' }
        ],
        items: [
          { id: 1, name: 'Slim Business Laptop Backpack', specs: 'Fits up to 15.6" laptops • Water-resistant nylon • Luggage strap', price: 'As low as ₱520.00', img: 'assets/images/laptop-backpack.png', badge: 'Best Seller', variantType: 'business', url: '/product/backpack-laptop-slim/' },
          { id: 2, name: 'Executive Expandable Travel Pack', specs: 'Expands to 30L • 17" Laptop sleeve • Hidden passport pocket', price: 'As low as ₱690.00', img: 'assets/images/laptop-backpack.png', badge: 'Premium', variantType: 'travel', url: '/product/backpack-laptop-travel/' }
        ]
      },
      'tote-bag-classic-zip': {
        name:    'Classic Zip Totes',
        eyebrow: 'Eco Giveaways',
        price:   'As low as ₱120.00',
        heroImg: 'assets/images/tote-bag.png',
        desc:    'Sturdy, reusable canvas tote bags equipped with top zip closures. Ideal for sustainable corporate gifting, seminars, and retail promotions.',
        variantTypes: [
          { key: 'standard', label: '12oz Canvas' },
          { key: 'pocket',   label: 'With Outer Pocket' }
        ],
        items: [
          { id: 1, name: '12oz Zippered Canvas Tote', specs: '100% Natural unbleached cotton • Reinforced webbed handles', price: 'As low as ₱120.00', img: 'assets/images/tote-bag.png', badge: 'Best Seller', variantType: 'standard', url: '/product/tote-canvas-zip/' },
          { id: 2, name: 'Front-Pocket Zipper Tote', specs: 'Large front slip pocket • Color-accent handles • Screen printed', price: 'As low as ₱145.00', img: 'assets/images/tote-bag.png', badge: 'Eco', variantType: 'pocket', url: '/product/tote-canvas-pocket/' }
        ]
      }
    },

    'drinkware': {
      'tumbler-bamboo': {
        name:    'Bamboo Tumblers',
        eyebrow: 'Eco Drinkware',
        price:   'As low as ₱220.00',
        heroImg: 'assets/images/bamboo-tumbler.png',
        desc:    'Sustainably sourced natural bamboo exterior paired with food-grade 304 stainless steel interior. Keeps beverages icy cold for 24 hours or steaming hot for 12 hours.',
        variantTypes: [
          { key: 'classic', label: 'Standard 450ml' },
          { key: 'strainer',label: 'With Tea Infuser' },
          { key: 'handle',  label: 'Lid Handle' }
        ],
        items: [
          { id: 1, name: 'Bamboo Tumbler 450ml', specs: '450ml • Double-wall vacuum • Precision laser engrave', price: 'As low as ₱220.00', img: 'assets/images/bamboo-tumbler.png', badge: 'Best Seller', variantType: 'classic', url: '/product/tumbler-bamboo-450ml/' },
          { id: 2, name: 'Bamboo Tumbler + Tea Infuser', specs: '500ml • Removable 2-piece stainless mesh infuser', price: 'As low as ₱250.00', img: 'assets/images/bamboo-tumbler.png', badge: 'Popular', variantType: 'strainer', url: '/product/tumbler-bamboo-infuser/' },
          { id: 3, name: 'Bamboo Flask with Steel Carry Loop', specs: '530ml • Leak-proof silicon gasket lid • Ergonomic ring', price: 'As low as ₱280.00', img: 'assets/images/bamboo-tumbler.png', badge: 'Premium', variantType: 'handle', url: '/product/tumbler-bamboo-handle/' }
        ]
      },
      'tumbler-stainless': {
        name:    'Stainless Steel Tumblers',
        eyebrow: 'Drinkware & Flasks',
        price:   'As low as ₱310.00',
        heroImg: 'assets/images/stainless-tumbler.png',
        desc:    'Matte powder-coated insulated travel tumblers available in standard and large hydration sizes with spill-proof lids.',
        variantTypes: [
          { key: '500ml', label: '500ml Flask' },
          { key: '750ml', label: '750ml Sport' }
        ],
        items: [
          { id: 1, name: '500ml Powder Coat Tumbler', specs: '18/8 Stainless steel • Sweat-proof matte finish • Laser engraved', price: 'As low as ₱310.00', img: 'assets/images/stainless-tumbler.png', badge: 'Best Seller', variantType: '500ml', url: '/product/tumbler-ss-500ml/' },
          { id: 2, name: '750ml Wide-Mouth Sport Flask', specs: 'Wide mouth for ice cubes • Chug lid with handle loop', price: 'As low as ₱380.00', img: 'assets/images/stainless-tumbler.png', badge: 'New', variantType: '750ml', url: '/product/tumbler-ss-750ml/' }
        ]
      },
      'mugs-ceramic': {
        name:    'Ceramic Mugs',
        eyebrow: 'Office Drinkware',
        price:   'As low as ₱95.00',
        heroImg: 'assets/images/ceramic-mug.png',
        desc:    'Classic glossy white and two-tone ceramic mugs, perfectly suited for full-wrap sublimation prints or corporate brand logos.',
        variantTypes: [
          { key: 'classic', label: '11oz Classic' },
          { key: 'campfire',label: '15oz Campfire' }
        ],
        items: [
          { id: 1, name: '11oz Full-Color Ceramic Mug', specs: 'Gloss ceramic • Full-wrap dye sublimation • Microwave safe', price: 'As low as ₱95.00', img: 'assets/images/ceramic-mug.png', badge: 'Best Seller', variantType: 'classic', url: '/product/mug-11oz/' },
          { id: 2, name: '15oz Speckled Campfire Mug', specs: 'Vintage enamel look • Heavy ceramic wall • Generous capacity', price: 'As low as ₱135.00', img: 'assets/images/ceramic-mug.png', badge: 'Trending', variantType: 'campfire', url: '/product/mug-campfire/' }
        ]
      }
    },

    'pen-paper': {
      'pen-bamboo': {
        name:    'Bamboo Pens',
        eyebrow: 'Eco Stationery',
        price:   'As low as ₱35.00',
        heroImg: 'assets/images/bamboo-pen.png',
        desc:    'Lightweight, elegant bamboo ballpoint pens with polished chrome accents and smooth German black ink refills.',
        variantTypes: [
          { key: 'standard', label: 'Standard Ballpoint' },
          { key: 'stylus',   label: 'Stylus Tip' }
        ],
        items: [
          { id: 1, name: 'Classic Bamboo Click Pen', specs: 'Natural bamboo body • Retractable click • Crisp laser engraving', price: 'As low as ₱35.00', img: 'assets/images/bamboo-pen.png', badge: 'Best Seller', variantType: 'standard', url: '/product/pen-bamboo-click/' },
          { id: 2, name: 'Bamboo Touchscreen Stylus Pen', specs: 'Conductive soft stylus tip • Dual function for tablets & phones', price: 'As low as ₱48.00', img: 'assets/images/bamboo-pen.png', badge: 'New', variantType: 'stylus', url: '/product/pen-bamboo-stylus/' }
        ]
      },
      'paper-notebooks-journals': {
        name:    'Custom Notebooks & Journals',
        eyebrow: 'Stationery & Executive',
        price:   'As low as ₱95.00',
        heroImg: 'assets/images/custom-notebook.png',
        desc:    'A5 hardbound corporate notebooks with debossed logos, matching elastic closure bands, and 80gsm ivory lined paper.',
        variantTypes: [
          { key: 'hardbound', label: 'Hardbound A5' },
          { key: 'spiral',    label: 'Eco Kraft Spiral' }
        ],
        items: [
          { id: 1, name: 'A5 Classic Hardbound Journal', specs: '160 lined ivory pages • Ribbon bookmark • Debossed cover logo', price: 'As low as ₱95.00', img: 'assets/images/custom-notebook.png', badge: 'Best Seller', variantType: 'hardbound', url: '/product/journal-a5-hardbound/' },
          { id: 2, name: 'Recycled Kraft Spiral Notebook', specs: 'Eco kraft paper cover • Includes matching ballpoint pen', price: 'As low as ₱75.00', img: 'assets/images/custom-notebook.png', badge: 'Eco', variantType: 'spiral', url: '/product/notebook-kraft-spiral/' }
        ]
      }
    },

    'pu-leather': {
      'pu-leather-wallets': {
        name:    'PU Leather Wallets',
        eyebrow: 'Leather Corporate Gifts',
        price:   'As low as ₱195.00',
        heroImg: 'assets/images/leather-wallet.png',
        desc:    'Sophisticated bifold PU leather wallets featuring RFID blocking shields, multiple card slots, and custom metallic debossing.',
        variantTypes: [
          { key: 'bifold', label: 'Bifold Wallet' },
          { key: 'card',   label: 'Slim Card Holder' }
        ],
        items: [
          { id: 1, name: 'Executive RFID Bifold Wallet', specs: '8 Card slots • 2 Bill compartments • RFID blocking layer', price: 'As low as ₱195.00', img: 'assets/images/leather-wallet.png', badge: 'Best Seller', variantType: 'bifold', url: '/product/wallet-rfid-bifold/' },
          { id: 2, name: 'Minimalist Front-Pocket Card Holder', specs: 'Slim 4mm profile • Center cash sleeve • Premium stitching', price: 'As low as ₱125.00', img: 'assets/images/leather-wallet.png', badge: 'Popular', variantType: 'card', url: '/product/wallet-slim-card/' }
        ]
      },
      'pu-leather-keychains': {
        name:    'PU Leather Keychains',
        eyebrow: 'Leather Accessories',
        price:   'As low as ₱65.00',
        heroImg: 'assets/images/leather-keychain.png',
        desc:    'Custom stitched PU leather key fobs paired with zinc-alloy split rings. Ideal for car dealerships, hotel tokens, and VIP events.',
        variantTypes: [
          { key: 'loop',  label: 'Loop Strap' },
          { key: 'fob',   label: 'Shield Fob' }
        ],
        items: [
          { id: 1, name: 'Stitched Leather Loop Keychain', specs: 'Double-riveted loop • Brushed silver ring • Hot stamp logo', price: 'As low as ₱65.00', img: 'assets/images/leather-keychain.png', badge: 'Best Seller', variantType: 'loop', url: '/product/keychain-leather-loop/' },
          { id: 2, name: 'Shield Leather & Metal Keyring', specs: 'Zinc alloy badge with bonded leather inset', price: 'As low as ₱85.00', img: 'assets/images/leather-keychain.png', badge: 'Premium', variantType: 'fob', url: '/product/keychain-leather-fob/' }
        ]
      }
    }
  };


  /* ============================================================
     HELPER: Parse URL Query Parameters
     ============================================================ */
  function getParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      cat:    params.get('cat')    || 'accessories-gadgets',
      subcat: params.get('subcat') || 'car',
      item:   (params.get('item')   || 'car-charger-adapter').replace(/^\/product\//, '').replace(/\/$/, ''),
    };
  }

  /* ============================================================
     RESOLVE OR DYNAMICALLY GENERATE ITEM DATA
     GUARANTEE: NEVER bounces or redirects back!
     ============================================================ */
  function resolveItemData(params) {
    // 0. Dynamic DB items from PHP (creativekit3a_db) if present
    if (window.ITEMS_DATA && window.ITEMS_DATA[params.cat] && window.ITEMS_DATA[params.cat][params.item]) {
      return window.ITEMS_DATA[params.cat][params.item];
    }

    // 1. Direct match in curated ITEMS_DATA
    if (ITEMS_DATA[params.cat] && ITEMS_DATA[params.cat][params.item]) {
      return ITEMS_DATA[params.cat][params.item];
    }

    // 2. Check if product exists in CATEGORY_CATALOG
    const catCatalog = CATEGORY_CATALOG[params.cat] || CATEGORY_CATALOG['accessories-gadgets'];
    const catalogProduct = catCatalog.products?.find(p => {
      const pSlug = p.url.replace(/^\/product\//, '').replace(/\/$/, '');
      return pSlug === params.item;
    });

    const humanName = catalogProduct ? catalogProduct.name : params.item
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());

    const basePrice = catalogProduct ? catalogProduct.price : 'As low as ₱95.00';
    const heroImg   = catalogProduct ? catalogProduct.img : 'assets/images/car-charger-adapters.png';
    const subcatObj = catCatalog.subcats?.find(s => s.key === params.subcat);
    const eyebrow   = subcatObj ? subcatObj.label : catCatalog.name;

    // Synthesize rich variant data dynamically
    return {
      name:    humanName,
      eyebrow: eyebrow,
      price:   basePrice,
      heroImg: heroImg,
      desc:    `Premium corporate ${humanName} customized with your organization's logo. Perfect for high-impact brand promotions, company events, conferences, and employee appreciation gifts. Choose your configuration below.`,
      variantTypes: [
        { key: 'standard',  label: 'Standard Edition' },
        { key: 'executive', label: 'Executive Edition' },
        { key: 'eco',       label: 'Custom Imprint' }
      ],
      items: [
        {
          id: 1,
          name: `Classic ${humanName}`,
          specs: 'Standard finish • High-durability build • Silk screen or UV print',
          price: basePrice,
          img: heroImg,
          badge: 'Best Seller',
          variantType: 'standard',
          url: `/product/${params.item}-standard/`
        },
        {
          id: 2,
          name: `Executive ${humanName}`,
          specs: 'Matte premium finish • Precision laser engraved logo • Gift packaged',
          price: basePrice.replace(/₱(\d+)/, (m, p) => '₱' + Math.round(Number(p) * 1.25)),
          img: heroImg,
          badge: 'Premium',
          variantType: 'executive',
          url: `/product/${params.item}-executive/`
        },
        {
          id: 3,
          name: `Eco-Craft ${humanName}`,
          specs: 'Sustainable components • Eco-conscious packaging • Bulk volume savings',
          price: basePrice,
          img: heroImg,
          badge: 'Eco-Friendly',
          variantType: 'eco',
          url: `/product/${params.item}-eco/`
        }
      ]
    };
  }


  /* ============================================================
     RENDER BREADCRUMB
     ============================================================ */
  function renderBreadcrumb(params, itemData) {
    const bcCatLink    = document.getElementById('bc-category-link');
    const bcSubcatLink = document.getElementById('bc-subcat-link');
    const bcItemName   = document.getElementById('bc-item-name');

    const isPhp = window.location.pathname.endsWith('.php');
    const isInSubdir = window.location.pathname.includes('/product/');
    const catTarget = isPhp
      ? (isInSubdir ? '../category-page.php' : 'category-page.php')
      : (isInSubdir ? '../category-page.html' : 'category-page.html');

    const catObj = CATEGORY_CATALOG[params.cat];
    const catLabel = catObj ? catObj.name : params.cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    if (bcCatLink) {
      bcCatLink.textContent = catLabel;
      bcCatLink.href = `${catTarget}?cat=${encodeURIComponent(params.cat)}`;
    }

    if (bcSubcatLink) {
      const subcatObj = catObj?.subcats?.find(s => s.key === params.subcat);
      const subcatLabel = subcatObj ? subcatObj.label : params.subcat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      bcSubcatLink.textContent = subcatLabel;
      bcSubcatLink.href = `${catTarget}?cat=${encodeURIComponent(params.cat)}`;
    }

    if (bcItemName && itemData) {
      bcItemName.textContent = itemData.name;
    }

    if (itemData) {
      document.title = `${itemData.name} | CreativeKit 3A`;
    }
  }


  /* ============================================================
     RENDER HERO BANNER
     ============================================================ */
  function renderHero(itemData) {
    const title   = document.getElementById('item-hero-title');
    const eyebrow = document.getElementById('item-eyebrow');
    const desc    = document.getElementById('item-hero-desc');
    const price   = document.getElementById('item-hero-price');
    const img     = document.getElementById('item-hero-img');

    if (title)   title.textContent   = itemData.name;
    if (eyebrow) eyebrow.textContent = itemData.eyebrow;
    if (desc)    desc.textContent    = itemData.desc;
    if (price)   price.textContent   = itemData.price;
    if (img) {
      img.src = itemData.heroImg;
      img.alt = itemData.name;
      img.onerror = function () {
        this.src = 'assets/images/car-charger-adapters.png';
      };
    }
  }


  /* ============================================================
     RENDER VARIANT FILTER TABS
     ============================================================ */
  let activeVariantType = '';

  function renderVariantTabs(itemData) {
    const container = document.getElementById('item-variants-tabs-container');
    if (!container) return;
    container.innerHTML = '';

    const wrapper = document.getElementById('item-variants-tabs-wrapper');
    if (!itemData.variantTypes || !itemData.variantTypes.length) {
      if (wrapper) wrapper.style.display = 'none';
      return;
    }
    if (wrapper) wrapper.style.display = '';

    // "All" tab
    const allBtn = document.createElement('button');
    allBtn.className   = 'item-variant-tab' + (!activeVariantType ? ' active' : '');
    allBtn.dataset.key = '';
    allBtn.innerHTML   = `All <span class="vtab-count">${itemData.items.length}</span>`;
    allBtn.addEventListener('click', () => {
      activeVariantType = '';
      renderVariantTabs(itemData);
      renderItemsGrid(itemData, getSortValue());
    });
    container.appendChild(allBtn);

    // Specific variant tabs
    itemData.variantTypes.forEach(vt => {
      const count = itemData.items.filter(i => i.variantType === vt.key).length;
      const btn = document.createElement('button');
      btn.className   = 'item-variant-tab' + (activeVariantType === vt.key ? ' active' : '');
      btn.dataset.key = vt.key;
      btn.innerHTML   = `${vt.label} <span class="vtab-count">${count}</span>`;
      btn.addEventListener('click', () => {
        activeVariantType = vt.key;
        renderVariantTabs(itemData);
        renderItemsGrid(itemData, getSortValue());
      });
      container.appendChild(btn);
    });
  }


  /* ============================================================
     BUILD INDIVIDUAL ITEM CARD
     ============================================================ */
  function buildItemCard(item) {
    const badge = item.badge
      ? `<span class="item-card-badge">${item.badge}</span>`
      : '';

    return `
      <div class="item-card" data-item-name="${item.name}" data-item-price="${item.price}" data-item-img="${item.img}">
        <div class="item-card-img">
          <img src="${item.img}" alt="${item.name}" loading="lazy"
               onerror="this.src='assets/images/car-charger-adapters.png';">
          ${badge}
        </div>
        <div class="item-card-body">
          <div class="item-card-title">${item.name}</div>
          <div class="item-card-specs">${item.specs}</div>
          <div class="item-card-price">${item.price}</div>
        </div>
        <div class="item-card-footer">
          <button class="qm-trigger-btn" type="button" aria-label="Request quote for ${item.name}">
            <i class="fas fa-paper-plane" aria-hidden="true"></i> REQUEST QUOTE
          </button>
          <button class="cart-add-btn" type="button" title="Add to Quote Cart" aria-label="Add to cart">
            <i class="fas fa-cart-plus" aria-hidden="true"></i>
          </button>
        </div>
      </div>`;
  }


  /* ============================================================
     RENDER ITEMS GRID
     ============================================================ */
  function renderItemsGrid(itemData, sortVal) {
    const grid = document.getElementById('items-grid');
    if (!grid) return;
    grid.innerHTML = '';

    let items = activeVariantType
      ? itemData.items.filter(i => i.variantType === activeVariantType)
      : itemData.items;

    const parsePrice = (priceStr) => {
      const num = parseFloat(String(priceStr).replace(/[^0-9.]/g, ''));
      return isNaN(num) ? 0 : num;
    };

    if (sortVal === 'name-asc')   items = [...items].sort((a,b) => a.name.localeCompare(b.name));
    if (sortVal === 'name-desc')  items = [...items].sort((a,b) => b.name.localeCompare(a.name));
    if (sortVal === 'price-asc')  items = [...items].sort((a,b) => parsePrice(a.price) - parsePrice(b.price));
    if (sortVal === 'price-desc') items = [...items].sort((a,b) => parsePrice(b.price) - parsePrice(a.price));

    const countEl = document.getElementById('items-showing-count');
    const nameEl  = document.getElementById('items-showing-name');
    if (countEl) countEl.textContent = items.length;
    if (nameEl)  nameEl.textContent  = itemData.name;

    if (!items.length) {
      grid.innerHTML = '<div class="items-no-results"><i class="fas fa-box-open"></i><p>No variants found.</p></div>';
      return;
    }

    if (!activeVariantType && itemData.variantTypes && itemData.variantTypes.length) {
      itemData.variantTypes.forEach(vt => {
        const group = items.filter(i => i.variantType === vt.key);
        if (!group.length) return;

        const heading = document.createElement('div');
        heading.className = 'items-type-heading';
        heading.innerHTML = `<h3>${vt.label}</h3><span class="type-count">${group.length}</span>`;
        grid.appendChild(heading);

        group.forEach(item => {
          grid.insertAdjacentHTML('beforeend', buildItemCard(item));
        });
      });
    } else {
      items.forEach(item => {
        grid.insertAdjacentHTML('beforeend', buildItemCard(item));
      });
    }

    // Attach card action listeners
    attachCardListeners(grid, itemData);
  }

  function attachCardListeners(grid, itemData) {
    grid.querySelectorAll('.item-card').forEach(card => {
      const title = card.dataset.itemName;
      const price = card.dataset.itemPrice;
      const img   = card.dataset.itemImg;

      // 1. "Request Quote" button
      const quoteBtn = card.querySelector('.qm-trigger-btn');
      if (quoteBtn) {
        quoteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (typeof window.openQuoteForProduct === 'function') {
            window.openQuoteForProduct(title, '', `Selected variant: ${title} (${price})`);
          } else if (typeof openModal === 'function') {
            openModal('quote-modal');
            const details = document.getElementById('qm-details');
            if (details) details.value = `Inquiring about variant: ${title} (${price})\n` + details.value;
          }
        });
      }

      // 2. "Add to Quote Cart" button
      const cartBtn = card.querySelector('.cart-add-btn');
      if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (typeof window.addToCart === 'function') {
            window.addToCart({
              id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              name: title,
              price: price,
              img: img
            });
          } else if (typeof showToast === 'function') {
            showToast(`Added "${title}" to Quote Cart!`);
          }
        });
      }

      // Clicking card anywhere triggers quote pre-fill
      card.addEventListener('click', () => {
        if (typeof window.openQuoteForProduct === 'function') {
          window.openQuoteForProduct(title, '', `Selected variant: ${title} (${price})`);
        } else if (typeof openModal === 'function') {
          openModal('quote-modal');
        }
      });
    });
  }


  /* ============================================================
     RENDER RELATED PRODUCTS (Dynamic from same category)
     ============================================================ */
  function renderRelated(params, currentItemSlug) {
    const relatedGrid = document.getElementById('related-grid') || document.getElementById('items-related-grid');
    if (!relatedGrid) return;
    relatedGrid.innerHTML = '';

    if (window.SIBLING_DATA && window.SIBLING_DATA[params.cat]) {
      const dbSiblings = window.SIBLING_DATA[params.cat].filter(s => s.slug !== currentItemSlug);
      if (dbSiblings.length) {
        dbSiblings.forEach(sib => {
          const card = document.createElement('div');
          card.className = 'product-card';
          card.innerHTML = `
            <div class="product-card-img">
              <img src="${sib.img}" alt="${sib.name}" loading="lazy" onerror="this.src='assets/images/placeholder.png';">
            </div>
            <div class="product-card-body">
              <div class="product-card-title">${sib.name}</div>
              <div class="product-card-price">${sib.price}</div>
            </div>
            <div class="product-card-footer">
              <span class="customize-btn"><i class="fas fa-chevron-right"></i> VIEW</span>
            </div>`;
          card.style.cursor = 'pointer';
          card.addEventListener('click', () => { window.location.href = sib.url; });
          relatedGrid.appendChild(card);
        });
        return;
      }
    }

    const catObj = CATEGORY_CATALOG[params.cat] || CATEGORY_CATALOG['accessories-gadgets'];
    const isPhp  = window.location.pathname.endsWith('.php');
    const isInSubdir = window.location.pathname.includes('/product/');
    const targetPage = isPhp 
      ? (isInSubdir ? 'car-charger-adapters.php' : 'product/car-charger-adapters.php')
      : (isInSubdir ? '../car-charger-adapters.html' : 'car-charger-adapters.html');

    // Get sibling products from the same category
    let siblings = catObj.products.filter(p => {
      const pSlug = p.url.replace(/^\/product\//, '').replace(/\/$/, '');
      return pSlug !== currentItemSlug;
    });

    // If fewer than 4 siblings, take from adjacent categories
    if (siblings.length < 4) {
      Object.keys(CATEGORY_CATALOG).forEach(catKey => {
        if (catKey !== params.cat && siblings.length < 4) {
          siblings.push(...CATEGORY_CATALOG[catKey].products.slice(0, 4 - siblings.length));
        }
      });
    }

    siblings.slice(0, 4).forEach(product => {
      const pSlug = product.url.replace(/^\/product\//, '').replace(/\/$/, '');
      const pCat  = product.catSlug || params.cat;
      const url   = `${targetPage}?cat=${pCat}&subcat=${product.subcat}&item=${pSlug}`;

      const card = document.createElement('div');
      card.className = 'product-card';
      card.dataset.url = url;
      card.innerHTML = `
        <div class="product-card-img">
          <img src="${product.img}" alt="${product.name}" loading="lazy"
               onerror="this.src='assets/images/car-charger-adapters.png';">
        </div>
        <div class="product-card-body">
          <div class="product-card-title">${product.name}</div>
          <div class="product-card-price">${product.price}</div>
        </div>
        <div class="product-card-footer">
          <span class="customize-btn"><i class="fas fa-chevron-right" aria-hidden="true"></i> VIEW VARIANTS</span>
        </div>`;

      card.addEventListener('click', () => {
        window.location.href = url;
      });

      relatedGrid.appendChild(card);
    });
  }


  /* ============================================================
     HELPER: Get sort dropdown value
     ============================================================ */
  function getSortValue() {
    const sel = document.getElementById('items-sort-select');
    return sel ? sel.value : 'default';
  }


  /* ============================================================
     SEARCH: Live filter on items grid
     ============================================================ */
  function initSearch(itemData) {
    const input = document.getElementById('items-search-input') || document.getElementById('navbar-search-input');
    if (!input) return;

    input.addEventListener('input', function () {
      const q = this.value.trim().toLowerCase();
      if (!q) {
        renderItemsGrid(itemData, getSortValue());
        return;
      }

      const grid = document.getElementById('items-grid');
      if (!grid) return;
      grid.innerHTML = '';

      const results = itemData.items.filter(
        i => i.name.toLowerCase().includes(q) || i.specs.toLowerCase().includes(q)
      );

      if (!results.length) {
        grid.innerHTML = `<div class="items-no-results"><i class="fas fa-search"></i><p>No items match "<strong>${q}</strong>"</p></div>`;
        return;
      }

      results.forEach(item => grid.insertAdjacentHTML('beforeend', buildItemCard(item)));
      attachCardListeners(grid, itemData);
    });
  }


  /* ============================================================
     INIT — Runs on page load
     ============================================================ */
  (function init() {
    const params   = getParams();
    const itemData = resolveItemData(params);

    // Render all sections
    renderBreadcrumb(params, itemData);
    renderHero(itemData);
    renderVariantTabs(itemData);
    renderItemsGrid(itemData, 'default');
    renderRelated(params, params.item);
    initSearch(itemData);

    // Sort dropdown listener
    const sortSel = document.getElementById('items-sort-select');
    if (sortSel) {
      sortSel.addEventListener('change', function () {
        renderItemsGrid(itemData, this.value);
      });
    }
  })();

})();
