const secondsInHour = 60 * 60;
console.log(`В часе ${secondsInHour} секунд.`);
let value = 0;
value += 7; console.log('После +7:', value);
value *= 4; console.log('После ×4:', value);
value -= 8; console.log('После -8:', value);
value /= 4; console.log('После /4:', value);
value **= 3; console.log('После ^3:', value);
value %= 5; console.log('Остаток от деления на 5:', value);
for (const [expr, result] of [
  ['5 > 4', 5 > 4], ['"ананас" > "яблоко"', 'ананас' > 'яблоко'], ['"2" > "12"', '2' > '12'],
  ['undefined == null', undefined == null], ['undefined === null', undefined === null],
  ['null == "0"', null == '0'], ['null === +"0"', null === +'0']
]) console.log(expr, '=>', result);
