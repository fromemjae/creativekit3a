<?php
/**
 * includes/admin-layout.php — Opens the staff-portal shell:
 * fixed dark sidebar (collapsible: an icon rail on a desktop, a drawer under 1024px) + slim top header. Used by every page in pages/
 * (dashboard, products, product-form, quotes, reports) instead of the
 * storefront top bar / navbar. Close it with includes/admin-footer.php.
 *
 * Expects auth/guard.php to have run ($current_user_name, $current_user_role).
 * Optional: $admin_heading (string) — title shown in the top header.
 */

$admin_current = basename($_SERVER['PHP_SELF']);
$admin_heading = $admin_heading ?? 'Dashboard';
$admin_user    = $current_user_name ?? ($_SESSION['user_name'] ?? 'User');
$admin_role    = $current_user_role ?? ($_SESSION['user_role'] ?? 'staff');
$admin_initials = strtoupper(implode('', array_map(fn($w) => mb_substr($w, 0, 1), array_slice(preg_split('/\s+/', trim($admin_user)), 0, 2))));

// Live badge: quote requests still waiting for review
$admin_new_quotes = 0;
$admin_pdo = function_exists('get_db') ? get_db() : null;
if ($admin_pdo) {
    try {
        $admin_new_quotes = (int)$admin_pdo->query("SELECT COUNT(*) FROM quote_requests WHERE status = 'new'")->fetchColumn();
    } catch (PDOException $e) {
        $admin_new_quotes = 0;
    }
}

$admin_nav = [
    ['dashboard.php', 'Dashboard', 'fa-chart-pie',          ['dashboard.php']],
    ['products.php',  'Products',  'fa-boxes',              ['products.php', 'product-form.php']],
    ['quotes.php',    'Quotes',    'fa-file-invoice-dollar', ['quotes.php']],
    ['reports.php',   'Reports',   'fa-chart-bar',          ['reports.php']],
];
?>
<div class="admin-shell" id="admin-shell">
  <script>try{if(localStorage.getItem('ck_staff_side_collapsed')==='1')document.getElementById('admin-shell').classList.add('sidebar-collapsed')}catch(e){}</script>

  <!-- ============================================================
       SIDEBAR
       ============================================================ -->
  <aside class="admin-sidebar" id="admin-sidebar" aria-label="Staff portal navigation">
    <a href="<?= BASE_URL ?>/pages/dashboard.php" class="admin-brand">
      <img src="<?= BASE_URL ?>/assets/images/logo.png" alt="" class="admin-brand-logo">
      <span class="admin-brand-text">CreativeKit3A<small>Staff Portal</small></span>
    </a>

    <nav class="admin-nav">
      <p class="admin-nav-title">Main</p>
      <?php foreach ($admin_nav as [$file, $label, $icon, $matches]): ?>
        <a href="<?= BASE_URL ?>/pages/<?= $file ?>"
           class="admin-nav-link<?= in_array($admin_current, $matches, true) ? ' active' : '' ?>" title="<?= $label ?>"
           <?= in_array($admin_current, $matches, true) ? 'aria-current="page"' : '' ?>>
          <i class="fas <?= $icon ?>" aria-hidden="true"></i>
          <span><?= $label ?></span>
          <?php if ($file === 'quotes.php' && $admin_new_quotes > 0): ?>
            <span class="admin-nav-badge" title="New quote requests"><?= $admin_new_quotes ?></span>
          <?php endif; ?>
        </a>
      <?php endforeach; ?>

      <?php if ($admin_role === 'admin'): ?>
        <a href="<?= BASE_URL ?>/pages/super-admin.php"
           class="admin-nav-link<?= $admin_current === 'super-admin.php' ? ' active' : '' ?>" title="Super admin"
           <?= $admin_current === 'super-admin.php' ? 'aria-current="page"' : '' ?>>
          <i class="fas fa-user-shield" aria-hidden="true"></i>
          <span>Super admin</span>
        </a>
      <?php endif; ?>

      <p class="admin-nav-title">Quick Actions</p>
      <a href="<?= BASE_URL ?>/pages/product-form.php" class="admin-nav-link" title="Add Product">
        <i class="fas fa-plus-circle" aria-hidden="true"></i><span>Add Product</span>
      </a>
      <a href="<?= BASE_URL ?>/pages/quotes.php?status=new" class="admin-nav-link" title="New Inquiries">
        <i class="fas fa-inbox" aria-hidden="true"></i><span>New Inquiries</span>
      </a>
    </nav>

    <div class="admin-sidebar-footer">
      <a href="<?= BASE_URL ?>/" class="admin-nav-link" title="View Storefront">
        <i class="fas fa-store" aria-hidden="true"></i><span>View Storefront</span>
      </a>
      <a href="<?= BASE_URL ?>/auth/logout.php" class="admin-nav-link admin-nav-logout" title="Logout">
        <i class="fas fa-sign-out-alt" aria-hidden="true"></i><span>Logout</span>
      </a>
    </div>
  </aside>
  <div class="admin-sidebar-overlay" id="admin-sidebar-overlay" aria-hidden="true"></div>

  <!-- ============================================================
       MAIN AREA
       ============================================================ -->
  <div class="admin-main">
    <header class="admin-topbar">
      <button type="button" class="admin-menu-btn" id="admin-menu-btn" aria-label="Open navigation" title="Open navigation" aria-controls="admin-sidebar" aria-expanded="false">
        <i class="fas fa-bars"></i>
      </button>

      <div class="admin-topbar-title">
        <span class="admin-topbar-eyebrow">Staff Portal</span>
        <strong><?= htmlspecialchars($admin_heading) ?></strong>
      </div>

      <form class="admin-search" role="search" action="<?= BASE_URL ?>/pages/products.php" method="get">
        <i class="fas fa-search" aria-hidden="true"></i>
        <label for="admin-search-q" class="admin-visually-hidden">Search products</label>
        <input type="search" id="admin-search-q" name="q" placeholder="Search products by name or SKU…" aria-label="Search products"
               value="<?= $admin_current === 'products.php' ? htmlspecialchars($_GET['q'] ?? '') : '' ?>">
      </form>

      <div class="admin-user" title="Signed in as <?= htmlspecialchars(ucfirst($admin_role)) ?>">
        <span class="admin-avatar" aria-hidden="true"><?= htmlspecialchars($admin_initials) ?></span>
        <span class="admin-user-text">
          <strong><?= htmlspecialchars($admin_user) ?></strong>
          <small><?= htmlspecialchars(ucfirst($admin_role)) ?></small>
        </span>
      </div>
    </header>

    <div class="admin-content">
