<?php
/**
 * pages/super-admin.php — Super admin console (admins only)
 *   - User accounts: promote to admin, demote to staff or customer, move organization,
 *     deactivate / reactivate, add, delete
 *   - Organizations: CreativeKit3A and every client company; add, edit, suspend, delete
 *   - System-wide settings (config/settings.php): registration, maintenance, quote minimum, session length
 *   - The log of every change made here
 * Every form posts to actions/super-admin-actions.php with the console's CSRF token.
 * Dedicated assets: /assets/css/super-admin.css, /assets/js/super-admin.js
 */
require_once __DIR__ . '/../config/db.php';
$required_role = 'admin';
require_once __DIR__ . '/../auth/guard.php';

$page_title    = 'Super admin console | CreativeKit3A';
$meta_desc     = 'Admin console for CreativeKit3A: user roles, client organizations and system-wide settings.';
$extra_css     = ['/assets/css/admin.css', '/assets/css/super-admin.css'];
$extra_js      = ['/assets/js/super-admin.js'];
$admin_heading = 'Super admin';
$console_head  = true;   // includes/head.php: the console's fonts, page metas and entrance line
$flash = get_flash();

if (empty($_SESSION['sa_csrf'])) {
    $_SESSION['sa_csrf'] = bin2hex(random_bytes(32));
}
$csrf = $_SESSION['sa_csrf'];

