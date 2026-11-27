<?php
/**
 * category-page.php — Public Product Category Page (database-driven)
 *
 * All categories, subcategories and products are read from the single
 * creativekit3a_db database through config/db.php, then handed to
 * category-page.js (which only renders — it holds no hardcoded data).
 *
 * URL examples:
 *   /category-page.php                      → Accessories & Gadgets (default)
 *   /category-page.php?cat=drinkware        → Drinkware
 *   /category-page.php?cat=pu-leather       → PU Leather
 *   /category-page.php?q=tumbler            → header search (SQL LIKE)
 *
 * SQL used: SELECT, WHERE, LIKE, ORDER BY, AS, INNER JOIN, LEFT JOIN
 */

require_once __DIR__ . '/config/db.php';

$active_slug   = trim($_GET['cat'] ?? '');
$search        = trim($_GET['q'] ?? $_GET['s'] ?? '');
$category_data = [];   // slug => { name, icon, desc, count, subcats[], products[] }

if ($pdo) {
    try {
        // 1. Main categories (parent_id IS NULL)
        $main = $pdo->query(
            "SELECT id, name, slug, description, icon
             FROM categories
             WHERE parent_id IS NULL AND is_active = 1
             ORDER BY sort_order ASC, name ASC"
        )->fetchAll();

        // 2. Subcategories joined to their parent (INNER JOIN on self-reference)
        $subs = $pdo->query(
            "SELECT sc.id, sc.name AS label, sc.slug AS sub_slug, mc.slug AS parent_slug
             FROM categories AS sc
             INNER JOIN categories AS mc ON sc.parent_id = mc.id
             WHERE sc.is_active = 1
             ORDER BY mc.sort_order ASC, sc.sort_order ASC"
        )->fetchAll();

        // 3. Active products with their subcategory, parent and variant count
        //    (LEFT JOIN keeps products that have no variants)
        $products = $pdo->query(
            "SELECT p.id, p.name, p.slug, p.price_min, p.image,
                    sc.slug AS sub_slug,
                    mc.slug AS parent_slug,
                    COUNT(v.id) AS variant_count
             FROM products AS p
             INNER JOIN categories AS sc ON p.category_id = sc.id
             INNER JOIN categories AS mc ON sc.parent_id  = mc.id
             LEFT JOIN product_variants AS v ON v.product_id = p.id
             WHERE p.status = 'active'
             GROUP BY p.id, p.name, p.slug, p.price_min, p.image, sc.slug, mc.slug
             ORDER BY sc.sort_order ASC, p.id ASC"
        )->fetchAll();

        foreach ($main as $m) {
            $category_data[$m['slug']] = [
                'name'     => $m['name'],
                'icon'     => 'fas ' . $m['icon'],
                'desc'     => $m['description'] ?? '',
                'count'    => '0',
                'subcats'  => [],
                'products' => [],
            ];
        }
        foreach ($subs as $s) {
            if (isset($category_data[$s['parent_slug']])) {
                $category_data[$s['parent_slug']]['subcats'][] = ['key' => $s['sub_slug'], 'label' => $s['label']];
            }
        }
        foreach ($products as $p) {
            if (!isset($category_data[$p['parent_slug']])) continue;
            $url = ((int)$p['variant_count'] > 0)
                ? '/product/car-charger-adapters.php?' . http_build_query([
                      'cat' => $p['parent_slug'], 'subcat' => $p['sub_slug'], 'item' => $p['slug'],
                  ])
                : '';
            $category_data[$p['parent_slug']]['products'][] = [
                'id'     => (int)$p['id'],
                'name'   => $p['name'],
                'price'  => ((float)$p['price_min'] > 0) ? 'From ₱' . number_format((float)$p['price_min'], 2) : 'Ask for Quote',
                'img'    => url($p['image'] ?: '/assets/images/placeholder.png'),
                'url'    => url($url),
                'subcat' => $p['sub_slug'],
            ];
        }
        foreach ($category_data as &$c) {
            $c['count'] = (string)count($c['products']);
        }
        unset($c);

        // 4. Header search: prepared LIKE across product, description, subcategory
        //    and category names. Rendered by the same grid as a pseudo-category
        //    whose tabs are the main categories that have matches.
        if ($search !== '') {
            $like = '%' . $search . '%';
            $stmt = $pdo->prepare(
                "SELECT p.id, p.name, p.slug, p.price_min, p.image,
                        sc.slug AS sub_slug, mc.slug AS parent_slug, mc.name AS parent_name,
                        COUNT(v.id) AS variant_count
                 FROM products AS p
                 INNER JOIN categories AS sc ON p.category_id = sc.id
                 INNER JOIN categories AS mc ON sc.parent_id  = mc.id
                 LEFT JOIN product_variants AS v ON v.product_id = p.id
                 WHERE p.status = 'active'
                   AND (p.name LIKE :q1 OR p.description LIKE :q2 OR sc.name LIKE :q3 OR mc.name LIKE :q4)
                 GROUP BY p.id, p.name, p.slug, p.price_min, p.image, sc.slug, mc.slug, mc.name, mc.sort_order
                 ORDER BY mc.sort_order ASC, p.name ASC"
            );
            $stmt->execute([':q1' => $like, ':q2' => $like, ':q3' => $like, ':q4' => $like]);
            $results = ['name' => 'Search: “' . $search . '”', 'icon' => 'fas fa-search',
                        'desc' => '', 'count' => '0', 'subcats' => [], 'products' => []];
            foreach ($stmt->fetchAll() as $p) {
                if (!in_array($p['parent_slug'], array_column($results['subcats'], 'key'), true)) {
                    $results['subcats'][] = ['key' => $p['parent_slug'], 'label' => $p['parent_name']];
                }
                $url = ((int)$p['variant_count'] > 0)
                    ? product_url($p['parent_slug'], $p['sub_slug'], $p['slug'], (int)$p['variant_count'])
                    : '';
                $results['products'][] = [
                    'id'     => (int)$p['id'],
                    'name'   => $p['name'],
                    'price'  => ((float)$p['price_min'] > 0) ? 'From ₱' . number_format((float)$p['price_min'], 2) : 'Ask for Quote',
                    'img'    => url($p['image'] ?: '/assets/images/placeholder.png'),
                    'url'    => url($url),
                    'subcat' => $p['parent_slug'],
                ];
            }
            $results['count'] = (string)count($results['products']);
            $category_data['search'] = $results;
            $active_slug = 'search';
        }
    } catch (PDOException $e) {
        $category_data = [];
    }
}

