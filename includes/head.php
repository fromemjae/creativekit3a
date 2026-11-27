<?php
/**
 * includes/head.php — Shared <head> partial
 *
 * Two looks share this partial:
 *   - the storefront (index, category, product, staff login): the CreativeKit3A design system in
 *     /assets/kit (system.css, cards, motion, layout) + /assets/css/storefront.css + per-page CSS;
 *   - the staff portal (pages/*.php except login): the original global.css + style.css, unchanged.
 */

require_once __DIR__ . '/../config/app.php';   // BASE_URL + url() helper

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$title     = $title     ?? $page_title ?? 'CreativeKit3A | Corporate Giveaways Philippines';
$meta_desc = $meta_desc ?? 'Corporate giveaways printed, engraved or embroidered with your logo, from 50 pieces. CreativeKit3A, Tondo, Manila.';
$extra_css = $extra_css ?? [];

// Staff portal pages keep the old stylesheet; everything else is the storefront.
$script_path   = str_replace('\\', '/', $_SERVER['SCRIPT_NAME'] ?? '');
$is_storefront = $is_storefront ?? !(str_contains($script_path, '/pages/') && basename($script_path) !== 'login.php');
?>
<!DOCTYPE html>
<?php if ($is_storefront): ?>
<html lang="en" data-type="product" data-radius="soft" data-buttons="solid" data-motion>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title><?= htmlspecialchars($title) ?></title>
  <meta name="description" content="<?= htmlspecialchars($meta_desc) ?>">
  <meta property="og:type" content="website">
  <meta property="og:title" content="<?= htmlspecialchars($title) ?>">
  <meta property="og:description" content="<?= htmlspecialchars($meta_desc) ?>">
  <meta property="og:image" content="<?= htmlspecialchars(url('/share.jpg')) ?>">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="<?= htmlspecialchars(url('/assets/images/logo.png')) ?>" type="image/png">
  <meta name="theme-color" content="#ffffff">
  <!-- <link rel="canonical" href="https://creativekit3a.shop/"> once the live domain is confirmed -->
  <meta name="site-kind" content="other">
  <meta name="page-type" content="product">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Mona+Sans:wdth,wght@75..125,400..700&family=Poppins:wght@900&display=swap" rel="stylesheet">
  <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        crossorigin="anonymous" referrerpolicy="no-referrer">

  <link rel="stylesheet" href="<?= htmlspecialchars(asset('/assets/kit/system.css')) ?>">
  <link rel="stylesheet" href="<?= htmlspecialchars(asset('/assets/kit/ui/cards.css')) ?>">
  <link rel="stylesheet" href="<?= htmlspecialchars(asset('/assets/kit/motion/motion.css')) ?>">
  <link rel="stylesheet" href="<?= htmlspecialchars(asset('/assets/kit/layout/layout.css')) ?>">
  <style>
  :root {
    --p-bg: #ffffff; --p-surface: #fff1e6; --p-ink: #1f2b4d; --p-muted: #5f6984;
    --p-accent: #ff6b00; --p-accent-ink: #111111; --p-action: #ff6b00; --p-action-ink: #111111;
    --p-inv-bg: #1f2b4d; --p-inv-surface: #2c3859; --p-inv-ink: #ffffff; --p-inv-muted: #a2a8b8;
    --p-inv-accent: #ff6b00; --p-inv-accent-ink: #111111; --p-inv-action: #ff6b00; --p-inv-action-ink: #111111;
    --font-display: "Mona Sans", system-ui, sans-serif;
    --font-text: "Mona Sans", system-ui, sans-serif;
    --display-weight: 400;
    --display-tracking: -0.03em;
    --display-tracking-xl: -0.04em;
    --display-stretch: 104%;
    --ly-scale: 0.96;
  }
  </style>
  <link rel="stylesheet" href="<?= htmlspecialchars(asset('/assets/css/storefront.css')) ?>">
  <link rel="stylesheet" href="<?= htmlspecialchars(asset('/assets/css/quote-modal.css')) ?>">
  <?php foreach ($extra_css as $css): ?>
    <link rel="stylesheet" href="<?= htmlspecialchars(asset($css)) ?>">
  <?php endforeach; ?>

  <script>document.documentElement.classList.add('m-enter');setTimeout(()=>document.documentElement.classList.add('m-enter-done'),700)</script>
  <?php if (!empty($use_moment)): ?>
  <script>document.documentElement.classList.add('mo-js');setTimeout(()=>document.documentElement.classList.add('mo-safe'),2500)</script>
  <link rel="modulepreload" href="<?= htmlspecialchars(url('/assets/kit/moments/moments.js')) ?>">
  <link rel="modulepreload" href="<?= htmlspecialchars(url('/assets/kit/moments/lib.js')) ?>">
  <link rel="modulepreload" href="<?= htmlspecialchars(url('/assets/kit/moments/' . $use_moment . '/moment.js')) ?>">
  <?php endif; ?>
  <!-- Base path for JS-built URLs (site may live in a subfolder, e.g. /creativekit3a) -->
  <script>window.BASE_URL = <?= json_encode(BASE_URL) ?>;</script>
</head>
<?php else: ?>
<html lang="en"<?= !empty($console_head) ? ' data-type="service"' : '' ?>>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="<?= htmlspecialchars($meta_desc) ?>">
  <title><?= htmlspecialchars($title) ?></title>
  <?php if (!empty($console_head)): ?>
  <!-- the super admin console (pages/super-admin.php): staff-only, the storefront's Mona Sans -->
  <meta name="robots" content="noindex">
  <meta name="site-kind" content="other">
  <meta name="page-type" content="service">
  <meta property="og:title" content="<?= htmlspecialchars($title) ?>">
  <meta property="og:description" content="<?= htmlspecialchars($meta_desc) ?>">
  <meta property="og:image" content="<?= htmlspecialchars(url('/share.jpg')) ?>">
  <meta name="theme-color" content="#1f2b4d">
  <link rel="icon" href="<?= htmlspecialchars(url('/assets/images/logo.png')) ?>" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Mona+Sans:wdth,wght@75..125,400..700&display=swap" rel="stylesheet">
  <script>document.documentElement.classList.add('m-enter');setTimeout(()=>document.documentElement.classList.add('m-enter-done'),700)</script>
  <?php endif; ?>

  <!-- Google Fonts & Font Awesome 6 -->
  <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        crossorigin="anonymous" referrerpolicy="no-referrer">

  <!-- Shared base: admin utilities (alerts, badges, modals, tooltips) -->
  <link rel="stylesheet" href="<?= htmlspecialchars(asset('/assets/css/global.css')) ?>">
  <!-- CreativeKit3A Main UI: top bar, header, mega menu, hero, cards, footer, auth modals -->
  <link rel="stylesheet" href="<?= htmlspecialchars(asset('/assets/css/style.css')) ?>">
  <link rel="stylesheet" href="<?= htmlspecialchars(asset('/assets/css/quote-modal.css')) ?>">

  <!-- Dedicated Per-Page Stylesheet(s) -->
  <?php foreach ($extra_css as $css): ?>
    <link rel="stylesheet" href="<?= htmlspecialchars(asset($css)) ?>">
  <?php endforeach; ?>
  <!-- Base path for JS-built URLs (site may live in a subfolder, e.g. /creativekit3a) -->
  <script>window.BASE_URL = <?= json_encode(BASE_URL) ?>;</script>
</head>
<?php endif; ?>
