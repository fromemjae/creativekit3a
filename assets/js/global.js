/**
 * ============================================================
 * assets/js/global.js — Shared JavaScript for every page
 * (CreativeKit3A Main UI behaviours, ported from the original main.js)
 * Includes:
 *   - Modal controller (openModal / closeModal / closeAllModals)
 *   - Mobile sidenav (hamburger)
 *   - Sticky navbar scroll behaviour
 *   - Navbar search (search icon submits the form)
 *   - Image onerror fallback → assets/images/placeholder.png
 *   - Auth modal helpers (password toggle + strength meter)
 *   - Toast notifications, tooltips, auto-dismiss alerts
 * ============================================================
 */

'use strict';

const BASE = window.BASE_URL || '';
const PLACEHOLDER_IMG = BASE + '/assets/images/placeholder.png';

// ============================================================
// 1. Image fallback — any <img> that fails to load gets the local
//    placeholder once (capture phase: image errors don't bubble).
//    Replace files in assets/images/{hero,items,categories}/ with real
//    photos of the same name; no code change needed.
// ============================================================
document.addEventListener('error', (e) => {
  const img = e.target;
  if (!(img instanceof HTMLImageElement) || img.dataset.fallbackApplied) return;
  img.dataset.fallbackApplied = '1';
  img.src = img.dataset.fallback || PLACEHOLDER_IMG;
}, true);

// ============================================================
// 2. Modal controller
//    Main UI modals (.lm-modal: Sign In, Register, Request a Quote) use the
//    .open class + #lm-overlay; admin dialogs (.modal-overlay) use .active.
// ============================================================
window.openModal = function (modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  if (modal.classList.contains('lm-modal')) {
    document.querySelectorAll('.lm-modal.open').forEach((m) => m.classList.remove('open', 'active'));
    document.getElementById('lm-overlay')?.classList.add('open');
  }
  modal.classList.add('open', 'active');
  document.body.style.overflow = 'hidden';
};

window.closeModal = function (modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('open', 'active');
  if (!document.querySelector('.lm-modal.open')) {
    document.getElementById('lm-overlay')?.classList.remove('open');
  }
  if (!document.querySelector('.lm-modal.open, .modal-overlay.active')) {
    document.body.style.overflow = '';
  }
};