if (!isset($category_data[$active_slug])) {
    $active_slug = array_key_first($category_data) ?? '';
}
$active_cat = $category_data[$active_slug] ?? null;

$title      = 'CreativeKit3A: ' . ($active_cat ? $active_cat['name'] : 'the catalogue') . ' with your logo';
$meta_desc  = ($active_cat ? $active_cat['name'] . ' with your company logo, priced per piece. ' : '') . 'Corporate giveaways from CreativeKit3A in Tondo, Manila: a quote within 24 hours.';
$extra_css  = ['/assets/css/category-page.css'];
$active_nav = $search !== '' ? '' : $active_slug;

include __DIR__ . '/includes/head.php';
?>
<body>
<?php
include __DIR__ . '/includes/topbar.php';
include __DIR__ . '/includes/navbar.php';
?>

<?php $cat_links = $mega_menu ?? []; ?>
  <!-- CATALOGUE: the category's title, the categories, the subcategory filter and sort, then the
       products in one group per subcategory (category-page.js renders the groups from CATEGORY_DATA) -->
  <section class="section ck-catalog" id="catalogue" aria-labelledby="hero-title">
    <div class="wrap">
      <nav class="ck-crumbs cat-breadcrumb" aria-label="Breadcrumb">
        <a href="<?= BASE_URL ?>/">Home</a>
        <span class="sep" aria-hidden="true">/</span>
        <span class="current" id="hero-breadcrumb-current"><?= e($active_cat['name'] ?? 'Categories') ?></span>
      </nav>
      <div class="ck-catalog__head">
        <div>
          <h1 class="cat-hero-title"><span id="hero-title"><?= e($active_cat['name'] ?? 'Catalogue') ?></span> with your logo</h1>
          <p class="cat-hero-desc" id="hero-desc"><?= e($active_cat['desc'] ?? '') ?></p>
        </div>
        <p class="ck-catalog__count"><span class="cat-hero-count" id="hero-product-count"><?= e($active_cat['count'] ?? '0') ?></span> products, each with your logo</p>
        <span id="hero-icon" hidden></span>
      </div>

      <nav class="ck-chips" aria-label="Categories">
        <?php foreach ($cat_links as $cat_slug => $cat): ?>
          <a class="ck-chip" href="<?= BASE_URL ?>/category-page.php?cat=<?= urlencode($cat_slug) ?>"<?= ($search === '' && $cat_slug === $active_slug) ? ' aria-current="page"' : '' ?>><?= e($cat['name']) ?></a>
        <?php endforeach; ?>
      </nav>

      <div class="ck-toolbar">
        <div class="subcat-tabs-wrapper" id="subcat-tabs-wrapper">
          <div class="ck-filter" id="subcat-tabs-container" role="group" aria-label="Filter by type"><!-- filter buttons from category-page.js --></div>
        </div>
        <div class="sort-bar-right ck-sort">
          <label for="sort-select">Sort</label>
          <select class="sort-select" id="sort-select">
            <option value="default">Default</option>
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
          </select>
        </div>
      </div>
      <p class="sort-bar-left ck-showing" aria-live="polite">Showing <strong id="showing-count">all</strong> products <span id="showing-in">in <strong id="showing-subcat"><?= e($active_cat['name'] ?? 'all categories') ?></strong></span></p>

      <div class="cat-product-grid" id="cat-product-grid"><!-- product groups from category-page.js --></div>
    </div>
  </section>

  <!-- Catalog data from MySQL (creativekit3a_db) for category-page.js -->
  <script>
    window.CATEGORY_DATA   = <?= json_encode($category_data, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;
    window.ACTIVE_CATEGORY = <?= json_encode($active_slug, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;
  </script>

<?php
$extra_js = ['/assets/js/category-page.js'];
include __DIR__ . '/includes/footer.php';
?>
