<?php
declare(strict_types=1); require __DIR__.'/solution.php'; $result=null; $error=null;
if($_SERVER['REQUEST_METHOD']==='POST') { try { $city=trim((string)($_POST['city']??'')); $year=filter_var($_POST['year']??null,FILTER_VALIDATE_INT); if($city===''||$year===false) throw new InvalidArgumentException('Заполните город и год.'); $date=(string)($_POST['date']??''); $birthday=(string)($_POST['birthday']??''); $result=['city'=>$city,'leap'=>isLeapYear((int)$year),'weekday'=>russianWeekday($date),'days'=>daysToBirthdayFromInput($birthday)]; } catch(Throwable $e){$error=$e->getMessage();}}
function e(string $v):string{return htmlspecialchars($v,ENT_QUOTES,'UTF-8');}
?><!doctype html><html lang="ru"><meta charset="utf-8"><title>Форма</title><body><form method="post">
<label>Любимый город <input name="city" required></label><br><label>Год <input type="number" name="year" required></label><br>
<label>Дата <input type="date" name="date" required></label><br><label>День рождения <input type="date" name="birthday" required></label><br><button>Отправить</button></form>
<?php if($error):?><p><?=e($error)?></p><?php elseif($result):?><ul><li>Город: <?=e($result['city'])?></li><li>Год <?= $result['leap']?'високосный':'не високосный' ?></li><li>День недели: <?=e($result['weekday'])?></li><li>До дня рождения: <?=$result['days']?> дней</li></ul><?php endif?></body></html>
