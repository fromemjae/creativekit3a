<?php
/**
 * includes/footer.php — Site footer, Sign In / Register modals, quote modal,
 * and script loader (CreativeKit3A Main UI). Always the LAST include in <body>.
 *
 * Optional variable:
 *   $extra_js (array) — page-specific scripts, loaded after the shared ones
 */
$extra_js = $extra_js ?? [];

// Where the auth modals send the user back to (current page, same site only)
$return_to = $_SERVER['REQUEST_URI'] ?? (BASE_URL . '/');

// Errors / old input from a failed modal sign-in or registration (set by auth/*.php)
$login_errors    = $_SESSION['login_errors']    ?? [];
$login_email     = $_SESSION['login_email']     ?? '';
$register_errors = $_SESSION['register_errors'] ?? [];
$register_old    = $_SESSION['register_old']    ?? [];
unset($_SESSION['login_errors'], $_SESSION['login_email'], $_SESSION['register_errors'], $_SESSION['register_old']);

// Storefront pages don't render flash alerts themselves → show them as a toast
$footer_flash = function_exists('get_flash') ? get_flash() : null;
?>
<!-- ============================================================
     SITE FOOTER — footer.closing: row 1 the close (Request a quote), row 2 the directory and the legal row
     ============================================================ -->
<?php $footer_cats = $mega_menu ?? []; ?>
</main>
<footer class="footer footer--dark ground-inverse closing" id="contact" aria-labelledby="contact-heading">
  <div class="wrap">
    <div class="closing__cta close--word">
      <div class="section-head section-head--row">
        <div>
          <h2 id="contact-heading">Request a quote for your next order</h2>
          <p>Send the item, the quantity and the date you need it by, and we send a quote within 24 hours.</p>
        </div>
        <a class="btn btn--primary btn--xl" href="mailto:salesandmarketing@creativekit3a.com" onclick="openModal('quote-modal'); return false;">Request a quote<svg class="m-arrow" viewBox="0 0 12 12" aria-hidden="true"><path class="m-arrow__stem" d="M1 6h8"/><path class="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5"/></svg></a>
      </div>
      <ul class="ck-direct grid" aria-label="Call or email us">
        <li class="span-3"><span class="t-label muted">Mobile</span><a href="tel:+639177142774">+63 917 714 2774</a></li>
        <li class="span-3"><span class="t-label muted">Phone</span><a href="tel:+639339927410">+63 933 992 7410</a></li>
        <li class="span-6 start-7"><span class="t-label muted">Email</span><a href="mailto:salesandmarketing@creativekit3a.com">salesandmarketing@creativekit3a.com</a></li>
      </ul>
    </div>

    <div class="closing__links">
      <div class="grid">
        <div class="span-4 stack-4">
          <a class="nav__logo ck-logo" href="<?= BASE_URL ?>/" aria-label="CreativeKit3A home">
            <img src="<?= BASE_URL ?>/assets/images/logo.png" alt="" width="28" height="28" loading="lazy">
            <span class="ck-logo__name">CreativeKit3A</span>
          </a>
          <p class="footer__lede">Corporate giveaways with your logo.</p>
        </div>
        <div class="span-4 footer__col">
          <h3>Catalogue</h3>
          <ul class="ck-two-col">
            <?php foreach ($footer_cats as $cat_slug => $cat): ?>
              <li><a href="<?= BASE_URL ?>/category-page.php?cat=<?= urlencode($cat_slug) ?>"><?= htmlspecialchars($cat['name']) ?></a></li>
            <?php endforeach; ?>
          </ul>
        </div>
        <div class="span-2 footer__col">
          <h3>Company</h3>
          <ul>
            <li><a href="<?= BASE_URL ?>/#how">How it works</a></li>
            <li><a href="<?= BASE_URL ?>/#corporate-heading">About</a></li>
            <li><a href="<?= BASE_URL ?>/#contact-heading">Contact</a></li>
            <li><a href="https://www.facebook.com/profile.php?id=100063787431490" target="_blank" rel="noopener">Facebook</a></li>
          </ul>
        </div>
        <div class="span-2 footer__col">
          <h3>Visit</h3>
          <p class="ck-address">2779B R. Fernandez St. corner Benita St., Gagalangin, Tondo, Manila, Philippines, 1013</p>
        </div>
      </div>
      <div class="footer__legal">
        <span>&copy; Copyright <?= date('Y') ?>. CreativeKit3A.shop All Rights Reserved. &nbsp; VAT registered company</span>
        <div class="footer-payments" aria-label="Accepted payment methods">
          <img src="<?= BASE_URL ?>/assets/images/payments/mastercard.png" alt="Mastercard" width="40" height="24" loading="lazy">
          <img src="<?= BASE_URL ?>/assets/images/payments/visa.png" alt="Visa" width="40" height="24" loading="lazy">
          <img src="<?= BASE_URL ?>/assets/images/payments/paypal.png" alt="PayPal" width="40" height="24" loading="lazy">
          <img src="<?= BASE_URL ?>/assets/images/payments/bpi.png" alt="BPI" width="40" height="24" loading="lazy">
          <img src="<?= BASE_URL ?>/assets/images/payments/gcash.png" alt="GCash" width="40" height="24" loading="lazy">
          <img src="<?= BASE_URL ?>/assets/images/payments/maya.png" alt="Maya" width="40" height="24" loading="lazy">
        </div>
      </div>
    </div>
  </div>
