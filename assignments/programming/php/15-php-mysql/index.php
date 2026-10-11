<?php
declare(strict_types=1); require __DIR__.'/db.php'; $orders=[];$error=null;$date=(string)($_GET['date']??date('Y-m-d'));
if(!preg_match('/^\\d{4}-\\d{2}-\\d{2}$/',$date)){$error='Некорректная дата.';} else {
 try{$pdo=database(); try{$stmt=$pdo->prepare('SELECT o.id,o.order_date,c.full_name,c.phone,p.name product,m.name material FROM orders o JOIN clients c ON c.id=o.clientID JOIN products p ON p.id=o.productID JOIN material m ON m.id=o.materialID WHERE o.order_date=:date ORDER BY o.id');$stmt->execute(['date'=>$date]);$orders=$stmt->fetchAll();}catch(PDOException $e){error_log('SQL '.$e->getCode().': '.$e->getMessage());$error='Произошла ошибка при выполнении запроса. Код: '.$e->getCode();}}
 catch(PDOException $e){error_log('DB '.$e->getCode().': '.$e->getMessage());$error='Невозможно подключиться к MySQL. Код: '.$e->getCode();}
}
function e(string $v):string{return htmlspecialchars($v,ENT_QUOTES,'UTF-8');}
?><!doctype html><html lang="ru"><meta charset="utf-8"><body><form><input type="date" name="date" value="<?=e($date)?>"><button>Найти</button></form><?php if($error):?><p><?=e($error)?></p><?php elseif(!$orders):?><p>Заказы за выбранную дату не найдены.</p><?php else:foreach($orders as $o):?><article><h2>Заказ #<?=$o['id']?></h2><p><?=e($o['full_name'])?>, <?=e($o['phone'])?></p><p><?=e($o['product'])?> / <?=e($o['material'])?> / <?=e($o['order_date'])?></p></article><?php endforeach;endif?></body></html>
