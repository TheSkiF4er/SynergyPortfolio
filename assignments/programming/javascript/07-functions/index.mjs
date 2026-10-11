function isPalindrome(value) {
  const normalized = String(value).toLowerCase().replace(/[^a-zа-яё0-9]/giu, '');
  return normalized === [...normalized].reverse().join('');
}
function isPrime(n) {
  if (!Number.isInteger(n) || n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}
function ageFromBirthDate(birthDate, now = new Date()) {
  if (!(birthDate instanceof Date) || Number.isNaN(birthDate.getTime())) throw new TypeError('Ожидалась корректная Date');
  let age = now.getFullYear() - birthDate.getFullYear();
  const beforeBirthday = now.getMonth() < birthDate.getMonth() || (now.getMonth() === birthDate.getMonth() && now.getDate() < birthDate.getDate());
  if (beforeBirthday) age--;
  return age;
}
function isWeekend(date) { return [0,6].includes(date.getDay()); }
console.log('Палиндром:', isPalindrome('А роза упала на лапу Азора'));
console.log('97 простое:', isPrime(97));
console.log('Возраст:', ageFromBirthDate(new Date(2000, 0, 1), new Date(2026, 8, 12)));
console.log('Дата выходная:', isWeekend(new Date(2026, 8, 12)));