</footer>

<!-- ============================================================
     AUTH MODALS — Sign In & Register (POST to auth/login.php / auth/register.php)
     ============================================================ -->
<div class="lm-overlay" id="lm-overlay" onclick="closeAllModals()" aria-hidden="true"></div>

<!-- ── LOGIN MODAL ──────────────────────────────────────────── -->
<div class="lm-modal" id="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
  <div class="lm-card">
    <button class="lm-close" onclick="closeModal('login-modal')" aria-label="Close">&times;</button>

    <div class="lm-header">
      <span class="lm-brand" id="login-title">CreativeKit3A</span>
      <p class="lm-tagline">Sign in to your account</p>
    </div>

    <div class="lm-tabs" role="tablist">
      <button class="lm-tab active" id="tab-login" role="tab" aria-selected="true" type="button">Sign In</button>
      <button class="lm-tab" id="tab-register" role="tab" aria-selected="false" type="button"
              onclick="closeModal('login-modal'); openModal('register-modal');">Register</button>
    </div>

    <form class="lm-panel" id="panel-login" role="tabpanel" method="post" action="<?= BASE_URL ?>/auth/login.php">
      <input type="hidden" name="from_modal" value="1">
      <input type="hidden" name="return_to" value="<?= htmlspecialchars($return_to) ?>">

      <div class="lm-field">
        <label for="lm-login-email"><i class="fas fa-envelope"></i> Email Address</label>
        <input type="email" id="lm-login-email" name="email" placeholder="you@email.com"
               autocomplete="email" value="<?= htmlspecialchars($login_email) ?>" required>
      </div>

      <div class="lm-field">
        <label for="lm-login-password"><i class="fas fa-lock"></i> Password</label>
        <div class="lm-pw-wrap">
          <input type="password" id="lm-login-password" name="password" placeholder="••••••••"
                 autocomplete="current-password" required>
          <button type="button" class="lm-pw-toggle"
                  onclick="togglePw('lm-login-password', this)" aria-label="Show password">
            <i class="fas fa-eye"></i>
          </button>
        </div>
      </div>

      <div class="lm-extras">
        <label class="lm-remember"><input type="checkbox" id="lm-remember" name="remember"> Remember me</label>
        <a href="mailto:salesandmarketing@creativekit3a.com?subject=Password%20reset" class="lm-forgot">Forgot password?</a>
      </div>

      <div class="lm-msg lm-msg--error" id="lm-login-error" <?= $login_errors ? '' : 'hidden' ?>><?= htmlspecialchars(implode(' ', $login_errors)) ?></div>

      <button type="submit" class="btn btn-primary lm-submit" id="lm-login-btn">
        <i class="fas fa-sign-in-alt"></i> Sign In
      </button>

      <p class="lm-switch">
        Don't have an account?
        <a href="#register-modal" onclick="closeModal('login-modal'); openModal('register-modal'); return false;">Register here</a>
      </p>
    </form>
  </div>
</div>

