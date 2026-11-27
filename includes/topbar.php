<?php
/**
 * includes/topbar.php — kept for the pages that include it.
 *
 * The dark top bar is gone from the storefront design: Sign in / account / Logout now sit in the
 * header (includes/navbar.php) and the phone numbers and email in the footer's contact block.
 * This partial only makes sure the session is open, as it did before.
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
