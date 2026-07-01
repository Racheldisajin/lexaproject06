<?php

// Vercel serverless environment adjustments
if (isset($_ENV['VERCEL'])) {
    $_ENV['LOG_CHANNEL'] = 'stderr';
    $_ENV['VIEW_COMPILED_PATH'] = '/tmp/views';
    $_ENV['SESSION_DRIVER'] = 'cookie';
    
    if (!is_dir($_ENV['VIEW_COMPILED_PATH'])) {
        mkdir($_ENV['VIEW_COMPILED_PATH'], 0777, true);
    }
}

require __DIR__ . '/../public/index.php';
