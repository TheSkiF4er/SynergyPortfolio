<?php require __DIR__ . '/solution.php'; ?>
<!doctype html><html lang="ru"><meta charset="utf-8"><title>Синтаксис PHP</title><body>
<p><?= htmlspecialchars(greeting(), ENT_QUOTES, 'UTF-8') ?></p>
<pre><?= htmlspecialchars(poem(), ENT_QUOTES, 'UTF-8') ?></pre>
<p>В часе <?= secondsInHour() ?> секунд.</p>
</body></html>
