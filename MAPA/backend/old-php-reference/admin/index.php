<?php
/*
 * admin/index.php  –  THE ADMIN DASHBOARD (only the screen; saving happens in save.php).
 *
 * One <form> per section (Hero, Campuses, Announcements, About, Pages, Footer).
 * Each form posts to save.php with a hidden field  section=<name>.
 * admin.js shows one section at a time and handles "+ Add / Remove / ↑ ↓" for campuses and announcements.
 */
require_once __DIR__ . '/auth.php';
require_login();

$content = get_content();
$flash   = take_flash();

/** Hidden fields every form needs: the safety token + which section this form saves. */
function form_fields(string $section): string {
  return csrf_field() . '<input type="hidden" name="section" value="' . e($section) . '">';
}

/** Picture chooser: preview + dropdown of files in assets/images/homepage/ + optional upload. */
function image_picker(string $selectName, string $uploadName, string $current): string {
  $files = image_files();
  $currentUrl = image_url($current);
  $html  = '<div class="img-field">';
  $html .= '<img class="thumb" src="' . ($currentUrl ? '../' . e($currentUrl) : '') . '" alt="" ' . ($currentUrl ? '' : 'hidden') . '>';
  $html .= '<label>Picture<select class="img-select" name="' . e($selectName) . '">';
  $html .= '<option value="" data-url="">(no picture)</option>';
  foreach ($files as $f) {
    $html .= '<option value="' . e($f) . '" data-url="../' . e(image_url($f)) . '"' . ($f === $current ? ' selected' : '') . '>' . e($f) . '</option>';
  }
  if ($current !== '' && !in_array($current, $files, true)) {     // saved name whose file is gone
    $html .= '<option value="" selected>⚠ ' . e($current) . ' (file not found)</option>';
  }
  $html .= '</select></label>';
  $html .= '<label>…or upload a new one (JPG/PNG/WebP, max ' . MAX_UPLOAD_MB . ' MB)<input type="file" name="' . e($uploadName) . '" accept="image/jpeg,image/png,image/webp"></label>';
  return $html . '</div>';
}

/** The buttons on top of every repeating row. */
function row_tools(string $title): string {
  return '<div class="row-head"><strong>' . $title . '</strong><span class="tools">'
       . '<button type="button" data-act="up" title="Move up">↑</button>'
       . '<button type="button" data-act="down" title="Move down">↓</button>'
       . '<button type="button" data-act="del" class="danger">Remove</button></span></div>';
}

/** One campus row. $k is a unique key for this row (the template uses "__K__"). */
function campus_row(string $k, array $r): string {
  return '<div class="row">' . row_tools('Campus')
    . '<input type="hidden" name="campuses[' . $k . '][slug]" value="' . e($r['slug'] ?? '') . '">'
    . '<label>Name<input name="campuses[' . $k . '][name]" maxlength="80" required value="' . e($r['name'] ?? '') . '"></label>'
    . '<label>Description<textarea name="campuses[' . $k . '][desc]" maxlength="400" rows="3">' . e($r['desc'] ?? '') . '</textarea></label>'
    . image_picker("campuses[$k][img]", "upload_$k", $r['img'] ?? '')
    . '</div>';
}

/** One announcement row. */
function announcement_row(string $k, array $r): string {
  return '<div class="row">' . row_tools('Announcement')
    . '<label>Title<input name="announcements[' . $k . '][title]" maxlength="140" required value="' . e($r['title'] ?? '') . '"></label>'
    . '<label>Date (any text, e.g. “March 3, 2026”)<input name="announcements[' . $k . '][date]" maxlength="60" value="' . e($r['date'] ?? '') . '"></label>'
    . '<label>Short text (optional)<textarea name="announcements[' . $k . '][text]" maxlength="500" rows="3">' . e($r['text'] ?? '') . '</textarea></label>'
    . image_picker("announcements[$k][img]", "upload_$k", $r['img'] ?? '')
    . '</div>';
}

$sections = [
  'hero' => 'Hero text', 'campuses' => 'Campuses', 'announcements' => 'Announcements',
  'about' => 'About section', 'pages' => 'About & Contact pages', 'footer' => 'Footer',
];
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
<body>

<header class="top">
  <strong>MAPA Admin</strong>
  <span class="grow"></span>
  <?php if (DEBUG): ?><a href="../debug.php" target="_blank">Debug page ↗</a><?php endif; ?>
  <a href="../index.php" target="_blank">View site ↗</a>
  <a href="logout.php">Log out</a>
</header>

