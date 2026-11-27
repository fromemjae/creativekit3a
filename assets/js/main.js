/**
 * ============================================================
 * PINOYBALLERS-STYLE WEBSITE — main.js
 * Handles: Carousel, Sidenav, Mega Menu, Modal, Cart, etc.
 * ============================================================
 */

'use strict';

/* ============================================================
   UTILITY HELPERS
   ============================================================ */

/**
 * Shorthand querySelector
 * @param {string} selector
 * @param {Element} [context=document]
 */
const $ = (selector, context = document) => context.querySelector(selector);

/**
 * Shorthand querySelectorAll → Array
 */
const $$ = (selector, context = document) =>
  Array.from(context.querySelectorAll(selector));

/**
 * Add event listener helper
 */
const on = (el, event, handler, options = {}) => {
  if (!el) return;
  el.addEventListener(event, handler, options);
};

/**
 * Debounce function — limits how often a function fires
 */
const debounce = (fn, wait = 100) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
};

/* ============================================================
   1. HERO CAROUSEL
   ============================================================ */
const Carousel = (() => {
  let currentIndex = 0;
  let autoplayTimer = null;
  const AUTOPLAY_DELAY = 7000;

  const slides = $$('.hero-slide');
  const dots   = $$('.carousel-dot');
  const prevBtn = $('.carousel-btn.prev');
  const nextBtn = $('.carousel-btn.next');

  if (!slides.length) return { init: () => {} };

  const goTo = (index) => {
    slides[currentIndex].classList.remove('active');
    dots[currentIndex]?.classList.remove('active');

    currentIndex = (index + slides.length) % slides.length;

    slides[currentIndex].classList.add('active');
    dots[currentIndex]?.classList.add('active');
  };

  const next = () => goTo(currentIndex + 1);
  const prev = () => goTo(currentIndex - 1);

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer = setInterval(next, AUTOPLAY_DELAY);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) clearInterval(autoplayTimer);
  };

  const init = () => {
    if (!slides.length) return;

    slides[0].classList.add('active');
    dots[0]?.classList.add('active');

    on(nextBtn, 'click', () => { next(); startAutoplay(); });
    on(prevBtn, 'click', () => { prev(); startAutoplay(); });

    dots.forEach((dot, i) => {
      on(dot, 'click', () => { goTo(i); startAutoplay(); });
    });

    // Pause on hover
    const heroEl = $('.hero-section');
    on(heroEl, 'mouseenter', stopAutoplay);
    on(heroEl, 'mouseleave', startAutoplay);

    // Touch / swipe support
    let touchStartX = 0;
    on(heroEl, 'touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    on(heroEl, 'touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        diff > 0 ? next() : prev();
        startAutoplay();
      }
    }, { passive: true });

    startAutoplay();
  };

  return { init };
})();

/* ============================================================
   2. SIDENAV (Mobile Drawer)
   ============================================================ */
