import {
  deriveViewModel,
  initialState,
  MAX_COUNT,
  MIN_COUNT,
  reducer,
  validateState,
} from '../../src/business/counter.js';

describe('counter business logic (Jest)', () => {
  test('initial state is 0 and neutral', () => {
    expect(initialState.count).toBe(0);
    const vm = deriveViewModel(initialState);
    expect(vm.resultTone).toBe('neutral');
    expect(vm.isPlusDisabled).toBe(false);
    expect(vm.isMinusDisabled).toBe(false);
    expect(vm.message).toBe('');
  });

  test('границы ±10: reducer clamps to MIN/MAX', () => {
    let s = { count: 0 };
    for (let i = 0; i < 100; i++) s = reducer(s, { type: 'INCREMENT' });
    expect(s.count).toBe(MAX_COUNT);

    for (let i = 0; i < 100; i++) s = reducer(s, { type: 'DECREMENT' });
    expect(s.count).toBe(MIN_COUNT);
  });

  test('смена цвета: deriveViewModel returns correct tone', () => {
    expect(deriveViewModel({ count: 0 }).resultTone).toBe('neutral');
    expect(deriveViewModel({ count: 1 }).resultTone).toBe('positive');
    expect(deriveViewModel({ count: -1 }).resultTone).toBe('negative');
  });

  test('блокировка кнопок: deriveViewModel disables at limits', () => {
    const atMax = deriveViewModel({ count: MAX_COUNT });
    expect(atMax.isPlusDisabled).toBe(true);
    expect(atMax.isMinusDisabled).toBe(false);

    const atMin = deriveViewModel({ count: MIN_COUNT });
    expect(atMin.isMinusDisabled).toBe(true);
    expect(atMin.isPlusDisabled).toBe(false);
  });

  test('validateState normalizes unsafe input (localStorage)', () => {
    expect(validateState({ count: '7' }).count).toBe(7);
    expect(validateState({ count: 999 }).count).toBe(MAX_COUNT);
    expect(validateState({ count: -999 }).count).toBe(MIN_COUNT);
    expect(validateState({ count: NaN }).count).toBe(0);
    expect(validateState(null).count).toBe(0);
  });
});
