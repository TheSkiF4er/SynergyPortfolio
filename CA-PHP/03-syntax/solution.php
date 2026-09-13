<?php
declare(strict_types=1);
function greeting(string $name = 'Anna'): string { return "Hello, {$name}!"; }
function poem(): string { return "\"Аптеку позабудь ты для венков лавровых\nИ не мори больных, но усыпляй здоровых.\""; }
function secondsInHour(): int { return 60 * 60; }