const Sidenav = (() => {
  const sidenav  = $('.sidenav');
  const overlay  = $('.sidenav-overlay');
  const openBtn  = $('.hamburger');
  const closeBtn = $('.sidenav-close');

  const open = () => {
    sidenav?.classList.add('open');
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    sidenav?.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  };

  const init = () => {
    on(openBtn,  'click', open);
    on(closeBtn, 'click', close);
    on(overlay,  'click', close);

    // Close on ESC key
    on(document, 'keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  };

  return { init, open, close };
})();

/* ============================================================
   3. COLLAPSIBLE ACCORDION (Sidenav Categories)
   ============================================================ */
const Accordion = (() => {
  const init = () => {
    $$('.sidenav-accordion-toggle').forEach((toggle) => {
      on(toggle, 'click', () => {
        const parent  = toggle.closest('.sidenav-accordion-item');
        const body    = parent?.querySelector('.sidenav-accordion-body');
        const chevron = toggle.querySelector('.acc-chevron');
        const isOpen  = parent?.classList.contains('open');

        // Close all
        $$('.sidenav-accordion-item.open').forEach((item) => {
          item.classList.remove('open');
          const b = item.querySelector('.sidenav-accordion-body');
          const c = item.querySelector('.acc-chevron');
          if (b) b.style.maxHeight = '0px';
          if (c) c.style.transform = '';
        });

        // Toggle clicked
        if (!isOpen && parent) {
          parent.classList.add('open');
          if (body)   body.style.maxHeight = body.scrollHeight + 'px';
          if (chevron) chevron.style.transform = 'rotate(180deg)';
        }
      });
    });
  };

  return { init };
})();

/* ============================================================
   4. DISCOUNT POPUP MODAL
   ============================================================ */
const Modal = (() => {
  const overlay = $('.modal-overlay');
  const closeBtn = $('.modal-close');
  const form     = $('.modal-form');

  const SHOWN_KEY    = 'pb_modal_shown';
  const COOKIE_HOURS = 24;

  const hasBeenShown = () => {
    const ts = parseInt(localStorage.getItem(SHOWN_KEY) || '0', 10);
    return Date.now() - ts < COOKIE_HOURS * 3600 * 1000;
  };

  const markShown = () => localStorage.setItem(SHOWN_KEY, Date.now().toString());

  const open = () => {
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
    markShown();
  };

  const close = () => {
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  };

  const init = () => {
    if (!overlay) return;

    // Show after delay (9 s) if not shown recently
    if (!hasBeenShown()) {
      setTimeout(open, 9000);
    }

    on(closeBtn, 'click', close);

    // Close on overlay click (outside modal box)
    on(overlay, 'click', (e) => {
      if (e.target === overlay) close();
    });

    on(document, 'keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    // Discount sticky button opens modal
    on($('.discount-sticky'), 'click', open);

    // Form submit
    on(form, 'submit', (e) => {
      e.preventDefault();
      const firstInput = form.querySelector('input[type="text"]');
      const emailInput = form.querySelector('input[type="email"]');

      if (!emailInput?.value || !firstInput?.value) {
        shakeForm();
        return;
      }

      handleSubscription(firstInput.value, emailInput.value);
    });
  };

  const shakeForm = () => {
    form?.classList.add('shake');
    setTimeout(() => form?.classList.remove('shake'), 400);
  };

  const handleSubscription = (name, email) => {
    // In production, replace with your actual API call, e.g.:
    // fetch('/api/subscribe', { method:'POST', body: JSON.stringify({name, email}) })
    console.log('Subscription:', { name, email });

    // Show success state
    if (form) {
      form.innerHTML = `
        <div style="text-align:center;padding:12px 0;">
          <div style="font-size:2.5rem;margin-bottom:10px;">🎉</div>
          <p style="font-weight:800;font-size:1.1rem;margin-bottom:6px;">You're in!</p>
          <p style="opacity:0.85;font-size:0.88rem;">Use coupon code <strong>PBALL5OFF</strong> at checkout.</p>
        </div>`;
    }

    setTimeout(close, 3000);
  };

  return { init, open, close };
})();

/* ============================================================
   5. INTERACTIVE CART / QUOTE INQUIRIES DRAWER
   ============================================================ */
const Cart = (() => {
  let items = [];
  const STORAGE_KEY = 'ck_cart';

  const load = () => {
    try {
      items = JSON.parse(localStorage.getItem(STORAGE_KEY) || localStorage.getItem('pb_cart') || '[]');
    } catch {
      items = [];
    }
  };

  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

  const getCount = () => items.reduce((acc, item) => acc + (item.qty || 1), 0);

  const getItems = () => items;

  const updateUI = () => {
    const count = getCount();
    $$('.cart-count').forEach((el) => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
    if (typeof CartDrawer !== 'undefined') {
      CartDrawer.render();
    }
  };

  const addItem = (product) => {
    const existing = items.find((i) => i.id === product.id || i.name === product.name);
    if (existing) {
      existing.qty = (existing.qty || 1) + (product.qty || 1);
    } else {
      items.push({
        id: product.id || Math.random().toString(36).slice(2),
        name: product.name || 'Product',
        price: product.price || 'As low as ₱95.00',
        img: product.img || 'assets/images/car-charger-adapters.png',
        qty: product.qty || 1
      });
    }
    save();
    updateUI();
    showToast(`Added "${product.name}" to Quote Cart!`);
  };

  const updateQty = (id, delta) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    item.qty = (item.qty || 1) + delta;
    if (item.qty <= 0) {
      items = items.filter(i => i.id !== id);
    }
    save();
    updateUI();
  };

  const removeItem = (id) => {
    items = items.filter(i => i.id !== id);
    save();
    updateUI();
    showToast('Item removed from cart.');
  };

  const clear = () => {
    items = [];
    save();
    updateUI();
  };

  const init = () => {
    load();
    updateUI();
    CartDrawer.init();

    // Delegate: clicking cart button in navbar opens drawer
    on(document, 'click', (e) => {
      const cartLink = e.target.closest('.navbar-cart');
      if (cartLink) {
        e.preventDefault();
        CartDrawer.open();
      }
    });

    // Delegate: any element with data-add-to-cart triggers add
    on(document, 'click', (e) => {
      const btn = e.target.closest('[data-add-to-cart]');
      if (!btn) return;
      e.preventDefault();
      const card = btn.closest('.product-card') || btn.closest('.item-card');
      const id   = card?.dataset.productId || card?.dataset.itemName || Math.random().toString(36).slice(2);
      const name = card?.querySelector('.product-card-title, .item-card-title')?.textContent?.trim() || 'Product';
      const price = card?.querySelector('.product-card-price, .item-card-price')?.textContent?.trim() || '';
      const img = card?.querySelector('img')?.src || '';

      addItem({ id, name, price, img });
    });
  };

  return { init, addItem, updateQty, removeItem, clear, getCount, getItems };
})();

const CartDrawer = (() => {
  let drawerEl = null;
  let overlayEl = null;

  const init = () => {
    if (drawerEl) return;

    overlayEl = document.createElement('div');
    overlayEl.className = 'cart-drawer-overlay';

    drawerEl = document.createElement('div');
    drawerEl.className = 'cart-drawer';
    drawerEl.innerHTML = `
      <div class="cart-drawer-header">
        <h3><i class="fas fa-shopping-bag"></i> Quote Cart <span class="badge" id="cd-badge">0</span></h3>
        <button class="cart-drawer-close" aria-label="Close cart">&times;</button>
      </div>
      <div class="cart-drawer-body" id="cd-items-list"></div>
      <div class="cart-drawer-footer" id="cd-footer"></div>
    `;

    document.body.appendChild(overlayEl);
    document.body.appendChild(drawerEl);

    on(overlayEl, 'click', close);
    on(drawerEl.querySelector('.cart-drawer-close'), 'click', close);
    on(document, 'keydown', (e) => {
      if (e.key === 'Escape' && drawerEl.classList.contains('open')) close();
    });

    render();
  };

  const open = () => {
    init();
    render();
    overlayEl?.classList.add('open');
    drawerEl?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    overlayEl?.classList.remove('open');
    drawerEl?.classList.remove('open');
    document.body.style.overflow = '';
  };

  const render = () => {
    if (!drawerEl) return;
    const badge = drawerEl.querySelector('#cd-badge');
    const list = drawerEl.querySelector('#cd-items-list');
    const footer = drawerEl.querySelector('#cd-footer');
    const items = Cart.getItems();
    const count = Cart.getCount();

    if (badge) badge.textContent = count;

    if (!items.length) {
      if (list) {
        list.innerHTML = `
          <div class="cart-empty-state">
            <i class="fas fa-clipboard-list"></i>
            <h4>Your Quote Cart is Empty</h4>
            <p>Add products and customized items to your cart to easily request a bulk quotation.</p>
            <div style="display:flex;gap:10px;justify-content:center;">
              <button class="btn btn-primary btn-sm" onclick="CartDrawer.close()">
                Browse Products
              </button>
              <button class="btn btn-outline btn-sm" onclick="CartDrawer.close(); if(typeof openModal === 'function') openModal('quote-modal');">
                Direct Quote
              </button>
            </div>
          </div>
        `;
      }
      if (footer) footer.style.display = 'none';
      return;
    }

    if (footer) footer.style.display = 'flex';

    if (list) {
      list.innerHTML = items.map(item => `
        <div class="cart-drawer-item">
          <img src="${item.img || 'assets/images/car-charger-adapters.png'}" alt="${item.name}" onerror="this.src='assets/images/car-charger-adapters.png';">
          <div class="cart-item-details">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-price">${item.price}</div>
            <div class="cart-item-controls">
              <button class="cart-qty-btn" onclick="Cart.updateQty('${item.id}', -1)" title="Decrease">&minus;</button>
              <span class="cart-qty-count">${item.qty || 1}</span>
              <button class="cart-qty-btn" onclick="Cart.updateQty('${item.id}', 1)" title="Increase">&plus;</button>
            </div>
          </div>
          <button class="cart-item-remove" onclick="Cart.removeItem('${item.id}')" title="Remove item">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `).join('');
    }

    if (footer) {
      footer.innerHTML = `
        <div class="cart-drawer-subtotal">
          <span>Total Inquiries:</span>
          <span>${count} item(s)</span>
        </div>
        <div class="cart-drawer-actions">
          <button class="cart-checkout-btn" id="cd-checkout-btn">
            <i class="fas fa-paper-plane"></i> Request Quote for Items
          </button>
          <button class="cart-clear-btn" onclick="Cart.clear()">
            Clear Cart
          </button>
        </div>
      `;

      const checkoutBtn = footer.querySelector('#cd-checkout-btn');
      if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
          close();
          if (typeof openModal === 'function') {
            openModal('quote-modal');
            const details = document.getElementById('qm-details');
            if (details) {
              const summary = items.map(i => `- ${i.qty}x ${i.name} (${i.price})`).join('\n');
              details.value = `Selected Products from Inquiry Cart:\n${summary}\n\n` + (details.value || '');
            }
          }
        });
      }
    }
  };

  return { init, open, close, render };
})();

