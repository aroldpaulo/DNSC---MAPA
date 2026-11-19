<?php
/*
 * includes/header.php  –  TOP OF EVERY PUBLIC PAGE: <head> + the navigation bar.
 *
 * Each page sets these variables BEFORE including this file:
 *   $pageTitle  (text in the browser tab)
 *   $navSolid   (true = green navbar from the start, false = transparent over the hero)
 */
require_once __DIR__ . '/functions.php';
$pageTitle = $pageTitle ?? 'DNSC – MAPA';
$navSolid  = $navSolid  ?? false;
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= e($pageTitle) ?></title>
  <!-- browser-tab icon: replace assets/images/favicon.png with your own picture (square PNG, ideally 64x64 or bigger) -->
  <link rel="icon" type="image/png" href="assets/images/favicon.png">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="assets/css/global.css">
  <link rel="stylesheet" href="assets/css/homepage.css">
  <script>window.MAPA_DEBUG = <?= DEBUG ? 'true' : 'false' ?>;</script>
</head>
<body>

<!-- ===================== NAVIGATION BAR (css: global.css "NAVBAR", js: global.js) ===================== -->
<header class="navbar<?= $navSolid ? ' solid' : '' ?>" id="navbar">
  <div class="container nav-inner">
    <a href="index.php" class="brand">
      <span class="logo-circle"><img src="assets/images/logo.png" alt="" onerror="this.remove()"><em>LOGO</em></span>
      <span class="brand-text"><strong>MAPA</strong><small>DNSC Campus Navigation</small></span>
    </a>
    <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false" aria-controls="navLinks"><i class="fa-solid fa-bars"></i></button>
    <nav class="nav-links" id="navLinks">
      <a href="index.php">Home</a>
      <a href="about.php">About DNSC</a>
      <a href="index.php#campuses">Explore Campuses</a>
      <a href="contact.php">Contact</a>
    </nav>
  </div>
</header>
<?php if ($navSolid): ?><div class="nav-spacer"></div><?php endif; ?>
