<?php require __DIR__ . '/solution.php'; ?><!doctype html><html lang="ru"><meta charset="utf-8"><body><ul>
<li>До 31 декабря: <?= daysUntilBirthday(12,31) ?> дней</li><li><?= formatFixedDate() ?></li><li>С начала года: <?= daysSinceYearStart() ?> дней</li></ul></body></html>