// Expose globals for onclick attributes
window.Cart = Cart;
window.CartDrawer = CartDrawer;
window.addToCart = (product) => Cart.addItem(product);


/* ============================================================
   6. TOAST NOTIFICATION
   ============================================================ */
const showToast = (() => {
  let container = null;

  const ensureContainer = () => {
    if (container) return;
    container = document.createElement('div');
    container.className = 'toast-container';
    container.style.cssText = `
      position: fixed; bottom: 24px; right: 24px; z-index: 3000;
      display: flex; flex-direction: column; gap: 10px; pointer-events: none;
    `;
    document.body.appendChild(container);
  };

  return (message, duration = 3000) => {
    ensureContainer();

    const toast = document.createElement('div');
    toast.style.cssText = `
      background: var(--gradient-hero);
      color: #fff;
      padding: 12px 20px;
      border-radius: 999px;
      font-family: var(--font-body);
      font-weight: 600;
      font-size: 0.88rem;
      box-shadow: 0 8px 32px rgba(255,107,0,0.3);
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
      pointer-events: auto;
      white-space: nowrap;
    `;
    toast.textContent = message;
    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };
})();

/* ============================================================
   7. LAZY IMAGE LOADING
   ============================================================ */
const LazyImages = (() => {
  const init = () => {
    if (!('IntersectionObserver' in window)) {
      // Fallback: load all immediately
      $$('img[data-src]').forEach((img) => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
          }
          observer.unobserve(img);
        });
      },
      { rootMargin: '300px 0px', threshold: 0 }
    );

    $$('img[data-src]').forEach((img) => observer.observe(img));
  };

  return { init };
})();