<div class="layout">
  <nav class="side">
    <?php foreach ($sections as $id => $label): ?><a href="#<?= $id ?>" data-panel="<?= $id ?>"><?= e($label) ?></a><?php endforeach; ?>
  </nav>

  <main>
    <?php if ($flash): ?><div class="flash <?= e($flash[0]) ?>" role="status"><?= e($flash[1]) ?></div><?php endif; ?>

    <!-- ========== HERO TEXT ========== -->
    <form class="panel" id="hero" method="post" action="save.php" enctype="multipart/form-data"><?= form_fields('hero') ?>
      <h2>Hero text</h2>
      <label>Headline<input name="title" maxlength="120" required value="<?= e($content['hero']['title']) ?>"></label>
      <label>Subtitle<textarea name="lead" maxlength="300" rows="2"><?= e($content['hero']['lead']) ?></textarea></label>
      <p class="hint">Background picture of the first (search) slide:</p>
      <?= image_picker('img', 'upload_hero', $content['hero']['img'] ?? '') ?>
      <button class="primary">Save</button>
    </form>

    <!-- ========== CAMPUSES ========== -->
    <form class="panel" id="campuses" method="post" action="save.php" enctype="multipart/form-data" data-repeater data-max="12"><?= form_fields('campuses') ?>
      <h2>Campuses</h2>
      <p class="hint">These appear in the homepage slider, the campus cards and the search suggestions.</p>
      <div class="rows"><?php foreach ($content['campuses'] as $i => $r) echo campus_row('e' . $i, $r); ?></div>
      <template><?= campus_row('__K__', []) ?></template>
      <div class="actions"><button type="button" data-act="add">+ Add campus</button><button class="primary">Save campuses</button></div>
    </form>

    <!-- ========== ANNOUNCEMENTS ========== -->
    <form class="panel" id="announcements" method="post" action="save.php" enctype="multipart/form-data" data-repeater data-max="30"><?= form_fields('announcements') ?>
      <h2>Announcements</h2>
      <p class="hint">Remove all of them to hide the Announcements section.</p>
      <div class="rows"><?php foreach ($content['announcements'] as $i => $r) echo announcement_row('e' . $i, $r); ?></div>
      <template><?= announcement_row('__K__', []) ?></template>
      <div class="actions"><button type="button" data-act="add">+ Add announcement</button><button class="primary">Save announcements</button></div>
    </form>

    <!-- ========== ABOUT SECTION (homepage) ========== -->
    <form class="panel" id="about" method="post" action="save.php"><?= form_fields('about') ?>
      <h2>About section (homepage)</h2>
      <label>Goal<textarea name="history" maxlength="3000" rows="5"><?= e($content['about']['history']) ?></textarea></label>
      <label>Mission<textarea name="mission" maxlength="1500" rows="3"><?= e($content['about']['mission']) ?></textarea></label>
      <label>Vision<textarea name="vision" maxlength="1500" rows="3"><?= e($content['about']['vision']) ?></textarea></label>
      <label>Core values<textarea name="values" maxlength="1500" rows="3"><?= e($content['about']['values']) ?></textarea></label>
      <label>Official DNSC website link<input name="website_url" maxlength="300" placeholder="https://…" value="<?= e($content['about']['website_url']) ?>"></label>
      <button class="primary">Save</button>
    </form>

    <!-- ========== ABOUT & CONTACT PAGES ========== -->
    <form class="panel" id="pages" method="post" action="save.php"><?= form_fields('pages') ?>
      <h2>About &amp; Contact pages</h2>
      <p class="hint">Leave a blank line between paragraphs.</p>
      <label>About DNSC page<textarea name="about" maxlength="8000" rows="8"><?= e($content['pages']['about']) ?></textarea></label>
      <label>Contact page<textarea name="contact" maxlength="8000" rows="8"><?= e($content['pages']['contact']) ?></textarea></label>
      <button class="primary">Save</button>
    </form>

    <!-- ========== FOOTER ========== -->
    <form class="panel" id="footer" method="post" action="save.php"><?= form_fields('footer') ?>
      <h2>Footer</h2>
      <label>Description<textarea name="description" maxlength="400" rows="3"><?= e($content['footer']['description']) ?></textarea></label>
      <label>Official website link<input name="website_url" maxlength="300" placeholder="https://…" value="<?= e($content['footer']['website_url']) ?>"></label>
      <label>Facebook page link<input name="facebook_url" maxlength="300" placeholder="https://…" value="<?= e($content['footer']['facebook_url']) ?>"></label>
      <label>Credits line<input name="credits" maxlength="200" value="<?= e($content['footer']['credits']) ?>"></label>
      <button class="primary">Save</button>
    </form>

    <p class="hint">The admin username and password are set in <code>config.php</code>.</p>
  </main>
</div>

<script src="admin.js"></script>
</body>
</html>
