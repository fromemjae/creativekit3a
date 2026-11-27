<?php
/**
 * admin/index.php — Management Information, Inventory & Purchasing Portal
 * CreativeKit 3A Enterprise Management Portal
 * Supports both standalone browser execution and live MySQL database integration.
 *
 * Layout (restyle 2026-11): a navy side menu (the three systems, the tools, the signed-in admin) beside a white work area
 * whose top bar names the open system. Same tokens as the storefront: white, navy #1f2b4d, orange #ff6b00, Mona Sans.
 * Every id, data-tab and AdminApp handler is unchanged; admin-system.js still renders every table.
 */

require_once __DIR__ . '/../includes/db.php';
$pdo = get_db_connection();
$db_connected = ($pdo !== null);

// Fetch quick stats from MySQL if available
$db_metrics = null;
if ($db_connected) {
    try {
        $stmt = $pdo->query("SELECT * FROM v_mis_executive_kpi");
        $db_metrics = $stmt->fetch();
    } catch (\Throwable $e) {
        $db_metrics = null;
    }
}
?>
<!DOCTYPE html>
<html lang="en" data-type="service">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script>document.documentElement.classList.add('m-enter');setTimeout(()=>document.documentElement.classList.add('m-enter-done'),700)</script>
  <title>Management portal | CreativeKit3A</title>
  <meta name="description" content="CreativeKit3A staff portal: stock across three warehouses, purchase orders and suppliers, and the activity log.">
  <meta name="robots" content="noindex, nofollow">
  <meta name="theme-color" content="#1f2b4d">
  <meta name="page-type" content="service">
  <meta name="site-kind" content="other">
  <link rel="icon" href="../assets/images/logo.png">

  <!-- Mona Sans, the storefront's face -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mona+Sans:wdth,wght@75..125,400..700&family=Poppins:wght@900&display=swap">

  <!-- Font Awesome -->
  <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        crossorigin="anonymous" referrerpolicy="no-referrer">

  <!-- Admin System Stylesheet -->
  <link rel="stylesheet" href="../assets/css/admin-system.css">
