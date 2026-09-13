<?php
declare(strict_types=1);
function database(): PDO {
    $host=getenv('DB_HOST')?:'127.0.0.1'; $port=getenv('DB_PORT')?:'3306'; $db=getenv('DB_NAME')?:'synergy_php'; $user=getenv('DB_USER')?:'synergy'; $pass=getenv('DB_PASSWORD')?:'synergy';
    return new PDO("mysql:host={$host};port={$port};dbname={$db};charset=utf8mb4",$user,$pass,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);
}
