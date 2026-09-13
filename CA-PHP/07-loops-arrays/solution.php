<?php
declare(strict_types=1);
function temperatureStats(array $temperatures): array {
    if ($temperatures === []) throw new InvalidArgumentException('Массив пуст.');
    $sorted=$temperatures; sort($sorted, SORT_NUMERIC);
    return ['average'=>array_sum($temperatures)/count($temperatures),'lowest'=>array_slice($sorted,0,3),'highest'=>array_slice($sorted,-3)];
}
function randomMatrix10x10(?int $seed=null): array {
    if ($seed !== null) mt_srand($seed); $matrix=[];
    for($r=0;$r<10;$r++){ $row=[]; for($c=0;$c<10;$c++) $row[]=mt_rand(1,10); $matrix[]=$row; }
    return $matrix;
}
function usersData(): array { return [
    ['userName'=>'Stanley','login'=>'stanley','password'=>'demo-1'],
    ['userName'=>'Anna','login'=>'anna','password'=>'demo-2'],
    ['userName'=>'Max','login'=>'max','password'=>'demo-3'],
]; }
function sumSquares1To25(): int { $sum=0; for($i=1;$i<=25;$i++) $sum += $i*$i; return $sum; }
function greetingByLanguage(string $name,string $language): string { return match(strtolower($language)){
    'ru'=>"Привет, {$name}!",'en'=>"Hello, {$name}!",'fr'=>"Bonjour, {$name}!",'it'=>"Ciao, {$name}!",default=>throw new InvalidArgumentException('Поддерживаются ru/en/fr/it')}; }
