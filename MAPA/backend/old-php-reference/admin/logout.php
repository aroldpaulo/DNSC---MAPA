<?php
// admin/logout.php – ends the admin session and goes back to the homepage.
require_once __DIR__ . '/auth.php';
$_SESSION = [];
session_destroy();
header('Location: ../index.php');