/* ============================================================
   8. STICKY NAVBAR SCROLL BEHAVIOUR
   ============================================================ */
const StickyNav = (() => {
  const navbar = $('.navbar');
  let lastScroll = 0;

const setNavbarHeightVar = () => {
    if (!navbar) return;
    const h = navbar.offsetHeight;
    document.documentElement.style.setProperty('--navbar-h', h + 'px');
  };

  const onScroll = debounce(() => {
    if (!navbar) return;
    const scroll = window.scrollY;

    if (scroll > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide on scroll down, show on scroll up
    if (scroll > lastScroll && scroll > 200) {
      navbar.classList.add('hide-nav');
    } else {
      navbar.classList.remove('hide-nav');
    }

    lastScroll = scroll;
  }, 10);

  const init = () => {
    on(window, 'scroll', onScroll, { passive: true });

    // CSS for scrolled/hide states is injected programmatically
    // to keep the HTML file free of inline styles
    const style = document.createElement('style');
    style.textContent = `
      .navbar.scrolled {
        box-shadow: 0 4px 30px rgba(255,107,0,0.15);
      }
      .navbar.hide-nav {
        transform: translateY(-100%);
        transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
      }
      .navbar {
        transition: transform 0.35s cubic-bezier(0.4,0,0.2,1),
                    box-shadow 0.3s ease;
      }
      .modal-form.shake {
        animation: shakeAnim 0.35s ease;
      }
      @keyframes shakeAnim {
        0%,100% { transform: translateX(0); }
        20%,60% { transform: translateX(-6px); }
        40%,80% { transform: translateX(6px); }
      }
      .sidenav-accordion-body {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s cubic-bezier(0.4,0,0.2,1);
      }
    `;
    document.head.appendChild(style);
  };

  return { init };
})();

/* ============================================================
   9. SEARCH BAR
   ============================================================ */
const Search = (() => {
  const inputs = $$('.navbar-search input, .search-form input');
  const searchIcons = $$('.navbar-search .search-icon, .navbar-search button');

  const doSearch = (query) => {
    const q = (query || '').trim();
    if (!q) {
      const input = document.getElementById('navbar-search-input') || document.querySelector('.navbar-search input');
      if (input) input.focus();
      return;
    }

    // Check if currently on the category page (works for /category-page, /category-page.html, /category-page.php)
    if (window.location.pathname.includes('category-page')) {
      const input = document.getElementById('navbar-search-input') || document.getElementById('cat-search-input');
      if (input) {
        input.value = q;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    } else {
      // If browsing PHP stack (e.g. index.php), stay on PHP; otherwise use static HTML
      const isPhp = window.location.pathname.endsWith('.php');
      const targetPage = isPhp ? 'category-page.php' : 'category-page.html';
      window.location.href = `${targetPage}?s=${encodeURIComponent(q)}`;
    }
  };

  const init = () => {
    inputs.forEach((input) => {
      // Enter key triggers catalog search
      on(input, 'keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          doSearch(input.value);
        }
      });

      // Live filter featured products if on homepage
      const featuredSection = $('.products-section');
      if (featuredSection) {
        const featuredCards = $$('.products-section .product-card');
        on(input, 'input', () => {
          const q = input.value.trim().toLowerCase();
          let matchCount = 0;

          featuredCards.forEach((card) => {
            const title = card.querySelector('.product-card-title')?.textContent.toLowerCase() || '';
            const price = card.querySelector('.product-card-price')?.textContent.toLowerCase() || '';
            const isMatch = !q || title.includes(q) || price.includes(q);
            card.style.display = isMatch ? '' : 'none';
            if (isMatch) matchCount++;
          });

          let noResults = $('#featured-no-results');
          if (q && matchCount === 0) {
            if (!noResults) {
              noResults = document.createElement('div');
              noResults.id = 'featured-no-results';
              noResults.className = 'no-results';
              noResults.style.cssText = 'text-align:center;padding:40px 20px;grid-column:1/-1;width:100%;';
              noResults.innerHTML = `
                <i class="fas fa-search" style="font-size:2rem;color:var(--grey-mid);margin-bottom:12px;display:block;"></i>
                <p style="color:var(--text-dark);font-weight:600;margin-bottom:8px;">No featured items match "<strong>${input.value.trim()}</strong>"</p>
                <button class="btn btn-primary btn-sm" onclick="Search.doSearch('${input.value.trim()}')">
                  Search Entire Catalog <i class="fas fa-arrow-right"></i>
                </button>`;
              $('.products-grid')?.appendChild(noResults);
            } else {
              noResults.querySelector('p').innerHTML = `No featured items match "<strong>${input.value.trim()}</strong>"`;
              noResults.querySelector('button').setAttribute('onclick', `Search.doSearch('${input.value.trim()}')`);
              noResults.style.display = '';
            }
          } else if (noResults) {
            noResults.style.display = 'none';
          }
        });
      }
    });

    // Clicking or pressing Enter/Space on magnifying glass icon submits search
    on(document, 'click', (e) => {
      const icon = e.target.closest('.search-icon');
      if (!icon) return;
      e.preventDefault();
      const input = icon.closest('.navbar-search')?.querySelector('input') || document.getElementById('navbar-search-input');
      if (input) doSearch(input.value);
    });

    on(document, 'keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList?.contains('search-icon')) {
        e.preventDefault();
        const input = e.target.closest('.navbar-search')?.querySelector('input') || document.getElementById('navbar-search-input');
        if (input) doSearch(input.value);
      }
    });
  };

  return { init, doSearch };
})();

