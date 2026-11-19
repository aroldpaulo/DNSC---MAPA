<?php
/*
 * admin/save.php  –  RECEIVES THE ADMIN FORMS AND SAVES THEM (it shows no page, it only redirects back).
 *
 * Flow:  form in index.php  ->  save.php  ->  data/content.json  ->  redirect back to index.php
 * Each form sends  section=<name>.  The big switch at the bottom has one block per section.
 * If anything is wrong we throw a RuntimeException; its message is shown as a red box in the dashboard.
 */
require_once __DIR__ . '/auth.php';
require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: index.php'); exit; }
check_csrf();

/* ---------------------------- helper functions ---------------------------- */

/** Trim text, remove invisible control characters (keeps line breaks), cut to a maximum length. */
function clean($value, int $max): string {
  $value = str_replace("\r\n", "\n", (string)$value);
  $value = preg_replace('/[^\P{C}\n]+/u', '', $value) ?? '';
  return mb_substr(trim($value), 0, $max);
}

/** Read the repeating rows (campuses / announcements) from the form, in the order they were sent. */
function read_rows(string $field, int $max): array {
  $rows = [];
  $input = is_array($_POST[$field] ?? null) ? $_POST[$field] : [];
  foreach ($input as $key => $row) {
    if (is_array($row) && preg_match('/^[A-Za-z0-9]{1,20}$/', (string)$key)) $rows[(string)$key] = $row;
  }
  if (count($rows) > $max) throw new RuntimeException("Too many items (maximum $max).");
  return $rows;
}

/** Save an uploaded picture into assets/images/homepage/. Returns the file name, or null if nothing was uploaded. */
function save_upload(string $field): ?string {
  $file = $_FILES[$field] ?? null;
  if ($file === null || $file['error'] === UPLOAD_ERR_NO_FILE) return null;
  if ($file['error'] !== UPLOAD_ERR_OK) throw new RuntimeException('Upload failed (PHP error code ' . $file['error'] . '). Try a smaller file.');
  if ($file['size'] > MAX_UPLOAD_MB * 1024 * 1024) throw new RuntimeException('Pictures must be ' . MAX_UPLOAD_MB . ' MB or smaller.');

  $info = @getimagesize($file['tmp_name']);                // also proves the file really is a picture
  $extension = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp'][$info[2] ?? 0] ?? null;
  if ($extension === null) throw new RuntimeException('Only JPG, PNG or WebP pictures are allowed.');

  // keep the original name (cleaned); add -2, -3... if that name is already taken
  $base = preg_replace('/[^A-Za-z0-9_-]+/', '-', pathinfo((string)$file['name'], PATHINFO_FILENAME));
  $base = substr(trim((string)$base, '-'), 0, 60) ?: 'picture';
  $name = "$base.$extension";
  for ($n = 2; is_file(IMAGE_DIR . '/' . $name); $n++) $name = "$base-$n.$extension";

  if (!is_dir(IMAGE_DIR)) @mkdir(IMAGE_DIR, 0755, true);
  if (!move_uploaded_file($file['tmp_name'], IMAGE_DIR . '/' . $name)) {
    throw new RuntimeException('Could not save the picture. Make the folder ' . IMAGE_DIR_URL . '/ writable.');
  }
  return $name;
}

/** The picture for one row: a new upload wins, otherwise the file picked in the dropdown (must really exist). */
function choose_image(string $rowKey, array $row): string {
  $uploaded = save_upload("upload_$rowKey");
  if ($uploaded !== null) return $uploaded;
  $picked = basename((string)($row['img'] ?? ''));
  return in_array($picked, image_files(), true) ? $picked : '';
}

/** Turn a name into a url-friendly id: "Main Campus" -> "main-campus". */
function make_slug(string $text): string {
  return substr(trim(preg_replace('/[^a-z0-9]+/', '-', strtolower($text)) ?? '', '-'), 0, 40);
}

