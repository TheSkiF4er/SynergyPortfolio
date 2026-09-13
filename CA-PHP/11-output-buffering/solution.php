<?php
declare(strict_types=1);
function captureFirstLine(): string { ob_start(); echo 'Это первая строка'; $captured=(string)ob_get_contents(); ob_end_clean(); return $captured; }
function reverseCallback(string $buffer): string { return strrev($buffer); }
function bufferedReverse(string $value='reverse string'): string { ob_start(); ob_start('reverseCallback'); echo $value; ob_end_flush(); return (string)ob_get_clean(); }
function sortCharactersDescending(string $value): string { $chars=str_split($value); rsort($chars, SORT_STRING); return implode('', $chars); }