</head>
<body class="admin-body">

  <!-- ============================================================
       SIGNED OUT: the sign-in page (header.nav and one screen). admin-system.js swaps it for the portal after sign-in;
       without a script it stays, and the portal (which needs the script) stays hidden.
       ============================================================ -->
  <header class="nav adm-pub-nav" id="adm-pub-nav">
    <div class="wrap adm-pub-nav__in">
      <a class="adm-skip" href="#gate-admin-email">Skip to the sign-in form</a>
      <a href="index.php" class="admin-brand">
        <span class="adm-logo"><img src="../assets/images/logo.png" alt="" width="28" height="28"></span>
        <span class="adm-brand-text">
          <span class="admin-brand-title">CreativeKit3A</span>
          <span class="admin-brand-badge">Management portal</span>
        </span>
      </a>
      <a class="adm-pub-nav__link" href="../index.php"><i class="fas fa-arrow-left" aria-hidden="true"></i> <span><span class="adm-pub-nav__long">Return to Public </span>Storefront</span></a>
    </div>
  </header>

  <main class="adm-pub-main" id="adm-pub-main">
    <section class="hero adm-signin" id="admin-auth-gate" data-enter>
      <div class="wrap"><div class="hero-text adm-signin__grid">
        <div class="adm-signin__text">
          <p class="adm-signin__eyebrow">Staff only</p>
          <h1 id="gate-title">Corporate giveaways management portal</h1>
          <p class="adm-signin__lead">Stock in 3 warehouses (Quezon City, Taguig and Cebu), purchase orders and the supplier directory. This management portal is restricted to authorized CreativeKit 3A administrators and procurement officers.</p>

          <form onsubmit="AdminApp.handleGateLogin(event)" class="adm-gate__form">
            <div class="form-group">
              <label for="gate-admin-email">Admin Email</label>
              <input type="email" id="gate-admin-email" placeholder="admin@creativekit3a.com" required autocomplete="username">
            </div>
            <div class="form-group">
              <label for="gate-admin-password">Admin Password</label>
              <input type="password" id="gate-admin-password" placeholder="••••••••" required autocomplete="current-password">
            </div>
            <div id="gate-error-msg" class="adm-gate__error" role="alert" style="display:none;"></div>
            <button type="submit" class="btn-admin btn-admin-primary adm-gate__submit">
              <i class="fas fa-right-to-bracket" aria-hidden="true"></i> Sign in to the portal
            </button>
          </form>
        </div>

        <div class="adm-signin__range">
          <img src="../assets/images/admin/tumbler-bamboo.png" alt="Bamboo tumbler with an engraved name" width="240" height="240">
          <img src="../assets/images/admin/jackets-corporate.png" alt="Three black corporate jackets with a printed logo" width="240" height="174">
          <img src="../assets/images/admin/laptop-backpack-md.png" alt="Blue laptop bag with a tan strap" width="360" height="315">
          <img src="../assets/images/admin/desk-organizers-md.png" alt="Bamboo desk organiser with a pen holder" width="360" height="297">
        </div>
      </div></div>
    </section>
  </main>

  <!-- SIGNED IN: the portal -->
  <div class="adm-shell" hidden>
    <script>try{if(localStorage.getItem('ck_admin_side_collapsed')==='1')document.currentScript.parentNode.classList.add('is-collapsed')}catch(e){}</script>
    <a class="adm-skip" href="#admin-main">Skip to the dashboard</a>

    <!-- Side menu: the three systems, the tools, the signed-in admin -->
    <aside class="adm-side" id="adm-side" aria-label="Portal menu">
      <div class="adm-side__head">
        <a href="index.php" class="admin-brand">
          <span class="adm-logo"><img src="../assets/images/logo.png" alt="" width="28" height="28" onerror="this.style.display='none'"></span>
          <span class="adm-brand-text">
            <span class="admin-brand-title">CreativeKit3A</span>
            <span class="admin-brand-badge">Management portal</span>
          </span>
        </a>
        <button type="button" class="adm-side__close" data-side-close aria-label="Close the menu"><i class="fas fa-xmark" aria-hidden="true"></i></button>
      </div>

      <nav class="adm-nav admin-tabs" aria-label="Systems">
        <p class="adm-nav__label">Systems</p>
        <button type="button" class="admin-tab active" data-tab="information" aria-current="page" title="Information">
          <i class="fas fa-chart-pie" aria-hidden="true"></i>
          <span class="adm-nav__text">Information <small>MIS overview</small></span>
        </button>
        <button type="button" class="admin-tab" data-tab="inventory" title="Inventory">
          <i class="fas fa-boxes-stacked" aria-hidden="true"></i>
          <span class="adm-nav__text">Inventory <small>Stock and movements</small></span>
          <span class="badge" id="tab-badge-inventory">0</span>
        </button>
        <button type="button" class="admin-tab" data-tab="purchasing" title="Purchasing">
          <i class="fas fa-cart-flatbed" aria-hidden="true"></i>
          <span class="adm-nav__text">Purchasing <small>Orders and suppliers</small></span>
          <span class="badge" id="tab-badge-purchasing">0</span>
        </button>

        <p class="adm-nav__label">Tools</p>
        <button type="button" class="adm-nav__link" onclick="AdminApp.exportReportCSV()" title="Export inventory report">
          <i class="fas fa-file-csv" aria-hidden="true"></i> <span class="adm-nav__lbl">Export inventory report</span>
        </button>
        <a href="../index.php" class="adm-nav__link btn-storefront" title="View storefront">
          <i class="fas fa-store" aria-hidden="true"></i> <span class="adm-nav__lbl">View storefront</span>
        </a>
      </nav>

      <div class="adm-side__foot">
        <div id="admin-user-display"></div>
        <div class="adm-status">
          <!-- Database status pill -->
          <span class="adm-db <?php echo $db_connected ? 'is-on' : 'is-local'; ?>" title="<?php echo $db_connected ? 'MySQL connected' : 'Local data engine'; ?>">
            <i class="fas <?php echo $db_connected ? 'fa-database' : 'fa-server'; ?>" aria-hidden="true"></i>
            <span><?php echo $db_connected ? 'MySQL connected' : 'Local data engine'; ?></span>
          </span>
          <span class="admin-clock" title="Local time"><i class="far fa-clock" aria-hidden="true"></i> <span id="admin-clock-time">--:--:--</span></span>
        </div>
      </div>
    </aside>
    <div class="adm-scrim" data-side-close></div>

    <div class="adm-main">
      <!-- Top bar: the menu button (collapses the side menu on a desktop, opens the drawer under 1024px) and the open system's name -->
      <header class="admin-navbar adm-top">
        <button type="button" class="adm-burger" data-side-toggle aria-controls="adm-side" aria-expanded="false" aria-label="Open the menu">
          <i class="fas fa-bars" aria-hidden="true"></i>
        </button>
        <div class="adm-top__title">
          <p class="adm-top__eyebrow" id="admin-page-eyebrow">Information system (MIS)</p>
          <h1 id="admin-page-title">Corporate giveaways overview</h1>
        </div>
        <p class="adm-top__date" id="admin-page-date"></p>
      </header>

      <!-- Main Container -->
      <main class="admin-container" id="admin-main">

        <!-- ============================================================
             1. INFORMATION SYSTEM (MIS & EXECUTIVE DASHBOARD)
             ============================================================ -->
        <section class="tab-content-panel" id="panel-information" aria-labelledby="admin-page-title">

          <!-- Executive KPI Cards: the two peso figures large, the three counts under them -->
          <div class="kpi-grid">
            <div class="kpi-card kpi-card--money kpi-card--brand">
              <div class="kpi-info">
                <p class="kpi-label">Inventory valuation</p>
                <div class="kpi-value" id="kpi-inventory-val">₱0.00</div>
                <div class="kpi-subtext">Current asset value in warehouses</div>
              </div>
              <img class="kpi-photo" src="../assets/images/admin/tumbler-bamboo.png" alt="Bamboo tumbler with an engraved name" width="240" height="240">
            </div>

            <div class="kpi-card kpi-card--money kpi-card--navy">
              <div class="kpi-info">
                <p class="kpi-label">Procurement spend</p>
                <div class="kpi-value" id="kpi-procurement-spend">₱0.00</div>
                <div class="kpi-subtext">Total received purchase orders</div>
                <button type="button" class="btn-admin btn-admin-primary kpi-action" onclick="AdminApp.switchTab('purchasing'); AdminApp.openCreatePOModal()">
                  <i class="fas fa-plus" aria-hidden="true"></i> Create purchase order
                </button>
              </div>
              <img class="kpi-photo" src="../assets/images/admin/jackets-corporate.png" alt="Three black corporate jackets with a printed logo" width="240" height="174">
            </div>

            <div class="kpi-card">
              <div class="kpi-icon success"><i class="fas fa-cubes" aria-hidden="true"></i></div>
              <div class="kpi-info">
                <p class="kpi-label">Units on hand</p>
                <div class="kpi-value" id="kpi-inventory-units">0</div>
                <div class="kpi-subtext">Across 3 active storage hubs</div>
              </div>
            </div>

            <div class="kpi-card kpi-card--alert">
              <div class="kpi-icon danger"><i class="fas fa-triangle-exclamation" aria-hidden="true"></i></div>
              <div class="kpi-info">
                <p class="kpi-label">Low stock alerts</p>
                <div class="kpi-value" id="kpi-low-stock">0</div>
                <div class="kpi-subtext">Items below reorder threshold</div>
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-icon sky"><i class="fas fa-file-invoice-dollar" aria-hidden="true"></i></div>
              <div class="kpi-info">
                <p class="kpi-label">Open purchase orders</p>
                <div class="kpi-value" id="kpi-active-pos">0</div>
                <div class="kpi-subtext">Pending / in-transit deliveries</div>
              </div>
            </div>
          </div>

          <!-- MIS Visual Breakdown Grid -->
          <div class="grid-2col">
            <div class="admin-card">
              <div class="admin-card-header">
                <h2><i class="fas fa-chart-simple" aria-hidden="true"></i> Stock by category</h2>
              </div>
              <ul class="adm-bars">
                <li style="--v:35%;--c:var(--adm-orange)">
                  <img class="adm-bars__pic" src="../assets/images/admin/tumbler-bamboo-sm.png" alt="Bamboo tumbler" width="56" height="56" loading="lazy">
                  <span class="adm-bars__name">Drinkware (Tumblers, Flasks, Mugs)</span>
                  <span class="adm-bars__num">35% <small>2,410 units</small></span>
                  <span class="adm-bars__track"><i></i></span>
                </li>
                <li style="--v:45%;--c:var(--adm-navy)">
                  <img class="adm-bars__pic" src="../assets/images/admin/desk-organizers.png" alt="Bamboo desk organiser with a pen holder" width="56" height="56" loading="lazy">
                  <span class="adm-bars__name">Pen &amp; Paper (Bamboo Pens, Journals)</span>
                  <span class="adm-bars__num">45% <small>4,180 units</small></span>
                  <span class="adm-bars__track"><i></i></span>
                </li>
                <li style="--v:12%;--c:#ffa15c">
                  <img class="adm-bars__pic" src="../assets/images/admin/laptop-backpack.png" alt="Blue laptop bag with a tan strap" width="56" height="56" loading="lazy">
                  <span class="adm-bars__name">Bags &amp; Pouches (Totes, Backpacks)</span>
                  <span class="adm-bars__num">12% <small>1,390 units</small></span>
                  <span class="adm-bars__track"><i></i></span>
                </li>
                <li style="--v:8%;--c:#5f7cc4">
                  <img class="adm-bars__pic" src="../assets/images/admin/jackets-corporate-sm.png" alt="Corporate jackets" width="56" height="56" loading="lazy">
                  <span class="adm-bars__name">Apparel &amp; Tech Accessories (Jackets, Chargers)</span>
                  <span class="adm-bars__num">8% <small>830 units</small></span>
                  <span class="adm-bars__track"><i></i></span>
                </li>
              </ul>
            </div>

            <div class="admin-card">
              <div class="admin-card-header">
                <h2><i class="fas fa-warehouse" aria-hidden="true"></i> Warehouse capacity</h2>
              </div>
              <ul class="adm-wh">
                <li style="--v:78%">
                  <div class="adm-wh__name"><strong>Main Central Warehouse (WH-QC)</strong><span>Diliman, Quezon City</span></div>
                  <span class="badge-status badge-in-stock">Primary Facility (78% Cap.)</span>
                  <span class="adm-wh__meter"><i></i></span>
                </li>
                <li style="--v:42%">
                  <div class="adm-wh__name"><strong>Metro Manila Distribution Hub (WH-MM)</strong><span>FTI Complex, Taguig City</span></div>
                  <span class="badge-status badge-sent">Distribution Depot (42% Cap.)</span>
                  <span class="adm-wh__meter"><i></i></span>
                </li>
                <li style="--v:25%">
                  <div class="adm-wh__name"><strong>Visayas Regional Depot (WH-CEB)</strong><span>Mandaue City, Cebu</span></div>
                  <span class="badge-status badge-draft">Regional Satellite (25% Cap.)</span>
                  <span class="adm-wh__meter"><i></i></span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Management Audit Trail & System Logs -->
          <div class="admin-card">
            <div class="admin-card-header">
              <h2><i class="fas fa-clipboard-list" aria-hidden="true"></i> Activity log and audit trail</h2>
            </div>
            <div class="admin-table-wrap">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Module</th>
                    <th>Action</th>
                    <th>Operation Details</th>
                    <th>Operator</th>
                  </tr>
                </thead>
                <tbody id="audit-logs-table-body">
                  <!-- Rendered via admin-system.js -->
                </tbody>
              </table>
            </div>
          </div>

        </section>

        <!-- ============================================================
             2. INVENTORY SYSTEM
             ============================================================ -->
        <section class="tab-content-panel" id="panel-inventory" style="display:none;" aria-labelledby="admin-page-title">

          <div class="admin-card">
            <div class="admin-card-header">
              <h2><i class="fas fa-boxes-stacked" aria-hidden="true"></i> Stock across the warehouses</h2>

              <div class="admin-card-tools">
                <label class="adm-field adm-field--search">
                  <span class="adm-field__label">Search</span>
                  <input type="text" id="inv-search-input" class="admin-search-input" placeholder="SKU or item">
                </label>

                <label class="adm-field">
                  <span class="adm-field__label">Category</span>
                  <select id="inv-category-select" class="admin-select">
                    <option value="all">All Categories</option>
                    <option value="Accessories & Gadgets">Accessories &amp; Gadgets</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Bags & Pouches">Bags &amp; Pouches</option>
                    <option value="Drinkware">Drinkware</option>
                    <option value="Pen & Paper">Pen &amp; Paper</option>
                    <option value="PU Leather">PU Leather</option>
                  </select>
                </label>

                <label class="adm-field">
                  <span class="adm-field__label">Status</span>
                  <select id="inv-status-select" class="admin-select">
                    <option value="all">All Statuses</option>
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock (Alerts)</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </label>
              </div>
            </div>

            <div class="admin-table-wrap">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Product Description</th>
                    <th>Location</th>
                    <th class="num">On Hand</th>
                    <th class="num">Reserved</th>
                    <th class="num">Available</th>
                    <th class="num">Reorder Point</th>
                    <th>Status</th>
                    <th class="num">Asset Valuation</th>
                    <th class="num">Actions</th>
                  </tr>
                </thead>
                <tbody id="inventory-table-body">
                  <!-- Rendered via admin-system.js -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- Stock Movement History Ledger -->
          <div class="admin-card">
            <div class="admin-card-header">
              <h2><i class="fas fa-history" aria-hidden="true"></i> Stock movement ledger</h2>
            </div>
            <div class="admin-table-wrap">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Movement Ref</th>
                    <th>Type</th>
                    <th>Source / Ref</th>
                    <th>Product Name</th>
                    <th class="num">Qty Change</th>
                    <th>Warehouse</th>
                    <th>Logged Date</th>
                  </tr>
                </thead>
                <tbody id="movements-table-body">
                  <!-- Rendered via admin-system.js -->
                </tbody>
              </table>
            </div>
          </div>

        </section>

        <!-- ============================================================
             3. PURCHASING SYSTEM (PROCUREMENT & SUPPLIERS)
             ============================================================ -->
        <section class="tab-content-panel" id="panel-purchasing" style="display:none;" aria-labelledby="admin-page-title">

          <div class="admin-card">
            <div class="admin-card-header">
              <h2><i class="fas fa-file-invoice-dollar" aria-hidden="true"></i> Purchase orders</h2>

              <button type="button" class="btn-admin btn-admin-primary" onclick="AdminApp.openCreatePOModal()">
                <i class="fas fa-plus" aria-hidden="true"></i> Create purchase order
              </button>
            </div>

            <div class="admin-table-wrap">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>PO Number</th>
                    <th>Supplier / Vendor</th>
                    <th>Order Date</th>
                    <th>Expected Delivery</th>
                    <th>PO Status</th>
                    <th>Payment</th>
                    <th class="num">Total Amount</th>
                    <th class="num">Goods Receipt</th>
                  </tr>
                </thead>
                <tbody id="purchasing-table-body">
                  <!-- Rendered via admin-system.js -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- Supplier Directory -->
          <div class="admin-card">
            <div class="admin-card-header">
              <h2><i class="fas fa-building" aria-hidden="true"></i> Supplier directory</h2>
            </div>

            <div class="admin-table-wrap">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Supplier Code</th>
                    <th>Company Name</th>
                    <th>Contact Representative</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Terms</th>
                    <th>Vendor Rating</th>
                  </tr>
                </thead>
                <tbody id="suppliers-table-body">
                  <!-- Rendered via admin-system.js -->
                </tbody>
              </table>
            </div>
          </div>

        </section>

      </main>
    </div>
  </div>

  <!-- ============================================================
       MODAL 1: STOCK ADJUSTMENT
       ============================================================ -->
  <div class="admin-modal-overlay" id="modal-stock-adjust">
    <div class="admin-modal" role="dialog" aria-modal="true" aria-labelledby="adj-title">
      <div class="admin-modal-header">
        <h2 id="adj-title"><span class="adm-modal-icon"><i class="fas fa-sliders-h" aria-hidden="true"></i></span> Stock adjustment</h2>
        <button type="button" class="cart-drawer-close" onclick="AdminApp.closeStockAdjustModal()" aria-label="Close the stock adjustment">&times;</button>
      </div>
      <div class="admin-modal-body">
        <input type="hidden" id="adj-item-id">

        <div class="adm-modal-item">
          <div class="adm-modal-item__name" id="adj-item-name">Product Name</div>
          <div class="adm-modal-item__meta">
            Current On-Hand Stock: <strong id="adj-current-qty">0</strong> units
          </div>
        </div>

        <div class="form-group">
          <label for="adj-type">Adjustment Action</label>
          <select id="adj-type" class="admin-select">
            <option value="in">Stock In (Add pieces received)</option>
            <option value="out">Stock Out (Deduct pieces dispatched)</option>
            <option value="set">Set Exact Count (Physical audit overwrite)</option>
          </select>
        </div>

        <div class="form-group">
          <label for="adj-qty">Quantity</label>
          <input type="number" id="adj-qty" placeholder="e.g. 50" min="1">
        </div>

        <div class="form-group">
          <label for="adj-remarks">Audit Reason / Remarks</label>
          <textarea id="adj-remarks" rows="2" placeholder="e.g. Physical inventory reconciliation or damaged batch write-off"></textarea>
        </div>
      </div>
      <div class="admin-modal-footer">
        <button type="button" class="btn-admin btn-admin-secondary" onclick="AdminApp.closeStockAdjustModal()">Cancel</button>
        <button type="button" class="btn-admin btn-admin-primary" onclick="AdminApp.submitStockAdjust()">
          <i class="fas fa-save" aria-hidden="true"></i> Save adjustment
        </button>
      </div>
    </div>
  </div>

  <!-- ============================================================
       MODAL 2: CREATE PURCHASE ORDER
       ============================================================ -->
  <div class="admin-modal-overlay" id="modal-create-po">
    <div class="admin-modal" role="dialog" aria-modal="true" aria-labelledby="po-title">
      <div class="admin-modal-header">
        <h2 id="po-title"><span class="adm-modal-icon"><i class="fas fa-cart-plus" aria-hidden="true"></i></span> Create purchase order</h2>
        <button type="button" class="cart-drawer-close" onclick="AdminApp.closeCreatePOModal()" aria-label="Close the purchase order form">&times;</button>
      </div>
      <div class="admin-modal-body">
        <div class="form-group">
          <label for="po-supplier-select">Select Supplier / Manufacturer</label>
          <select id="po-supplier-select" class="admin-select">
            <!-- Populated via JS -->
          </select>
        </div>

        <div class="form-group">
          <label for="po-warehouse-select">Receiving Destination Warehouse</label>
          <select id="po-warehouse-select" class="admin-select">
            <option value="WH-QC">Main Central Warehouse (WH-QC)</option>
            <option value="WH-MM">Metro Manila Distribution Hub (WH-MM)</option>
            <option value="WH-CEB">Visayas Regional Depot (WH-CEB)</option>
          </select>
        </div>

        <div class="form-group">
          <label for="po-item-name">Item Description</label>
          <input type="text" id="po-item-name" placeholder="e.g. 450ml Bamboo Tumbler Blanks">
        </div>

        <div class="grid-2col grid-2col--tight">
          <div class="form-group">
            <label for="po-item-qty">Order Quantity</label>
            <input type="number" id="po-item-qty" placeholder="e.g. 250" min="1">
          </div>
          <div class="form-group">
            <label for="po-item-cost">Unit Cost (₱)</label>
            <input type="number" id="po-item-cost" placeholder="e.g. 175.00" step="0.5" min="1">
          </div>
        </div>

        <div class="form-group">
          <label for="po-exp-date">Expected Delivery Date</label>
          <input type="date" id="po-exp-date">
        </div>
      </div>
      <div class="admin-modal-footer">
        <button type="button" class="btn-admin btn-admin-secondary" onclick="AdminApp.closeCreatePOModal()">Cancel</button>
        <button type="button" class="btn-admin btn-admin-primary" onclick="AdminApp.submitCreatePO()">
          <i class="fas fa-paper-plane" aria-hidden="true"></i> Issue purchase order
        </button>
      </div>
    </div>
  </div>

  <!-- Admin System JavaScript -->
  <script src="../assets/js/admin-system.js"></script>
</body>
</html>
