import test from 'node:test'; import assert from 'node:assert/strict';
import {hourQuarter,season,isArmstrong,gcd,leapYears,isPalindrome,isPrime,Employee,emailsIn,Temperature} from '../solutions.mjs';
test('conditions',()=>{assert.equal(hourQuarter(0),1);assert.equal(hourQuarter(59),4);assert.equal(season(12),'winter')});
test('algorithms',()=>{assert.equal(isArmstrong(153),true);assert.equal(gcd(84,30),6);assert.deepEqual(leapYears(1999,2004),[2000,2004]);assert.equal(isPalindrome('топот'),true);assert.equal(isPrime(97),true)});
test('oop/regexp/accessors',()=>{const e=new Employee('A','Dev',100);assert.equal(e.annualSalary(),1200);assert.deepEqual(emailsIn('a@b.com x'),['a@b.com']);const t=new Temperature();t.celsius=100;assert.equal(t.fahrenheit,212)});
