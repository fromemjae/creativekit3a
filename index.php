<?php
/**
 * index.php — Storefront homepage (CreativeKit3A design system)
 * Hero (the range on the stage, from hero_banners), best sellers (featured products),
 * how an order works (pinned chapters), about, then the shared close and footer.
 *
 * Dedicated Assets:
 *   - CSS: /assets/css/home.css
 */

require_once __DIR__ . '/config/db.php';

$title      = 'CreativeKit3A: corporate giveaways with your logo, Manila';
$meta_desc  = 'Jackets, tumblers, bags, gadgets and gift sets printed, engraved or embroidered with your company logo. A quote within 24 hours, from Tondo, Manila.';
$extra_css  = ['/assets/css/home.css'];
$use_moment = 'pinned-chapters';

$featured_products = [];
$hero_banners      = [];
if ($pdo) {
    try {
        // OUR PRODUCTS: featured active products
        // (INNER JOIN subcategory, LEFT JOIN parent category + variants, AS aliases)
        $featured_products = $pdo->query(
            "SELECT p.id, p.name, p.slug, p.price_min, p.image,
                    c.slug AS subcat_slug,
                    COALESCE(mc.slug, c.slug) AS cat_slug,
                    COUNT(v.id) AS variant_count
             FROM products AS p
             INNER JOIN categories AS c  ON p.category_id = c.id
             LEFT JOIN categories  AS mc ON c.parent_id   = mc.id
             LEFT JOIN product_variants AS v ON v.product_id = p.id
             WHERE p.is_featured = 1 AND p.status = 'active'
             GROUP BY p.id, p.name, p.slug, p.price_min, p.image, c.slug, mc.slug
             ORDER BY p.id ASC
             LIMIT 8"
        )->fetchAll();

        // Hero carousel slides (hero_banners LEFT JOIN the promoted product for the link)
        $hero_banners = $pdo->query(
            "SELECT b.id, b.eyebrow, b.title, b.subtitle, b.body, b.image,
                    p.slug AS product_slug, sc.slug AS subcat_slug,
                    COALESCE(mc.slug, sc.slug) AS cat_slug,
                    COUNT(v.id) AS variant_count
             FROM hero_banners AS b
             LEFT JOIN products   AS p  ON b.product_id = p.id AND p.status = 'active'
             LEFT JOIN categories AS sc ON p.category_id = sc.id
             LEFT JOIN categories AS mc ON sc.parent_id  = mc.id
             LEFT JOIN product_variants AS v ON v.product_id = p.id
             WHERE b.is_active = 1
             GROUP BY b.id, b.eyebrow, b.title, b.subtitle, b.body, b.image, p.slug, sc.slug, mc.slug, b.sort_order
             ORDER BY b.sort_order ASC, b.id ASC"
        )->fetchAll();
    } catch (PDOException $e) {
        $featured_products = [];
        $hero_banners      = [];
    }
}

