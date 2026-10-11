<?php
declare(strict_types=1); if(session_status()!==PHP_SESSION_ACTIVE) session_start();
function requireAuth():void{if(!isset($_SESSION['user_id'])){header('Location: login.php');exit;}}
function e(string $v):string{return htmlspecialchars($v,ENT_QUOTES,'UTF-8');}
