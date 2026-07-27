<?php
require_once '../includes/functions.php';
ensureSession();
session_destroy();
redirect('login.php');
