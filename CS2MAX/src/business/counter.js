/**
 * Бизнес-логика счетчика (не зависит от DOM).
 *
 * Архитектура: чистый reducer + константы.
 * Это упрощает тестирование (unit) и масштабирование.
 *
 * @module business/counter
 */

/** Минимальное значение счетчика. */
export const MIN_COUNT = -10;

/** Максимальное значение счетчика. */
export const MAX_COUNT = 10;

/**
 * Валидатор/нормализатор значения (пример: clamp(count, MIN, MAX)).
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Нормализует состояние счетчика.
 * Полезно при восстановлении из localStorage или при серверной интеграции.
 *
 * @param {unknown} raw
 * @returns {CounterState}
 */
export function validateState(raw) {
  const count =
    typeof raw === 'object' && raw !== null && 'count' in raw
      ? /** @type {any} */ (raw).count
      : 0;

  const safeNumber = Number.isFinite(Number(count)) ? Number(count) : 0;
  return { count: clamp(safeNumber, MIN_COUNT, MAX_COUNT) };
}

/**
 * @typedef {Object} CounterState
 * @property {number} count Текущее значение счетчика.
 */

/**
 * Начальное состояние.
 * @type {CounterState}
 */
export const initialState = Object.freeze({ count: 0 });

/**
 * @typedef {Object} CounterAction
 * @property {'INCREMENT'|'DECREMENT'|'RESET'} type
 */

/**
 * Чистый редьюсер: принимает state и action, возвращает новый state.
 *
 * @param {CounterState} state
 * @param {CounterAction} action
 * @returns {CounterState}
 */
export function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: clamp(state.count + 1, MIN_COUNT, MAX_COUNT),
      };
    case 'DECREMENT':
      return {
        ...state,
        count: clamp(state.count - 1, MIN_COUNT, MAX_COUNT),
      };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

/**
 * Вычисляет UI-состояние (без прямой работы с DOM).
 *
 * @param {CounterState} state
 * @returns {{
 *   resultTone: 'neutral'|'positive'|'negative',
 *   isPlusDisabled: boolean,
 *   isMinusDisabled: boolean,
 *   isExtreme: boolean,
 *   message: string
 * }}
 */
export function deriveViewModel(state) {
  const { count } = state;

  const resultTone = count === 0 ? 'neutral' : count > 0 ? 'positive' : 'negative';
  const isPlusDisabled = count >= MAX_COUNT;
  const isMinusDisabled = count <= MIN_COUNT;
  const isExtreme = count === MAX_COUNT || count === MIN_COUNT;

  return {
    resultTone,
    isPlusDisabled,
    isMinusDisabled,
    isExtreme,
    message: isExtreme ? 'Вы достигли экстремального значения' : '',
  };
}
