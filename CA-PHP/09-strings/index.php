<?php require __DIR__ . '/solution.php'; ?><!doctype html><html lang="ru"><meta charset="utf-8"><body><ul>
<li><?= compactDateToFormatted('010122') ?></li><li><?= containsPyati() ? 'Подстрока найдена' : 'Подстрока не найдена' ?></li>
<li><?= htmlspecialchars(fileNameFromPath('C:/OpenServer/domains/localhost/index.php')) ?></li></ul></body></html>
