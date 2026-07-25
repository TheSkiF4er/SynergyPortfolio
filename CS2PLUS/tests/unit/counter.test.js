import { describe, expect, it } from 'vitest';
import {
  deriveViewModel,
  initialState,
  MAX_COUNT,
  MIN_COUNT,
  reducer,
} from '../../src/business/counter.js';

describe('counter business logic', () => {
  it('initial state is 0 and neutral', () => {
    expect(initialState.count).toBe(0);
    const vm = deriveViewModel(initialState);
    expect(vm.resultTone).toBe('neutral');
    expect(vm.isPlusDisabled).toBe(false);
    expect(vm.isMinusDisabled).toBe(false);
    expect(vm.message).toBe('');
  });

  it('increment/decrement changes tone', () => {
    const s1 = reducer(initialState, { type: 'INCREMENT' });
    expect(s1.count).toBe(1);
    expect(deriveViewModel(s1).resultTone).toBe('positive');

    const s2 = reducer(initialState, { type: 'DECREMENT' });
    expect(s2.count).toBe(-1);
    expect(deriveViewModel(s2).resultTone).toBe('negative');
  });

  it('clamps to MIN/MAX', () => {
    let s = { count: 0 };
    for (let i = 0; i < 100; i++) s = reducer(s, { type: 'INCREMENT' });
    expect(s.count).toBe(MAX_COUNT);
    expect(deriveViewModel(s).isPlusDisabled).toBe(true);
    expect(deriveViewModel(s).message).toContain('экстремального');

    for (let i = 0; i < 100; i++) s = reducer(s, { type: 'DECREMENT' });
    expect(s.count).toBe(MIN_COUNT);
    expect(deriveViewModel(s).isMinusDisabled).toBe(true);
    expect(deriveViewModel(s).message).toContain('экстремального');
  });

  it('reset returns to initial state', () => {
    const s1 = { count: 5 };
    const s2 = reducer(s1, { type: 'RESET' });
    expect(s2).toEqual(initialState);
  });
});
