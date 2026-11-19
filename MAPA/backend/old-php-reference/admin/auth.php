<?php
/*
 * admin/auth.php  –  LOGIN CHECK + SAFETY TOKEN, shared by all admin pages.
 *
 *   require_login()   put at the top of every admin page: sends visitors to login.php if not logged in
 *   csrf_field()      prints a hidden field inside every <form> (blocks forged requests from other sites)
 *   check_csrf()      call at the start of every form handler (login.php, save.php)
 *   flash() / take_flash()   one-time messages ("Saved!") shown after a redirect
 *
 * The username and password are in config.php.
 */
require_once __DIR__ . '/../includes/functions.php';

session_name('mapa_admin');
session_start();

function is_logged_in(): bool {
  return !empty($_SESSION['admin']);
}

function require_login(): void {
  if (!is_logged_in()) { header('Location: login.php'); exit; }
}

function csrf_token(): string {
  if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
  return $_SESSION['csrf'];
}

function csrf_field(): string {
  return '<input type="hidden" name="csrf" value="' . e(csrf_token()) . '">';
}

function check_csrf(): void {
  if (!hash_equals(csrf_token(), (string)($_POST['csrf'] ?? ''))) {
    http_response_code(403);
    exit('Invalid or expired form. Go back, reload the page and try again.');
  }
}

function flash(string $type, string $message): void {   // $type: 'ok' or 'err'
  $_SESSION['flash'] = [$type, $message];
}

function take_flash(): ?array {                          // read the message once, then forget it
  $f = $_SESSION['flash'] ?? null;
  unset($_SESSION['flash']);
  return $f;
}
