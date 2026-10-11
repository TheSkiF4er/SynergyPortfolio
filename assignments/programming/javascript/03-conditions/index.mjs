function quarter(minute) {
  if (!Number.isInteger(minute) || minute < 0 || minute > 59) return 'Такой минуты в часе нет';
  return ['Первая', 'Вторая', 'Третья', 'Четвертая'][Math.floor(minute / 15)];
}
function season(month) {
  if (!Number.isInteger(month) || month < 1 || month > 12) return 'Такого месяца не существует';
  if ([12,1,2].includes(month)) return 'Зима';
  if ([3,4,5].includes(month)) return 'Весна';
  if ([6,7,8].includes(month)) return 'Лето';
  return 'Осень';
}
function evenSquareOddCube(number) { return number % 2 === 0 ? number ** 2 : number ** 3; }
console.log('37 минут:', quarter(37));
console.log('Месяц 9:', season(9));
console.log('Число 4:', evenSquareOddCube(4));
console.log('Число 3:', evenSquareOddCube(3));
