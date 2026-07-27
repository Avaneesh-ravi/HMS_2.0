<?php
require_once __DIR__ . '/' . '../includes/functions.php';
ensureSession();
session_destroy();
redirect('login.php');
