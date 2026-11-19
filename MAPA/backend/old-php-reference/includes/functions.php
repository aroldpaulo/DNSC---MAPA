<?php
/*
 * includes/functions.php  –  THE ONLY "BACKEND LIBRARY" OF THE SITE.
 *
 * Every public page and every admin page loads this file first.
 * Sections:
 *   1. Error handling      4. Images
 *   2. Small helpers       5. Campuses
 *   3. Content (read/save the editable text)
 */
require_once __DIR__ . '/../config.php';

/* ============================== 1. ERROR HANDLING ============================== */
error_reporting(E_ALL);
ini_set('display_errors', DEBUG ? '1' : '0');
ini_set('log_errors', '1');
ini_set('error_log', ERROR_LOG);          // look here when something silently fails

/* ============================== 2. SMALL HELPERS =============================== */

/** Make text safe to print inside HTML.  Use e($text) for EVERYTHING that comes from the content file. */
function e($text): string {
  return htmlspecialchars((string)$text, ENT_QUOTES, 'UTF-8');
}

/** Only allow safe links (https, mailto, relative path, #). Anything else becomes "#". */
function safe_url($url): string {
  $url = trim((string)$url);
  return preg_match('~^(https?://[^\s"<>]+|mailto:[^\s"<>]+|/[^\s"<>]*|#[^\s"<>]*)$~i', $url) ? $url : '#';
}

/** Plain text -> <p> paragraphs (a blank line starts a new paragraph). */
function paragraphs(string $text): string {
  $html = '';
  foreach (preg_split('/\n{2,}/', trim($text)) as $p) {
    if (trim($p) !== '') $html .= '<p>' . nl2br(e(trim($p))) . "</p>\n";
  }
  return $html;
}

/* ============================== 3. CONTENT ===================================== */
/*
 * "Content" = all text/images you can edit in the admin.
 * default_content() is what the site shows BEFORE anyone saves in the admin.
 * After the first save, data/content.json is used instead (it wins over the defaults).
 * To go back to the defaults: delete data/content.json.
 */

function default_content(): array {
  $campus = fn($slug, $name, $img) => [
    'slug' => $slug, 'name' => $name, 'img' => $img,
    'desc' => 'Placeholder description. Replace with verified campus information.',
  ];
  $announcement = ['title' => 'ANNOUNCEMENT TITLE (PLACEHOLDER)', 'date' => 'Date placeholder', 'text' => '', 'img' => ''];
  return [
    'hero' => [
      'title' => 'Find Your Way Around DNSC.',
      'lead'  => 'Explore campuses, discover offices, and navigate your destination with ease.',
      'img'   => 'search-bg.jpg',   // background of the first (search) slide – replace the file or pick another in the admin
    ],
    // 'img' is just a FILE NAME inside assets/images/homepage/
    'campuses' => [
      $campus('panabo',       'Main Campus (Placeholder)', 'campus-1.jpg'),
      $campus('tagum',        'Campus 2 (Placeholder)',    'campus-2.jpg'),
      $campus('other-campus', 'Campus 3 (Placeholder)',    'campus-3.jpg'),
    ],
    'announcements' => [$announcement, $announcement, $announcement],
    'about' => [   // "history" is shown on the homepage under the label "Goal"
      'history' => "On Curriculum and Instruction: To Cultivate a Dynamic and Inclusive Learning Environment for a Globalized Future\n"
                 . "On Research, Development, and Extension: To Foster a Culture of Innovation and Collaboration in Research, Development, and Extension\n"
                 . "On Administration and Resource Management: To Enhance Institutional Effectiveness and Sustainability through Integrated Initiatives",
      'mission' => 'DNSC shall produce future-ready workforce, create innovative solutions and technologies, empower communities, and uphold good governance towards sustainable development.',
      'vision'  => 'An Institution Leading in Agri-Fisheries and Socio-Cultural Development in the ASEAN Region',
      'values'  => 'Stewardship, Adaptability and Excellence, Integrity and Innovativeness, and Love of God and Country',
      'website_url' => '#',
    ],
    'footer' => [
      'description'  => 'Multi-campus interactive navigation and student service assistant. Project description placeholder.',
      'website_url'  => '#',
      'facebook_url' => '#',
      'credits'      => 'Developer credits placeholder.',
    ],
    'pages' => [   // text of about.php and contact.php
      'about'   => 'Placeholder.',
      'contact' => 'Placeholder.',
    ],
  ];
}

/** Read the content (defaults + whatever was saved in data/content.json). */
function get_content(): array {
  static $cache = null;                       // read the file only once per page load
  if ($cache !== null) return $cache;

  $content = default_content();
  if (is_file(CONTENT_FILE)) {
    $saved = json_decode((string)file_get_contents(CONTENT_FILE), true);
    if (!is_array($saved)) {
      error_log('content.json is not valid JSON – using defaults.');
    } else {
      foreach ($saved as $key => $value) {
        if (!isset($content[$key]) || !is_array($value)) continue;
        // lists (campuses, announcements) are replaced; groups (hero, about, ...) are merged field by field
        $isList = in_array($key, ['campuses', 'announcements'], true);
        $content[$key] = $isList ? $value : array_merge($content[$key], $value);
      }
    }
  }
  return $cache = $content;
}

/** Save the content to data/content.json. Returns true on success. */
function save_content(array $content): bool {
  $json = json_encode($content, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  if ($json === false) return false;
  $ok = @file_put_contents(CONTENT_FILE, $json, LOCK_EX) !== false;
  if (!$ok) error_log('Cannot write ' . CONTENT_FILE . ' – is the data/ folder writable?');
  return $ok;
}

/* ============================== 4. IMAGES ====================================== */
/*
 * An image is stored as a FILE NAME only (e.g. "campus-1.jpg").
 * The file must exist in assets/images/homepage/  (see IMAGE_DIR in config.php).
 * To change a picture: put the file in that folder, then pick it in the admin (or upload it there).
 */

/** File names found in the image folder (jpg, png, webp), sorted. */
function image_files(): array {
  $files = [];
  foreach (@scandir(IMAGE_DIR) ?: [] as $name) {
    if (preg_match('/^[A-Za-z0-9._-]+\.(jpe?g|png|webp)$/i', $name)) $files[] = $name;
  }
  return $files;
}

/**
 * Browser URL of an image, or "" if the file does not exist.
 * "?v=" + the file's modified time makes the browser reload a picture you replaced.
 * The result is relative to the SITE ROOT (admin pages add "../" in front).
 */
function image_url($file): string {
  $file = basename((string)$file);            // basename() = never allow folders / "../"
  $path = IMAGE_DIR . '/' . $file;
  if ($file === '' || !is_file($path)) return '';
  return IMAGE_DIR_URL . '/' . rawurlencode($file) . '?v=' . filemtime($path);
}

/** Inline CSS for a picture background (with a green gradient when there is no picture). */
function bg_style(string $url): string {
  $gradient = 'linear-gradient(135deg,#0B5D1E,#29A31E)';
  if ($url === '') return "background-image:$gradient";
  return "background-image:url('" . e($url) . "'),$gradient";
}

/* ============================== 5. CAMPUSES ==================================== */

/** The campus list, each campus with an extra 'img_url' (ready to use in HTML; "" = no picture). */
function get_campuses(): array {
  return array_map(function ($c) {
    $c['img_url'] = image_url($c['img'] ?? '');
    return $c;
  }, get_content()['campuses']);
}
