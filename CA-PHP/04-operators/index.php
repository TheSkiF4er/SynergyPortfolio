<?php require __DIR__ . '/solution.php'; ?><!doctype html><html lang="ru"><meta charset="utf-8"><body>
<h1>Комбинированные операторы</h1><ol><?php foreach(combinedOperations() as [$op,$value]): ?><li><?= htmlspecialchars($op) ?> → <?= $value ?></li><?php endforeach ?></ol>
<p>Variable variables: <?= implode(', ', variableVariables()) ?></p></body></html>