<!-- ── REGISTER MODAL ───────────────────────────────────────── -->
<div class="lm-modal" id="register-modal" role="dialog" aria-modal="true" aria-labelledby="register-title">
  <div class="lm-card">
    <button class="lm-close" onclick="closeModal('register-modal')" aria-label="Close">&times;</button>

    <div class="lm-header">
      <span class="lm-brand" id="register-title">CreativeKit3A</span>
      <p class="lm-tagline">Create your account</p>
    </div>

    <form class="lm-panel" id="panel-register" role="tabpanel" method="post" action="<?= BASE_URL ?>/auth/register.php">
      <input type="hidden" name="return_to" value="<?= htmlspecialchars($return_to) ?>">

      <div class="lm-field-row">
        <div class="lm-field">
          <label for="lm-reg-firstname"><i class="fas fa-user"></i> First Name</label>
          <input type="text" id="lm-reg-firstname" name="first_name" placeholder="Juan"
                 autocomplete="given-name" value="<?= htmlspecialchars($register_old['first_name'] ?? '') ?>" required>
        </div>
        <div class="lm-field">
          <label for="lm-reg-lastname"><i class="fas fa-user"></i> Last Name</label>
          <input type="text" id="lm-reg-lastname" name="last_name" placeholder="Dela Cruz"
                 autocomplete="family-name" value="<?= htmlspecialchars($register_old['last_name'] ?? '') ?>" required>
        </div>
      </div>

      <div class="lm-field">
        <label for="lm-reg-email"><i class="fas fa-envelope"></i> Email Address</label>
        <input type="email" id="lm-reg-email" name="email" placeholder="you@email.com"
               autocomplete="email" value="<?= htmlspecialchars($register_old['email'] ?? '') ?>" required>
      </div>

      <div class="lm-field">
        <label for="lm-reg-phone">
          <i class="fas fa-mobile-alt"></i> Mobile
          <span class="lm-optional">(optional)</span>
        </label>
        <input type="tel" id="lm-reg-phone" name="phone" placeholder="+63 917 000 0000" autocomplete="tel"
               value="<?= htmlspecialchars($register_old['phone'] ?? '') ?>">
      </div>

      <div class="lm-field">
        <label for="lm-reg-password"><i class="fas fa-lock"></i> Password</label>
        <div class="lm-pw-wrap">
          <input type="password" id="lm-reg-password" name="password" placeholder="At least 8 characters"
                 autocomplete="new-password" minlength="8" required>
          <button type="button" class="lm-pw-toggle"
                  onclick="togglePw('lm-reg-password', this)" aria-label="Show password">
            <i class="fas fa-eye"></i>
          </button>
        </div>
        <div class="lm-strength-bar"><div class="lm-strength-fill" id="lm-strength-fill"></div></div>
        <span class="lm-strength-label" id="lm-strength-label"></span>
      </div>

      <div class="lm-field">
        <label for="lm-reg-confirm"><i class="fas fa-lock"></i> Confirm Password</label>
        <div class="lm-pw-wrap">
          <input type="password" id="lm-reg-confirm" name="password_confirm" placeholder="Repeat your password"
                 autocomplete="new-password" minlength="8" required>
          <button type="button" class="lm-pw-toggle"
                  onclick="togglePw('lm-reg-confirm', this)" aria-label="Show password">
            <i class="fas fa-eye"></i>
          </button>
        </div>
      </div>

      <div class="lm-terms">
        <label>
          <input type="checkbox" id="lm-reg-terms" name="terms" value="1" required>
          I agree to the <a href="<?= BASE_URL ?>/#corporate-heading">Terms &amp; Conditions</a>
        </label>
      </div>

      <div class="lm-msg lm-msg--error"  id="lm-reg-error" <?= $register_errors ? '' : 'hidden' ?>><?= htmlspecialchars(implode(' ', $register_errors)) ?></div>
      <div class="lm-msg lm-msg--success" id="lm-reg-success" hidden></div>

      <button type="submit" class="btn btn-primary lm-submit" id="lm-reg-btn">
        <i class="fas fa-user-plus"></i> Create Account
      </button>

      <p class="lm-switch">
        Already have an account?
        <a href="#login-modal" onclick="closeModal('register-modal'); openModal('login-modal'); return false;">Sign in here</a>
      </p>
    </form>
  </div>
</div>

<!-- Reusable Request a Quote Modal Partial -->
<?php include __DIR__ . '/quote-modal.php'; ?>

<!-- Shared JavaScript: modal controller, sidenav, sticky nav, search, image fallback, auth modals -->
<script src="<?= htmlspecialchars(asset('/assets/js/global.js')) ?>"></script>
<script src="<?= htmlspecialchars(asset('/assets/js/quote-modal.js')) ?>"></script>
<!-- the design system: nav sheet, moments (system.js), hovers and presses (motion.js), the hero (layout.js) -->
<script type="module" src="<?= htmlspecialchars(asset('/assets/kit/system.js')) ?>"></script>
<script type="module" src="<?= htmlspecialchars(asset('/assets/kit/motion/motion.js')) ?>"></script>
<script type="module" src="<?= htmlspecialchars(asset('/assets/kit/layout/layout.js')) ?>"></script>

<?php if ($login_errors || $register_errors || $footer_flash): ?>
<script>
  document.addEventListener('DOMContentLoaded', function () {
    <?php if ($login_errors): ?>openModal('login-modal');<?php endif; ?>
    <?php if ($register_errors): ?>openModal('register-modal');<?php endif; ?>
    <?php if ($footer_flash): ?>showToast(<?= json_encode($footer_flash['message']) ?>, <?= json_encode($footer_flash['type']) ?>);<?php endif; ?>
  });
</script>
<?php endif; ?>

<!-- Dedicated Per-Page JavaScript Files -->
<?php foreach ($extra_js as $js): ?>
  <script src="<?= htmlspecialchars(asset($js)) ?>"></script>
<?php endforeach; ?>

</body>
</html>
