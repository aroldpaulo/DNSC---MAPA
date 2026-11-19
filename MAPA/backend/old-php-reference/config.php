<?php
/*
 * config.php  –  ALL SETTINGS LIVE HERE.
 * Every page loads this (through includes/functions.php), so change things here, not in many places.
 */

// ---- Debug mode -----------------------------------------------------------------
// true  = show PHP errors on screen, print messages in the browser console (F12), enable debug.php
// false = hide errors from visitors (use this when the site is live). Errors are ALWAYS written to data/error.log
define('DEBUG', true);

// ---- Admin login ----------------------------------------------------------------
// CHANGE THE PASSWORD before putting the site online.
define('ADMIN_USER', 'admin');
define('ADMIN_PASSWORD', 'ChangeMe123!');

// ---- Folders & files -------------------------------------------------------------
define('ROOT_DIR',     __DIR__);
define('DATA_DIR',     ROOT_DIR . '/data');                    // must be writable by the web server
define('CONTENT_FILE', DATA_DIR . '/content.json');            // everything edited in the admin is saved here
define('ERROR_LOG',    DATA_DIR . '/error.log');

// All slider / campus / announcement pictures live in ONE folder (must be writable for admin uploads).
define('IMAGE_DIR_URL', 'assets/images/homepage');             // as used in the browser (relative to the site root)
define('IMAGE_DIR',     ROOT_DIR . '/' . IMAGE_DIR_URL);       // as used by PHP on disk
define('MAX_UPLOAD_MB', 2);
