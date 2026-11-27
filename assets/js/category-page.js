  (function () {
    'use strict';

    /* ============================================================
       CATEGORY DATA
       — Add / edit / remove products here.
       Each product: { id, name, price, img, url, subcat }
       subcat must match a key in subcats[].
       ============================================================ */
    const STATIC_CATEGORY_DATA = {

      'accessories-gadgets': {
        name:    'Accessories & Gadgets',
        icon:    'fas fa-mobile-alt',
        desc:    'Browse our full range of custom accessories, gadgets, tech items, and desk essentials — perfect for corporate giveaways and events.',
        count:   '25+',
        subcats: [
          { key: 'car',      label: 'Car Accessories' },
          { key: 'computer', label: 'Computer Accessories' },
          { key: 'desk',     label: 'Desk Accessories' },
          { key: 'mobile',   label: 'Mobile Accessories' },
          { key: 'gadgets',  label: 'Gadgets' },
        ],
        products: [
          { id:1,  name:'Car Charger Adapters',         price:'As low as ₱85.00',  img:'assets/images/car-charger-adapters.png',                                                                            url:'/product/car-charger-adapter',          subcat:'car'      },
          { id:2,  name:'Car Organizers & Holders',     price:'As low as ₱120.00', img:'assets/images/car-organizer.png',                                                                       url:'/product/car-organizers',               subcat:'car'      },
          { id:3,  name:'Dash Cams',                    price:'As low as ₱450.00', img:'assets/images/dash-cam.png',                                         url:'/product/car-dashcams',                 subcat:'car'      },
          { id:4,  name:'Audio Accessories',            price:'As low as ₱95.00',  img:'assets/images/audio-accessories.png',                                                            url:'/product/computer-audio',               subcat:'computer' },
          { id:5,  name:'Mouse & Mouse Pads',           price:'As low as ₱75.00',  img:'assets/images/mouse-pad.png',                                          url:'/product/computer-mouse',               subcat:'computer' },
          { id:7,  name:'Desk Organizers & Pen Holders',price:'As low as ₱95.00',  img:'assets/images/desk-organizer.png',                                                                   url:'/product/desk-organizers',              subcat:'desk'     },
          { id:8,  name:'Clocks & Timepieces',          price:'As low as ₱220.00', img:'assets/images/wooven-clock.png',                                    url:'/product/desk-clocks',                  subcat:'desk'     },
          { id:9,  name:'Mobile Power Banks',           price:'As low as ₱350.00', img:'assets/images/mobile-powerbank.png',                                                                            url:'/product/mobile-powerbanks',            subcat:'mobile'   },
          { id:10, name:'Mobile Stands',                price:'As low as ₱65.00',  img:'assets/images/mobile-stand.png',                                                                       url:'/product/mobile-stands',                subcat:'mobile'   },
          { id:11, name:'Portable Fans',                price:'As low as ₱180.00', img:'assets/images/portable-fan.png',                                         url:'/product/gadgets-portable-fans',        subcat:'gadgets'  },
          { id:12, name:'Power Banks',                  price:'As low as ₱380.00', img:'assets/images/power-banks.png',                                                            url:'/product/gadgets-powerbanks',           subcat:'gadgets'  },
        ]
      },

      'apparel': {
        name:  'Apparel',
        icon:  'fas fa-tshirt',
        desc:  'Custom-printed caps, jackets, shirts, and uniforms for your brand, team, or event.',
        count: '20+',
        subcats: [
          { key: 'caps',     label: 'Caps' },
          { key: 'jackets',  label: 'Jackets' },
          { key: 'shirts',   label: 'Shirts' },
        ],
        products: [
          { id:1, name:'Baseball Cap',                price:'As low as ₱180.00', img:'https://pinoyballers.com/wp-content/uploads/2021/12/pb-016-1-min-300x192.jpg',                                                url:'/product/cap-baseball/',           subcat:'caps'    },
          { id:2, name:'Bucket Hat',                  price:'As low as ₱190.00', img:'https://pinoyballers.com/wp-content/uploads/2025/03/Silicone_Wristband-300x130.png',                                         url:'/product/cap-bucket-hat/',         subcat:'caps'    },
          { id:3, name:'Bomber Jackets',              price:'As low as ₱650.00', img:'https://pinoyballers.com/wp-content/uploads/2017/11/Custom-Baller-Bands-Xavier-Ateneo-High-School-2-300x182.jpeg',           url:'/product/jacket-bomber/',          subcat:'jackets' },
          { id:4, name:'Corporate Jackets',           price:'As low as ₱720.00', img:'https://pinoyballers.com/wp-content/uploads/2019/08/Soft-Enamel-Lapel-Pins-001-1-300x300.png',                              url:'/product/jackets-corporate/',      subcat:'jackets' },
          { id:5, name:'Hoodies',                     price:'As low as ₱480.00', img:'https://pinoyballers.com/wp-content/uploads/2019/08/ID-Lace-Lanyards-AIFUL-FINANCE-PHILIPPINES-INC-300x142.png',            url:'/product/jacket-hoodies/',         subcat:'jackets' },
          { id:6, name:'Varsity Jackets',             price:'As low as ₱800.00', img:'https://pinoyballers.com/wp-content/uploads/2019/10/Custom-Tote-Bags-0422-194x300.png',                                     url:'/product/jacket-varsity-jackets/', subcat:'jackets' },
          { id:7, name:'Collared Shirt',              price:'As low as ₱280.00', img:'https://pinoyballers.com/wp-content/uploads/2025/09/Elections-Ballers-Gov-Jerry-Singson-ONE-ILOCOS-SUR-300x209.jpg',        url:'/product/shirt-collared/',         subcat:'shirts'  },
          { id:8, name:'Dri Fit Shirt',               price:'As low as ₱250.00', img:'https://pinoyballers.com/wp-content/uploads/2019/11/Fabric-Wristbands-International-School-Manila-Inc-1-298x300.jpeg',      url:'/product/shirt-dri-fit/',          subcat:'shirts'  },
          { id:9, name:'Round Neck Shirt',            price:'As low as ₱220.00', img:'https://pinoyballers.com/wp-content/uploads/2021/12/pb-016-1-min-300x192.jpg',                                               url:'/product/shirt-round-neck/',       subcat:'shirts'  },
        ]
      },

      'bags-pouches': {
        name:  'Bags & Pouches',
        icon:  'fas fa-shopping-bag',
        desc:  'Custom bags for every purpose — from backpacks to eco bags, laptop bags, totes, and travel luggage.',
        count: '18+',
        subcats: [
          { key: 'backpacks',  label: 'Backpacks' },
          { key: 'ecobags',    label: 'Eco Bags' },
          { key: 'laptop',     label: 'Laptop Bags' },
          { key: 'tote',       label: 'Tote Bags' },
          { key: 'travel',     label: 'Travel Bags' },
          { key: 'lunch',      label: 'Lunch Bags' },
          { key: 'organizer',  label: 'Organizer Pouches' },
        ],
        products: [
          { id:1, name:'Computer Backpacks',        price:'As low as ₱480.00', img:'https://pinoyballers.com/wp-content/uploads/2019/10/Custom-Tote-Bags-0422-194x300.png',     url:'/product/backpacks-computer/',       subcat:'backpacks' },
          { id:2, name:'Sports Backpacks',          price:'As low as ₱420.00', img:'https://pinoyballers.com/wp-content/uploads/2021/12/pb-016-1-min-300x192.jpg',               url:'/product/backpacks-sports/',         subcat:'backpacks' },
          { id:3, name:'Travel Backpacks',          price:'As low as ₱550.00', img:'https://pinoyballers.com/wp-content/uploads/2025/03/Silicone_Wristband-300x130.png',         url:'/product/backpacks-travel/',         subcat:'backpacks' },
          { id:4, name:'Foldable Shopping Totes',   price:'As low as ₱95.00',  img:'https://pinoyballers.com/wp-content/uploads/2017/11/Custom-Baller-Bands-Xavier-Ateneo-High-School-2-300x182.jpeg',  url:'/product/ecobags-shopping-tote/',    subcat:'ecobags'   },
          { id:5, name:'Non Woven Shopping Bags',   price:'As low as ₱75.00',  img:'https://pinoyballers.com/wp-content/uploads/2019/08/Soft-Enamel-Lapel-Pins-001-1-300x300.png', url:'/product/ecobags-non-woven/',        subcat:'ecobags'   },
          { id:6, name:'Laptop Backpacks',          price:'As low as ₱520.00', img:'https://pinoyballers.com/wp-content/uploads/2019/08/ID-Lace-Lanyards-AIFUL-FINANCE-PHILIPPINES-INC-300x142.png', url:'/product/laptop-backpack/',          subcat:'laptop'    },
          { id:7, name:'Laptop Shoulder Bags',      price:'As low as ₱450.00', img:'https://pinoyballers.com/wp-content/uploads/2025/09/Elections-Ballers-Gov-Jerry-Singson-ONE-ILOCOS-SUR-300x209.jpg', url:'/product/laptop-shoulder-bag/',      subcat:'laptop'    },
          { id:8, name:'Classic Zip Totes',         price:'As low as ₱120.00', img:'https://pinoyballers.com/wp-content/uploads/2019/10/Custom-Tote-Bags-0422-194x300.png',     url:'/product/tote-bag-classic-zip/',     subcat:'tote'      },
          { id:9, name:'Foldable Totes',            price:'As low as ₱95.00',  img:'https://pinoyballers.com/wp-content/uploads/2019/11/Fabric-Wristbands-International-School-Manila-Inc-1-298x300.jpeg', url:'/product/tote-bag-foldable-zip/',    subcat:'tote'      },
          { id:10,name:'Duffel Travel Bags',        price:'As low as ₱680.00', img:'https://pinoyballers.com/wp-content/uploads/2021/12/pb-016-1-min-300x192.jpg',               url:'/product/travel-bag-duffel/',        subcat:'travel'    },
          { id:11,name:'Weekender Travel Bag',      price:'As low as ₱750.00', img:'https://pinoyballers.com/wp-content/uploads/2025/03/Silicone_Wristband-300x130.png',         url:'/product/travel-bag-weekender/',     subcat:'travel'    },
          { id:12,name:'Hand Carry Lunch Bags',     price:'As low as ₱180.00', img:'https://pinoyballers.com/wp-content/uploads/2017/11/Custom-Baller-Bands-Xavier-Ateneo-High-School-2-300x182.jpeg', url:'/product/lunch-bag-hand-carry/',     subcat:'lunch'     },
          { id:13,name:'Clutch Pouches',            price:'As low as ₱95.00',  img:'https://pinoyballers.com/wp-content/uploads/2019/08/Soft-Enamel-Lapel-Pins-001-1-300x300.png', url:'/product/organizer-clutch-pouche/', subcat:'organizer' },
        ]
      },

      'drinkware': {
        name:  'Drinkware',
        icon:  'fas fa-coffee',
        desc:  'Custom tumblers, mugs, water bottles, and drinkware — great for corporate gifts, events, and everyday use.',
        count: '18+',
        subcats: [
          { key: 'tumbler',     label: 'Tumblers & Flasks' },
          { key: 'mugs',        label: 'Mugs & Cups' },
          { key: 'bottles',     label: 'Water Bottles' },
          { key: 'eco',         label: 'Eco-Friendly' },
        ],
        products: [
          { id:1, name:'Bamboo Tumblers',            price:'As low as ₱220.00', img:'https://pinoyballers.com/wp-content/uploads/2021/12/pb-016-1-min-300x192.jpg',              url:'/product/tumbler-bamboo/',       subcat:'tumbler' },
          { id:2, name:'Insulated & Double-Walled',  price:'As low as ₱280.00', img:'https://pinoyballers.com/wp-content/uploads/2025/03/Silicone_Wristband-300x130.png',        url:'/product/tumbler-insulated/',    subcat:'tumbler' },
          { id:3, name:'Stainless Steel Tumblers',   price:'As low as ₱310.00', img:'https://pinoyballers.com/wp-content/uploads/2017/11/Custom-Baller-Bands-Xavier-Ateneo-High-School-2-300x182.jpeg', url:'/product/tumbler-stainless/',    subcat:'tumbler' },
          { id:4, name:'Ceramic Mugs',               price:'As low as ₱95.00',  img:'https://pinoyballers.com/wp-content/uploads/2019/08/Soft-Enamel-Lapel-Pins-001-1-300x300.png', url:'/product/mugs-ceramic/',         subcat:'mugs'    },
          { id:5, name:'Coffee Mugs',                price:'As low as ₱110.00', img:'https://pinoyballers.com/wp-content/uploads/2019/08/ID-Lace-Lanyards-AIFUL-FINANCE-PHILIPPINES-INC-300x142.png', url:'/product/mugs-coffee/',          subcat:'mugs'    },
          { id:6, name:'Travel Mugs with Lids',      price:'As low as ₱195.00', img:'https://pinoyballers.com/wp-content/uploads/2025/09/Elections-Ballers-Gov-Jerry-Singson-ONE-ILOCOS-SUR-300x209.jpg', url:'/product/mugs-travel-mugs/',     subcat:'mugs'    },
          { id:7, name:'Stainless Steel Mugs',       price:'As low as ₱165.00', img:'https://pinoyballers.com/wp-content/uploads/2019/10/Custom-Tote-Bags-0422-194x300.png',    url:'/product/mugs-stainless/',       subcat:'mugs'    },
          { id:8, name:'BPA-Free Bottles',           price:'As low as ₱120.00', img:'https://pinoyballers.com/wp-content/uploads/2019/11/Fabric-Wristbands-International-School-Manila-Inc-1-298x300.jpeg', url:'/product/water-bottle-bpa/',     subcat:'bottles' },
          { id:9, name:'Sports Bottles',             price:'As low as ₱140.00', img:'https://pinoyballers.com/wp-content/uploads/2021/12/pb-016-1-min-300x192.jpg',              url:'/product/water-bottle-sports/',  subcat:'bottles' },
          { id:10,name:'Bamboo Drinkware',           price:'As low as ₱195.00', img:'https://pinoyballers.com/wp-content/uploads/2025/03/Silicone_Wristband-300x130.png',        url:'/product/eco-friendly-bamboo/',  subcat:'eco'     },
        ]
      },

      'giftset': {
        name:  'Gift Set',
        icon:  'fas fa-gift',
        desc:  'Curated gift sets for corporate events, onboarding, wellness, travel, and occasions — fully branded for your company.',
        count: '12+',
        subcats: [
          { key: 'corporate',  label: 'Corporate' },
          { key: 'lifestyle',  label: 'Lifestyle' },
          { key: 'wellness',   label: 'Health & Wellness' },
        ],
        products: [
          { id:1, name:'Active Outdoors Gift Sets',       price:'Ask for Quote', img:'https://pinoyballers.com/wp-content/uploads/2021/12/pb-016-1-min-300x192.jpg',              url:'/product/gift-set-active-outdoors/',      subcat:'lifestyle'  },
          { id:2, name:'Desk Essentials Gift Sets',       price:'Ask for Quote', img:'https://pinoyballers.com/wp-content/uploads/2025/03/Silicone_Wristband-300x130.png',        url:'/product/gift-set-desk-essentials/',      subcat:'corporate'  },
          { id:3, name:'Employee Onboarding Sets',        price:'Ask for Quote', img:'https://pinoyballers.com/wp-content/uploads/2017/11/Custom-Baller-Bands-Xavier-Ateneo-High-School-2-300x182.jpeg', url:'/product/gift-set-employee-onboarding/', subcat:'corporate'  },
          { id:4, name:'Gadget Gift Sets',                price:'Ask for Quote', img:'https://pinoyballers.com/wp-content/uploads/2019/08/Soft-Enamel-Lapel-Pins-001-1-300x300.png', url:'/product/gift-set-gadget/',              subcat:'corporate'  },
          { id:5, name:'Health & Wellness Gift Sets',     price:'Ask for Quote', img:'https://pinoyballers.com/wp-content/uploads/2019/08/ID-Lace-Lanyards-AIFUL-FINANCE-PHILIPPINES-INC-300x142.png', url:'/product/gift-set-health-wellness/',      subcat:'wellness'   },
          { id:6, name:'Sustainable Gift Sets',           price:'Ask for Quote', img:'https://pinoyballers.com/wp-content/uploads/2025/09/Elections-Ballers-Gov-Jerry-Singson-ONE-ILOCOS-SUR-300x209.jpg', url:'/product/gift-set-sustainable/',         subcat:'lifestyle'  },
          { id:7, name:'Work From Home Gift Sets',        price:'Ask for Quote', img:'https://pinoyballers.com/wp-content/uploads/2019/10/Custom-Tote-Bags-0422-194x300.png',    url:'/product/gift-set-work-from-home/',       subcat:'corporate'  },
          { id:8, name:'Travel Executive Gift Sets',      price:'Ask for Quote', img:'https://pinoyballers.com/wp-content/uploads/2019/11/Fabric-Wristbands-International-School-Manila-Inc-1-298x300.jpeg', url:'/product/gift-set-travel-executive/',    subcat:'lifestyle'  },
        ]
      },

      'home-living': {
        name:  'Home Living',
        icon:  'fas fa-home',
        desc:  'Branded home & lifestyle items — from cleaning essentials and outdoor chairs to personal care and portable fans.',
        count: '14+',
        subcats: [
          { key: 'kitchen',   label: 'Kitchen & Dining' },
          { key: 'personal',  label: 'Personal Care' },
          { key: 'outdoor',   label: 'Outdoor & Lifestyle' },
        ],
        products: [
          { id:1, name:'Cleaning Essentials',     price:'Ask for Quote', img:'https://pinoyballers.com/wp-content/uploads/2021/12/pb-016-1-min-300x192.jpg',              url:'/product/home-living-cleaning-essentials/', subcat:'kitchen'  },
          { id:2, name:'Cutlery Sets',            price:'Ask for Quote', img:'https://pinoyballers.com/wp-content/uploads/2025/03/Silicone_Wristband-300x130.png',        url:'/product/home-living-cutlery-sets/',        subcat:'kitchen'  },
          { id:3, name:'Hand Towels',             price:'Ask for Quote', img:'https://pinoyballers.com/wp-content/uploads/2017/11/Custom-Baller-Bands-Xavier-Ateneo-High-School-2-300x182.jpeg', url:'/product/home-living-hand-towels/',        subcat:'personal' },
          { id:4, name:'Personal Care',           price:'Ask for Quote', img:'https://pinoyballers.com/wp-content/uploads/2019/08/Soft-Enamel-Lapel-Pins-001-1-300x300.png', url:'/product/home-living-personal-care/',      subcat:'personal' },
          { id:5, name:'Pillows',                 price:'Ask for Quote', img:'https://pinoyballers.com/wp-content/uploads/2019/08/ID-Lace-Lanyards-AIFUL-FINANCE-PHILIPPINES-INC-300x142.png', url:'/product/home-living-pillows/',            subcat:'personal' },
          { id:6, name:'Outdoor Chairs',          price:'Ask for Quote', img:'https://pinoyballers.com/wp-content/uploads/2025/09/Elections-Ballers-Gov-Jerry-Singson-ONE-ILOCOS-SUR-300x209.jpg', url:'/product/home-living-outdoor-chairs/',     subcat:'outdoor'  },
          { id:7, name:'Portable Fans',           price:'Ask for Quote', img:'https://pinoyballers.com/wp-content/uploads/2019/10/Custom-Tote-Bags-0422-194x300.png',    url:'/product/home-living-portable-fans/',      subcat:'outdoor'  },
          { id:8, name:'Lifestyle Gift Sets',     price:'Ask for Quote', img:'https://pinoyballers.com/wp-content/uploads/2019/11/Fabric-Wristbands-International-School-Manila-Inc-1-298x300.jpeg', url:'/product/home-living-lifestyle/',         subcat:'outdoor'  },
        ]
      },

      'pen-paper': {
        name:  'Pen & Paper',
        icon:  'fas fa-pen',
        desc:  'Custom pens, notebooks, journals, planners, and stationery sets — ideal for corporate giveaways and office use.',
        count: '16+',
        subcats: [
          { key: 'pen',   label: 'Pens' },
          { key: 'paper', label: 'Paper & Notebooks' },
        ],
        products: [
          { id:1, name:'Bamboo Pens',                  price:'As low as ₱35.00',  img:'https://pinoyballers.com/wp-content/uploads/2021/12/pb-016-1-min-300x192.jpg',              url:'/product/pen-bamboo/',              subcat:'pen'   },
          { id:2, name:'Metal Pens',                   price:'As low as ₱55.00',  img:'https://pinoyballers.com/wp-content/uploads/2025/03/Silicone_Wristband-300x130.png',        url:'/product/pen-metal/',               subcat:'pen'   },
          { id:3, name:'Multi-Functional Pens',        price:'As low as ₱75.00',  img:'https://pinoyballers.com/wp-content/uploads/2017/11/Custom-Baller-Bands-Xavier-Ateneo-High-School-2-300x182.jpeg', url:'/product/pen-multi-functional/',    subcat:'pen'   },
          { id:4, name:'Plastic Pens',                 price:'As low as ₱22.00',  img:'https://pinoyballers.com/wp-content/uploads/2019/08/Soft-Enamel-Lapel-Pins-001-1-300x300.png', url:'/product/pen-plastic/',             subcat:'pen'   },
          { id:5, name:'Pen Gift Sets',                price:'As low as ₱120.00', img:'https://pinoyballers.com/wp-content/uploads/2019/08/ID-Lace-Lanyards-AIFUL-FINANCE-PHILIPPINES-INC-300x142.png', url:'/product/pen-gift-set/',            subcat:'pen'   },
          { id:6, name:'Custom Notebooks & Journals',  price:'As low as ₱95.00',  img:'https://pinoyballers.com/wp-content/uploads/2025/09/Elections-Ballers-Gov-Jerry-Singson-ONE-ILOCOS-SUR-300x209.jpg', url:'/product/paper-notebooks-journals', subcat:'paper' },
          { id:7, name:'Custom Desk Calendars',        price:'As low as ₱120.00', img:'https://pinoyballers.com/wp-content/uploads/2019/10/Custom-Tote-Bags-0422-194x300.png',    url:'/product/paper-desk-calendars/',    subcat:'paper' },
          { id:8, name:'Stationery Sets',              price:'As low as ₱145.00', img:'https://pinoyballers.com/wp-content/uploads/2019/11/Fabric-Wristbands-International-School-Manila-Inc-1-298x300.jpeg', url:'/product/paper-stationery-sets/',   subcat:'paper' },
          { id:9, name:'Memo Solutions',               price:'As low as ₱55.00',  img:'https://pinoyballers.com/wp-content/uploads/2021/12/pb-016-1-min-300x192.jpg',              url:'/product/paper-memo-solutions/',    subcat:'paper' },
          { id:10,name:'Padfolios',                    price:'As low as ₱195.00', img:'https://pinoyballers.com/wp-content/uploads/2025/03/Silicone_Wristband-300x130.png',        url:'/product/paper-padfolios',          subcat:'paper' },
        ]
      },

      'pu-leather': {
        name:  'PU Leather',
        icon:  'fas fa-briefcase',
        desc:  'Elegant PU leather products for corporate gifting — wallets, card cases, organizers, keychains, and more.',
        count: '10+',
        subcats: [
          { key: 'wallets',    label: 'Wallets & Cases' },
          { key: 'organizers', label: 'Organizers & Bags' },
          { key: 'keychains',  label: 'Keychains & Tags' },
        ],
        products: [
          { id:1, name:'Wallets',                      price:'As low as ₱195.00', img:'https://pinoyballers.com/wp-content/uploads/2021/12/pb-016-1-min-300x192.jpg',              url:'/product/pu-leather-wallets/',          subcat:'wallets'    },
          { id:2, name:'Card Cases',                   price:'As low as ₱120.00', img:'https://pinoyballers.com/wp-content/uploads/2025/03/Silicone_Wristband-300x130.png',        url:'/product/pu-leather-card-cases/',       subcat:'wallets'    },
          { id:3, name:'Leather Pouches',              price:'As low as ₱145.00', img:'https://pinoyballers.com/wp-content/uploads/2017/11/Custom-Baller-Bands-Xavier-Ateneo-High-School-2-300x182.jpeg', url:'/product/pu-leather-pouches/',          subcat:'wallets'    },
          { id:4, name:'Desk Mats',                    price:'As low as ₱220.00', img:'https://pinoyballers.com/wp-content/uploads/2019/08/Soft-Enamel-Lapel-Pins-001-1-300x300.png', url:'/product/pu-leather-desk-mats/',        subcat:'organizers' },
          { id:5, name:'Organizers',                   price:'As low as ₱175.00', img:'https://pinoyballers.com/wp-content/uploads/2019/08/ID-Lace-Lanyards-AIFUL-FINANCE-PHILIPPINES-INC-300x142.png', url:'/product/pu-leather-organizers/',       subcat:'organizers' },
          { id:6, name:'Gift Sets',                    price:'Ask for Quote',     img:'https://pinoyballers.com/wp-content/uploads/2025/09/Elections-Ballers-Gov-Jerry-Singson-ONE-ILOCOS-SUR-300x209.jpg', url:'/product/pu-leather-gift-sets/',        subcat:'organizers' },
          { id:7, name:'Travel-Related Leather Gifts', price:'Ask for Quote',     img:'https://pinoyballers.com/wp-content/uploads/2019/10/Custom-Tote-Bags-0422-194x300.png',    url:'/product/pu-leather-travel-related/',   subcat:'organizers' },
          { id:8, name:'Keychains',                    price:'As low as ₱65.00',  img:'https://pinoyballers.com/wp-content/uploads/2019/11/Fabric-Wristbands-International-School-Manila-Inc-1-298x300.jpeg', url:'/product/pu-leather-keychains/',        subcat:'keychains'  },
          { id:9, name:'Luggage Tags',                 price:'As low as ₱95.00',  img:'https://pinoyballers.com/wp-content/uploads/2021/12/pb-016-1-min-300x192.jpg',              url:'/product/pu-leather-luggage-tags/',     subcat:'keychains'  },
        ]
      }

    };

    const CATEGORY_DATA = (window.CATEGORY_DATA && Object.keys(window.CATEGORY_DATA).length > 0)
      ? window.CATEGORY_DATA
      : STATIC_CATEGORY_DATA;

    /** Escape catalogue text before inserting it into innerHTML */
    function esc(str) {
      return String(str ?? "").replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;" }[ch]));
    }

    const IS_PHP = !window.location.pathname.endsWith('.html');

    /** The item page for a card: the database gives a ready URL; the static
        fallback catalogue gives /product/<slug>/, turned into the item page link */
    function itemUrl(product, catSlug) {
      const url = product.url || '';
      if (!url.startsWith('/product/')) return url;
      const itemSlug = url.replace(/^\/product\//, '').replace(/\/$/, '');
      const page = IS_PHP ? 'product/car-charger-adapters.php' : 'car-charger-adapters.html';
      return `${page}?cat=${encodeURIComponent(catSlug)}&subcat=${encodeURIComponent(product.subcat || '')}&item=${encodeURIComponent(itemSlug)}`;
    }

    /* ============================================================
       DETECT WHICH CATEGORY WE'RE ON
       Reads URL query param (?cat=drinkware) or path (/product-category/drinkware)
       ============================================================ */
    function getCategorySlug() {
      // 1. From database / PHP injected
      if (window.ACTIVE_CATEGORY && CATEGORY_DATA[window.ACTIVE_CATEGORY]) return window.ACTIVE_CATEGORY;

      // 2. Check query parameter (?cat=drinkware)
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get('cat');
      if (catParam && CATEGORY_DATA[catParam]) return catParam;

      // 3. Try /product-category/SLUG pattern in pathname
      const path = window.location.pathname;
      const m = path.match(/\/product-category\/([^/]+)/);
      if (m && CATEGORY_DATA[m[1]]) return m[1];

      // 4. Special case for PU leather URL
      if (path.includes('pu-leather')) return 'pu-leather';

      // 5. Fallback: show first category
      return Object.keys(CATEGORY_DATA)[0] || 'accessories-gadgets';
    }

    /* ============================================================
       RENDER HERO BANNER
       ============================================================ */
    function renderHero(cat) {
      document.title = cat.name + ' | CreativeKit3A';
      const titleEl = document.getElementById('hero-title');
      const breadcrumbEl = document.getElementById('hero-breadcrumb-current');
      const descEl = document.getElementById('hero-desc');
      const countEl = document.getElementById('hero-product-count');
      const iconEl = document.getElementById('hero-icon');

      if (titleEl) titleEl.textContent = cat.name;
      if (breadcrumbEl) breadcrumbEl.textContent = cat.name;
      if (descEl) descEl.textContent = cat.desc;
      if (countEl) countEl.textContent = cat.count;
      if (iconEl) iconEl.innerHTML = '<i class="' + cat.icon + '"></i>';
    }

    /* ============================================================
       RENDER SUBCATEGORY TABS
       ============================================================ */
    function renderTabs(cat, activeSubcat) {
      const container = document.getElementById('subcat-tabs-container');
      if (!container) return;
      container.innerHTML = '';

      // "All" tab
      const allBtn = document.createElement('button');
      allBtn.className   = 'subcat-tab' + (!activeSubcat ? ' active' : '');
      allBtn.dataset.key = '';
      allBtn.innerHTML   = 'All <span class="tab-count">' + cat.products.length + '</span>';
      allBtn.addEventListener('click', () => { renderPage(slugKey, ''); });
      container.appendChild(allBtn);

      // One tab per subcategory
      cat.subcats.forEach(sc => {
        const count = cat.products.filter(p => p.subcat === sc.key).length;
        const btn = document.createElement('button');
        btn.className   = 'subcat-tab' + (activeSubcat === sc.key ? ' active' : '');
        btn.dataset.key = sc.key;
        btn.innerHTML   = sc.label + ' <span class="tab-count">' + count + '</span>';
        btn.addEventListener('click', () => { renderPage(slugKey, sc.key); });
        container.appendChild(btn);
      });
    }

    /* ============================================================
       BUILD A PRODUCT CARD (matches the style in index.html)
       ============================================================ */
    function buildCard(product) {
      // product.url is built by category-page.php: it points to the item
      // (variants) page when the product has rows in product_variants,
      // and is empty otherwise (card then opens the quote modal).
      // A product with a page is a real link; one without opens the quote form for it.
      const price = String(product.price || '').replace(/^As low as /, 'From ');
      const url   = itemUrl(product, product.catSlug || slugKey);
      const inner = `
          <div class="ck-card__img product-card-img">
            <img src="${esc(product.img)}" alt="${esc(product.name)}" width="600" height="600" loading="lazy">
          </div>
          <h3 class="product-card-title">${esc(product.name)}</h3>
          <p class="product-card-price">${esc(price === 'Ask for Quote' ? 'Price on request' : price)}</p>`;
      return url
        ? `<a class="card ck-card product-card" href="${esc(url)}" data-product-id="${esc(product.id)}" data-url="${esc(url)}">${inner}</a>`
        : `<button type="button" class="card ck-card product-card" data-product-id="${esc(product.id)}" data-url="">${inner}</button>`;
    }

    /** Cards without a page open the quote modal for that product (linked cards navigate by themselves) */
    function bindCardClicks(grid) {
      grid.querySelectorAll('button.product-card').forEach(card => {
        card.addEventListener('click', () => {
          if (typeof window.openQuoteFor === 'function') window.openQuoteFor(card.dataset.productId);
        });
      });
    }

    /** One group: its heading and its own grid, so every row starts full from the left */
    function groupHtml(label, items) {
      return `<div class="ck-group">
          <h2 class="ck-group__head subcat-section-heading">${esc(label)}</h2>
          <div class="ck-grid">${items.map(buildCard).join('')}</div>
        </div>`;
    }

    /* ============================================================
       RENDER PRODUCT GRID
       ============================================================ */
    function renderGrid(cat, activeSubcat, sortVal) {
      const grid = document.getElementById('cat-product-grid');
      grid.innerHTML = '';

      let products = activeSubcat
        ? cat.products.filter(p => p.subcat === activeSubcat)
        : cat.products;

      // Sort
      if (sortVal === 'name-asc')   products = [...products].sort((a,b) => a.name.localeCompare(b.name));
      if (sortVal === 'name-desc')  products = [...products].sort((a,b) => b.name.localeCompare(a.name));

      // Update count label
      const subLabel = activeSubcat
        ? cat.subcats.find(s => s.key === activeSubcat)?.label || cat.name
        : cat.name;
      document.getElementById('showing-count').textContent  = products.length;
      document.getElementById('showing-subcat').textContent = subLabel;

      if (!products.length) {
        grid.innerHTML = '<div class="no-results"><i class="fas fa-box-open"></i><p>No products found in this category yet.</p></div>';
        return;
      }

      // If showing all, group by subcategory
      if (!activeSubcat) {
        cat.subcats.forEach(sc => {
          const group = products.filter(p => p.subcat === sc.key);
          if (group.length) grid.insertAdjacentHTML('beforeend', groupHtml(sc.label, group));
        });
      } else {
        grid.insertAdjacentHTML('beforeend', `<div class="ck-grid">${products.map(buildCard).join('')}</div>`);
      }

      bindCardClicks(grid);
    }

    /* ============================================================
       FULL PAGE RENDER  (hero + tabs + grid)
       ============================================================ */
    let currentSubcat = '';
    let currentSearchQuery = '';

    function renderPage(slug, subcatKey) {
      currentSearchQuery = '';
      const cat = CATEGORY_DATA[slug];
      if (!cat) return;
      currentSubcat = subcatKey;
      const sortVal = document.getElementById('sort-select')?.value || 'default';

      // Restore subcat tabs wrapper if previously hidden by search
      const tabsWrapper = document.getElementById('subcat-tabs-wrapper');
      if (tabsWrapper) tabsWrapper.style.display = '';

      renderHero(cat);
      renderTabs(cat, subcatKey);
      renderGrid(cat, subcatKey, sortVal);
    }

    /* ============================================================
       UNIVERSAL SEARCH ENGINE
       Searches across ALL products in all categories.
       Excludes any products that do NOT match the keyword query.
       ============================================================ */
    function searchCatalog(query) {
      const q = (query || '').trim().toLowerCase();
      currentSearchQuery = q;

      if (!q) {
        renderPage(slugKey, currentSubcat);
        return;
      }

      const queryWords = q.split(/\s+/).filter(Boolean);
      const matches = [];

      // Filter all categories
      Object.keys(CATEGORY_DATA).forEach(catSlug => {
        const cat = CATEGORY_DATA[catSlug];
        if (!cat || !Array.isArray(cat.products)) return;
        cat.products.forEach(p => {
          const pName   = p.name.toLowerCase();
          const pSubcat = (p.subcat || '').toLowerCase();
          const pCat    = cat.name.toLowerCase();

          // Product MUST match all query tokens
          const isMatch = queryWords.every(word =>
            pName.includes(word) || pSubcat.includes(word) || pCat.includes(word)
          );

          if (isMatch) {
            matches.push({
              ...p,
              catSlug: catSlug,
              catName: cat.name
            });
          }
        });
      });

      // Update Hero banner with search statistics
      const titleEl       = document.getElementById('hero-title');
      const breadcrumbEl  = document.getElementById('hero-breadcrumb-current');
      const descEl        = document.getElementById('hero-desc');
      const countEl       = document.getElementById('hero-product-count');
      const iconEl        = document.getElementById('hero-icon');
      const tabsWrapper   = document.getElementById('subcat-tabs-wrapper');

      if (titleEl)      titleEl.textContent      = `Search: "${query.trim()}"`;
      if (breadcrumbEl) breadcrumbEl.textContent = `Search: "${query.trim()}"`;
      if (descEl)       descEl.textContent       = `Found ${matches.length} product(s) matching your keyword.`;
      if (countEl)      countEl.textContent      = `${matches.length}`;
      if (iconEl)       iconEl.innerHTML          = '<i class="fas fa-search"></i>';
      if (tabsWrapper)  tabsWrapper.style.display = 'none';

      document.title = `Search: "${query.trim()}" | CreativeKit3A`;

      // Update sort bar indicators
      const showingCountEl  = document.getElementById('showing-count');
      const showingSubcatEl = document.getElementById('showing-subcat');
      if (showingCountEl)  showingCountEl.textContent  = matches.length;
      if (showingSubcatEl) showingSubcatEl.textContent = `matching "${query.trim()}"`;

      // Render results grid
      const grid = document.getElementById('cat-product-grid');
      if (!grid) return;
      grid.innerHTML = '';

      if (!matches.length) {
        grid.innerHTML = '<div class="no-results"><i class="fas fa-search"></i><p>No products match "<strong>' + esc(query.trim()) + '</strong>". Check the spelling or try another word.</p></div>';
        return;
      }

      // Apply sorting
      const sortVal = document.getElementById('sort-select')?.value || 'default';
      let sortedMatches = [...matches];
      if (sortVal === 'name-asc')  sortedMatches.sort((a,b) => a.name.localeCompare(b.name));
      if (sortVal === 'name-desc') sortedMatches.sort((a,b) => b.name.localeCompare(a.name));

      grid.insertAdjacentHTML('beforeend', `<div class="ck-grid">${sortedMatches.map(buildCard).join('')}</div>`);
      bindCardClicks(grid);
    }

    /* ============================================================
       INIT & EVENT LISTENERS
       ============================================================ */
    const slugKey = getCategorySlug();

    // Sort dropdown change listener
    document.getElementById('sort-select')?.addEventListener('change', function () {
      if (currentSearchQuery) {
        searchCatalog(currentSearchQuery);
      } else {
        renderGrid(CATEGORY_DATA[slugKey], currentSubcat, this.value);
      }
    });

    // Search input (live filter across whole catalog)
    const searchInput = document.getElementById('navbar-search-input') || document.getElementById('cat-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        const val = this.value;
        const url = new URL(window.location.href);
        if (val.trim()) {
          url.searchParams.set('s', val.trim());
        } else {
          url.searchParams.delete('s');
        }
        window.history.replaceState({}, '', url);
        searchCatalog(val);
      });
    }

    // Check URL parameters for ?s=... or ?q=... on initial page load
    const urlParams   = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('s') || urlParams.get('q');

    if (searchParam) {
      if (searchInput) searchInput.value = searchParam;
      searchCatalog(searchParam);
    } else {
      // ?subcat=<key> (the category menu's subcategory links) opens on that subcategory's tab
      const urlSub  = urlParams.get('subcat') || '';
      const initSub = (CATEGORY_DATA[slugKey]?.subcats || []).some(sc => sc.key === urlSub) ? urlSub : '';
      renderPage(slugKey, initSub);
    }

  })();