$users = $orgs = $log = [];
$role_counts = ['admin' => 0, 'staff' => 0, 'customer' => 0];
$inactive = 0;
$settings_meta = null;
if ($pdo) {
    $users = $pdo->query("SELECT u.id, u.first_name, u.last_name, u.email, u.role, u.is_active, u.organization_id,
                                 u.last_login_at, u.created_at, o.name AS org_name, o.status AS org_status
                          FROM users AS u LEFT JOIN organizations AS o ON o.id = u.organization_id
                          ORDER BY FIELD(u.role, 'admin', 'staff', 'customer'), u.first_name, u.last_name")->fetchAll();
    foreach ($users as $u) {
        if ((int)$u['is_active']) $role_counts[$u['role']]++; else $inactive++;
    }
    $orgs = $pdo->query("SELECT o.*,
                                (SELECT COUNT(*) FROM users AS u WHERE u.organization_id = o.id) AS members,
                                (SELECT COUNT(*) FROM quote_requests AS q WHERE q.organization_id = o.id) AS quotes,
                                (SELECT COALESCE(SUM(q.quantity), 0) FROM quote_requests AS q WHERE q.organization_id = o.id) AS units
                         FROM organizations AS o
                         ORDER BY o.type = 'internal' DESC, o.status = 'active' DESC, o.name")->fetchAll();
    $log = $pdo->query("SELECT a.action, a.details, a.created_at, CONCAT(u.first_name, ' ', u.last_name) AS who
                        FROM activity_log AS a LEFT JOIN users AS u ON u.id = a.user_id
                        WHERE a.action IN ('role_change','user_deactivate','user_reactivate','user_org','create_user','delete_user',
                                           'org_create','org_update','org_suspend','org_reactivate','org_delete','settings_update')
                        ORDER BY a.created_at DESC, a.id DESC LIMIT 10")->fetchAll();
    try {
        $settings_meta = $pdo->query("SELECT s.updated_at, CONCAT(u.first_name, ' ', u.last_name) AS who
                                      FROM system_settings AS s LEFT JOIN users AS u ON u.id = s.updated_by
                                      WHERE s.updated_by IS NOT NULL ORDER BY s.updated_at DESC LIMIT 1")->fetch() ?: null;
    } catch (PDOException $e) {
        $settings_meta = null;
    }
}
$me         = (int)$current_user_id;
$roles      = ['admin' => 'Admin', 'staff' => 'Staff', 'customer' => 'Customer'];
$active_orgs = count(array_filter($orgs, fn($o) => $o['status'] === 'active'));
$maint      = setting_on('maintenance_mode');
$log_icons  = [
    'role_change' => 'fa-user-shield', 'user_deactivate' => 'fa-user-lock', 'user_reactivate' => 'fa-user-check',
    'user_org' => 'fa-building-user', 'create_user' => 'fa-user-plus', 'delete_user' => 'fa-user-xmark',
    'org_create' => 'fa-building-circle-check', 'org_update' => 'fa-pen', 'org_suspend' => 'fa-building-lock',
    'org_reactivate' => 'fa-building-circle-arrow-right', 'org_delete' => 'fa-building-circle-xmark', 'settings_update' => 'fa-sliders',
];
$initials = fn(string $f, string $l) => strtoupper(mb_substr($f, 0, 1) . mb_substr($l, 0, 1));
$when = fn(?string $d) => $d ? date('M j, Y · g:i a', strtotime($d)) : 'Never';

include __DIR__ . '/../includes/head.php';
?>
<body class="admin-body">
<?php include __DIR__ . '/../includes/admin-layout.php'; ?>
<!-- Super admin console. Kind: service (corporate giveaways, staff-only, noindex).
     Look: the storefront's navy #1f2b4d and orange #ff6b00 on white, Mona Sans; flat grounds, one radius scale. -->
<main class="sa" id="sa-main">

  <?php if ($flash): ?>
    <div class="sa-flash sa-flash--<?= e($flash['type']) ?>" role="status">
      <i class="fas <?= $flash['type'] === 'success' ? 'fa-circle-check' : ($flash['type'] === 'info' ? 'fa-circle-info' : 'fa-triangle-exclamation') ?>" aria-hidden="true"></i>
      <span><?= e($flash['message']) ?></span>
    </div>
  <?php endif; ?>

  <!-- 1. Overview: what this console controls, the live counts and the store's state -->
  <section class="sa-hero" data-enter aria-labelledby="sa-title">
    <div class="wrap">
    <div class="sa-hero__text">
      <p class="sa-eyebrow">Super admin console</p>
      <h1 id="sa-title">Roles, client organizations and site settings for the corporate giveaways store</h1>
      <p class="sa-lead"><?= count($users) ?> accounts across <?= count($orgs) ?> organizations. Promote staff to admin, demote an admin, suspend a client company or pause the quote desk for CreativeKit3A, all from this page.</p>
      <div class="sa-hero__actions">
        <a class="sa-btn sa-btn--primary" href="#users">Manage user roles</a>
        <a class="sa-btn sa-btn--ghost" href="#settings">Change site settings</a>
      </div>
    </div>
    <ul class="sa-stats" aria-label="Live counts">
      <li class="sa-stat sa-stat--orange">
        <span class="sa-stat__label"><i class="fas fa-user-shield" aria-hidden="true"></i> Admins</span>
        <strong class="sa-stat__value"><?= $role_counts['admin'] ?></strong>
        <span class="sa-stat__note">full control of this console</span>
      </li>
      <li class="sa-stat">
        <span class="sa-stat__label"><i class="fas fa-user-tie" aria-hidden="true"></i> Staff</span>
        <strong class="sa-stat__value"><?= $role_counts['staff'] ?></strong>
        <span class="sa-stat__note">products, quotes and reports</span>
      </li>
      <li class="sa-stat">
        <span class="sa-stat__label"><i class="fas fa-user" aria-hidden="true"></i> Customers</span>
        <strong class="sa-stat__value"><?= $role_counts['customer'] ?></strong>
        <span class="sa-stat__note"><?= setting_on('registration_open') ? 'registration open' : 'registration paused' ?></span>
      </li>
      <li class="sa-stat">
        <span class="sa-stat__label"><i class="fas fa-building" aria-hidden="true"></i> Organizations</span>
        <strong class="sa-stat__value"><?= $active_orgs ?><small>/<?= count($orgs) ?></small></strong>
        <span class="sa-stat__note">active of all</span>
      </li>
      <li class="sa-stat">
        <span class="sa-stat__label"><i class="fas fa-user-lock" aria-hidden="true"></i> Deactivated</span>
        <strong class="sa-stat__value"><?= $inactive ?></strong>
        <span class="sa-stat__note">accounts that cannot sign in</span>
      </li>
      <li class="sa-stat <?= $maint ? 'sa-stat--alert' : 'sa-stat--navy' ?>">
        <span class="sa-stat__label"><i class="fas <?= $maint ? 'fa-screwdriver-wrench' : 'fa-store' ?>" aria-hidden="true"></i> Quote desk</span>
        <strong class="sa-stat__value sa-stat__value--word"><?= $maint ? 'Paused' : 'Open' ?></strong>
        <span class="sa-stat__note">minimum <?= number_format((int)setting('quote_min_qty')) ?> pieces</span>
      </li>
    </ul>
      </div>
  </section>

  <nav class="sa-jump" aria-label="Console sections">
    <a href="#users"><i class="fas fa-users" aria-hidden="true"></i> Users <span><?= count($users) ?></span></a>
    <a href="#organizations"><i class="fas fa-building" aria-hidden="true"></i> Organizations <span><?= count($orgs) ?></span></a>
    <a href="#settings"><i class="fas fa-sliders" aria-hidden="true"></i> Settings</a>
    <a href="#audit"><i class="fas fa-clock-rotate-left" aria-hidden="true"></i> Change log</a>
  </nav>

  <!-- 2. Users: every account, its role, organization and status -->
  <section class="sa-section" id="users" aria-labelledby="users-h">
    <div class="wrap">
    <div class="sa-section__head">
      <div>
        <h2 id="users-h">User accounts and roles</h2>
        <p class="sa-sub">Admins get this console. Staff keep products, quotes and reports. Customers use the storefront only. A change applies on the user's next page load.</p>
      </div>
      <button type="button" class="sa-btn sa-btn--primary" data-open="sa-add-user"><i class="fas fa-user-plus" aria-hidden="true"></i> Add a user</button>
    </div>

    <div class="sa-toolbar">
      <label class="sa-search">
        <i class="fas fa-magnifying-glass" aria-hidden="true"></i>
        <span class="sa-visually-hidden">Search users</span>
        <input type="search" id="sa-user-search" placeholder="Search by name, email or organization" autocomplete="off">
      </label>
      <div class="sa-filter" role="group" aria-label="Show users">
        <button type="button" class="is-on" data-filter="all" aria-pressed="true">All <span><?= count($users) ?></span></button>
        <button type="button" data-filter="admin" aria-pressed="false">Admins <span><?= $role_counts['admin'] ?></span></button>
        <button type="button" data-filter="staff" aria-pressed="false">Staff <span><?= $role_counts['staff'] ?></span></button>
        <button type="button" data-filter="customer" aria-pressed="false">Customers <span><?= $role_counts['customer'] ?></span></button>
        <button type="button" data-filter="inactive" aria-pressed="false">Deactivated <span><?= $inactive ?></span></button>
      </div>
    </div>

    <div class="sa-table-wrap">
      <table class="sa-table" id="sa-users">
        <thead>
          <tr><th scope="col">User</th><th scope="col">Role</th><th scope="col">Organization</th><th scope="col">Status</th><th scope="col">Last sign-in</th><th scope="col"><span class="sa-visually-hidden">Actions</span></th></tr>
        </thead>
        <tbody>
        <?php foreach ($users as $u):
            $uid = (int)$u['id']; $self = $uid === $me; $name = $u['first_name'] . ' ' . $u['last_name'];
            $state = !(int)$u['is_active'] ? 'inactive' : (($u['org_status'] ?? '') === 'suspended' ? 'suspended' : 'active'); ?>
          <tr data-role="<?= e($u['role']) ?>" data-state="<?= $state ?>" data-search="<?= e(strtolower($name . ' ' . $u['email'] . ' ' . ($u['org_name'] ?? ''))) ?>">
            <td data-label="User">
              <span class="sa-person">
                <span class="sa-avatar sa-avatar--<?= e($u['role']) ?>" aria-hidden="true"><?= e($initials($u['first_name'], $u['last_name'])) ?></span>
                <span class="sa-person__text"><strong><?= e($name) ?><?php if ($self): ?> <em class="sa-you">You</em><?php endif; ?></strong><small><?= e($u['email']) ?></small></span>
              </span>
            </td>
            <td data-label="Role"><span class="sa-role sa-role--<?= e($u['role']) ?>"><?= $roles[$u['role']] ?></span></td>
            <td data-label="Organization"><?= $u['org_name'] ? e($u['org_name']) : '<span class="sa-muted">None</span>' ?></td>
            <td data-label="Status">
              <?php if ($state === 'inactive'): ?><span class="sa-state sa-state--off">Deactivated</span>
              <?php elseif ($state === 'suspended'): ?><span class="sa-state sa-state--warn">Organization suspended</span>
              <?php else: ?><span class="sa-state sa-state--on">Active</span><?php endif; ?>
            </td>
            <td data-label="Last sign-in" class="sa-nowrap"><?= e($when($u['last_login_at'])) ?></td>
            <td class="sa-actions">
              <?php if ($self): ?>
                <span class="sa-muted sa-self-note">Another admin changes your account</span>
              <?php else: ?>
                <form method="post" action="<?= BASE_URL ?>/actions/super-admin-actions.php"
                      <?= $u['role'] === 'admin' ? 'data-confirm="Demote ' . e($name) . ' to staff? They lose this console straight away."' : '' ?>>
                  <input type="hidden" name="csrf" value="<?= e($csrf) ?>">
                  <input type="hidden" name="action" value="set_role">
                  <input type="hidden" name="user_id" value="<?= $uid ?>">
                  <?php if ($u['role'] === 'admin'): ?>
                    <input type="hidden" name="role" value="staff">
                    <button type="submit" class="sa-btn sa-btn--small sa-btn--ghost"><i class="fas fa-arrow-down" aria-hidden="true"></i> Demote to staff</button>
                  <?php else: ?>
                    <input type="hidden" name="role" value="admin">
                    <button type="submit" class="sa-btn sa-btn--small sa-btn--primary"><i class="fas fa-arrow-up" aria-hidden="true"></i> Promote to admin</button>
                  <?php endif; ?>
                </form>
                <button type="button" class="sa-btn sa-btn--small sa-btn--ghost" data-manage
                        data-id="<?= $uid ?>" data-name="<?= e($name) ?>" data-email="<?= e($u['email']) ?>"
                        data-role="<?= e($u['role']) ?>" data-org="<?= (int)$u['organization_id'] ?>" data-active="<?= (int)$u['is_active'] ?>"
                        aria-label="Manage <?= e($name) ?>"><i class="fas fa-sliders" aria-hidden="true"></i> Manage</button>
              <?php endif; ?>
            </td>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table>
      <p class="sa-empty" id="sa-users-empty" hidden>No user matches that search.</p>
    </div>
      </div>
  </section>

  <!-- 3. Organizations: CreativeKit3A and the client companies that request quotes -->
  <section class="sa-section" id="organizations" aria-labelledby="orgs-h">
    <div class="wrap">
    <div class="sa-section__head">
      <div>
        <h2 id="orgs-h">Client organizations</h2>
        <p class="sa-sub">A company joins this list with its first quote request. Suspending one signs out its members and stops their sign-in until you reactivate it.</p>
      </div>
      <button type="button" class="sa-btn sa-btn--primary" data-org-edit data-id="0"><i class="fas fa-building-circle-check" aria-hidden="true"></i> Add an organization</button>
    </div>

    <ul class="sa-orgs">
      <?php foreach ($orgs as $o): $internal = $o['type'] === 'internal'; $susp = $o['status'] === 'suspended'; ?>
        <li class="sa-org<?= $internal ? ' sa-org--house' : '' ?><?= $susp ? ' is-suspended' : '' ?>">
          <div class="sa-org__top">
            <span class="sa-org__mark" aria-hidden="true"><?= e(mb_strtoupper(mb_substr($o['name'], 0, 1))) ?></span>
            <div class="sa-org__name">
              <h3><?= e($o['name']) ?></h3>
              <p><?= $internal ? 'CreativeKit3A staff' : 'Client company' ?><?= $o['contact_email'] ? ' · ' . e($o['contact_email']) : '' ?></p>
            </div>
            <span class="sa-state <?= $susp ? 'sa-state--warn' : 'sa-state--on' ?>"><?= $susp ? 'Suspended' : 'Active' ?></span>
          </div>
          <dl class="sa-org__facts">
            <div><dt>Members</dt><dd><?= (int)$o['members'] ?></dd></div>
            <div><dt>Quote requests</dt><dd><?= (int)$o['quotes'] ?></dd></div>
            <div><dt>Pieces asked</dt><dd><?= number_format((int)$o['units']) ?></dd></div>
          </dl>
          <div class="sa-org__actions">
            <button type="button" class="sa-btn sa-btn--small sa-btn--ghost" data-org-edit
                    data-id="<?= (int)$o['id'] ?>" data-name="<?= e($o['name']) ?>" data-email="<?= e($o['contact_email'] ?? '') ?>" data-notes="<?= e($o['notes'] ?? '') ?>"
                    aria-label="Edit <?= e($o['name']) ?>"><i class="fas fa-pen" aria-hidden="true"></i> Edit</button>
            <?php if (!$internal): ?>
              <form method="post" action="<?= BASE_URL ?>/actions/super-admin-actions.php"
                    <?= $susp ? '' : 'data-confirm="Suspend ' . e($o['name']) . '? Its members are signed out and cannot sign in."' ?>>
                <input type="hidden" name="csrf" value="<?= e($csrf) ?>">
                <input type="hidden" name="action" value="set_org_status">
                <input type="hidden" name="org_id" value="<?= (int)$o['id'] ?>">
                <input type="hidden" name="status" value="<?= $susp ? 'active' : 'suspended' ?>">
                <button type="submit" class="sa-btn sa-btn--small sa-btn--ghost" aria-label="<?= ($susp ? 'Reactivate ' : 'Suspend ') . e($o['name']) ?>">
                  <i class="fas <?= $susp ? 'fa-rotate-left' : 'fa-ban' ?>" aria-hidden="true"></i> <?= $susp ? 'Reactivate' : 'Suspend' ?>
                </button>
              </form>
              <form method="post" action="<?= BASE_URL ?>/actions/super-admin-actions.php"
                    data-confirm="Delete <?= e($o['name']) ?>? Its members and quote requests stay, without an organization." data-danger>
                <input type="hidden" name="csrf" value="<?= e($csrf) ?>">
                <input type="hidden" name="action" value="delete_org">
                <input type="hidden" name="org_id" value="<?= (int)$o['id'] ?>">
                <button type="submit" class="sa-btn sa-btn--small sa-btn--danger" aria-label="Delete <?= e($o['name']) ?>"><i class="fas fa-trash-can" aria-hidden="true"></i> Delete</button>
              </form>
            <?php else: ?>
              <span class="sa-muted sa-house-note">Always active</span>
            <?php endif; ?>
          </div>
        </li>
      <?php endforeach; ?>
    </ul>
      </div>
  </section>

  <!-- 4. System-wide settings: each switch takes effect on the next page load -->
  <section class="sa-section" id="settings" aria-labelledby="settings-h">
    <div class="wrap">
    <div class="sa-section__head">
      <div>
        <h2 id="settings-h">System-wide settings</h2>
        <p class="sa-sub"><?= $settings_meta ? 'Last changed by ' . e($settings_meta['who'] ?: 'a deleted account') . ' on ' . e($when($settings_meta['updated_at'])) . '.' : 'Running on the defaults. Changes apply to the whole site on the next page load.' ?></p>
      </div>
    </div>

    <form class="sa-settings" method="post" action="<?= BASE_URL ?>/actions/super-admin-actions.php">
      <input type="hidden" name="csrf" value="<?= e($csrf) ?>">
      <input type="hidden" name="action" value="save_settings">

      <fieldset class="sa-card">
        <legend><i class="fas fa-store" aria-hidden="true"></i> Store details</legend>
        <div class="sa-field">
          <label for="set-store-name">Store name</label>
          <input id="set-store-name" name="store_name" type="text" maxlength="255" required value="<?= e(setting('store_name')) ?>">
        </div>
        <div class="sa-field">
          <label for="set-support-email">Support email</label>
          <input id="set-support-email" name="support_email" type="email" maxlength="255" required value="<?= e(setting('support_email')) ?>">
        </div>
      </fieldset>

      <fieldset class="sa-card">
        <legend><i class="fas fa-key" aria-hidden="true"></i> Access</legend>
        <div class="sa-switch">
          <input id="set-registration" name="registration_open" type="checkbox" value="1" <?= setting_on('registration_open') ? 'checked' : '' ?>>
          <label for="set-registration"><strong>Customer registration</strong><small>New customers can create an account from the storefront.</small></label>
        </div>
        <div class="sa-field">
          <label for="set-session">Staff session length, in hours</label>
          <input id="set-session" name="session_hours" type="number" min="1" max="72" required value="<?= e(setting('session_hours')) ?>">
        </div>
      </fieldset>

      <fieldset class="sa-card">
        <legend><i class="fas fa-file-invoice" aria-hidden="true"></i> Quote desk</legend>
        <div class="sa-field">
          <label for="set-min-qty">Minimum quote quantity, in pieces</label>
          <input id="set-min-qty" name="quote_min_qty" type="number" min="1" max="10000" required value="<?= e(setting('quote_min_qty')) ?>">
        </div>
        <div class="sa-switch sa-switch--alert">
          <input id="set-maintenance" name="maintenance_mode" type="checkbox" value="1" <?= $maint ? 'checked' : '' ?>>
          <label for="set-maintenance"><strong>Maintenance mode</strong><small>The quote form shows the message below and takes no requests. Staff can still submit.</small></label>
        </div>
        <div class="sa-field">
          <label for="set-maint-msg">Maintenance message</label>
          <textarea id="set-maint-msg" name="maintenance_message" rows="2" maxlength="255" required><?= e(setting('maintenance_message')) ?></textarea>
        </div>
      </fieldset>

      <div class="sa-settings__save">
        <button type="submit" class="sa-btn sa-btn--primary"><i class="fas fa-floppy-disk" aria-hidden="true"></i> Save settings</button>
      </div>
    </form>
      </div>
  </section>

  <!-- 5. The log of changes made in this console -->
  <section class="sa-section" id="audit" aria-labelledby="audit-h">
    <div class="wrap">
    <div class="sa-section__head">
      <div>
        <h2 id="audit-h">Console change log</h2>
        <p class="sa-sub">The last ten role, organization and settings changes, newest first.</p>
      </div>
    </div>
    <?php if ($log): ?>
      <ol class="sa-log">
        <?php foreach ($log as $l): ?>
          <li>
            <span class="sa-log__icon" aria-hidden="true"><i class="fas <?= $log_icons[$l['action']] ?? 'fa-circle' ?>"></i></span>
            <span class="sa-log__text"><strong><?= e($l['details']) ?></strong><small><?= e($l['who'] ?: 'A deleted account') ?> · <?= e($when($l['created_at'])) ?></small></span>
          </li>
        <?php endforeach; ?>
      </ol>
    <?php else: ?>
      <p class="sa-card sa-log-empty">No change has been made here yet. Role changes, suspensions and saved settings appear in this log.</p>
    <?php endif; ?>
      </div>
  </section>
</main>

<!-- Manage a user: role, organization, sign-in, delete (filled by super-admin.js) -->
<dialog class="sa-dialog" id="sa-manage" aria-labelledby="sa-manage-title">
  <div class="sa-dialog__head">
    <div><h2 id="sa-manage-title">Manage user</h2><p class="sa-sub" id="sa-manage-email"></p></div>
    <button type="button" class="sa-icon-btn" data-close aria-label="Close"><i class="fas fa-xmark" aria-hidden="true"></i></button>
  </div>

  <form method="post" action="<?= BASE_URL ?>/actions/super-admin-actions.php" class="sa-dialog__block">
    <input type="hidden" name="csrf" value="<?= e($csrf) ?>">
    <input type="hidden" name="action" value="set_role">
    <input type="hidden" name="user_id" data-user-id>
    <fieldset class="sa-roles">
      <legend>Role</legend>
      <?php foreach (['admin' => 'Full control, including this console', 'staff' => 'Products, quotes and reports', 'customer' => 'Storefront only, no staff portal'] as $r => $desc): ?>
        <label class="sa-role-option"><input type="radio" name="role" value="<?= $r ?>"><span><strong><?= $roles[$r] ?></strong><small><?= $desc ?></small></span></label>
      <?php endforeach; ?>
    </fieldset>
    <button type="submit" class="sa-btn sa-btn--primary">Save the role</button>
  </form>

  <form method="post" action="<?= BASE_URL ?>/actions/super-admin-actions.php" class="sa-dialog__block">
    <input type="hidden" name="csrf" value="<?= e($csrf) ?>">
    <input type="hidden" name="action" value="set_org">
    <input type="hidden" name="user_id" data-user-id>
    <div class="sa-field">
      <label for="sa-manage-org">Organization</label>
      <select id="sa-manage-org" name="organization_id">
        <option value="0">No organization</option>
        <?php foreach ($orgs as $o): ?><option value="<?= (int)$o['id'] ?>"><?= e($o['name']) ?></option><?php endforeach; ?>
      </select>
    </div>
    <button type="submit" class="sa-btn sa-btn--ghost">Move to this organization</button>
  </form>

  <div class="sa-dialog__block sa-dialog__row">
    <form method="post" action="<?= BASE_URL ?>/actions/super-admin-actions.php" data-active-form>
      <input type="hidden" name="csrf" value="<?= e($csrf) ?>">
      <input type="hidden" name="action" value="set_active">
      <input type="hidden" name="user_id" data-user-id>
      <input type="hidden" name="active" data-active-value>
      <button type="submit" class="sa-btn sa-btn--ghost" data-active-label>Deactivate the account</button>
    </form>
    <form method="post" action="<?= BASE_URL ?>/actions/super-admin-actions.php" data-delete-form data-danger>
      <input type="hidden" name="csrf" value="<?= e($csrf) ?>">
      <input type="hidden" name="action" value="delete_user">
      <input type="hidden" name="user_id" data-user-id>
      <button type="submit" class="sa-btn sa-btn--danger"><i class="fas fa-trash-can" aria-hidden="true"></i> Delete the account</button>
    </form>
  </div>
</dialog>

<!-- Add a user -->
<dialog class="sa-dialog" id="sa-add-user" aria-labelledby="sa-add-title">
  <div class="sa-dialog__head">
    <div><h2 id="sa-add-title">Add a user</h2><p class="sa-sub">They sign in with this email and starting password.</p></div>
    <button type="button" class="sa-icon-btn" data-close aria-label="Close"><i class="fas fa-xmark" aria-hidden="true"></i></button>
  </div>
  <form method="post" action="<?= BASE_URL ?>/actions/super-admin-actions.php" class="sa-dialog__block sa-grid-2">
    <input type="hidden" name="csrf" value="<?= e($csrf) ?>">
    <input type="hidden" name="action" value="create_user">
    <div class="sa-field"><label for="nu-first">First name</label><input id="nu-first" name="first_name" required minlength="2" autocomplete="off"></div>
    <div class="sa-field"><label for="nu-last">Last name</label><input id="nu-last" name="last_name" required minlength="2" autocomplete="off"></div>
    <div class="sa-field sa-span-2"><label for="nu-email">Email</label><input id="nu-email" name="email" type="email" required autocomplete="off"></div>
    <div class="sa-field"><label for="nu-role">Role</label>
      <select id="nu-role" name="role"><option value="staff">Staff</option><option value="admin">Admin</option><option value="customer">Customer</option></select></div>
    <div class="sa-field"><label for="nu-org">Organization</label>
      <select id="nu-org" name="organization_id"><option value="0">No organization</option>
        <?php foreach ($orgs as $o): ?><option value="<?= (int)$o['id'] ?>" <?= $o['type'] === 'internal' ? 'selected' : '' ?>><?= e($o['name']) ?></option><?php endforeach; ?>
      </select></div>
    <div class="sa-field sa-span-2"><label for="nu-pass">Starting password, 8 characters or more</label><input id="nu-pass" name="password" type="text" minlength="8" required autocomplete="new-password"></div>
    <div class="sa-span-2"><button type="submit" class="sa-btn sa-btn--primary">Add the user</button></div>
  </form>
</dialog>

<!-- Add or edit an organization -->
<dialog class="sa-dialog" id="sa-org" aria-labelledby="sa-org-title">
  <div class="sa-dialog__head">
    <div><h2 id="sa-org-title">Add an organization</h2><p class="sa-sub">A client company that orders giveaways.</p></div>
    <button type="button" class="sa-icon-btn" data-close aria-label="Close"><i class="fas fa-xmark" aria-hidden="true"></i></button>
  </div>
  <form method="post" action="<?= BASE_URL ?>/actions/super-admin-actions.php" class="sa-dialog__block">
    <input type="hidden" name="csrf" value="<?= e($csrf) ?>">
    <input type="hidden" name="action" value="save_org">
    <input type="hidden" name="org_id" value="0" data-org-id>
    <div class="sa-field"><label for="org-name">Name</label><input id="org-name" name="name" required minlength="2" maxlength="150"></div>
    <div class="sa-field"><label for="org-email">Contact email</label><input id="org-email" name="contact_email" type="email" maxlength="255"></div>
    <div class="sa-field"><label for="org-notes">Notes</label><input id="org-notes" name="notes" maxlength="255"></div>
    <button type="submit" class="sa-btn sa-btn--primary" data-org-submit>Add the organization</button>
  </form>
</dialog>

<!-- Confirm a change that removes access -->
<dialog class="sa-dialog sa-dialog--confirm" id="sa-confirm" aria-labelledby="sa-confirm-text">
  <p id="sa-confirm-text"></p>
  <div class="sa-dialog__row">
    <button type="button" class="sa-btn sa-btn--ghost" data-close>Keep it as it is</button>
    <button type="button" class="sa-btn sa-btn--primary" data-confirm-ok>Yes, go ahead</button>
  </div>
</dialog>

<?php include __DIR__ . '/../includes/admin-footer.php'; ?>
