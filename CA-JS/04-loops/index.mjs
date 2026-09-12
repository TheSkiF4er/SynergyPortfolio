for (let n = 1; n <= 100; n++) {
  const by3 = n % 3 === 0, by5 = n % 5 === 0;
  if (by3 && by5) console.log(`число ${n} кратно 3 и 5 одновременно`);
  else if (by3) console.log(`число ${n} кратно 3`);
  else if (by5) console.log(`число ${n} кратно 5`);
  else console.log(n);
}
const armstrong = [];
for (let n = 100; n <= 999; n++) {
  const digits = String(n).split('').map(Number);
  if (digits.reduce((sum, d) => sum + d ** 3, 0) === n) armstrong.push(n);
}
console.log('Трёхзначные числа Армстронга:', armstrong.join(', '));
let a = 84, b = 30, x = a, y = b;
while (y) [x, y] = [y, x % y];
console.log(`НОД(${a}, ${b}) = ${x}`);