/** Write content.json or stop with a clear message. */
function commit(array $content): void {
  if (!save_content($content)) {
    throw new RuntimeException('Could not write data/content.json. Make the data/ folder writable. (Details: data/error.log)');
  }
}

/* ---------------------------- one block per form ---------------------------- */
$section = (string)($_POST['section'] ?? '');

try {
  $content = get_content();

  switch ($section) {

    case 'hero':
      $content['hero'] = [
        'title' => clean($_POST['title'] ?? '', 120) ?: $content['hero']['title'],
        'lead'  => clean($_POST['lead'] ?? '', 300),
        'img'   => choose_image('hero', $_POST),      // upload field is "upload_hero", dropdown field is "img"
      ];
      commit($content);
      flash('ok', 'Hero text saved.');
      break;

    case 'campuses':
      $campuses = []; $usedSlugs = [];
      foreach (read_rows('campuses', 12) as $key => $row) {
        $name = clean($row['name'] ?? '', 80);
        if ($name === '') throw new RuntimeException('Every campus needs a name.');

        $slug = (string)($row['slug'] ?? '');                       // existing campuses keep their slug (links stay valid)
        if (!preg_match('/^[a-z0-9-]{1,40}$/', $slug)) $slug = make_slug($name) ?: 'campus';
        $base = $slug;
        for ($n = 2; isset($usedSlugs[$slug]); $n++) $slug = "$base-$n";   // slugs must be unique
        $usedSlugs[$slug] = true;

        $campuses[] = [
          'slug' => $slug,
          'name' => $name,
          'desc' => clean($row['desc'] ?? '', 400),
          'img'  => choose_image($key, $row),
        ];
      }
      if (!$campuses) throw new RuntimeException('Keep at least one campus.');
      $content['campuses'] = $campuses;
      commit($content);
      flash('ok', 'Campuses saved.');
      break;

    case 'announcements':
      $items = [];
      foreach (read_rows('announcements', 30) as $key => $row) {
        $title = clean($row['title'] ?? '', 140);
        if ($title === '') throw new RuntimeException('Every announcement needs a title.');
        $items[] = [
          'title' => $title,
          'date'  => clean($row['date'] ?? '', 60),
          'text'  => clean($row['text'] ?? '', 500),
          'img'   => choose_image($key, $row),
        ];
      }
      $content['announcements'] = $items;
      commit($content);
      flash('ok', 'Announcements saved.');
      break;

    case 'about':
      $content['about'] = [
        'history' => clean($_POST['history'] ?? '', 3000),
        'mission' => clean($_POST['mission'] ?? '', 1500),
        'vision'  => clean($_POST['vision'] ?? '', 1500),
        'values'  => clean($_POST['values'] ?? '', 1500),
        'website_url' => safe_url(clean($_POST['website_url'] ?? '', 300)),
      ];
      commit($content);
      flash('ok', 'About section saved.');
      break;

    case 'pages':
      $content['pages'] = [
        'about'   => clean($_POST['about'] ?? '', 8000),
        'contact' => clean($_POST['contact'] ?? '', 8000),
      ];
      commit($content);
      flash('ok', 'Pages saved.');
      break;

    case 'footer':
      $content['footer'] = [
        'description'  => clean($_POST['description'] ?? '', 400),
        'website_url'  => safe_url(clean($_POST['website_url'] ?? '', 300)),
        'facebook_url' => safe_url(clean($_POST['facebook_url'] ?? '', 300)),
        'credits'      => clean($_POST['credits'] ?? '', 200),
      ];
      commit($content);
      flash('ok', 'Footer saved.');
      break;

    default:
      throw new RuntimeException('Unknown section: ' . $section);
  }
} catch (RuntimeException $e) {
  flash('err', $e->getMessage());
}

// go back to the same section in the dashboard
$back = preg_match('/^[a-z]{3,20}$/', $section) ? $section : 'hero';
header('Location: index.php#' . $back);
