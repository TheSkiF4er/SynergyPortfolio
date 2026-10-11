export const typeReport = (value) => ({ value, type: typeof value });
export const arithmetic = (a,b) => ({sum:a+b,diff:a-b,product:a*b,quotient:b===0?null:a/b,bitAnd:a&b,bitOr:a|b});
export function hourQuarter(minute){ if(!Number.isInteger(minute)||minute<0||minute>59) throw new RangeError('0..59'); return Math.floor(minute/15)+1; }
export function season(month){ if(month<1||month>12) throw new RangeError('1..12'); return ['winter','winter','spring','spring','spring','summer','summer','summer','autumn','autumn','autumn','winter'][month-1]; }
export const squareOrCube=(n)=>n>=0?n*n:n*n*n;
export function fizzBuzzLike(limit=100){return Array.from({length:limit},(_,i)=>i+1).filter(n=>n%3===0||n%5===0);}
export function isArmstrong(n){const s=String(Math.abs(n)),p=s.length;return [...s].reduce((a,d)=>a+Number(d)**p,0)===Math.abs(n);}
export function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a;}
export function leapYears(from,to){const out=[];for(let y=from;y<=to;y++)if(y%400===0||(y%4===0&&y%100!==0))out.push(y);return out;}
export const sortNumbers=(xs)=>[...xs].sort((a,b)=>a-b);
export function weekdayMap(){return new Map([[1,'Monday'],[2,'Tuesday'],[3,'Wednesday'],[4,'Thursday'],[5,'Friday'],[6,'Saturday'],[7,'Sunday']]);}
export const unique=(xs)=>[...new Set(xs)];
export const isPalindrome=(s)=>{const n=String(s).toLowerCase().replace(/[^a-zа-яё0-9]/giu,'');return n===[...n].reverse().join('');};
export function isPrime(n){if(!Number.isInteger(n)||n<2)return false;for(let i=2;i*i<=n;i++)if(n%i===0)return false;return true;}
export const ageLabel=(age)=>age<0?'invalid':age<18?'minor':age<65?'adult':'senior';
export const isWeekend=(d)=>[0,6].includes(d instanceof Date?d.getDay():d);
export const jsonRoundTrip=(value)=>JSON.parse(JSON.stringify(value));
export function destructureUser({name,age,address:{city='—'}={}}){return {name,age,city};}
export class Employee{constructor(name,position,salary){this.name=name;this.position=position;this.salary=salary;}annualSalary(){return this.salary*12;}raise(percent){this.salary*=1+percent/100;return this.salary;}}
export const emailsIn=(text)=>text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)??[];
export class Temperature{#c=0;get celsius(){return this.#c;}set celsius(v){if(!Number.isFinite(v))throw new TypeError('number');this.#c=v;}get fahrenheit(){return this.#c*9/5+32;}set fahrenheit(v){this.celsius=(v-32)*5/9;}}
