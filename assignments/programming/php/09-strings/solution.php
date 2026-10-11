<?php
declare(strict_types=1);
function compactDateToFormatted(string $value): string {
    if (!preg_match('/^\\d{6}$/',$value)) throw new InvalidArgumentException('Ожидается ddmmyy.');
    $chunked = rtrim(chunk_split($value,2,'.'),'.');
    [$d,$m,$y]=explode('.',$chunked); return date('d.m.Y', mktime(0,0,0,(int)$m,(int)$d,2000+(int)$y));
}
function containsPyati(string $phrase='Я считаю до пяти'): bool { return strpos($phrase,'пяти') !== false; }
function fileNameFromPath(string $path): string { $tail=strrchr(str_replace('\\','/',$path),'/'); return substr($tail === false ? $path : $tail, $tail === false ? 0 : 1); }
