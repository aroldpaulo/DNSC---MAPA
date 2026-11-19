<?php
/*
 * includes/footer.php  –  BOTTOM OF EVERY PUBLIC PAGE: cookie notice + footer + JavaScript.
 *
 * A page can set  $pageScripts = ['carousel.js', 'search.js'];  before including this file
 * to load extra scripts (only the homepage needs them).
 */
$footer      = get_content()['footer'];
$pageScripts = $pageScripts ?? [];
?>

<!-- ===================== COOKIE NOTICE (js: global.js) ===================== -->
<div class="cookie" id="cookie">
  <button class="cookie-x" aria-label="Close">&times;</button>
  <p><strong>Welcome!</strong> By continuing to browse this site, you agree to the data privacy statement and use of cookies. (Placeholder text)</p>
  <div class="cookie-row"><a href="#">Tell me more!</a><button class="btn-red" id="agree">I Agree</button></div>
</div>

<!-- ===================== FOOTER (css: global.css "FOOTER") ===================== -->
<footer class="footer">
  <div class="container footer-grid">
    <div><h4>MAPA</h4><p><?= e($footer['description']) ?></p></div>
    <div><h4>Links</h4>
      <a href="index.php">Home</a><a href="about.php">About DNSC</a><a href="index.php#campuses">Campuses</a><a href="contact.php">Contact</a>
    </div>
    <div><h4>Official DNSC</h4>
      <a href="<?= e(safe_url($footer['website_url'])) ?>">Official Website</a>
      <a href="<?= e(safe_url($footer['facebook_url'])) ?>">Facebook Page</a>
    </div>
  </div>
  <div class="footer-bottom">&copy; <?= date('Y') ?> MAPA. <?= e($footer['credits']) ?></div>
</footer>

<script src="assets/js/global.js"></script>
<?php foreach ($pageScripts as $script): ?>
<script src="assets/js/<?= e($script) ?>"></script>
<?php endforeach; ?>
</body>
</html>
