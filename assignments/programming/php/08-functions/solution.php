<?php
declare(strict_types=1);
function rectangleDescription(float $width,float $height): string { return "Ширина: {$width}; высота: {$height}; площадь: ".($width*$height); }
function hypotenuse(float $a,float $b): float { return hypot($a,$b); }
function randomInteger67To200(): int { return random_int(67,200); }
function randomFloat67To200(): float { return 67 + (random_int(0, PHP_INT_MAX) / PHP_INT_MAX) * 133; }