window.closeAllModals = function () {
  document.querySelectorAll('.lm-modal, .modal-overlay').forEach((m) => m.classList.remove('open', 'active'));
  document.getElementById('lm-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
};

// ============================================================
// 3. Auth modal helpers
// ============================================================
window.togglePw = function (inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const hidden = input.type === 'password';
  input.type = hidden ? 'text' : 'password';
  const icon = btn && btn.querySelector('i');
  if (icon) {
    icon.classList.toggle('fa-eye', !hidden);
    icon.classList.toggle('fa-eye-slash', hidden);
  }
};

// ============================================================
// 4. Toast notifications (used for storefront flash messages)
// ============================================================
window.showToast = function (message, type = 'info') {
  let box = document.getElementById('ck-toasts');
  if (!box) {
    box = document.createElement('div');
    box.id = 'ck-toasts';
    box.style.cssText = 'position:fixed;top:20px;right:20px;z-index:3000;display:flex;flex-direction:column;gap:10px;max-width:360px;';
    document.body.appendChild(box);
  }
  const colors = { success: '#10B981', danger: '#EF4444', warning: '#F59E0B', info: '#FF6B00' };
  const toast = document.createElement('div');
  toast.setAttribute('role', 'status');
  toast.style.cssText = 'background:#fff;color:#1A1A1A;border-left:4px solid ' + (colors[type] || colors.info) +
    ';border-radius:12px;padding:12px 16px;box-shadow:0 8px 32px rgba(255,107,0,0.15);font-size:0.9rem;' +
    'transition:opacity .3s ease, transform .3s ease;';
  toast.textContent = message;
  box.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(12px)'; }, 4500);
  setTimeout(() => toast.remove(), 4900);
};

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 5. Mobile sidenav (hamburger)
  // ============================================================
  const sidenav  = document.querySelector('.sidenav');
  const overlay  = document.querySelector('.sidenav-overlay');
  const openBtn  = document.querySelector('.hamburger');
  const closeBtn = document.querySelector('.sidenav-close');

  const openSidenav = () => {
    sidenav?.classList.add('open');
    overlay?.classList.add('open');
    openBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const closeSidenav = () => {
    sidenav?.classList.remove('open');
    overlay?.classList.remove('open');
    openBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  window.closeDrawer = closeSidenav;

  openBtn?.addEventListener('click', openSidenav);
  closeBtn?.addEventListener('click', closeSidenav);
  overlay?.addEventListener('click', closeSidenav);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeSidenav(); closeAllModals(); }
  });

  // ============================================================
  // 6. Sticky navbar: shadow after scrolling, hide on scroll down
  // ============================================================
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const style = document.createElement('style');
    style.textContent =
      '.navbar{transition:transform .35s cubic-bezier(.4,0,.2,1),box-shadow .3s ease}' +
      '.navbar.scrolled{box-shadow:0 4px 30px rgba(255,107,0,.15)}' +
      '.navbar.hide-nav{transform:translateY(-100%)}';
    document.head.appendChild(style);

    let lastScroll = 0;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 80);
        navbar.classList.toggle('hide-nav', y > lastScroll && y > 200);
        lastScroll = y;
        ticking = false;
      });
    }, { passive: true });
  }

  // ============================================================
  // 6b. Mega menu: keep each dropdown inside the viewport.
  //     Panels open left-aligned under their category; if one would run past
  //     the right edge (Gift Set, Home Living, Pen & Paper, PU Leather…) it is
  //     shifted left just enough, never past the left gutter.
  // ============================================================
  const EDGE = 16;
  const placeDropdown = (item) => {
    const panel = item.querySelector('.mega-dropdown');
    if (!panel) return;
    panel.style.left = '0px';
    const r = panel.getBoundingClientRect();
    if (!r.width) return;
    const vw = document.documentElement.clientWidth;
    let shift = 0;
    if (r.right > vw - EDGE) shift = (vw - EDGE) - r.right;      // pull back from the right edge
    if (r.left + shift < EDGE) shift = EDGE - r.left;             // but never past the left gutter
    panel.style.left = shift + 'px';
  };
  // Measure on the next frame: :hover / :focus-within must be applied first
  const schedulePlace = (item) => requestAnimationFrame(() => placeDropdown(item));
  document.querySelectorAll('.mega-menu-item').forEach((item) => {
    item.addEventListener('mouseenter', () => schedulePlace(item));
    item.addEventListener('focusin', () => schedulePlace(item));
  });
  window.addEventListener('resize', () => {
    document.querySelectorAll('.mega-menu-item:hover, .mega-menu-item:focus-within').forEach(placeDropdown);
  });

  // ============================================================
  // 7. Navbar search — clicking the magnifier or pressing Enter submits search
  // ============================================================
  document.querySelectorAll('.navbar-search').forEach((container) => {
    const icon  = container.querySelector('.search-icon');
    const input = container.querySelector('input');
    const form  = container.tagName === 'FORM' ? container : container.closest('form');

    const executeSearch = () => {
      const q = (input?.value || '').trim();
      if (!q) {
        if (input) input.focus();
        return;
      }
      if (form && form.requestSubmit) {
        form.requestSubmit();
      } else {
        const isPhp = window.location.pathname.endsWith('.php');
        const target = isPhp ? (BASE + '/category-page.php') : 'category-page.html';
        window.location.href = `${target}?s=${encodeURIComponent(q)}`;
      }
    };

    if (icon) {
      icon.style.cursor = 'pointer';
      icon.addEventListener('click', (e) => {
        e.preventDefault();
        executeSearch();
      });
      icon.addEventListener('keydown', (e) => {   // keyboard: Enter / Space on the search icon
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          executeSearch();
        }
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        if (!input || !input.value.trim()) e.preventDefault();
      });
    } else if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          executeSearch();
        }
      });
    }
  });

  // ============================================================
  // 8. Register modal: password strength meter + confirm check
  // ============================================================
  const regPw      = document.getElementById('lm-reg-password');
  const regConfirm = document.getElementById('lm-reg-confirm');
  const fill       = document.getElementById('lm-strength-fill');
  const label      = document.getElementById('lm-strength-label');
  const LEVELS = [
    { text: 'Too short', color: '#EF4444', width: '15%' },
    { text: 'Weak',      color: '#F97316', width: '35%' },
    { text: 'Fair',      color: '#F59E0B', width: '60%' },
    { text: 'Good',      color: '#84CC16', width: '80%' },
    { text: 'Strong',    color: '#10B981', width: '100%' },
  ];
  regPw?.addEventListener('input', () => {
    const v = regPw.value;
    let score = v.length >= 8 ? 1 : 0;
    if (score && /[A-Z]/.test(v)) score++;
    if (score && /[0-9]/.test(v)) score++;
    if (score && /[^A-Za-z0-9]/.test(v)) score++;
    const lvl = LEVELS[v ? score : 0];
    if (fill)  { fill.style.width = v ? lvl.width : '0'; fill.style.background = lvl.color; }
    if (label) { label.textContent = v ? lvl.text : ''; label.style.color = lvl.color; }
  });
  const checkConfirm = () => {
    if (regConfirm) regConfirm.setCustomValidity(regConfirm.value && regPw && regConfirm.value !== regPw.value ? 'Passwords do not match.' : '');
  };
  regPw?.addEventListener('input', checkConfirm);
  regConfirm?.addEventListener('input', checkConfirm);

  // ============================================================
  // 9. Global tooltip system ([data-tooltip])
  // ============================================================
  let tooltipEl = document.getElementById('app-tooltip');
  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'app-tooltip';
    document.body.appendChild(tooltipEl);
  }
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-tooltip]');
    if (!target) return;
    const text = target.getAttribute('data-tooltip');
    if (!text) return;
    tooltipEl.textContent = text;
    tooltipEl.classList.add('visible');
    const rect = target.getBoundingClientRect();
    const tip = tooltipEl.getBoundingClientRect();
    let top = rect.top - tip.height - 8;
    let left = rect.left + rect.width / 2 - tip.width / 2;
    if (top < 10) top = rect.bottom + 8;
    if (left < 10) left = 10;
    else if (left + tip.width > window.innerWidth - 10) left = window.innerWidth - tip.width - 10;
    tooltipEl.style.top = `${top}px`;
    tooltipEl.style.left = `${left}px`;
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('[data-tooltip]')) tooltipEl.classList.remove('visible');
  });

  // ============================================================
  // 10. Auto-dismiss flash alerts (admin pages)
  // ============================================================
  document.querySelectorAll('.alert').forEach((alert) => {
    alert.querySelector('.alert-close')?.addEventListener('click', () => {
      alert.style.opacity = '0';
      alert.style.transform = 'translateY(-6px)';
      setTimeout(() => alert.remove(), 250);
    });
    if (alert.classList.contains('alert-success') || alert.classList.contains('alert-info')) {
      setTimeout(() => {
        if (!alert.parentNode) return;
        alert.style.transition = 'all 0.4s ease';
        alert.style.opacity = '0';
        alert.style.transform = 'translateY(-6px)';
        setTimeout(() => alert.remove(), 400);
      }, 6000);
    }
  });
});
