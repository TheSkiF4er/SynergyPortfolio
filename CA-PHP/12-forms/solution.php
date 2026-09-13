<?php
declare(strict_types=1);
function isLeapYear(int $year): bool { return $year % 400 === 0 || ($year % 4 === 0 && $year % 100 !== 0); }
function russianWeekday(string $date): string { $dt=DateTimeImmutable::createFromFormat('!Y-m-d',$date); if(!$dt) throw new InvalidArgumentException('Некорректная дата.'); return ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'][(int)$dt->format('w')]; }
function daysToBirthdayFromInput(string $date,?DateTimeImmutable $today=null): int { $birthday=DateTimeImmutable::createFromFormat('!Y-m-d',$date); if(!$birthday) throw new InvalidArgumentException('Некорректный день рождения.'); $today=($today??new DateTimeImmutable('today'))->setTime(0,0); $next=$birthday->setDate((int)$today->format('Y'),(int)$birthday->format('m'),(int)$birthday->format('d')); if($next<$today)$next=$next->modify('+1 year'); return (int)$today->diff($next)->days; }
