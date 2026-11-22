<?php
/**
 * includes/navbar.php — Main white header, 8-category mega menu bar,
 * and mobile sidenav (CreativeKit3A Main UI).
 *
 * The mega menu and sidenav are built from the categories, products and
 * product_variants tables through config/db.php — nothing is hardcoded.
 *
 * Optional variable:
 *   $active_nav (string) — main-category slug to highlight (adds 'active-cat')
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$active_nav   = $active_nav ?? '';
$is_logged_in = isset($_SESSION['user_id']);
$is_staff     = in_array($_SESSION['user_role'] ?? '', ['admin', 'staff'], true);
$search_value = trim($_GET['q'] ?? $_GET['s'] ?? '');

// -------------------------------------------------------------
// Mega menu data: main category → subcategory columns → product links
// (INNER JOIN on the self-referencing categories table, LEFT JOIN products
//  so empty subcategories still show, LEFT JOIN variants for the link target)
// -------------------------------------------------------------
$mega_menu = [];
$nav_pdo = function_exists('get_db') ? get_db() : null;
if ($nav_pdo) {
    try {
        $rows = $nav_pdo->query(
            "SELECT mc.slug AS cat_slug, mc.name AS cat_name,
                    sc.slug AS sub_slug, sc.name AS sub_name,
                    p.name  AS product_name, p.slug AS product_slug,
                    COUNT(v.id) AS variant_count
             FROM categories AS mc
             INNER JOIN categories AS sc ON sc.parent_id = mc.id AND sc.is_active = 1
             LEFT JOIN products AS p ON p.category_id = sc.id AND p.status = 'active'
             LEFT JOIN product_variants AS v ON v.product_id = p.id
             WHERE mc.parent_id IS NULL AND mc.is_active = 1
             GROUP BY mc.id, mc.slug, mc.name, mc.sort_order, sc.id, sc.slug, sc.name, sc.sort_order, p.id, p.name, p.slug
             ORDER BY mc.sort_order ASC, sc.sort_order ASC, p.name ASC"
        )->fetchAll();
        foreach ($rows as $r) {
            $cat = &$mega_menu[$r['cat_slug']];
            $cat['name'] = $r['cat_name'];
            $cat['cols'][$r['sub_slug']]['name'] = $r['sub_name'];
            $cat['cols'][$r['sub_slug']]['links'] = $cat['cols'][$r['sub_slug']]['links'] ?? [];
            if ($r['product_slug']) {
                $cat['cols'][$r['sub_slug']]['links'][] = [
                    'name' => $r['product_name'],
                    'url'  => product_url($r['cat_slug'], $r['sub_slug'], $r['product_slug'], (int)$r['variant_count']),
                ];
            }
            unset($cat);
        }
    } catch (PDOException $e) {
        $mega_menu = [];
    }
}

/** ' active-cat' when the slug is the highlighted main category */
function nav_active(string $slug): string {
    global $active_nav;
    return $active_nav === $slug ? ' active-cat' : '';
}
?>

<!-- ============================================================
     MAIN NAVBAR
     ============================================================ -->
<nav class="navbar" role="navigation" aria-label="Main navigation">
  <div class="navbar-inner">

    <!-- Hamburger (mobile) -->
    <button class="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="sidenav">
      <span></span><span></span><span></span>
    </button>

    <!-- Logo -->
    <a href="<?= BASE_URL ?>/" class="navbar-logo" aria-label="CreativeKit3A home">
      <img src="<?= BASE_URL ?>/assets/images/logo.png" alt="CreativeKit3A Logo" class="logo-img">
      <span class="logo-text">CreativeKit3A</span>
    </a>

    <!-- Search (submits to the catalog: SQL LIKE across products) -->
    <form class="navbar-search" role="search" action="<?= BASE_URL ?>/category-page.php" method="get">
      <input type="search" name="q" placeholder="What are you looking for?"
             aria-label="Search products" id="navbar-search-input" value="<?= htmlspecialchars($search_value) ?>">
      <i class="fas fa-search search-icon" role="button" tabindex="0" title="Search" aria-label="Search"></i>
    </form>

    <!-- Right side links -->
    <div class="navbar-right">
      <nav class="navbar-links" aria-label="Secondary navigation">
        <a href="<?= BASE_URL ?>/#corporate-heading">About</a>
        <a href="<?= BASE_URL ?>/category-page.php"
          <?= $active_nav ? 'style="color:var(--orange-primary);font-weight:700;"' : '' ?>>Category</a>
        <a href="<?= BASE_URL ?>/#contact-heading">Contact Us</a>
      </nav>
      <button class="btn-chat" onclick="openModal('quote-modal')" aria-label="Request a Quote">Request a Quote</button>
      <a href="#" class="navbar-cart" aria-label="Quote cart" onclick="openModal('quote-modal'); return false;">
        <i class="fas fa-shopping-cart" aria-hidden="true"></i>
        <span>Cart</span>
        <span class="cart-count" aria-live="polite">0</span>
      </a>
    </div>

  </div>
