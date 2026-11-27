/* ============================================================
   admin-system.js — CreativeKit 3A Management Portal
   Core logic for Purchasing, Inventory, and Information Systems
   ============================================================ */

(function () {
  'use strict';

  // Local storage keys for persistent demo & live state
  const KEYS = {
    INVENTORY: 'ck_admin_inventory',
    PURCHASING: 'ck_admin_purchasing',
    SUPPLIERS: 'ck_admin_suppliers',
    AUDIT_LOGS: 'ck_admin_audit_logs',
    MOVEMENTS: 'ck_admin_movements'
  };

  /* ── 1. DEFAULT SEED DATA ── */
  const DEFAULT_SUPPLIERS = [
    { id: 1, code: 'SUP-PH-001', name: 'Luzon Garments & Apparel Mfg', contact: 'Maricel Bautista', email: 'orders@luzongarments.ph', phone: '+63 2 8712 3456', location: 'Taytay, Rizal', terms: 'Net 30', rating: 4.9 },
    { id: 2, code: 'SUP-PH-002', name: 'Pacific Tech & Gadgets Import Corp', contact: 'Kenji Tanaka', email: 'supply@pacifictech.com.ph', phone: '+63 2 8923 8812', location: 'Binondo, Manila', terms: 'Net 15', rating: 4.8 },
    { id: 3, code: 'SUP-PH-003', name: 'EcoDrinkware Phils Corp', contact: 'Eduardo Ramos', email: 'sales@ecodrinkware.ph', phone: '+63 917 555 1290', location: 'Sta. Rosa, Laguna', terms: 'Net 30', rating: 4.95 },
    { id: 4, code: 'SUP-PH-004', name: 'Premium Leather & Packaging Solutions', contact: 'Sofia Tan', email: 'inquiry@premiumleather.ph', phone: '+63 2 8540 2211', location: 'Marikina City', terms: 'Net 30', rating: 4.7 }
  ];

  const DEFAULT_INVENTORY = [
    { id: 1, sku: 'ACC-CAR-001', name: 'Car Charger Adapters', category: 'Accessories & Gadgets', wh: 'WH-QC', qty: 480, reserved: 50, reorder: 60, cost: 45.00, price: 85.00 },
    { id: 2, sku: 'ACC-CAR-002', name: 'Car Organizers & Holders', category: 'Accessories & Gadgets', wh: 'WH-QC', qty: 310, reserved: 30, reorder: 50, cost: 70.00, price: 120.00 },
    { id: 3, sku: 'ACC-CAR-003', name: 'Dash Cams', category: 'Accessories & Gadgets', wh: 'WH-QC', qty: 18, reserved: 5, reorder: 25, cost: 280.00, price: 450.00 },
    { id: 4, sku: 'APP-JKT-001', name: 'Corporate Jackets', category: 'Apparel', wh: 'WH-QC', qty: 14, reserved: 10, reorder: 30, cost: 480.00, price: 720.00 },
    { id: 5, sku: 'APP-JKT-001', name: 'Corporate Jackets', category: 'Apparel', wh: 'WH-MM', qty: 22, reserved: 5, reorder: 20, cost: 480.00, price: 720.00 },
    { id: 6, sku: 'APP-JKT-002', name: 'Bomber Jackets', category: 'Apparel', wh: 'WH-QC', qty: 95, reserved: 15, reorder: 25, cost: 420.00, price: 650.00 },
    { id: 7, sku: 'BAG-LPT-001', name: 'Laptop Backpacks', category: 'Bags & Pouches', wh: 'WH-QC', qty: 140, reserved: 25, reorder: 30, cost: 320.00, price: 520.00 },
    { id: 8, sku: 'BAG-TOT-001', name: 'Classic Zip Totes', category: 'Bags & Pouches', wh: 'WH-QC', qty: 1250, reserved: 200, reorder: 150, cost: 65.00, price: 120.00 },
    { id: 9, sku: 'DRK-TMB-001', name: 'Bamboo Tumblers', category: 'Drinkware', wh: 'WH-QC', qty: 850, reserved: 120, reorder: 100, cost: 120.00, price: 220.00 },
    { id: 10, sku: 'DRK-TMB-002', name: 'Stainless Steel Tumblers', category: 'Drinkware', wh: 'WH-QC', qty: 620, reserved: 90, reorder: 80, cost: 180.00, price: 310.00 },
    { id: 11, sku: 'DRK-MUG-001', name: 'Ceramic Mugs', category: 'Drinkware', wh: 'WH-QC', qty: 940, reserved: 100, reorder: 150, cost: 48.00, price: 95.00 },
    { id: 12, sku: 'PEN-BAM-001', name: 'Bamboo Pens', category: 'Pen & Paper', wh: 'WH-QC', qty: 3400, reserved: 500, reorder: 300, cost: 16.00, price: 35.00 },
    { id: 13, sku: 'PPR-NBK-001', name: 'Custom Notebooks & Journals', category: 'Pen & Paper', wh: 'WH-QC', qty: 780, reserved: 150, reorder: 100, cost: 52.00, price: 95.00 },
    { id: 14, sku: 'LEA-WLT-001', name: 'PU Leather Wallets', category: 'PU Leather', wh: 'WH-QC', qty: 19, reserved: 4, reorder: 30, cost: 95.00, price: 195.00 }
  ];

  const DEFAULT_PURCHASE_ORDERS = [
    {
      id: 1,
      poNumber: 'PO-2026-001',
      supplier: 'EcoDrinkware Phils Corp',
      orderDate: '2026-10-15',
      expectedDate: '2026-10-25',
      receivedDate: '2026-10-24',
      status: 'received',
      paymentStatus: 'paid',
      totalAmount: 101060.00,
      wh: 'WH-QC',
      items: [{ name: 'Bamboo Tumbler Blanks 450ml', sku: 'DRK-TMB-001', qty: 500, unitCost: 176.00, total: 88000.00 }]
    },
    {
      id: 2,
      poNumber: 'PO-2026-002',
      supplier: 'Luzon Garments & Apparel Mfg',
      orderDate: '2026-11-05',
      expectedDate: '2026-11-18',
      receivedDate: '2026-11-17',
      status: 'received',
      paymentStatus: 'paid',
      totalAmount: 82440.00,
      wh: 'WH-QC',
      items: [{ name: 'Executive Corporate Windbreaker Blanks', sku: 'APP-JKT-001', qty: 150, unitCost: 480.00, total: 72000.00 }]
    },
    {
      id: 3,
      poNumber: 'PO-2026-003',
      supplier: 'Pacific Tech & Gadgets Import Corp',
      orderDate: '2026-11-18',
      expectedDate: '2026-11-28',
      receivedDate: null,
      status: 'sent',
      paymentStatus: 'unpaid',
      totalAmount: 51900.00,
      wh: 'WH-QC',
      items: [{ name: '1080p HD Wide-Angle Dash Cam Units', sku: 'ACC-CAR-003', qty: 150, unitCost: 300.00, total: 45000.00 }]
    },
    {
      id: 4,
      poNumber: 'PO-2026-004',
      supplier: 'Premium Leather & Packaging Solutions',
      orderDate: '2026-11-20',
      expectedDate: '2026-12-02',
      receivedDate: null,
      status: 'draft',
      paymentStatus: 'unpaid',
      totalAmount: 37040.00,
      wh: 'WH-QC',
      items: [{ name: 'RFID Bifold PU Leather Wallet Blanks', sku: 'LEA-WLT-001', qty: 250, unitCost: 128.00, total: 32000.00 }]
    }
  ];

  const DEFAULT_MOVEMENTS = [
    { id: 1, ref: 'MOV-261024-001', type: 'stock_in', source: 'PO-2026-001', item: 'Bamboo Tumblers', qty: 500, wh: 'WH-QC', user: 'Ramon Valdez', date: '2026-10-24 14:32' },
    { id: 2, ref: 'MOV-261117-002', type: 'stock_in', source: 'PO-2026-002', item: 'Corporate Jackets', qty: 150, wh: 'WH-QC', user: 'Ramon Valdez', date: '2026-11-17 10:15' },
    { id: 3, ref: 'MOV-261119-003', type: 'stock_out', source: 'ORD-2026-041', item: 'Classic Zip Totes', qty: -100, wh: 'WH-QC', user: 'Analyn Santos', date: '2026-11-19 16:45' }
  ];

  const DEFAULT_AUDIT_LOGS = [
    { id: 1, module: 'Inventory', action: 'Stock In', details: 'Received 150 units of Corporate Jackets from PO-2026-002.', user: 'Warehouse Lead', time: '2026-11-17 10:15' },
    { id: 2, module: 'Purchasing', action: 'Create PO', details: 'Created Purchase Order PO-2026-003 for Pacific Tech.', user: 'Procurement Officer', time: '2026-11-18 09:20' },
    { id: 3, module: 'Quotes', action: 'Approval', details: 'Quotation inquiry CK3A-849201 marked as Approved & In Production.', user: 'Sales Manager', time: '2026-11-20 11:45' }
  ];

  /* ── 2. STATE STORE HELPERS ── */
  function getStore(key, defaults) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaults;
    } catch {
      return defaults;
    }
  }

  function setStore(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /* ── 3. STATE INITIALIZATION ── */
  let inventory = getStore(KEYS.INVENTORY, DEFAULT_INVENTORY);
  let purchasing = getStore(KEYS.PURCHASING, DEFAULT_PURCHASE_ORDERS);
  let suppliers = getStore(KEYS.SUPPLIERS, DEFAULT_SUPPLIERS);
  let movements = getStore(KEYS.MOVEMENTS, DEFAULT_MOVEMENTS);
  let auditLogs = getStore(KEYS.AUDIT_LOGS, DEFAULT_AUDIT_LOGS);

  function logAudit(module, action, details) {
    const entry = {
      id: Date.now(),
      module,
      action,
      details,
      user: 'Operations Admin',
      time: new Date().toLocaleString()
    };
    auditLogs.unshift(entry);
    setStore(KEYS.AUDIT_LOGS, auditLogs);
    renderAuditLogs();
  }

  /* ── 4. INFORMATION SYSTEM (MIS & Analytics) ── */
  function renderMISDashboard() {
    // KPI calculations
    let totalStockUnits = 0;
    let totalInventoryValuation = 0;
    let lowStockCount = 0;

    inventory.forEach(item => {
      totalStockUnits += item.qty;
      totalInventoryValuation += (item.qty * item.price);
      if (item.qty <= item.reorder) {
        lowStockCount++;
      }
    });

    let totalProcurementSpend = 0;
    let activePOCount = 0;

    purchasing.forEach(po => {
      if (po.status === 'received') {
        totalProcurementSpend += po.totalAmount;
      } else {
        activePOCount++;
      }
    });

    // Update KPI UI
    const elValuation = document.getElementById('kpi-inventory-val');
    const elUnits = document.getElementById('kpi-inventory-units');
    const elLowStock = document.getElementById('kpi-low-stock');
    const elProcurement = document.getElementById('kpi-procurement-spend');
    const elActivePO = document.getElementById('kpi-active-pos');

    if (elValuation) elValuation.textContent = '₱' + totalInventoryValuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (elUnits) elUnits.textContent = totalStockUnits.toLocaleString();
    if (elLowStock) elLowStock.textContent = lowStockCount;
    if (elProcurement) elProcurement.textContent = '₱' + totalProcurementSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (elActivePO) elActivePO.textContent = activePOCount;

    // Update Tab Badges
    const invBadge = document.getElementById('tab-badge-inventory');
    const poBadge = document.getElementById('tab-badge-purchasing');
    // the word "alerts" hides on the collapsed rail, where only the number fits
    if (invBadge) {
      if (lowStockCount > 0) invBadge.innerHTML = `${lowStockCount}<span class="badge__word"> alerts</span>`;
      else invBadge.textContent = inventory.length;
      invBadge.title = lowStockCount > 0 ? `${lowStockCount} low stock alerts` : `${inventory.length} items`;
    }
    if (poBadge) poBadge.textContent = purchasing.length;

    renderAuditLogs();
  }

  function renderAuditLogs() {
    const container = document.getElementById('audit-logs-table-body');
    if (!container) return;

    if (!auditLogs.length) {
      container.innerHTML = `<tr><td colspan="5" class="adm-empty">No system audit entries found.</td></tr>`;
      return;
    }

    container.innerHTML = auditLogs.slice(0, 10).map(log => `
      <tr>
        <td><strong>${log.time}</strong></td>
        <td><span class="badge-status badge-sent">${log.module}</span></td>
        <td><strong>${log.action}</strong></td>
        <td>${log.details}</td>
        <td><i class="fas fa-user-circle adm-muted" aria-hidden="true"></i> ${log.user}</td>
      </tr>
    `).join('');
  }

  /* ── 5. INVENTORY SYSTEM (Stock & Warehouses) ── */
  function renderInventoryTable(filterKeyword = '', filterCategory = 'all', filterStatus = 'all') {
    const tbody = document.getElementById('inventory-table-body');
    if (!tbody) return;

    let filtered = inventory.filter(item => {
      const matchKeyword = !filterKeyword ||
        item.name.toLowerCase().includes(filterKeyword.toLowerCase()) ||
        item.sku.toLowerCase().includes(filterKeyword.toLowerCase());
      const matchCategory = (filterCategory === 'all') || item.category === filterCategory;

      let status = 'in-stock';
      if (item.qty <= 0) status = 'out-of-stock';
      else if (item.qty <= item.reorder) status = 'low-stock';

      const matchStatus = (filterStatus === 'all') || (status === filterStatus);

      return matchKeyword && matchCategory && matchStatus;
    });

    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="10" class="adm-empty"><i class="fas fa-box-open" aria-hidden="true"></i>No inventory records found.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(item => {
      let statusBadge = `<span class="badge-status badge-in-stock"><i class="fas fa-check-circle"></i> In Stock</span>`;
      if (item.qty <= 0) {
        statusBadge = `<span class="badge-status badge-out-of-stock"><i class="fas fa-times-circle"></i> Out of Stock</span>`;
      } else if (item.qty <= item.reorder) {
        statusBadge = `<span class="badge-status badge-low-stock"><i class="fas fa-exclamation-triangle"></i> Low Stock</span>`;
      }

      const available = item.qty - item.reserved;
      const totalVal = item.qty * item.price;

      return `
        <tr>
          <td><strong>${item.sku}</strong></td>
          <td>
            <strong>${item.name}</strong>
            <div class="adm-sub">${item.category}</div>
          </td>
          <td><span class="badge-status badge-draft"><i class="fas fa-warehouse"></i> ${item.wh}</span></td>
          <td class="num"><strong class="adm-qty">${item.qty}</strong></td>
          <td class="num adm-muted">${item.reserved}</td>
          <td class="num"><strong class="${available <= item.reorder ? 'adm-warn' : 'adm-ok'}">${available}</strong></td>
          <td class="num"><span class="adm-reorder"><i class="fas fa-bell" aria-hidden="true"></i> ${item.reorder}</span></td>
          <td>${statusBadge}</td>
          <td class="num"><strong>₱${totalVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
          <td class="num">
            <button class="btn-admin btn-admin-secondary btn-admin-sm" onclick="AdminApp.openStockAdjustModal(${item.id})">
              <i class="fas fa-sliders-h"></i> Adjust
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderMovementsTable() {
    const tbody = document.getElementById('movements-table-body');
    if (!tbody) return;

    if (!movements.length) {
      tbody.innerHTML = `<tr><td colspan="7" class="adm-empty">No stock movement records logged.</td></tr>`;
      return;
    }

    tbody.innerHTML = movements.slice(0, 15).map(m => `
      <tr>
        <td><strong>${m.ref}</strong></td>
        <td><span class="badge-status ${m.type === 'stock_in' ? 'badge-in-stock' : 'badge-out-of-stock'}">${m.type.replace('_', ' ').toUpperCase()}</span></td>
        <td>${m.source}</td>
        <td><strong>${m.item}</strong></td>
        <td class="num"><strong class="${m.qty > 0 ? 'adm-ok' : 'adm-bad'}">${m.qty > 0 ? '+' + m.qty : m.qty}</strong></td>
        <td>${m.wh}</td>
        <td>${m.date}</td>
      </tr>
    `).join('');
  }

  /* ── 6. PURCHASING SYSTEM (Procurement & Orders) ── */
  function renderPurchasingTable(filterStatus = 'all') {
    const tbody = document.getElementById('purchasing-table-body');
    if (!tbody) return;

    let filtered = purchasing.filter(po => (filterStatus === 'all') || po.status === filterStatus);

    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="8" class="adm-empty"><i class="fas fa-file-invoice" aria-hidden="true"></i>No purchase orders match criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(po => {
      let statusBadge = `<span class="badge-status badge-draft">Draft</span>`;
      if (po.status === 'sent') statusBadge = `<span class="badge-status badge-sent"><i class="fas fa-paper-plane"></i> Sent</span>`;
      if (po.status === 'received') statusBadge = `<span class="badge-status badge-received"><i class="fas fa-check-double"></i> Received</span>`;

      let payBadge = po.paymentStatus === 'paid'
        ? `<span class="badge-status badge-paid"><i class="fas fa-check"></i> Paid</span>`
        : `<span class="badge-status badge-unpaid"><i class="fas fa-clock"></i> Unpaid</span>`;

      const canReceive = po.status === 'sent' || po.status === 'draft';

      return `
        <tr>
          <td><strong>${po.poNumber}</strong></td>
          <td><strong>${po.supplier}</strong></td>
          <td>${po.orderDate}</td>
          <td>${po.expectedDate || '—'}</td>
          <td>${statusBadge}</td>
          <td>${payBadge}</td>
          <td class="num"><strong>₱${po.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
          <td class="num">
            ${canReceive ? `
              <button class="btn-admin btn-admin-success btn-admin-sm" onclick="AdminApp.receivePO(${po.id})">
                <i class="fas fa-dolly"></i> Receive Goods
              </button>
            ` : `
              <span class="adm-done"><i class="fas fa-check" aria-hidden="true"></i> Fulfilled</span>
            `}
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderSuppliersTable() {
    const tbody = document.getElementById('suppliers-table-body');
    if (!tbody) return;

    tbody.innerHTML = suppliers.map(s => `
      <tr>
        <td><strong>${s.code}</strong></td>
        <td><strong>${s.name}</strong></td>
        <td>${s.contact}</td>
        <td><a href="mailto:${s.email}">${s.email}</a></td>
        <td>${s.phone}</td>
        <td><span class="badge-status badge-draft">${s.terms}</span></td>
        <td><span class="adm-rating">★ ${s.rating.toFixed(1)}</span></td>
      </tr>
    `).join('');
  }

  /* ── 7. INTERACTIVE ACTIONS ── */
  // the top bar's eyebrow and title for each system
  const PANEL_TITLES = {
    information: ['Information system (MIS)', 'Corporate giveaways overview'],
    inventory: ['Inventory system', 'Giveaway stock and movements'],
    purchasing: ['Purchasing system', 'Giveaway orders and suppliers']
  };

  function setSideOpen(open) {
    const shell = document.querySelector('.adm-shell');
    const toggle = document.querySelector('[data-side-toggle]');
    if (!shell) return;
    const wasOpen = shell.classList.contains('is-open');
    shell.classList.toggle('is-open', open);
    syncSideToggle();
    if (open) document.querySelector('.adm-side .admin-tab.active')?.focus();
    else if (wasOpen && toggle) toggle.focus();
  }

  // Desktop (1024px and up): the same button collapses the side menu to an icon rail; the choice is remembered
  const DESKTOP = window.matchMedia('(min-width: 1024px)');
  function setSideCollapsed(collapsed) {
    const shell = document.querySelector('.adm-shell');
    if (!shell) return;
    shell.classList.toggle('is-collapsed', collapsed);
    try { localStorage.setItem('ck_admin_side_collapsed', collapsed ? '1' : '0'); } catch (_) {}
    syncSideToggle();
  }
  function syncSideToggle() {
    const shell = document.querySelector('.adm-shell');
    const toggle = document.querySelector('[data-side-toggle]');
    if (!shell || !toggle) return;
    if (DESKTOP.matches) {
      const collapsed = shell.classList.contains('is-collapsed');
      toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      toggle.setAttribute('aria-label', collapsed ? 'Expand the menu' : 'Collapse the menu');
      toggle.title = collapsed ? 'Expand the menu' : 'Collapse the menu';
    } else {
      toggle.setAttribute('aria-expanded', shell.classList.contains('is-open') ? 'true' : 'false');
      toggle.setAttribute('aria-label', 'Open the menu');
      toggle.title = 'Open the menu';
    }
  }

  window.AdminApp = {
    switchTab(tabId) {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content-panel').forEach(p => p.style.display = 'none');

      document.querySelectorAll('.admin-tab').forEach(t => t.removeAttribute('aria-current'));
      const targetTab = document.querySelector(`[data-tab="${tabId}"]`);
      const targetPanel = document.getElementById(`panel-${tabId}`);
      if (targetTab) { targetTab.classList.add('active'); targetTab.setAttribute('aria-current', 'page'); }
      if (targetPanel) targetPanel.style.display = 'block';

      // the top bar names the open system; on a phone the drawer closes
      const head = PANEL_TITLES[tabId];
      const elTitle = document.getElementById('admin-page-title');
      const elEyebrow = document.getElementById('admin-page-eyebrow');
      if (head && elTitle) elTitle.textContent = head[1];
      if (head && elEyebrow) elEyebrow.textContent = head[0];
      setSideOpen(false);

      if (tabId === 'information') renderMISDashboard();
      if (tabId === 'inventory') { renderInventoryTable(); renderMovementsTable(); }
      if (tabId === 'purchasing') { renderPurchasingTable(); renderSuppliersTable(); }
    },

    openStockAdjustModal(itemId) {
      const item = inventory.find(i => i.id === itemId);
      if (!item) return;

      document.getElementById('adj-item-id').value = item.id;
      document.getElementById('adj-item-name').textContent = `${item.name} (${item.sku})`;
      document.getElementById('adj-current-qty').textContent = item.qty;
      document.getElementById('adj-qty').value = '';
      document.getElementById('adj-remarks').value = '';

      document.getElementById('modal-stock-adjust').classList.add('open');
    },

    closeStockAdjustModal() {
      document.getElementById('modal-stock-adjust').classList.remove('open');
    },

    submitStockAdjust() {
      const id = parseInt(document.getElementById('adj-item-id').value, 10);
      const actionType = document.getElementById('adj-type').value;
      const qtyChange = parseInt(document.getElementById('adj-qty').value, 10);
      const remarks = document.getElementById('adj-remarks').value.trim();

      if (isNaN(qtyChange) || qtyChange <= 0) {
        alert('Please enter a valid positive quantity.');
        return;
      }

      const item = inventory.find(i => i.id === id);
      if (!item) return;

      let movementType = 'adjustment';
      let recordedQty = qtyChange;

      if (actionType === 'in') {
        item.qty += qtyChange;
        movementType = 'stock_in';
        recordedQty = qtyChange;
      } else if (actionType === 'out') {
        if (qtyChange > item.qty) {
          alert('Cannot remove more items than available on hand.');
          return;
        }
        item.qty -= qtyChange;
        movementType = 'stock_out';
        recordedQty = -qtyChange;
      } else {
        item.qty = qtyChange;
        movementType = 'adjustment';
        recordedQty = qtyChange;
      }

      setStore(KEYS.INVENTORY, inventory);

      // Record movement
      const movRef = `MOV-${Date.now().toString().slice(-6)}`;
      movements.unshift({
        id: Date.now(),
        ref: movRef,
        type: movementType,
        source: 'Manual Adjustment',
        item: item.name,
        qty: recordedQty,
        wh: item.wh,
        user: 'Operations Admin',
        date: new Date().toLocaleString()
      });
      setStore(KEYS.MOVEMENTS, movements);

      logAudit('Inventory', 'Stock Adjusted', `${item.name} (${item.sku}) adjusted by ${recordedQty} units. Note: ${remarks || 'None'}`);

      this.closeStockAdjustModal();
      renderInventoryTable();
      renderMovementsTable();
      renderMISDashboard();
    },

    openCreatePOModal() {
      const select = document.getElementById('po-supplier-select');
      if (select) {
        select.innerHTML = suppliers.map(s => `<option value="${s.name}">${s.name} (${s.code})</option>`).join('');
      }
      document.getElementById('modal-create-po').classList.add('open');
    },

    closeCreatePOModal() {
      document.getElementById('modal-create-po').classList.remove('open');
    },

    submitCreatePO() {
      const supplierName = document.getElementById('po-supplier-select').value;
      const itemName = document.getElementById('po-item-name').value.trim();
      const qty = parseInt(document.getElementById('po-item-qty').value, 10);
      const unitCost = parseFloat(document.getElementById('po-item-cost').value);
      const wh = document.getElementById('po-warehouse-select').value;
      const expDate = document.getElementById('po-exp-date').value;

      if (!itemName || isNaN(qty) || qty <= 0 || isNaN(unitCost) || unitCost <= 0) {
        alert('Please fill out all product details with valid quantities and costs.');
        return;
      }

      const total = qty * unitCost;
      const poNum = `PO-2026-${Math.floor(100 + Math.random() * 900)}`;

      const newPO = {
        id: Date.now(),
        poNumber: poNum,
        supplier: supplierName,
        orderDate: new Date().toISOString().split('T')[0],
        expectedDate: expDate || null,
        receivedDate: null,
        status: 'sent',
        paymentStatus: 'unpaid',
        totalAmount: total,
        wh: wh,
        items: [{ name: itemName, qty: qty, unitCost: unitCost, total: total }]
      };

      purchasing.unshift(newPO);
      setStore(KEYS.PURCHASING, purchasing);

      logAudit('Purchasing', 'PO Created', `Generated ${poNum} for ${supplierName} (Total: ₱${total.toLocaleString()}).`);

      this.closeCreatePOModal();
      renderPurchasingTable();
      renderMISDashboard();
    },

    receivePO(poId) {
      const po = purchasing.find(p => p.id === poId);
      if (!po) return;

      if (!confirm(`Confirm goods receipt for ${po.poNumber}? This will automatically increment stock in warehouse ${po.wh}.`)) {
        return;
      }

      po.status = 'received';
      po.receivedDate = new Date().toISOString().split('T')[0];
      setStore(KEYS.PURCHASING, purchasing);

      // Increment inventory stock
      po.items.forEach(poItem => {
        let invItem = inventory.find(i => i.name.toLowerCase() === poItem.name.toLowerCase() || (poItem.sku && i.sku === poItem.sku));
        if (invItem) {
          invItem.qty += poItem.qty;
        } else {
          inventory.push({
            id: Date.now(),
            sku: poItem.sku || `SKU-${Date.now().toString().slice(-4)}`,
            name: poItem.name,
            category: 'Procured Stock',
            wh: po.wh,
            qty: poItem.qty,
            reserved: 0,
            reorder: 20,
            cost: poItem.unitCost,
            price: Math.round(poItem.unitCost * 1.5)
          });
        }

        // Add movement ledger entry
        movements.unshift({
          id: Date.now() + Math.random(),
          ref: `MOV-${Date.now().toString().slice(-6)}`,
          type: 'stock_in',
          source: po.poNumber,
          item: poItem.name,
          qty: poItem.qty,
          wh: po.wh,
          user: 'Operations Admin',
          date: new Date().toLocaleString()
        });
      });

      setStore(KEYS.INVENTORY, inventory);
      setStore(KEYS.MOVEMENTS, movements);

      logAudit('Purchasing', 'Goods Received', `Received delivery for ${po.poNumber} at ${po.wh}. Stock updated.`);

      renderPurchasingTable();
      renderInventoryTable();
      renderMovementsTable();
      renderMISDashboard();
    },

    exportReportCSV() {
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'SKU,Product Name,Category,Warehouse,Stock On Hand,Reserved,Available,Reorder Level,Unit Price,Valuation\n';

      inventory.forEach(i => {
        const row = [
          i.sku,
          `"${i.name}"`,
          `"${i.category}"`,
          i.wh,
          i.qty,
          i.reserved,
          i.qty - i.reserved,
          i.reorder,
          i.price,
          i.qty * i.price
        ].join(',');
        csvContent += row + '\n';
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `CreativeKit3A_Inventory_Report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      logAudit('System', 'Report Export', 'Exported executive inventory CSV report.');
    },

    handleGateLogin: function (e) {
      if (e) e.preventDefault();
      const email = document.getElementById('gate-admin-email')?.value.trim();
      const pass  = document.getElementById('gate-admin-password')?.value;
      const errEl = document.getElementById('gate-error-msg');

      if (!email || !pass) {
        if (errEl) { errEl.textContent = 'Please enter both email and password.'; errEl.style.display = 'block'; }
        return;
      }

      const normEmail = email.toLowerCase();
      const isAdmin = (normEmail === 'admin@creativekit3a.com' || normEmail === 'admin@ck3a.com') && pass === 'Admin@2026!';

      if (isAdmin) {
        localStorage.setItem('ck_user', JSON.stringify({
          name: 'Admin',
          email: email,
          role: 'admin'
        }));
        if (errEl) errEl.style.display = 'none';
        checkAdminAuth();
        showToast('Admin access verified. Welcome to CreativeKit 3A Management Portal!');
      } else {
        if (errEl) {
          errEl.textContent = 'Invalid administrator credentials. Access denied.';
          errEl.style.display = 'block';
        }
      }
    },

    logout: function () {
      localStorage.removeItem('ck_user');
      checkAdminAuth();
      showToast('Signed out of Management Portal.');
      setTimeout(() => {
        const isPhp = window.location.pathname.endsWith('.php');
        window.location.href = isPhp ? '../index.php' : '../index.html';
      }, 500);
    }
  };

  function checkAdminAuth() {
    const userStr = localStorage.getItem('ck_user');
    let user = null;
    try {
      user = userStr ? JSON.parse(userStr) : null;
    } catch (_) {}

    const isAdmin = user && (user.role === 'admin' || user.email === 'admin@creativekit3a.com' || user.email === 'admin@ck3a.com');
    const userDisplay = document.getElementById('admin-user-display');
    // signed out: the sign-in page (its nav and main); signed in: the portal. Only one of the two is in the page.
    const signIn = [document.getElementById('adm-pub-nav'), document.getElementById('adm-pub-main')];
    const shell = document.querySelector('.adm-shell');

    if (!isAdmin) {
      signIn.forEach(el => { if (el) el.hidden = false; });
      if (shell) shell.hidden = true;
      return false;
    }

    signIn.forEach(el => { if (el) el.hidden = true; });
    if (shell) shell.hidden = false;

    if (userDisplay) {
      userDisplay.innerHTML = `
        <div class="adm-user">
          <span class="adm-user__avatar"><i class="fas fa-user-shield" aria-hidden="true"></i></span>
          <span class="adm-user__name">${user.name || 'Admin'}<small>${user.email || ''}</small></span>
          <button type="button" class="adm-user__out" onclick="AdminApp.logout()" title="Sign out of Admin"><i class="fas fa-right-from-bracket" aria-hidden="true"></i><span>Sign out</span></button>
        </div>`;
    }
    return true;
  }

  /* Each rendered cell carries its column's name (data-label), so a phone can stack a row as a card */
  function labelCells(tbody) {
    const heads = [...tbody.closest('table').querySelectorAll('thead th')].map(th => th.textContent.trim());
    tbody.querySelectorAll('tr').forEach(tr => [...tr.children].forEach((td, i) => {
      if (td.colSpan === 1 && heads[i]) td.setAttribute('data-label', heads[i]);
    }));
  }

  /* ── 8. BOOTSTRAP ── */
  document.addEventListener('DOMContentLoaded', () => {
    // 0. Check admin authentication
    checkAdminAuth();

    // Live Clock
    const clockEl = document.getElementById('admin-clock-time');
    if (clockEl) {
      const updateClock = () => {
        clockEl.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      };
      updateClock();
      setInterval(updateClock, 1000);
    }

    // Today's date in the top bar
    const dateEl = document.getElementById('admin-page-date');
    if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    // Side menu: on a desktop the top bar's button collapses it to icons; under 1024px it opens the drawer (the close button, the scrim and Escape close it)
    document.querySelectorAll('[data-side-toggle]').forEach(b => b.addEventListener('click', () => {
      if (DESKTOP.matches) setSideCollapsed(!document.querySelector('.adm-shell')?.classList.contains('is-collapsed'));
      else setSideOpen(true);
    }));
    DESKTOP.addEventListener('change', () => { setSideOpen(false); syncSideToggle(); });
    syncSideToggle();
    document.querySelectorAll('[data-side-close]').forEach(b => b.addEventListener('click', () => setSideOpen(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setSideOpen(false); });

    // Tab bindings
    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        AdminApp.switchTab(tab.dataset.tab);
      });
    });

    // Inventory search & filters
    const searchInput = document.getElementById('inv-search-input');
    const catSelect = document.getElementById('inv-category-select');
    const statusSelect = document.getElementById('inv-status-select');

    const handleFilterChange = () => {
      renderInventoryTable(
        searchInput ? searchInput.value.trim() : '',
        catSelect ? catSelect.value : 'all',
        statusSelect ? statusSelect.value : 'all'
      );
    };

    if (searchInput) searchInput.addEventListener('input', handleFilterChange);
    if (catSelect) catSelect.addEventListener('change', handleFilterChange);
    if (statusSelect) statusSelect.addEventListener('change', handleFilterChange);

    // Label the cells after every render
    document.querySelectorAll('.admin-table tbody').forEach(tb => {
      new MutationObserver(() => labelCells(tb)).observe(tb, { childList: true });
    });

    // Initial render
    renderMISDashboard();
    renderInventoryTable();
    renderMovementsTable();
    renderPurchasingTable();
    renderSuppliersTable();
  });

})();
