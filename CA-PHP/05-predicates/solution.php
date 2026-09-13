<?php
declare(strict_types=1);
function numbersEqual(int|float $a, int|float $b): bool { return $a === $b; }
function anyPositive(int|float $a, int|float $b): bool { return $a > 0 || $b > 0; }
function sumGreaterThan15(int|float $a, int|float $b): bool { return $a + $b > 15; }
