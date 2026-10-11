<?php
declare(strict_types=1);
function hourQuarter(int $time): int {
    if ($time < 0 || $time > 59) throw new InvalidArgumentException('Время должно быть от 0 до 59.');
    return intdiv($time, 15) + 1;
}
function seasonByMonth(int $month): string {
    return match ($month) {
        12,1,2 => 'зима', 3,4,5 => 'весна', 6,7,8 => 'лето', 9,10,11 => 'осень',
        default => 'Такого месяца не существует',
    };
}
function squareOrCube(int $number): int { return $number % 2 === 0 ? $number ** 2 : $number ** 3; }
function maxPermutationThreeDigits(int $number): int {
    if ($number < 100 || $number > 999) throw new InvalidArgumentException('Нужно трёхзначное положительное число.');
    $a = intdiv($number,100); $b = intdiv($number,10)%10; $c=$number%10;
    if ($a < $b) [$a,$b]=[$b,$a]; if ($a < $c) [$a,$c]=[$c,$a]; if ($b < $c) [$b,$c]=[$c,$b];
    return $a*100+$b*10+$c;
}
