<?php
/*
 * admin/login.php  –  THE ADMIN LOGIN PAGE (a normal page: type username + password, press Log in).
 * Username and password are set in config.php.
 */
require_once __DIR__ . '/auth.php';

if (is_logged_in()) { header('Location: index.php'); exit; }

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  check_csrf();
  $userOk = hash_equals(ADMIN_USER, trim((string)($_POST['user'] ?? '')));
  $passOk = hash_equals(ADMIN_PASSWORD, (string)($_POST['pass'] ?? ''));
  if ($userOk && $passOk) {
    session_regenerate_id(true);
    $_SESSION['admin'] = true;
    header('Location: index.php');
    exit;
  }
  usleep(400000);                                  // small delay makes password guessing slower
  $error = 'Incorrect username or password.';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>DNSC – MAPA Admin</title>
  <link rel="icon" type="image/png" href="../assets/images/favicon.png">
  <link rel="stylesheet" href="admin.css">
</head>
<body class="login-page">
  <form class="login-box" method="post">
    <h1>MAPA Admin</h1>
    <?= csrf_field() ?>
    <label>Username<input name="user" required autofocus autocomplete="username"></label>
    <label>Password<input type="password" name="pass" required autocomplete="current-password"></label>
    <?php if ($error): ?><p class="flash err"><?= e($error) ?></p><?php endif; ?>
    <button class="primary">Log in</button>
    <a class="back" href="../index.php">&larr; Back to the site</a>
  </form>
</body>
</html>
