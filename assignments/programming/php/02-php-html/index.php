<?php
declare(strict_types=1);
$users = [
    ['Антонов Игорь Владимирович', 'helloworld@mail.ru', 'муж', 1986],
    ['Иванова Кристина Викторовна', 'helloworld@mail.ru', 'жен', 1972],
    ['Борисов Максим Анатольевич', 'helloworld@mail.ru', 'муж', 1989],
];
?>
<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>PHP + HTML</title>
<style>table{border-collapse:collapse}th,td{border:1px solid #333;padding:6px 10px}</style></head><body>
<?php echo '<h1>Привет новый пользователь!</h1>'; ?>
<h3><?= htmlspecialchars(date('d.m.Y'), ENT_QUOTES, 'UTF-8') ?></h3>
<table><thead><tr><th>№</th><th>ФИО</th><th>E-mail</th><th>Пол</th><th>Год рождения</th></tr></thead><tbody>
<?php foreach ($users as $index => $row): ?>
<tr><td><?= $index + 1 ?></td><?php foreach ($row as $value): ?><td><?= htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8') ?></td><?php endforeach ?></tr>
<?php endforeach ?>
</tbody></table></body></html>
