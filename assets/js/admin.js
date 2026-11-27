/**
 * ============================================================
 * assets/js/admin.js — Staff portal shell (all pages in pages/)
 *   - Desktop: the menu button collapses the sidebar to an icon rail (remembered)
 *   - Tablets/phones: off-canvas sidebar toggle
 *   - Closes on overlay click, Escape, or when a nav link is chosen
 * ============================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const shell   = document.getElementById('admin-shell');
  const menuBtn = document.getElementById('admin-menu-btn');
  const overlay = document.getElementById('admin-sidebar-overlay');
  if (!shell || !menuBtn) return;

  const DESKTOP = window.matchMedia('(min-width: 1025px)');   // matches the CSS drawer breakpoint (max-width: 1024px)

  // Under 1025px: an off-canvas drawer
  const setOpen = (open) => {
    shell.classList.toggle('sidebar-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    sync();
  };

  // 1025px and up: the sidebar folds to an icon rail; the choice is remembered
  const setCollapsed = (collapsed) => {
    shell.classList.toggle('sidebar-collapsed', collapsed);
    try { localStorage.setItem('ck_staff_side_collapsed', collapsed ? '1' : '0'); } catch (_) {}
    sync();
  };

  // the menu button's state and name follow the layout
  function sync() {
    const label = DESKTOP.matches
      ? (shell.classList.contains('sidebar-collapsed') ? 'Expand navigation' : 'Collapse navigation')
      : 'Open navigation';
    const expanded = DESKTOP.matches ? !shell.classList.contains('sidebar-collapsed') : shell.classList.contains('sidebar-open');
    menuBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', label);
    menuBtn.title = label;
  }

  menuBtn.addEventListener('click', () => {
    if (DESKTOP.matches) setCollapsed(!shell.classList.contains('sidebar-collapsed'));
    else setOpen(!shell.classList.contains('sidebar-open'));
  });
  overlay?.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && shell.classList.contains('sidebar-open')) setOpen(false); });
  shell.querySelectorAll('.admin-nav-link').forEach((link) => link.addEventListener('click', () => { if (!DESKTOP.matches) setOpen(false); }));
  DESKTOP.addEventListener('change', () => { if (shell.classList.contains('sidebar-open')) setOpen(false); else sync(); });
  sync();
});
