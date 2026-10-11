<?php
declare(strict_types=1);
function daysUntilBirthday(int $month,int $day,?DateTimeImmutable $today=null): int {
    $today=($today??new DateTimeImmutable('today'))->setTime(0,0); $year=(int)$today->format('Y');
    $birthday=$today->setDate($year,$month,$day); if($birthday < $today) $birthday=$birthday->modify('+1 year');
    return intval($today->diff($birthday)->days);
}
function formatFixedDate(): string { return date('d-m-Y', strtotime('2022-02-23')); }
function daysSinceYearStart(?DateTimeImmutable $today=null): int { $today=($today??new DateTimeImmutable('today'))->setTime(0,0); $start=$today->setDate((int)$today->format('Y'),1,1); return intval($start->diff($today)->days); }
