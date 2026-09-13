<?php require __DIR__ . '/solution.php'; $first=captureFirstLine(); ?><!doctype html><html lang="ru"><meta charset="utf-8"><body><pre>
Это вторая строка
<?= htmlspecialchars($first) ?>
<?= htmlspecialchars(bufferedReverse()) ?>
<?= htmlspecialchars(sortCharactersDescending('abcdef123')) ?>
</pre></body></html>
