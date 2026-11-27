<?php
/**
 * includes/quote-modal.php
 * ─────────────────────────────────────────────────────────────
 * Request a Quote multi-step modal component.
 * Included inside includes/footer.php.
 *
 * The category and product dropdowns are filled from the single
 * creativekit3a_db database (categories + products tables) through
 * config/db.php — nothing is hardcoded. The selected product's id is
 * submitted so quote_requests.product_id links to products.id.
 * ─────────────────────────────────────────────────────────────
 */
$qm_groups   = [];   // main category name => [ [id, name], ... ] subcategories
$qm_products = [];   // [ { id, name, cat } ] active products (cat = subcategory id)
$qm_pdo = function_exists('get_db') ? get_db() : null;
if ($qm_pdo) {
    try {
        $rows = $qm_pdo->query(
            "SELECT sc.id, sc.name, mc.name AS parent_name
             FROM categories AS sc
             INNER JOIN categories AS mc ON sc.parent_id = mc.id
             WHERE sc.is_active = 1 AND mc.is_active = 1
             ORDER BY mc.sort_order ASC, sc.sort_order ASC"
        )->fetchAll();
        foreach ($rows as $r) {
            $qm_groups[$r['parent_name']][] = ['id' => (int)$r['id'], 'name' => $r['name']];
        }
        $qm_products = $qm_pdo->query(
            "SELECT p.id, p.name, p.category_id AS cat
             FROM products AS p
             WHERE p.status = 'active'
             ORDER BY p.name ASC"
        )->fetchAll();
    } catch (PDOException $e) {
        $qm_groups = [];
        $qm_products = [];
    }
}
?>
<!-- ============================================================
     REQUEST A QUOTE MODAL  (#quote-modal)
     ============================================================
     HOW TO USE:
       1. Paste this block anywhere before </body> (alongside your
          existing login/register modals).
       2. Add quote-modal.css to your <head>.
       3. Add quote-modal.js before </body> (after main.js).
       4. The "Request a Quote" button in navbar already has class
          .btn-chat — just add onclick="openModal('quote-modal')"
          to it (see the btn-chat snippet below).

     NAVBAR BUTTON CHANGE (in index.html / category-page.html):
       BEFORE:
         <button class="btn-chat" aria-label="Request a Quote">Request a Quote</button>
       AFTER:
         <button class="btn-chat" onclick="openModal('quote-modal')" aria-label="Request a Quote">Request a Quote</button>

     Backend endpoint expected:
       POST /api/quote
       Body: { name, company, email, phone, product_type, quantity, budget, deadline, details }
       Response: { success: true } | { success: false, message: '...' }
     ============================================================ -->

<div class="lm-modal qm-modal" id="quote-modal" role="dialog" aria-modal="true" aria-labelledby="quote-modal-title">
  <div class="lm-card qm-card">

    <!-- Close button -->
    <button class="lm-close" onclick="closeModal('quote-modal')" aria-label="Close">&times;</button>

    <!-- ── Header ─────────────────────────────────────────── -->
    <div class="lm-header qm-header">
      <span class="lm-brand">CreativeKit3A</span>
      <p id="quote-modal-title" class="qm-title">Request a Quote</p>
      <p class="lm-tagline">Tell us what you need — we'll get back within 24 hours.</p>
    </div>

    <?php if (function_exists('setting_on') && setting_on('maintenance_mode') && !in_array($_SESSION['user_role'] ?? '', ['admin', 'staff'], true)): ?>
    <!-- Maintenance mode (system setting): the desk takes no new requests until it is switched off -->
    <p class="qm-maintenance" role="status"><i class="fas fa-screwdriver-wrench" aria-hidden="true"></i> <?= htmlspecialchars(setting('maintenance_message')) ?></p>
    <?php endif; ?>

    <!-- ── Step indicator ─────────────────────────────────── -->
    <div class="qm-steps" aria-label="Form progress">
      <div class="qm-step active" id="qm-step-dot-1">
        <div class="qm-step-dot">1</div>
        <span>Your Info</span>
      </div>
      <div class="qm-step-line"></div>
      <div class="qm-step" id="qm-step-dot-2">
        <div class="qm-step-dot">2</div>
        <span>Product</span>
      </div>
      <div class="qm-step-line"></div>
      <div class="qm-step" id="qm-step-dot-3">
        <div class="qm-step-dot">3</div>
        <span>Details</span>
      </div>
    </div>

    <!-- ── STEP 1: Contact Info ────────────────────────────── -->
    <div class="lm-panel qm-panel" id="qm-panel-1">

      <div class="lm-field-row">
        <div class="lm-field">
          <label for="qm-name"><i class="fas fa-user"></i> Full Name <span class="qm-req">*</span></label>
          <input type="text" id="qm-name" placeholder="Juan Dela Cruz" autocomplete="name" required>
        </div>
        <div class="lm-field">
          <label for="qm-company"><i class="fas fa-building"></i> Company <span class="lm-optional">(optional)</span></label>
          <input type="text" id="qm-company" placeholder="ABC Corporation" autocomplete="organization">
        </div>
      </div>

      <div class="lm-field">
        <label for="qm-email"><i class="fas fa-envelope"></i> Email Address <span class="qm-req">*</span></label>
        <input type="email" id="qm-email" placeholder="you@company.com" autocomplete="email" required>
      </div>

      <div class="lm-field">
        <label for="qm-phone"><i class="fas fa-mobile-alt"></i> Mobile Number <span class="qm-req">*</span></label>
        <input type="tel" id="qm-phone" placeholder="+63 917 000 0000" autocomplete="tel" required>
      </div>

      <div class="lm-msg lm-msg--error" id="qm-err-1" hidden></div>

      <button class="btn btn-primary lm-submit" onclick="qmNextStep(1)">
        Next: Product Info <i class="fas fa-arrow-right"></i>
      </button>

    </div>

    <!-- ── STEP 2: Product Info ────────────────────────────── -->
    <div class="lm-panel qm-panel" id="qm-panel-2" hidden>

      <div class="lm-field">
        <label for="qm-product-type"><i class="fas fa-tag"></i> Product Category <span class="qm-req">*</span></label>
        <select id="qm-product-type" class="qm-select" required>
          <option value="" disabled selected>— Select a category —</option>
          <?php foreach ($qm_groups as $group => $subs): ?>
            <optgroup label="<?= htmlspecialchars($group) ?>">
              <?php foreach ($subs as $sub): ?>
                <option value="<?= htmlspecialchars($sub['name']) ?>" data-cat-id="<?= (int)$sub['id'] ?>"><?= htmlspecialchars($sub['name']) ?></option>
              <?php endforeach; ?>
            </optgroup>
          <?php endforeach; ?>
          <option value="Other / Not Listed">Other / Not Listed</option>
        </select>
      </div>

      <!-- Backend hook: product id set by openQuoteFor() so the quote links to products.id -->
      <input type="hidden" id="qm-product" value="">
      <script>
        window.QM_PRODUCTS = <?= json_encode($qm_products, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;
      </script>

      <div class="lm-field-row">
        <div class="lm-field">
          <label for="qm-quantity"><i class="fas fa-boxes"></i> Quantity <span class="qm-req">*</span></label>
          <select id="qm-quantity" class="qm-select" required>
            <option value="" disabled selected>— Select —</option>
            <?php
              // ranges below the minimum order (system setting quote_min_qty) are left out
              $qm_min = function_exists('setting') ? max(1, (int)setting('quote_min_qty')) : 50;
              foreach ([['50-99', '50 – 99 pcs', 99], ['100-299', '100 – 299 pcs', 299], ['300-499', '300 – 499 pcs', 499], ['500-999', '500 – 999 pcs', 999], ['1000+', '1,000+ pcs', PHP_INT_MAX]] as [$qv, $ql, $qmax]):
                if ($qmax < $qm_min) continue; ?>
            <option value="<?= $qv ?>"><?= $ql ?></option>
            <?php endforeach; ?>
          </select>
        </div>
        <div class="lm-field">
          <label for="qm-budget"><i class="fas fa-peso-sign"></i> Budget Range <span class="lm-optional">(optional)</span></label>
          <select id="qm-budget" class="qm-select">
            <option value="" disabled selected>— Select —</option>
            <option value="under-5k">Under ₱5,000</option>
            <option value="5k-15k">₱5,000 – ₱15,000</option>
            <option value="15k-50k">₱15,000 – ₱50,000</option>
            <option value="50k-100k">₱50,000 – ₱100,000</option>
            <option value="100k+">₱100,000+</option>
          </select>
        </div>
      </div>

      <div class="lm-field">
        <label for="qm-deadline"><i class="fas fa-calendar-alt"></i> Needed By <span class="lm-optional">(optional)</span></label>
        <input type="date" id="qm-deadline" class="qm-date"
               min="<?php echo date('Y-m-d', strtotime('+3 days')); ?>">
        <!-- If using plain HTML (no PHP), set min via JS in quote-modal.js -->
      </div>

      <div class="lm-msg lm-msg--error" id="qm-err-2" hidden></div>

      <div class="qm-btn-row">
        <button class="btn btn-outline qm-back-btn" onclick="qmPrevStep(2)">
          <i class="fas fa-arrow-left"></i> Back
        </button>
        <button class="btn btn-primary lm-submit qm-next-btn" onclick="qmNextStep(2)">
          Next: Details <i class="fas fa-arrow-right"></i>
        </button>
      </div>

    </div>

    <!-- ── STEP 3: Details & Submit ────────────────────────── -->
    <div class="lm-panel qm-panel" id="qm-panel-3" hidden>

      <div class="lm-field">
        <label for="qm-details">
          <i class="fas fa-pen-to-square"></i> Tell Us More
          <span class="lm-optional">(optional)</span>
        </label>
        <textarea id="qm-details" class="qm-textarea" rows="4"
                  placeholder="Describe your customization needs, logo placement, color preferences, event date, or anything else we should know..."></textarea>
      </div>

      <!-- Customization options checkboxes -->
      <div class="lm-field">
        <label><i class="fas fa-paint-brush"></i> Customization Needed</label>
        <div class="qm-checkboxes">
          <label class="qm-check-item"><input type="checkbox" name="qm-custom" value="logo-print"> Logo Printing</label>
          <label class="qm-check-item"><input type="checkbox" name="qm-custom" value="laser-engrave"> Laser Engraving</label>
          <label class="qm-check-item"><input type="checkbox" name="qm-custom" value="embroidery"> Embroidery</label>
          <label class="qm-check-item"><input type="checkbox" name="qm-custom" value="sublimation"> Sublimation</label>
          <label class="qm-check-item"><input type="checkbox" name="qm-custom" value="packaging"> Custom Packaging</label>
          <label class="qm-check-item"><input type="checkbox" name="qm-custom" value="not-sure"> Not Sure Yet</label>
        </div>
      </div>

      <!-- How did you hear about us -->
      <div class="lm-field">
        <label for="qm-source">
          <i class="fas fa-map-marker-alt"></i> How did you find us?
          <span class="lm-optional">(optional)</span>
        </label>
        <select id="qm-source" class="qm-select">
          <option value="" disabled selected>— Select —</option>
          <option value="facebook">Facebook</option>
          <option value="google">Google Search</option>
          <option value="referral">Referral / Word of Mouth</option>
          <option value="instagram">Instagram</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div class="lm-msg lm-msg--error"   id="qm-err-3"     hidden></div>
      <div class="lm-msg lm-msg--success" id="qm-success"   hidden></div>

      <div class="qm-btn-row">
        <button class="btn btn-outline qm-back-btn" id="qm-back-btn-3" onclick="qmPrevStep(3)">
          <i class="fas fa-arrow-left"></i> Back
        </button>
        <button class="btn btn-primary lm-submit qm-next-btn" id="qm-submit-btn" onclick="submitQuote()">
          <i class="fas fa-paper-plane"></i> Send Quote Request
        </button>
      </div>

    </div>

    <!-- ── SUCCESS STATE ───────────────────────────────────── -->
    <div class="qm-panel qm-success-panel" id="qm-panel-success" hidden>
      <div class="qm-success-icon">
        <i class="fas fa-circle-check"></i>
      </div>
      <h3 class="qm-success-title">Quote Request Sent!</h3>
      <p class="qm-success-msg">
        Thank you! We've received your request and will send a detailed quote to
        <strong id="qm-confirm-email"></strong> within <strong>24 hours</strong>.
      </p>
      <p class="qm-success-contact">
        Need it faster? Call us at
        <a href="tel:+639177142774">+63 917 714 2774</a> or
        <a href="tel:+639339927410">+63 933 992 7410</a>
      </p>
      <button class="btn btn-primary lm-submit" onclick="closeModal('quote-modal')">
        <i class="fas fa-check"></i> Done
      </button>
    </div>

  </div><!-- /.lm-card -->
</div><!-- /#quote-modal -->