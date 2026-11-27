<?php
/**
 * auth/register.php — POST handler for the storefront Register modal.
 *
 * Creates a 'customer' account (INSERT with a bcrypt password_hash),
 * logs the activity, signs the new user in, and returns them to the page
 * they registered from. Customers can browse and request quotes; the
 * staff portal (dashboard, products, quotes, reports) stays admin/staff-only.
 */

require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ' . BASE_URL . '/');
    exit;
}

$return_to  = safe_return_to($_POST['return_to'] ?? '');
$first_name = trim($_POST['first_name'] ?? '');
$last_name  = trim($_POST['last_name'] ?? '');
$email      = strtolower(trim($_POST['email'] ?? ''));
$phone      = trim($_POST['phone'] ?? '');
$password   = $_POST['password'] ?? '';
$confirm    = $_POST['password_confirm'] ?? '';
$terms      = !empty($_POST['terms']);

// Server-side validation (mirrors the modal's client-side checks)
$errors = [];
if (mb_strlen($first_name) < 2 || mb_strlen($last_name) < 2) {
    $errors[] = 'Please enter your first and last name.';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
}
if ($phone !== '' && !preg_match('/^[0-9+\-\s()]{7,20}$/', $phone)) {
    $errors[] = 'Please enter a valid mobile number.';
}
if (strlen($password) < 8) {
    $errors[] = 'Password must be at least 8 characters.';
} elseif ($password !== $confirm) {
    $errors[] = 'Passwords do not match.';
}
if (!$terms) {
    $errors[] = 'Please accept the Terms & Conditions.';
}
if (!$pdo) {
    $errors[] = 'Registration is unavailable: the database is not connected.';
}
if (function_exists('setting_on') && !setting_on('registration_open')) {
    $errors = ['New customer accounts are paused. Please send your quote request without an account, or try again later.'];
}

if (!$errors) {
    // Email must be unique (users.email has a UNIQUE index)
    $check = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
    $check->execute([':email' => $email]);
    if ($check->fetchColumn()) {
        $errors[] = 'An account with that email already exists. Please sign in instead.';
    }
}

if ($errors) {
    $_SESSION['register_errors'] = $errors;
    $_SESSION['register_old']    = ['first_name' => $first_name, 'last_name' => $last_name, 'email' => $email, 'phone' => $phone];
    header('Location: ' . $return_to);
    exit;
}

// INSERT the new customer account
$insert = $pdo->prepare(
    'INSERT INTO users (first_name, last_name, email, phone, password_hash, role, is_active, last_login_at)
     VALUES (:first, :last, :email, :phone, :hash, :role, 1, NOW())'
);
$insert->execute([
    ':first' => $first_name,
    ':last'  => $last_name,
    ':email' => $email,
    ':phone' => $phone !== '' ? $phone : null,
    ':hash'  => password_hash($password, PASSWORD_DEFAULT),
    ':role'  => 'customer',
]);
$user_id = (int)$pdo->lastInsertId();

$log = $pdo->prepare('INSERT INTO activity_log (user_id, action, entity_type, entity_id, details, ip_address)
                      VALUES (:uid, :act, :type, :eid, :details, :ip)');
$log->execute([
    ':uid'     => $user_id,
    ':act'     => 'register',
    ':type'    => 'user',
    ':eid'     => $user_id,
    ':details' => "New customer account: {$first_name} {$last_name}",
    ':ip'      => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
]);

// Sign the new customer in
session_regenerate_id(true);
$_SESSION['user_id']    = $user_id;
$_SESSION['user_role']  = 'customer';
$_SESSION['user_name']  = $first_name . ' ' . $last_name;
$_SESSION['user_email'] = $email;

set_flash('success', 'Welcome to CreativeKit3A, ' . $first_name . '! Your account has been created.');
header('Location: ' . $return_to);
exit;