</nav>

<!-- ============================================================
     MEGA MENU BAR (categories → subcategories → products, from the database)
     ============================================================ -->
<div class="mega-menu-bar" role="navigation" aria-label="Category navigation">
  <ul class="mega-menu-nav">
    <?php foreach ($mega_menu as $cat_slug => $cat): ?>
      <li class="mega-menu-item<?= nav_active($cat_slug) ?>">
        <a href="<?= BASE_URL ?>/category-page.php?cat=<?= urlencode($cat_slug) ?>"><?= htmlspecialchars(mb_strtoupper($cat['name'])) ?> <i class="fas fa-chevron-down chevron" aria-hidden="true"></i></a>
        <?php $col_count = count($cat['cols']); // ≤5 columns in one row, more → two balanced rows ?>
        <div class="mega-dropdown" style="--mega-cols: <?= $col_count <= 5 ? max(1, $col_count) : (int)ceil($col_count / 2) ?>;">
          <?php foreach ($cat['cols'] as $col): ?>
            <div class="mega-dropdown-col">
              <h4><?= htmlspecialchars($col['name']) ?></h4>
              <?php foreach ($col['links'] as $link): ?>
                <a href="<?= htmlspecialchars(url($link['url'])) ?>"><?= htmlspecialchars($link['name']) ?></a>
              <?php endforeach; ?>
            </div>
          <?php endforeach; ?>
        </div>
      </li>
    <?php endforeach; ?>
  </ul>
</div>

<!-- ============================================================
     MOBILE SIDENAV
     ============================================================ -->
<div class="sidenav-overlay" aria-hidden="true"></div>

<aside class="sidenav" id="sidenav" role="complementary" aria-label="Mobile navigation">
  <div class="sidenav-header">
    <span class="logo-text">CreativeKit3A</span>
    <button class="sidenav-close" aria-label="Close menu">&times;</button>
  </div>
  <div class="sidenav-body">
    <?php if ($is_staff): ?>
      <p class="sidenav-section-title">Staff Portal</p>
      <a href="<?= BASE_URL ?>/pages/dashboard.php">Dashboard</a>
      <a href="<?= BASE_URL ?>/pages/products.php">Products</a>
      <a href="<?= BASE_URL ?>/pages/quotes.php">Quotes</a>
      <a href="<?= BASE_URL ?>/pages/reports.php">Reports</a>
    <?php endif; ?>
    <p class="sidenav-section-title">Categories</p>
    <?php foreach ($mega_menu as $cat_slug => $cat): ?>
      <a href="<?= BASE_URL ?>/category-page.php?cat=<?= urlencode($cat_slug) ?>"><?= htmlspecialchars(mb_strtoupper($cat['name'])) ?></a>
    <?php endforeach; ?>
    <p class="sidenav-section-title">Quotation</p>
    <a href="#" onclick="closeDrawer(); openModal('quote-modal'); return false;"><i class="fas fa-paper-plane"></i> Request a Quote</a>
    <p class="sidenav-section-title">Help</p>
    <a href="<?= BASE_URL ?>/#corporate-heading">About</a>
    <a href="<?= BASE_URL ?>/category-page.php">All Categories</a>
    <a href="<?= BASE_URL ?>/#contact-heading">Contact Us</a>
    <p class="sidenav-section-title">Account</p>
    <?php if ($is_logged_in): ?>
      <a href="<?= BASE_URL ?>/auth/logout.php"><i class="fas fa-sign-out-alt"></i> Logout</a>
    <?php else: ?>
      <a href="#" onclick="openModal('login-modal'); return false;"><i class="fas fa-sign-in-alt"></i> Sign In</a>
      <a href="#" onclick="openModal('register-modal'); return false;"><i class="fas fa-user-plus"></i> Register</a>
    <?php endif; ?>
    <p class="sidenav-section-title">Contact</p>
    <a href="tel:+639177142774"><i class="fas fa-mobile-alt"></i> +63 917 714 2774</a>
    <a href="tel:+639339927410"><i class="fas fa-phone"></i> +63 933 992 7410</a>
    <a href="mailto:salesandmarketing@creativekit3a.com"><i class="fas fa-envelope"></i> salesandmarketing@creativekit3a.com</a>
  </div>
</aside>
