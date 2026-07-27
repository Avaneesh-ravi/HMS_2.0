<?php
require_once '../config/database.php';
require_once '../includes/functions.php';
ensureSession();
requireAdminLogin();
redirect('dashboard.php');