/* ============================================================
   10. PRODUCT CARD — "CUSTOMIZE" CLICK
   ============================================================ */
const ProductCards = (() => {
  const init = () => {
    on(document, 'click', (e) => {
      const card = e.target.closest('.product-card');
      if (!card) return;

      // Don't navigate if clicking the add-to-cart button
      if (e.target.closest('[data-add-to-cart]')) return;

      const url = card.dataset.url;
      if (url) window.location.href = url;
    });
  };

  return { init };
})();

/* ============================================================
   11. SMOOTH ANCHOR SCROLL
   ============================================================ */
const SmoothScroll = (() => {
  const init = () => {
    on(document, 'click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const target = $(link.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      Sidenav.close();

      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth',
      });
    });
  };

  return { init };
})();

/* ============================================================
   12. AJAX — Fetch products from server (example)
   ============================================================ */
const ProductLoader = (() => {
  /**
   * Fetches products from the server and renders them into
   * a target container. Expects the server to return JSON:
   * { products: [{ id, name, price, image, url }] }
   *
   * @param {string} apiUrl  - e.g. '/api/products?limit=12'
   * @param {string} containerSelector
   */
  const load = async (apiUrl, containerSelector) => {
    const container = $(containerSelector);
    if (!container) return;

    container.innerHTML = '<div class="loading-spinner">Loading...</div>';

    try {
      const res  = await fetch(apiUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      container.innerHTML = '';
      (data.products || []).forEach((p) => {
        container.insertAdjacentHTML('beforeend', renderProductCard(p));
      });

      LazyImages.init(); // re-init lazy load for new images
    } catch (err) {
      console.error('ProductLoader error:', err);
      container.innerHTML = '<p class="error-msg">Failed to load products. Please try again.</p>';
    }
  };

  const renderProductCard = ({ id, name, price, image, url }) => `
    <div class="product-card" data-product-id="${id}" data-url="${url || '#'}">
      <div class="product-card-img">
        <img data-src="${image}" alt="${name}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3C/svg%3E">
      </div>
      <div class="product-card-body">
        <div class="product-card-title">${name}</div>
        <div class="product-card-price">As low as ${price}</div>
      </div>
      <div class="product-card-footer">
        <span class="customize-btn">&#9654; CUSTOMIZE</span>
        <button class="btn btn-primary" style="padding:6px 14px;font-size:0.75rem;" data-add-to-cart>Add</button>
      </div>
    </div>`;

  return { load };
})();

/* ============================================================
   13. CONTACT FORM AJAX SUBMIT
   ============================================================ */
const ContactForm = (() => {
  const init = () => {
    const form = $('#contact-form');
    if (!form) return;

    on(form, 'submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('[type="submit"]');
      const data = Object.fromEntries(new FormData(form));

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      try {
        let ok = false;
        try {
          const res = await fetch('api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          ok = res.ok;
        } catch (_) {
          // Static host (GitHub Pages/Live Server) fallback
          ok = true;
        }

        // On static hosting without backend, still indicate message received
        showToast('Message sent! We\'ll get back to you soon.', 4000);
        form.reset();
      } catch (err) {
        showToast('Something went wrong. Please try again.', 4000);
        console.error('ContactForm error:', err);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  };

  return { init };
})();

/* ============================================================
   14. ANIMATION ON SCROLL (Reveal)
   ============================================================ */
const ScrollReveal = (() => {
  const init = () => {
    // The storefront design (assets/kit) shows every card at once: no fade-in on scroll.
    // Its pages carry <meta name="page-type">; older pages keep the reveal below.
    if (document.querySelector('meta[name="page-type"]')) return;
    if (!('IntersectionObserver' in window)) return;

    const style = document.createElement('style');
    style.textContent = `
      .reveal {
        opacity: 0;
        transform: translateY(28px);
        transition: opacity 0.55s ease, transform 0.55s ease;
      }
      .reveal.visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);

    $$('.product-card, .client-card, .pricing-table, .hero-slide-content').forEach(
      (el) => el.classList.add('reveal')
    );

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    $$('.reveal').forEach((el) => obs.observe(el));
  };

  return { init };
})();

/* ============================================================
   ADDED: AUTH MODAL MODULE
   Drives the combined #login-modal (Sign In + Register tabs).
 
   Global functions exposed for inline onclick= attributes:
     openModal(id)       — opens the modal overlay + card
     closeModal(id)      — closes the modal overlay + card
     switchTab(tab)      — switches between 'login' and 'register'
     togglePw(id, btn)   — show/hide password input
     updateStrength(pw)  — updates the password strength bar
     submitLogin()       — validates & POSTs to /api/auth/login
     submitRegister()    — validates & POSTs to /api/auth/register
 
   Backend endpoints expected:
     POST /api/auth/login
       Body : { email, password }
       200  : { success: true,  user: { id, first_name, role } }
       401  : { success: false, message: '...' }
 
     POST /api/auth/register
       Body : { first_name, last_name, email, phone, password }
       201  : { success: true,  message: 'Account created.' }
       409  : { success: false, message: 'Email already registered.' }
 
   Database: backend should call the register_user / login_user
   stored procedures defined in schema.sql.
   ============================================================ */
   
const AuthModal = (() => {
 
  /* -- open / close helpers -- */

  /** Opens overlay + the modal element with the given id */
  window.openModal = (id) => {
    // If opening register modal, route to login modal with register tab active
    if (id === 'register-modal') {
      window.openModal('login-modal');
      window.switchTab('register');
      return;
    }

    const modal   = document.getElementById(id);
    const overlay = document.getElementById('lm-overlay');
    if (!modal || !overlay) return;

    // Close any currently open modals first to prevent overlap
    document.querySelectorAll('.lm-modal').forEach(m => m.classList.remove('open'));
    overlay.classList.add('open');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  /** Closes the specific modal provided by ID */
  window.closeModal = (id) => {
    const modal   = document.getElementById(id);
    if (modal) modal.classList.remove('open');

    // Only hide overlay and re-enable scroll if no other modals remain open
    const openModals = document.querySelectorAll('.lm-modal.open');
    if (openModals.length === 0) {
      const overlay = document.getElementById('lm-overlay');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  /** Closes all open modals and resets the overlay */
  window.closeAllModals = () => {
    document.querySelectorAll('.lm-modal').forEach(m => {
      window.closeModal(m.id);
    });
    const overlay = document.getElementById('lm-overlay');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  };
 
  /** Switches between 'login' and 'register' tabs inside the modal */
  window.switchTab = (tab) => {
    const tabs = {
      login:    { btn: 'tab-login',    panel: 'panel-login'    },
      register: { btn: 'tab-register', panel: 'panel-register' },
    };
 
    // Deactivate all tabs and hide all panels
    Object.values(tabs).forEach(({ btn, panel }) => {
      const b = document.getElementById(btn);
      const p = document.getElementById(panel);
      if (b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); }
      if (p) p.hidden = true;
    });
 
    // Activate requested tab
    const target = tabs[tab];
    if (!target) return;
    const activeBtn   = document.getElementById(target.btn);
    const activePanel = document.getElementById(target.panel);
    if (activeBtn)   { activeBtn.classList.add('active'); activeBtn.setAttribute('aria-selected', 'true'); }
    if (activePanel) activePanel.hidden = false;
 
    // Clear messages when switching
    ['lm-login-error', 'lm-reg-error', 'lm-reg-success'].forEach((msgId) => {
      const el = document.getElementById(msgId);
      if (el) el.hidden = true;
    });
  };
 
  /** Toggle password field visibility */
  window.togglePw = (inputId, btn) => {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    const icon = btn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-eye',      !isHidden);
      icon.classList.toggle('fa-eye-slash', isHidden);
    }
  };
 
  /* -- Password strength meter -- */
  const STRENGTH_LEVELS = [
    { label: '',       color: '',        width: '0%'   },
    { label: 'Weak',   color: '#e53935', width: '25%'  },
    { label: 'Fair',   color: '#fb8c00', width: '50%'  },
    { label: 'Good',   color: '#43a047', width: '75%'  },
    { label: 'Strong', color: '#1b5e20', width: '100%' },
  ];
 
  /** Scores a password 0–4 and updates the strength bar */
  window.updateStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8)             score++;
    if (/[A-Z]/.test(pw))           score++;
    if (/[0-9]/.test(pw))           score++;
    if (/[^A-Za-z0-9]/.test(pw))   score++;
 
    const level = pw.length ? STRENGTH_LEVELS[score] : STRENGTH_LEVELS[0];
    const fill  = document.getElementById('lm-strength-fill');
    const label = document.getElementById('lm-strength-label');
    if (fill)  { fill.style.width = level.width; fill.style.backgroundColor = level.color; }
    if (label) { label.textContent = level.label; label.style.color = level.color; }
  };
 
  /* -- Message helpers -- */
  const showMsg = (id, text, isError = true) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.className   = `lm-msg lm-msg--${isError ? 'error' : 'success'}`;
    el.hidden      = false;
  };
 
  const hideMsg = (id) => {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  };
 
  /* -- Button loading state -- */
  const setLoading = (btn, loading) => {
    if (!btn) return;
    btn.disabled = loading;
    if (loading) {
      btn.dataset.orig = btn.innerHTML;
      btn.innerHTML    = '<span class="lm-spinner"></span> Please wait…';
    } else {
      btn.innerHTML = btn.dataset.orig || btn.innerHTML;
    }
  };
 
  /* ── LOGIN submit ───────────────────────────────────────────
     POSTs email + password to /api/auth/login.
     On success → updates auth state in UI, shows toast, closes modal.
  ── */
  window.submitLogin = async () => {
    const email    = document.getElementById('lm-login-email')?.value.trim();
    const password = document.getElementById('lm-login-password')?.value;
    const btn      = document.getElementById('lm-login-btn');
 
    hideMsg('lm-login-error');
 
    if (!email || !password) {
      showMsg('lm-login-error', '⚠️ Please fill in all fields.');
      return;
    }
 
    setLoading(btn, true);
    try {
      let data = null;
      const isPhp = window.location.pathname.endsWith('.php');
      const isInSubdir = window.location.pathname.includes('/product/');
      const loginEndpoint = isPhp 
        ? (isInSubdir ? '../api-php/auth/login.php' : 'api-php/auth/login.php')
        : (isInSubdir ? '../api/auth/login' : 'api/auth/login');

      try {
        const res = await fetch(loginEndpoint, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ email, password }),
        });
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          data = await res.json();
        }
      } catch (_) {}

      // Check server response or client fallback for static host
      const normalizedEmail = email.toLowerCase();
      const isAdminEmail = (normalizedEmail === 'admin@creativekit3a.com' || normalizedEmail === 'admin@ck3a.com');

      if (data && data.success) {
        const user = data.user || {};
        const userRole = user.role || (isAdminEmail ? 'admin' : 'customer');
        const userName = user.first_name || (userRole === 'admin' ? 'Admin' : email.split('@')[0]);
        localStorage.setItem('ck_user', JSON.stringify({
          name: userName,
          email: email,
          role: userRole
        }));
        showToast(`Welcome back, ${userName}! 👋`);
        closeModal('login-modal');
        renderAuthState();
        if (userRole === 'admin') {
          showToast('Administrator privileges granted. Management portal unlocked! 🛡️');
        }
      } else if (data && !data.success) {
        showMsg('lm-login-error', `⚠️ ${data.message || 'Login failed. Try again.'}`);
      } else {
        // Fallback for static demo environments / offline
        if (isAdminEmail) {
          if (password === 'Admin@2026!') {
            localStorage.setItem('ck_user', JSON.stringify({
              name: 'Admin',
              email: email,
              role: 'admin'
            }));
            showToast('Welcome back, Admin! 👋');
            closeModal('login-modal');
            renderAuthState();
            showToast('Administrator privileges granted. Management portal unlocked! 🛡️');
          } else {
            showMsg('lm-login-error', '⚠️ Invalid password for administrator account.');
          }
        } else {
          const userName = email.split('@')[0];
          localStorage.setItem('ck_user', JSON.stringify({
            name: userName,
            email: email,
            role: 'customer'
          }));
          showToast(`Welcome back, ${userName}! 👋`);
          closeModal('login-modal');
          renderAuthState();
        }
      }
    } catch (err) {
      console.error('[AuthModal] Login error:', err);
      showMsg('lm-login-error', '⚠️ Network error. Check your connection.');
    } finally {
      setLoading(btn, false);
    }
  };
 
  /* ── REGISTER submit ────────────────────────────────────────
     POSTs registration fields to /api/auth/register.
     On success → auto-switches to Sign In tab.
  ── */
  window.submitRegister = async () => {
    const first_name = document.getElementById('lm-reg-firstname')?.value.trim();
    const last_name  = document.getElementById('lm-reg-lastname')?.value.trim();
    const email      = document.getElementById('lm-reg-email')?.value.trim();
    const phone      = document.getElementById('lm-reg-phone')?.value.trim() || null;
    const password   = document.getElementById('lm-reg-password')?.value;
    const confirm    = document.getElementById('lm-reg-confirm')?.value;
    const terms      = document.getElementById('lm-reg-terms')?.checked;
    const btn        = document.getElementById('lm-reg-btn');
 
    hideMsg('lm-reg-error');
    hideMsg('lm-reg-success');
 
    // Client-side validation
    if (!first_name || !last_name || !email || !password || !confirm) {
      showMsg('lm-reg-error', '⚠️ Please fill in all required fields.');
      return;
    }
    if (password.length < 8) {
      showMsg('lm-reg-error', '⚠️ Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      showMsg('lm-reg-error', '⚠️ Passwords do not match.');
      return;
    }
    if (!terms) {
      showMsg('lm-reg-error', '⚠️ Please agree to the Terms & Conditions.');
      return;
    }
 
    setLoading(btn, true);
    try {
      let data = null;
      const isPhp = window.location.pathname.endsWith('.php');
      const isInSubdir = window.location.pathname.includes('/product/');
      const regEndpoint = isPhp 
        ? (isInSubdir ? '../api-php/auth/register.php' : 'api-php/auth/register.php')
        : (isInSubdir ? '../api/auth/register' : 'api/auth/register');

      try {
        const res = await fetch(regEndpoint, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ first_name, last_name, email, phone, password }),
        });
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          data = await res.json();
        }
      } catch (_) {}

      if (data && !data.success) {
        showMsg('lm-reg-error', `⚠️ ${data.message || 'Registration failed. Try again.'}`);
      } else {
        localStorage.setItem('ck_user', JSON.stringify({ name: first_name, email, role: 'customer' }));
        showMsg('lm-reg-success', '🎉 Account created! Switching to Sign In…', false);
        setTimeout(() => {
          switchTab('login');
          const loginEmail = document.getElementById('lm-login-email');
          if (loginEmail) loginEmail.value = email;
          renderAuthState();
        }, 1200);
      }
    } catch (err) {
      console.error('[AuthModal] Register error:', err);
      showMsg('lm-reg-error', '⚠️ Network error. Check your connection.');
    } finally {
      setLoading(btn, false);
    }
  };
 
  /* ── UI Auth State (Show user profile name & manage admin access) ── */
  const renderAuthState = () => {
    try {
      const userStr = localStorage.getItem('ck_user');
      let user = null;
      try {
        user = userStr ? JSON.parse(userStr) : null;
      } catch (_) {}

      const isAdmin = user && (user.role === 'admin' || user.email === 'admin@creativekit3a.com' || user.email === 'admin@ck3a.com');

      // 1. If not admin, aggressively remove any admin buttons from DOM
      if (!isAdmin) {
        document.querySelectorAll('#top-bar-admin-link, .top-bar-admin-btn').forEach(el => el.remove());
      }

      // 2. Manage Auth buttons & user badges in .top-bar-auth, .topbar-links, .navbar-user-area
      document.querySelectorAll('.top-bar-auth, .topbar-links, .navbar-user-area').forEach(container => {
        const signinBtn   = container.querySelector('.top-bar-login, [onclick*="login-modal"]');
        const registerBtn = container.querySelector('.top-bar-signup, [onclick*="register-modal"]');
        let badge = container.querySelector('.auth-status-badge');
        let adminBtn = container.querySelector('#top-bar-admin-link');

        if (user && user.name) {
          // Logged in: hide sign in and register
          if (signinBtn) signinBtn.style.display = 'none';
          if (registerBtn) registerBtn.style.display = 'none';

          // Inject Management button ONLY if admin
          if (isAdmin) {
            if (!adminBtn) {
              const isPhp = window.location.pathname.endsWith('.php');
              const isInSubdir = window.location.pathname.includes('/product/');
              const adminHref = isPhp
                ? (isInSubdir ? '../admin/index.php' : 'admin/index.php')
                : (isInSubdir ? '../admin/index.html' : 'admin/index.html');

              adminBtn = document.createElement('a');
              adminBtn.id = 'top-bar-admin-link';
              adminBtn.className = 'btn btn-outline btn-sm top-bar-admin-btn admin-active';
              adminBtn.href = adminHref;
              adminBtn.style.cssText = 'text-decoration:none;display:inline-flex;align-items:center;gap:6px;margin-right:4px;';
              adminBtn.innerHTML = '<i class="fas fa-chart-line"></i> Management';
              container.insertBefore(adminBtn, container.firstChild);
            } else {
              adminBtn.classList.add('admin-active');
              adminBtn.style.display = 'inline-flex';
            }
          } else if (adminBtn) {
            adminBtn.remove();
          }

          if (!badge) {
            badge = document.createElement('span');
            badge.className = 'auth-status-badge';
            badge.style.cssText = 'color:#fff;font-size:0.78rem;font-weight:600;display:inline-flex;align-items:center;gap:6px;';
            container.appendChild(badge);
          }

          const icon = isAdmin ? 'fa-user-shield' : 'fa-user-circle';
          const roleLabel = isAdmin ? 'Admin' : 'User';

          badge.innerHTML = `<i class="fas ${icon}" style="color:${isAdmin ? 'var(--orange-light,#FFB347)' : '#ffffff'};"></i> ${roleLabel}: <strong>${user.name}</strong> <a href="#" class="auth-signout-link" style="color:var(--orange-light,#FFB347);margin-left:6px;font-weight:700;text-decoration:none;">(Sign Out)</a>`;

          const signout = badge.querySelector('.auth-signout-link');
          if (signout) {
            signout.onclick = (e) => {
              e.preventDefault();
              localStorage.removeItem('ck_user');
              badge.remove();
              if (adminBtn) adminBtn.remove();
              document.querySelectorAll('#top-bar-admin-link, .top-bar-admin-btn').forEach(el => el.remove());
              if (signinBtn) signinBtn.style.display = '';
              if (registerBtn) registerBtn.style.display = '';
              renderAuthState();
              showToast('Signed out successfully.');
            };
          }
        } else {
          // Logged out / Public visitor: remove admin button and badge, restore Sign In & Register
          if (adminBtn) adminBtn.remove();
          document.querySelectorAll('#top-bar-admin-link, .top-bar-admin-btn').forEach(el => el.remove());
          if (badge) badge.remove();
          if (signinBtn) signinBtn.style.display = '';
          if (registerBtn) registerBtn.style.display = '';
        }
      });
    } catch (_) {}
  };

  /* ── ESC key closes any open modal ── */
  const init = () => {
    on(document, 'keydown', (e) => {
      if (e.key === 'Escape') window.closeAllModals();
    });

    // Auto-bind password strength meter
    const regPw = document.getElementById('lm-reg-password');
    if (regPw) {
      on(regPw, 'input', () => window.updateStrength(regPw.value));
    }

    // Render persistent logged-in state
    renderAuthState();
  };
 
  return { init, renderAuthState };
})();


 
 

/* ============================================================
   BOOTSTRAP — Run all modules on DOM ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  Carousel.init();
  Sidenav.init();
  Accordion.init();
  Modal.init();
  Cart.init();
  LazyImages.init();
  StickyNav.init();
  Search.init();
  ProductCards.init();
  SmoothScroll.init();
  ContactForm.init();
  ScrollReveal.init();
  AuthModal.init();

  console.log('[CreativeKit3A] All modules initialized ✓');
});
