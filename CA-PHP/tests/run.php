<?php
declare(strict_types=1);
$root=dirname(__DIR__);$failures=[];
function check(bool $condition,string $message):void{global $failures;if(!$condition)$failures[]=$message;}
require "$root/03-syntax/solution.php";check(secondsInHour()===3600,'03 seconds');
require "$root/04-operators/solution.php";check(variableVariables()===[50,70],'04 variable variables');
require "$root/05-predicates/solution.php";check(numbersEqual(5,5)&&anyPositive(-1,1)&&sumGreaterThan15(8,8),'05 predicates');
require "$root/06-conditionals/solution.php";check(hourQuarter(0)===1&&hourQuarter(59)===4&&seasonByMonth(12)==='зима'&&squareOrCube(4)===16&&squareOrCube(3)===27&&maxPermutationThreeDigits(381)===831,'06 conditionals');
require "$root/07-loops-arrays/solution.php";check(sumSquares1To25()===5525&&count(randomMatrix10x10(1))===10&&greetingByLanguage('Ann','en')==='Hello, Ann!','07 loops');
require "$root/08-functions/solution.php";check(abs(hypotenuse(3,4)-5)<0.0001,'08 hypot');
require "$root/09-strings/solution.php";check(compactDateToFormatted('010122')==='01.01.2022'&&containsPyati()&&fileNameFromPath('C:/x/index.php')==='index.php','09 strings');
require "$root/10-dates/solution.php";check(formatFixedDate()==='23-02-2022'&&daysSinceYearStart(new DateTimeImmutable('2026-01-01'))===0,'10 dates');
require "$root/11-output-buffering/solution.php";check(captureFirstLine()==='Это первая строка'&&bufferedReverse('abc')==='cba','11 buffer');
require "$root/12-forms/solution.php";check(isLeapYear(2024)&&!isLeapYear(2100)&&russianWeekday('2026-09-13')==='воскресенье','12 forms');
require "$root/13-validation/solution.php";check(validateRegistration(['name'=>'Иван Иванов','login'=>'ivan_1','email'=>'i@example.test','password'=>'Strong!1'])===[],'13 validation valid');check(validateRegistration(['name'=>'','login'=>'x!','email'=>'bad','password'=>'weak'])!==[],'13 validation invalid');
if($failures){foreach($failures as $f)fwrite(STDERR,"FAIL: $f\n");exit(1);} echo "CA-PHP smoke tests: OK\n";
