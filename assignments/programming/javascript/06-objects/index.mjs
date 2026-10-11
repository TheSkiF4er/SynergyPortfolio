const week = {1:'Понедельник',2:'Вторник',3:'Среда',4:'Четверг',5:'Пятница',6:'Суббота',7:'Воскресенье'};
console.log('Объект:', week);
console.log('Конкретный день:', week[5]);
delete week[7];
console.log('После удаления воскресенья:', week);
const asMap = new Map(Object.entries(week));
const uniqueNames = new Set(Object.values(week));
console.log('Map:', asMap, 'Set:', uniqueNames);
