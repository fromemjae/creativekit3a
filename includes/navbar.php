<?php
/**
 * includes/navbar.php — The storefront header (CreativeKit3A design system, nav-mega).
 *
 * Two fixed rows. The bar: the logo, four words, the product search, the account, the quote cart
 * and Request a quote. Under it, on a laptop and wider, the category bar of the old home menu: every
 * main category, and on hover its subcategories in columns with their products under them.
 * On a phone the categories move into the sheet under Catalogue, one fold per category.
 * (Before:) one fixed bar: the logo, four words,
 * the product search, the account (Sign in / name / Logout), the quote cart and the one
 * main action, Request a quote. On a phone /assets/kit/system.js turns it into a sheet.
 * The category panel is built from the categories, products and product_variants tables
 * through config/db.php, nothing is hardcoded. (The old dark top bar is folded in here;
 * includes/topbar.php now prints nothing.)
 *
 * Optional variable:
 *   $active_nav (string) — main-category slug of the page (marks the Catalogue word)
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$active_nav   = $active_nav ?? '';
$is_logged_in = isset($_SESSION['user_id']);
$user_name    = $_SESSION['user_name'] ?? '';
$user_role    = $_SESSION['user_role'] ?? '';
$is_staff     = in_array($user_role, ['admin', 'staff'], true);
$search_value = trim($_GET['q'] ?? $_GET['s'] ?? '');

// -------------------------------------------------------------
// Menu data: main category → subcategory columns → product links (the old home menu's
// shape), plus each category's product list and count for the footer and the home chips
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
            $cat['name']  = $r['cat_name'];
            $cat['links'] = $cat['links'] ?? [];
            $cat['count'] = $cat['count'] ?? 0;
            $cat['cols'][$r['sub_slug']]['name']  = $r['sub_name'];
            $cat['cols'][$r['sub_slug']]['links'] = $cat['cols'][$r['sub_slug']]['links'] ?? [];
            if ($r['product_slug']) {
                $cat['count']++;
                $link = [
                    'name' => $r['product_name'],
                    'url'  => product_url($r['cat_slug'], $r['sub_slug'], $r['product_slug'], (int)$r['variant_count']),
                ];
                $cat['links'][] = $link;
                $cat['cols'][$r['sub_slug']]['links'][] = $link;
            }
            unset($cat);
        }
    } catch (PDOException $e) {
        $mega_menu = [];
    }
}
$chev = '<svg class="chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
$cat_href = fn(string $c, string $sub = '') => BASE_URL . '/category-page.php?cat=' . urlencode($c) . ($sub !== '' ? '&subcat=' . urlencode($sub) : '');
?>
<header class="nav" id="site-nav">
  <div class="wrap nav__bar">
    <a class="skip-link" href="#top">Skip to content</a>
    <a class="nav__logo ck-logo" href="<?= BASE_URL ?>/" aria-label="CreativeKit3A home">
      <img src="<?= BASE_URL ?>/assets/images/logo.png" alt="" width="28" height="28">
      <span class="ck-logo__name">CreativeKit3A</span>
    </a>

    <nav class="nav__links" aria-label="Main">
      <div class="nav__item ck-catalogue">
        <a class="nav__link" href="<?= BASE_URL ?>/category-page.php"<?= $active_nav ? ' aria-current="page"' : '' ?>>Catalogue</a>
        <div class="nav__menu ck-sheet-cats">
          <div class="wrap">
            <?php foreach ($mega_menu as $cat_slug => $cat): ?>
              <details class="ck-fold"<?= $active_nav === $cat_slug ? ' open' : '' ?>>
                <summary><?= htmlspecialchars($cat['name']) ?><span><?= (int)$cat['count'] ?></span></summary>
                <a href="<?= htmlspecialchars($cat_href($cat_slug)) ?>">All <?= htmlspecialchars($cat['name']) ?></a>
                <?php foreach ($cat['cols'] ?? [] as $sub_slug => $col): ?>
                  <a href="<?= htmlspecialchars($cat_href($cat_slug, $sub_slug)) ?>"><?= htmlspecialchars($col['name']) ?></a>
                <?php endforeach; ?>
              </details>
            <?php endforeach; ?>
          </div>
        </div>
      </div>
      <div class="nav__item"><a class="nav__link" href="<?= BASE_URL ?>/#how">How it works</a></div>
      <div class="nav__item"><a class="nav__link" href="<?= BASE_URL ?>/#corporate-heading">About</a></div>
      <div class="nav__item"><a class="nav__link" href="<?= BASE_URL ?>/#contact-heading">Contact</a></div>
    </nav>

    <div class="nav__actions">
      <!-- Search (submits to the catalog: SQL LIKE across products) -->
      <form class="navbar-search ck-search" role="search" action="<?= BASE_URL ?>/category-page.php" method="get">
        <label class="ck-search__label" for="navbar-search-input">Search</label>
        <input type="search" name="q" placeholder="Mugs, bags, pens" id="navbar-search-input" value="<?= htmlspecialchars($search_value) ?>">
        <button class="ck-search__go" type="submit" aria-label="Search"><i class="fas fa-search" aria-hidden="true"></i></button>
      </form>

      <div class="navbar-user-area ck-account">
        <?php if ($is_logged_in): ?>
          <?php if ($is_staff): ?>
            <a class="nav__link" href="<?= BASE_URL ?>/pages/dashboard.php"><?= htmlspecialchars($user_name) ?> · Dashboard</a>
          <?php else: ?>
            <span class="nav__link ck-account__name"><?= htmlspecialchars($user_name) ?></span>
          <?php endif; ?>
          <a class="nav__link" href="<?= BASE_URL ?>/auth/logout.php">Log out</a>
        <?php else: ?>
          <button class="nav__link ck-linkbtn" type="button" onclick="openModal('login-modal')">Sign in</button>
          <button class="nav__link ck-linkbtn" type="button" onclick="openModal('register-modal')">Register</button>
        <?php endif; ?>
      </div>

      <a href="#quote-modal" class="navbar-cart ck-cart" aria-label="Quote cart" onclick="openModal('quote-modal'); return false;">
        <i class="fas fa-clipboard-list" aria-hidden="true"></i>
        <span class="cart-count" aria-live="polite">0</span>
      </a>

      <a class="btn btn--primary btn-chat" href="<?= BASE_URL ?>/#contact-heading" onclick="openModal('quote-modal'); return false;">Request a quote</a>
    </div>

    <button class="nav__toggle" type="button" aria-expanded="false" aria-label="Menu">
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 5h14M2 13h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>
  </div>

  <!-- The category bar (the old home menu): categories → subcategory columns → products, from the database -->
  <div class="wrap mega-menu-bar">
    <ul class="mega-menu-nav" aria-label="Categories">
      <?php foreach ($mega_menu as $cat_slug => $cat):
        $cols = $cat['cols'] ?? [];
        $n    = count($cols); ?>
        <li class="mega-menu-item<?= $active_nav === $cat_slug ? ' active-cat' : '' ?>">
          <a class="mega-menu-link" href="<?= htmlspecialchars($cat_href($cat_slug)) ?>"<?= $active_nav === $cat_slug ? ' aria-current="page"' : '' ?>><?= htmlspecialchars($cat['name']) ?> <?= $chev ?></a>
          <div class="mega-dropdown">
            <div class="wrap mega-dropdown__in">
              <div class="mega-dropdown__cols" style="--mega-cols: <?= $n <= 4 ? max(1, $n) : (int)ceil($n / 2) ?>;">
                <?php foreach ($cols as $sub_slug => $col): ?>
                  <div class="mega-dropdown-col">
                    <a class="mega-dropdown-col__head" href="<?= htmlspecialchars($cat_href($cat_slug, $sub_slug)) ?>"><?= htmlspecialchars($col['name']) ?></a>
                    <?php foreach (array_slice($col['links'], 0, 5) as $link): ?>
                      <a href="<?= htmlspecialchars(url($link['url'])) ?>"><?= htmlspecialchars($link['name']) ?></a>
                    <?php endforeach; ?>
                    <?php if (count($col['links']) > 5): ?>
                      <a class="mega-dropdown-col__more" href="<?= htmlspecialchars($cat_href($cat_slug, $sub_slug)) ?>">All <?= count($col['links']) ?> products</a>
                    <?php endif; ?>
                  </div>
                <?php endforeach; ?>
              </div>
              <a class="mega-dropdown__all" href="<?= htmlspecialchars($cat_href($cat_slug)) ?>">
                <span class="mega-dropdown__count"><?= (int)$cat['count'] ?> products</span>
                <span class="mega-dropdown__name">See all <?= htmlspecialchars($cat['name']) ?></span>
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </a>
            </div>
          </div>
        </li>
      <?php endforeach; ?>
    </ul>
  </div>
</header>
<main id="top">
