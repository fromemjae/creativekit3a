<?php
/**
 * actions/super-admin-actions.php — POST handler for pages/super-admin.php (admins only)
 *
 * Users:         set_role (promote / demote), set_active, set_org, create_user, delete_user
 * Organizations: save_org (create or edit), set_org_status, delete_org
 * Settings:      save_settings
 *
 * Every request carries the console's CSRF token. Safety rules: an admin never changes,
 * deactivates or deletes their own account here, and the last active admin always stays.
 * Each change is written to activity_log, then the browser returns to the console (PRG).
 */

require_once __DIR__ . '/../config/db.php';
$required_role = 'admin';
require_once __DIR__ . '/../auth/guard.php';

$back = BASE_URL . '/pages/super-admin.php';

function sa_back(string $type, string $message, string $anchor = ''): void {
    global $back;
    set_flash($type, $message);
    header('Location: ' . $back . ($anchor !== '' ? '#' . $anchor : ''));
    exit;
}

function sa_log(PDO $pdo, string $action, string $type, ?int $id, string $details): void {
    $pdo->prepare('INSERT INTO activity_log (user_id, action, entity_type, entity_id, details, ip_address)
                   VALUES (:uid, :act, :type, :eid, :details, :ip)')
        ->execute([
            ':uid' => (int)$_SESSION['user_id'], ':act' => $action, ':type' => $type, ':eid' => $id,
            ':details' => $details, ':ip' => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
        ]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ' . $back);
    exit;
}
if (!$pdo) {
    sa_back('danger', 'The database is not connected, so nothing was changed.');
}
if (!hash_equals($_SESSION['sa_csrf'] ?? '', (string)($_POST['csrf'] ?? ''))) {
    sa_back('danger', 'That form had expired. Please try again.');
}

$me     = (int)$_SESSION['user_id'];
$action = $_POST['action'] ?? '';
$roles  = ['admin' => 'Admin', 'staff' => 'Staff', 'customer' => 'Customer'];

/** The user a form names, or back to the console */
function sa_user(PDO $pdo, int $id): array {
    $st = $pdo->prepare('SELECT id, first_name, last_name, email, role, is_active, organization_id FROM users WHERE id = :id');
    $st->execute([':id' => $id]);
    $u = $st->fetch();
    if (!$u) sa_back('danger', 'That user no longer exists.', 'users');
    return $u;
}

/** Active admins other than the one named */
function sa_other_admins(PDO $pdo, int $id): int {
    $st = $pdo->prepare("SELECT COUNT(*) FROM users WHERE role = 'admin' AND is_active = 1 AND id <> :id");
    $st->execute([':id' => $id]);
    return (int)$st->fetchColumn();
}

switch ($action) {

    // ---------------------------------------------------------------- users
    case 'set_role':
        $u = sa_user($pdo, (int)($_POST['user_id'] ?? 0));
        $role = $_POST['role'] ?? '';
        $name = $u['first_name'] . ' ' . $u['last_name'];
        if (!isset($roles[$role])) sa_back('danger', 'Choose admin, staff or customer.', 'users');
        if ((int)$u['id'] === $me) sa_back('warning', 'You cannot change your own role. Ask another admin.', 'users');
        if ($u['role'] === $role) sa_back('info', "{$name} is already {$roles[$role]}.", 'users');
        if ($u['role'] === 'admin' && sa_other_admins($pdo, (int)$u['id']) === 0) {
            sa_back('warning', "{$name} is the last active admin. Promote someone else first.", 'users');
        }
        $pdo->prepare('UPDATE users SET role = :r WHERE id = :id')->execute([':r' => $role, ':id' => $u['id']]);
        $verb = $role === 'admin' ? 'Promoted' : 'Changed';
        sa_log($pdo, 'role_change', 'user', (int)$u['id'], "{$verb} {$name} from " . $roles[$u['role']] . " to {$roles[$role]}");
        sa_back('success', "{$name} is now {$roles[$role]}. The change applies on their next page load.", 'users');

    case 'set_active':
        $u = sa_user($pdo, (int)($_POST['user_id'] ?? 0));
        $on = ($_POST['active'] ?? '') === '1' ? 1 : 0;
        $name = $u['first_name'] . ' ' . $u['last_name'];
        if ((int)$u['id'] === $me) sa_back('warning', 'You cannot deactivate your own account.', 'users');
        if (!$on && $u['role'] === 'admin' && sa_other_admins($pdo, (int)$u['id']) === 0) {
            sa_back('warning', "{$name} is the last active admin and stays active.", 'users');
        }
        $pdo->prepare('UPDATE users SET is_active = :a WHERE id = :id')->execute([':a' => $on, ':id' => $u['id']]);
        sa_log($pdo, $on ? 'user_reactivate' : 'user_deactivate', 'user', (int)$u['id'], ($on ? 'Reactivated ' : 'Deactivated ') . $name);
        sa_back('success', $on ? "{$name} can sign in again." : "{$name} is signed out and cannot sign in.", 'users');

    case 'set_org':
        $u = sa_user($pdo, (int)($_POST['user_id'] ?? 0));
        $org_id = (int)($_POST['organization_id'] ?? 0);
        $org_name = 'no organization';
        if ($org_id > 0) {
            $st = $pdo->prepare('SELECT name FROM organizations WHERE id = :id');
            $st->execute([':id' => $org_id]);
            $org_name = $st->fetchColumn();
            if ($org_name === false) sa_back('danger', 'That organization no longer exists.', 'users');
        }
        $pdo->prepare('UPDATE users SET organization_id = :o WHERE id = :id')->execute([':o' => $org_id ?: null, ':id' => $u['id']]);
        $name = $u['first_name'] . ' ' . $u['last_name'];
        sa_log($pdo, 'user_org', 'user', (int)$u['id'], "Moved {$name} to {$org_name}");
        sa_back('success', "{$name} moved to {$org_name}.", 'users');

    case 'create_user':
        $first = trim($_POST['first_name'] ?? '');
        $last  = trim($_POST['last_name'] ?? '');
        $email = strtolower(trim($_POST['email'] ?? ''));
        $role  = $_POST['role'] ?? 'staff';
        $pass  = (string)($_POST['password'] ?? '');
        $org_id = (int)($_POST['organization_id'] ?? 0);
        $errors = [];
        if (mb_strlen($first) < 2 || mb_strlen($last) < 2) $errors[] = 'Enter a first and last name.';
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Enter a valid email address.';
        if (!isset($roles[$role])) $errors[] = 'Choose admin, staff or customer.';
        if (strlen($pass) < 8) $errors[] = 'The starting password needs 8 characters or more.';
        if (!$errors) {
            $st = $pdo->prepare('SELECT id FROM users WHERE email = :e');
            $st->execute([':e' => $email]);
            if ($st->fetchColumn()) $errors[] = 'An account with that email already exists.';
        }
        if ($errors) sa_back('danger', implode(' ', $errors), 'users');
        $pdo->prepare('INSERT INTO users (first_name, last_name, email, password_hash, role, organization_id, is_active)
                       VALUES (:f, :l, :e, :h, :r, :o, 1)')
            ->execute([':f' => $first, ':l' => $last, ':e' => $email, ':h' => password_hash($pass, PASSWORD_DEFAULT), ':r' => $role, ':o' => $org_id ?: null]);
        $id = (int)$pdo->lastInsertId();
        sa_log($pdo, 'create_user', 'user', $id, "Added {$roles[$role]} account: {$first} {$last}");
        sa_back('success', "{$first} {$last} can now sign in as {$roles[$role]}.", 'users');

    case 'delete_user':
        $u = sa_user($pdo, (int)($_POST['user_id'] ?? 0));
        $name = $u['first_name'] . ' ' . $u['last_name'];
        if ((int)$u['id'] === $me) sa_back('warning', 'You cannot delete your own account.', 'users');
        if ($u['role'] === 'admin' && sa_other_admins($pdo, (int)$u['id']) === 0) {
            sa_back('warning', "{$name} is the last active admin and cannot be deleted.", 'users');
        }
        $pdo->prepare('DELETE FROM users WHERE id = :id')->execute([':id' => $u['id']]);
        sa_log($pdo, 'delete_user', 'user', (int)$u['id'], "Deleted the account of {$name} ({$u['email']})");
        sa_back('success', "{$name}'s account is deleted. Their quotes and products stay, unassigned.", 'users');

    // -------------------------------------------------------- organizations
    case 'save_org':
        $id    = (int)($_POST['org_id'] ?? 0);
        $name  = trim($_POST['name'] ?? '');
        $email = strtolower(trim($_POST['contact_email'] ?? ''));
        $notes = trim($_POST['notes'] ?? '');
        if (mb_strlen($name) < 2) sa_back('danger', 'Enter the organization\'s name.', 'organizations');
        if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) sa_back('danger', 'Enter a valid contact email, or leave it empty.', 'organizations');
        $st = $pdo->prepare('SELECT id FROM organizations WHERE name = :n AND id <> :id');
        $st->execute([':n' => $name, ':id' => $id]);
        if ($st->fetchColumn()) sa_back('danger', "An organization named {$name} already exists.", 'organizations');
        if ($id > 0) {
            $pdo->prepare('UPDATE organizations SET name = :n, contact_email = :e, notes = :t WHERE id = :id')
                ->execute([':n' => $name, ':e' => $email ?: null, ':t' => $notes ?: null, ':id' => $id]);
            sa_log($pdo, 'org_update', 'organization', $id, "Edited organization {$name}");
            sa_back('success', "{$name} is saved.", 'organizations');
        }
        $pdo->prepare("INSERT INTO organizations (name, type, contact_email, notes) VALUES (:n, 'client', :e, :t)")
            ->execute([':n' => $name, ':e' => $email ?: null, ':t' => $notes ?: null]);
        $id = (int)$pdo->lastInsertId();
        sa_log($pdo, 'org_create', 'organization', $id, "Added organization {$name}");
        sa_back('success', "{$name} is added.", 'organizations');

    case 'set_org_status':
        $id = (int)($_POST['org_id'] ?? 0);
        $status = ($_POST['status'] ?? '') === 'suspended' ? 'suspended' : 'active';
        $st = $pdo->prepare('SELECT name, type FROM organizations WHERE id = :id');
        $st->execute([':id' => $id]);
        $org = $st->fetch();
        if (!$org) sa_back('danger', 'That organization no longer exists.', 'organizations');
        if ($org['type'] === 'internal') sa_back('warning', 'CreativeKit3A\'s own organization cannot be suspended.', 'organizations');
        $pdo->prepare('UPDATE organizations SET status = :s WHERE id = :id')->execute([':s' => $status, ':id' => $id]);
        sa_log($pdo, $status === 'suspended' ? 'org_suspend' : 'org_reactivate', 'organization', $id, ($status === 'suspended' ? 'Suspended ' : 'Reactivated ') . $org['name']);
        sa_back('success', $status === 'suspended' ? "{$org['name']} is suspended: its members cannot sign in." : "{$org['name']} is active again.", 'organizations');

    case 'delete_org':
        $id = (int)($_POST['org_id'] ?? 0);
        $st = $pdo->prepare('SELECT name, type FROM organizations WHERE id = :id');
        $st->execute([':id' => $id]);
        $org = $st->fetch();
        if (!$org) sa_back('danger', 'That organization no longer exists.', 'organizations');
        if ($org['type'] === 'internal') sa_back('warning', 'CreativeKit3A\'s own organization cannot be deleted.', 'organizations');
        $pdo->prepare('DELETE FROM organizations WHERE id = :id')->execute([':id' => $id]);
        sa_log($pdo, 'org_delete', 'organization', $id, "Deleted organization {$org['name']}");
        sa_back('success', "{$org['name']} is deleted. Its members and quotes stay, without an organization.", 'organizations');

    // ------------------------------------------------------------- settings
    case 'save_settings':
        $changed = [];
        $errors  = [];
        $values  = [];
        foreach (settings_schema() as $key => [$default, $type, $label]) {
            $raw = $type === 'bool' ? (isset($_POST[$key]) ? '1' : '0') : trim((string)($_POST[$key] ?? ''));
            if ($type === 'int') {
                if (!ctype_digit($raw)) { $errors[] = "{$label} must be a whole number."; continue; }
                $n = (int)$raw;
                if ($key === 'quote_min_qty' && ($n < 1 || $n > 10000)) $errors[] = 'The minimum quote quantity must be between 1 and 10,000.';
                if ($key === 'session_hours' && ($n < 1 || $n > 72))   $errors[] = 'The session length must be between 1 and 72 hours.';
                $raw = (string)$n;
            }
            if ($type === 'email' && !filter_var($raw, FILTER_VALIDATE_EMAIL)) $errors[] = "{$label} must be an email address.";
            if ($type === 'text' && ($raw === '' || mb_strlen($raw) > 255)) $errors[] = "{$label} needs 1 to 255 characters.";
            $values[$key] = $raw;
        }
        if ($errors) sa_back('danger', implode(' ', $errors), 'settings');
        $up = $pdo->prepare('INSERT INTO system_settings (setting_key, setting_value, updated_by) VALUES (:k, :v, :u)
                             ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_by = VALUES(updated_by)');
        $schema = settings_schema();
        foreach ($values as $key => $v) {
            if (setting($key) !== $v) {
                $up->execute([':k' => $key, ':v' => $v, ':u' => $me]);
                $changed[] = $schema[$key][2];
            }
        }
        if (!$changed) sa_back('info', 'Nothing changed in the settings.', 'settings');
        sa_log($pdo, 'settings_update', 'settings', null, 'Changed ' . implode(', ', $changed));
        sa_back('success', 'Saved: ' . implode(', ', $changed) . '.', 'settings');

    default:
        sa_back('danger', 'Unknown action.');
}
