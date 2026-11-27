<?php
/**
 * actions/quote-actions.php — Quote Request Processing Handler (POST)
 * Demonstrates:
 *   - $_POST handling
 *   - switch statement for action dispatch
 *   - if-else statement for status validation
 *   - Dual client & server-side validation
 *   - Prepared PDO statements (INSERT, UPDATE, DELETE)
 *   - Role-Based Access Control
 *   - Activity logging
 */

require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ' . BASE_URL . '/index.php');
    exit;
}

// Support raw JSON payloads as well as standard FormData
$raw_json = file_get_contents('php://input');
if (!empty($raw_json)) {
    $json_data = json_decode($raw_json, true);
    if (is_array($json_data)) {
        $_POST = array_merge($_POST, $json_data);
    }
}

$action = $_POST['action'] ?? '';

if (!$pdo) {
    if (isset($_POST['is_ajax']) && $_POST['is_ajax'] === '1') {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Database connection unavailable.']);
        exit;
    }
    set_flash('danger', 'Database connection not available.');
    header('Location: ' . BASE_URL . '/index.php');
    exit;
}

// -------------------------------------------------------------
// Action Routing using switch statement (Required PHP Construct)
// -------------------------------------------------------------
switch ($action) {

    // =========================================================
    // 1. PUBLIC QUOTE SUBMISSION (From Modal or Contact Form)
    // =========================================================
    case 'submit':
        $customer_name = trim($_POST['name'] ?? $_POST['customer_name'] ?? '');
        $company       = trim($_POST['company'] ?? '');
        $email         = trim($_POST['email'] ?? '');
        $phone         = trim($_POST['phone'] ?? '');
        $product_type  = trim($_POST['product_type'] ?? '');
        $quantity      = (int)($_POST['quantity'] ?? 100);
        $budget        = trim($_POST['budget'] ?? '');
        $deadline      = !empty($_POST['deadline']) ? $_POST['deadline'] : null;
        $details       = trim($_POST['details'] ?? '');
        $product_id    = !empty($_POST['product_id']) ? (int)$_POST['product_id'] : null;
        $is_ajax       = isset($_POST['is_ajax']) && $_POST['is_ajax'] === '1';

        // Server-Side Validation (Dual Validation: Server Side)
        $errors = [];
        if (empty($customer_name) || strlen($customer_name) < 2) {
            $errors[] = 'Full name is required.';
        }
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'A valid email address is required.';
        }
        // system settings (pages/super-admin.php): the minimum order and the maintenance switch
        $min_qty = max(1, (int)setting('quote_min_qty'));
        $qty_raw = trim((string)($_POST['quantity'] ?? ''));
        $qty_top = preg_match('/^(\d+)\s*-\s*(\d+)$/', $qty_raw, $qm) ? (int)$qm[2] : (str_ends_with($qty_raw, '+') ? PHP_INT_MAX : $quantity);
        if ($quantity <= 0 || $qty_top < $min_qty) {
            $errors[] = 'Quantity must be at least ' . number_format($min_qty) . ' pieces.';
        }
        $is_staff_session = in_array($_SESSION['user_role'] ?? '', ['admin', 'staff'], true);
        if (setting_on('maintenance_mode') && !$is_staff_session) {
            $errors = [setting('maintenance_message')];
        }

        if (!empty($errors)) {
            if ($is_ajax) {
                header('Content-Type: application/json');
                echo json_encode(['success' => false, 'errors' => $errors]);
                exit;
            }
            $_SESSION['quote_errors'] = $errors;
            $_SESSION['quote_data']   = $_POST;
            header('Location: ' . BASE_URL . '/index.php?quote=error#quote-modal');
            exit;
        }

        // Only link to a product that actually exists (FK quote_requests.product_id → products.id)
        if ($product_id !== null) {
            $chk = $pdo->prepare('SELECT id FROM products WHERE id = :id LIMIT 1');
            $chk->execute([':id' => $product_id]);
            if (!$chk->fetchColumn()) {
                $product_id = null;
            }
        }

        // Insert quote using prepared statement (INSERT requirement)
        $sql = 'INSERT INTO quote_requests
            (product_id, customer_name, company, email, phone, product_type, quantity, budget, deadline, details, status)
            VALUES 
            (:product_id, :customer_name, :company, :email, :phone, :product_type, :quantity, :budget, :deadline, :details, :status)';

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':product_id'    => $product_id,
            ':customer_name' => $customer_name,
            ':company'       => $company,
            ':email'         => $email,
            ':phone'         => $phone,
            ':product_type'  => $product_type,
            ':quantity'      => $quantity,
            ':budget'        => $budget,
            ':deadline'      => $deadline,
            ':details'       => $details,
            ':status'        => 'new',
        ]);

        $new_id = $pdo->lastInsertId();

        // file the request under its client organization (created on its first quote)
        if ($company !== '') {
            $org = $pdo->prepare('SELECT id FROM organizations WHERE name = :n LIMIT 1');
            $org->execute([':n' => $company]);
            $org_id = $org->fetchColumn();
            if (!$org_id) {
                $pdo->prepare("INSERT INTO organizations (name, type, contact_email) VALUES (:n, 'client', :e)")
                    ->execute([':n' => $company, ':e' => $email]);
                $org_id = $pdo->lastInsertId();
            }
            $pdo->prepare('UPDATE quote_requests SET organization_id = :o WHERE id = :id')->execute([':o' => $org_id, ':id' => $new_id]);
        }

        // Audit log entry
        $log = $pdo->prepare('INSERT INTO activity_log (user_id, action, entity_type, entity_id, details, ip_address) VALUES (:uid, :act, :type, :eid, :details, :ip)');
        $log->execute([
            ':uid'     => isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null,
            ':act'     => 'submit_quote',
            ':type'    => 'quote',
            ':eid'     => $new_id,
            ':details' => "New quote request #{$new_id} from {$customer_name} ({$company})",
            ':ip'      => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
        ]);

        if ($is_ajax) {
            header('Content-Type: application/json');
            echo json_encode(['success' => true, 'message' => 'Quote request submitted successfully!', 'id' => $new_id]);
            exit;
        }

        set_flash('success', "Thank you, {$customer_name}! Your quote request has been received (Ref #{$new_id}). We'll get back to you within 24 hours.");
        header('Location: ' . BASE_URL . '/index.php?quote=success');
        exit;

    // =========================================================
    // 2. UPDATE QUOTE STATUS (Admin & Staff)
    // =========================================================
    case 'update_status':
        require_once __DIR__ . '/../auth/guard.php';

        $quote_id = (int)($_POST['id'] ?? 0);
        $new_status = $_POST['status'] ?? '';

        $allowed_statuses = ['new', 'reviewing', 'quoted', 'accepted', 'declined'];
        if ($quote_id <= 0 || !in_array($new_status, $allowed_statuses, true)) {
            set_flash('danger', 'Invalid quote ID or status value.');
            header('Location: ' . BASE_URL . '/pages/quotes.php');
            exit;
        }

        // UPDATE quote status using prepared statement
        $update = $pdo->prepare('UPDATE quote_requests SET status = :status WHERE id = :id');
        $update->execute([':status' => $new_status, ':id' => $quote_id]);

        // Audit log
        $log = $pdo->prepare('INSERT INTO activity_log (user_id, action, entity_type, entity_id, details, ip_address) VALUES (:uid, :act, :type, :eid, :details, :ip)');
        $log->execute([
            ':uid'     => $current_user_id,
            ':act'     => 'update_quote',
            ':type'    => 'quote',
            ':eid'     => $quote_id,
            ':details' => "Quote #{$quote_id} status updated to '{$new_status}' by {$current_user_name}",
            ':ip'      => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
        ]);

        set_flash('success', "Quote #{$quote_id} status updated to '" . ucfirst($new_status) . "'.");
        header('Location: ' . BASE_URL . '/pages/quotes.php');
        exit;

    // =========================================================
    // 3. ASSIGN QUOTE TO STAFF (Admin Only)
    // =========================================================
    case 'assign':
        require_once __DIR__ . '/../auth/guard.php';

        if ($current_user_role !== 'admin') {
            set_flash('danger', 'Only administrators can assign quotes.');
            header('Location: ' . BASE_URL . '/pages/quotes.php');
            exit;
        }

        $quote_id    = (int)($_POST['id'] ?? 0);
        $assigned_to = !empty($_POST['assigned_to']) ? (int)$_POST['assigned_to'] : null;

        $update = $pdo->prepare('UPDATE quote_requests SET assigned_to = :assigned WHERE id = :id');
        $update->execute([':assigned' => $assigned_to, ':id' => $quote_id]);

        // Audit log
        $log = $pdo->prepare('INSERT INTO activity_log (user_id, action, entity_type, entity_id, details, ip_address) VALUES (:uid, :act, :type, :eid, :details, :ip)');
        $log->execute([
            ':uid'     => $current_user_id,
            ':act'     => 'assign_quote',
            ':type'    => 'quote',
            ':eid'     => $quote_id,
            ':details' => "Quote #{$quote_id} assigned to user ID " . ($assigned_to ?? 'unassigned'),
            ':ip'      => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
        ]);

        set_flash('success', "Quote #{$quote_id} assignment updated.");
        header('Location: ' . BASE_URL . '/pages/quotes.php');
        exit;

    // =========================================================
    // 4. DELETE QUOTE (Admin Only)
    // =========================================================
    case 'delete':
        require_once __DIR__ . '/../auth/guard.php';

        if ($current_user_role !== 'admin') {
            set_flash('danger', 'Only administrators can delete quote records.');
            header('Location: ' . BASE_URL . '/pages/quotes.php');
            exit;
        }

        $quote_id = (int)($_POST['id'] ?? 0);
        if ($quote_id <= 0) {
            set_flash('danger', 'Invalid quote ID.');
            header('Location: ' . BASE_URL . '/pages/quotes.php');
            exit;
        }

        $del = $pdo->prepare('DELETE FROM quote_requests WHERE id = :id');
        $del->execute([':id' => $quote_id]);

        // Audit log
        $log = $pdo->prepare('INSERT INTO activity_log (user_id, action, entity_type, entity_id, details, ip_address) VALUES (:uid, :act, :type, :eid, :details, :ip)');
        $log->execute([
            ':uid'     => $current_user_id,
            ':act'     => 'delete_quote',
            ':type'    => 'quote',
            ':eid'     => $quote_id,
            ':details' => "Deleted quote request #{$quote_id}",
            ':ip'      => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
        ]);

        set_flash('success', "Quote request #{$quote_id} was removed.");
        header('Location: ' . BASE_URL . '/pages/quotes.php');
        exit;

    // =========================================================
    // DEFAULT: UNKNOWN ACTION
    // =========================================================
    default:
        set_flash('danger', 'Unknown quote action.');
        header('Location: ' . BASE_URL . '/pages/quotes.php');
        exit;
}