include __DIR__ . '/includes/head.php';
?>
<body>
<!-- type: product (corporate giveaways, sold by quote)
     deal: hero product (the range: the three hero_banners cut-outs on the stage), nav nav-mega, close close-photo
     dealt, built as the close-word head row (no photograph without baked-in text), footer footer-columns,
     rhythm dark-band (#about), buttons solid, mark: the client's own logo; palette: the client's orange on its
     warm white (start.mjs brand), type bricolage (Fraunces dealt first clashes with the heavy geometric wordmark)
     moments: pinned-chapters in #how (the three steps of an order)
     restyle (2026-11-23): palette white-navy-tab dealt for a shop, built from the client's own orange through
     start.mjs brand (bg #ffffff, ink navy #1f2b4d, accent #ff6b00, surface #fff1e6): navy is the orange's complement,
     so the page runs orange, white and navy; type mona (Mona Sans; Instrument Serif dealt first: its calm editorial
     voice works against the lively brief and the heavy wordmark); rhythm brand-band: white, white, white (#how, its frame peach), orange (#about),
     then the navy footer (footer-dark, dealt from the product list); the header carries the old home menu again (categories, subcategories, products on hover) -->
<?php
include __DIR__ . '/includes/topbar.php';
include __DIR__ . '/includes/navbar.php';

$cat_links = $mega_menu ?? [];   // the category list navbar.php read from the database
?>

  <!-- HERO: the range on the stage (hero_banners), the head row above it -->
  <section class="hero hero--product" data-enter aria-labelledby="hero-h">
    <div class="wrap"><div class="hero-text hero__in">
      <div class="hero__head">
        <div>
          <h1 id="hero-h">Corporate giveaways with <span class="ck-hl">your logo</span></h1>
          <p class="hero__lead">Jackets, tumblers, bags, gadgets and gift sets with your logo printed, engraved or embroidered. We send a quote within 24 hours of your request.</p>
        </div>
        <div class="btn-row">
          <a class="btn btn--primary" href="<?= BASE_URL ?>/#contact-heading" onclick="openModal('quote-modal'); return false;">Request a quote</a>
          <a class="btn btn--secondary" href="<?= BASE_URL ?>/category-page.php">See the catalogue</a>
        </div>
      </div>
      <div class="hero__stage ck-range">
        <?php foreach ($hero_banners as $i => $hb):
          $hb_url = $hb['product_slug']
              ? product_url($hb['cat_slug'], $hb['subcat_slug'], $hb['product_slug'], (int)$hb['variant_count'])
              : '/category-page.php'; ?>
          <a class="ck-range__item" href="<?= e(url($hb_url)) ?>">
            <img class="is-cutout" src="<?= e(url($hb['image'])) ?>" alt="<?= e(ucwords(strtolower($hb['title']))) ?>" width="900" height="800"<?= $i === 0 ? ' fetchpriority="high"' : '' ?>>
          </a>
        <?php endforeach; ?>
      </div>
    </div></div>
  </section>

  <!-- BEST SELLERS: featured products (products.is_featured), the categories above them -->
  <section class="section" id="products" aria-labelledby="products-heading">
    <div class="wrap">
      <div class="section-head section-head--row">
        <div>
          <h2 id="products-heading">Best sellers, priced per piece</h2>
        </div>
        <a class="link" href="<?= BASE_URL ?>/category-page.php">See all products</a>
      </div>
      <nav class="ck-chips" aria-label="Categories">
        <?php foreach ($cat_links as $cat_slug => $cat): ?>
          <a class="ck-chip" href="<?= BASE_URL ?>/category-page.php?cat=<?= urlencode($cat_slug) ?>"><?= e($cat['name']) ?></a>
        <?php endforeach; ?>
      </nav>
      <div class="grid ck-cards">
        <?php foreach ($featured_products as $prod):
          $prod_url = product_url($prod['cat_slug'], $prod['subcat_slug'], $prod['slug'], (int)$prod['variant_count']); ?>
          <a class="card ck-card product-card span-3" href="<?= e(url($prod_url)) ?>" data-product-id="<?= (int)$prod['id'] ?>">
            <div class="ck-card__img"><img src="<?= e(url($prod['image'] ?: '/assets/images/placeholder.png')) ?>" alt="<?= e($prod['name']) ?>" width="600" height="600" loading="lazy"></div>
            <p class="product-card-title"><?= e($prod['name']) ?></p>
            <p class="product-card-price"><?= ((float)$prod['price_min'] > 0) ? 'From ₱' . number_format((float)$prod['price_min'], 2) . ' each' : 'Price on request' ?></p>
          </a>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <!-- HOW AN ORDER WORKS: pinned-chapters, three steps, one picture each -->
  <section class="section" id="how" style="--h: 2" data-moment="pinned-chapters" aria-labelledby="how-h">
    <div class="wrap mo-pc__grid">
      <div class="mo-pc__text">
        <h2 id="how-h">How an order works</h2>
        <ol class="mo-pc__steps">
          <li class="mo-pc__step">
            <h3>Choose the item and the quantity</h3>
            <p>Pick from the catalogue and tell us how many pieces you need. Orders start at 50 pieces.</p>
            <figure class="mo-pc__visual mo-pc__visual--lit"><img src="<?= BASE_URL ?>/assets/images/mobile-stand.png" alt="Two phone stands, one printed with a logo" width="510" height="510" loading="lazy"></figure>
          </li>
          <li class="mo-pc__step">
            <h3>Choose how your logo goes on</h3>
            <p>Logo printing, laser engraving, embroidery or sublimation, depending on the item. We can pack each piece in a custom box.</p>
            <figure class="mo-pc__visual mo-pc__visual--lit"><img src="<?= BASE_URL ?>/assets/images/items/desk-organizers.png" alt="A bamboo desk organiser engraved with a logo" width="730" height="636" loading="lazy"></figure>
          </li>
          <li class="mo-pc__step">
            <h3>Approve the quote, then we produce</h3>
            <p>We send the price for your quantity. Rush orders are possible: tell us the date you need them by.</p>
            <figure class="mo-pc__visual mo-pc__visual--lit"><img src="<?= BASE_URL ?>/assets/images/car-organizers.jpeg" alt="A car boot organiser with its compartments filled, in an open boot" width="690" height="644" loading="lazy"></figure>
          </li>
        </ol>
      </div>
      <div class="mo-pc__visuals frame"></div>
    </div>
  </section>

  <!-- ABOUT: the brand band (orange); the text left, four more of the range right -->
  <section class="section ground-brand" id="about" aria-labelledby="corporate-heading">
    <div class="wrap grid grid--top">
      <div class="span-5 stack-5">
        <h2 id="corporate-heading">About CreativeKit 3A</h2>
        <p class="t-lead">CreativeKit 3A makes customised giveaways for companies: wristbands, promotional items and branded accessories for clients, employees and events.</p>
        <ul class="rows ck-facts">
          <li><span class="rows__name">Office</span><span class="rows__value">Gagalangin, Tondo, Manila</span></li>
          <li><span class="rows__name">Payment</span><span class="rows__value">Card, PayPal, BPI, GCash, Maya</span></li>
          <li><span class="rows__name">Orders</span><span class="rows__value">By quote, for your item and logo</span></li>
        </ul>
        <a class="link" href="https://www.facebook.com/profile.php?id=100063787431490" target="_blank" rel="noopener">See our work on Facebook</a>
      </div>
      <div class="span-6 start-7 ck-quad">
        <img src="<?= BASE_URL ?>/assets/images/dash-cam.png" alt="A dash cam printed with a company logo" width="376" height="360" loading="lazy">
        <img src="<?= BASE_URL ?>/assets/images/audio-accessories.png" alt="A cream Bluetooth speaker on a cord" width="440" height="430" loading="lazy">
        <img src="<?= BASE_URL ?>/assets/images/car-tool.png" alt="A car safety hammer with a printed logo" width="236" height="360" loading="lazy">
        <img src="<?= BASE_URL ?>/assets/images/usb-hub.png" alt="Three USB hubs printed with logos" width="700" height="700" loading="lazy">
      </div>
    </div>
  </section>

<?php include __DIR__ . '/includes/footer.php'; ?>
