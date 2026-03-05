const { Calculator } = require('../src/Calculator');

describe('Calculator', () => {
  const c = new Calculator();

  test('basic operations', () => {
    expect(c.calc(2, '+', 3)).toBe(5);
    expect(c.calc(2, '-', 3)).toBe(-1);
    expect(c.calc(2, '*', 3)).toBe(6);
    expect(c.calc(6, '/', 3)).toBe(2);
  });

  test('power and percent', () => {
    expect(c.calc(2, '^', 3)).toBe(8);
    expect(c.calc(25, '%', 200)).toBe(50);
  });

  test('negative and decimals', () => {
    expect(c.calc(-2.5, '*', 4)).toBe(-10);
    expect(c.calc(0.1, '+', 0.2)).toBeCloseTo(0.3, 10);
  });

  test('division by zero throws', () => {
    expect(() => c.calc(1, '/', 0)).toThrow(/zero/i);
  });

  test('very large numbers boundary', () => {
    expect(() => c.calc(1e308, '*', 1e10)).toThrow(/finite/i);
  });

  test('batch element-wise and broadcasting', () => {
    expect(c.calcBatch([1,2,3], '+', [10,20,30])).toEqual([11,22,33]);
    expect(c.calcBatch([1,2,3], '*', 10)).toEqual([10,20,30]);
    expect(c.calcBatch(10, '-', [1,2,3])).toEqual([9,8,7]);
  });

  test('batch length mismatch throws', () => {
    expect(() => c.calcBatch([1,2], '+', [1,2,3])).toThrow(/same length/i);
  });
});
