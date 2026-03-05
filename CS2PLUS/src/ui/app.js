import { createStore } from './store.js';
import { deriveViewModel, initialState, reducer, MAX_COUNT, MIN_COUNT } from '../business/counter.js';

/**
 * UI слой: связывает store и DOM.
 * Главный принцип — DOM является функцией состояния: render(state).
 */

/** @typedef {import('../business/counter.js').CounterState} CounterState */

/**
 * @returns {{
 *  resultEl: HTMLElement,
 *  messageEl: HTMLElement,
 *  plusBtn: HTMLButtonElement,
 *  minusBtn: HTMLButtonElement,
 *  srStatusEl: HTMLElement
 * }}
 */
function getDom() {
  const resultEl = /** @type {HTMLElement} */ (document.getElementById('result'));
  const messageEl = /** @type {HTMLElement} */ (document.getElementById('message'));
  const plusBtn = /** @type {HTMLButtonElement} */ (document.getElementById('plus'));
  const minusBtn = /** @type {HTMLButtonElement} */ (document.getElementById('minus'));
  const srStatusEl = /** @type {HTMLElement} */ (document.getElementById('sr-status'));

  if (!resultEl || !messageEl || !plusBtn || !minusBtn || !srStatusEl) {
    throw new Error('Не удалось найти элементы интерфейса. Проверьте разметку index.html.');
  }

  return { resultEl, messageEl, plusBtn, minusBtn, srStatusEl };
}

/**
 * Рендерит UI, основываясь на состоянии.
 *
 * @param {CounterState} state
 * @param {ReturnType<typeof getDom>} dom
 */
export function render(state, dom) {
  const vm = deriveViewModel(state);

  dom.resultEl.textContent = String(state.count);
  dom.messageEl.textContent = vm.message;

  // Контраст: класс определяет фон и цвет текста.
  dom.resultEl.classList.remove('result--neutral', 'result--positive', 'result--negative');
  dom.resultEl.classList.add(`result--${vm.resultTone}`);

  dom.plusBtn.disabled = vm.isPlusDisabled;
  dom.minusBtn.disabled = vm.isMinusDisabled;

  // SR-only статус (чтобы не перегружать role=status на большом числе быстрых кликов).
  dom.srStatusEl.textContent = `Значение: ${state.count}.`;

  // Небольшая анимация изменения числа
  triggerBump(dom.resultEl);
}

/**
 * Добавляет CSS-класс для анимации "bump".
 * Уважает prefers-reduced-motion.
 *
 * @param {HTMLElement} el
 */
function triggerBump(el) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  el.classList.remove('bump');
  // Перезапуск анимации
  // eslint-disable-next-line no-unused-expressions
  el.offsetWidth;
  el.classList.add('bump');
}

function main() {
  const dom = getDom();
  const store = createStore(initialState, reducer);

  // Events -> actions
  dom.plusBtn.addEventListener('click', () => store.dispatch({ type: 'INCREMENT' }));
  dom.minusBtn.addEventListener('click', () => store.dispatch({ type: 'DECREMENT' }));

  // Клавиатурные шорткаты (UX): стрелки вверх/вниз и +/-
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === '+') store.dispatch({ type: 'INCREMENT' });
    if (e.key === 'ArrowDown' || e.key === '-') store.dispatch({ type: 'DECREMENT' });
    if (e.key === '0') store.dispatch({ type: 'RESET' });
  });

  // State -> UI
  store.subscribe((s) => render(s, dom));
  render(store.getState(), dom);

  // Подсказка в title для крайних значений
  dom.plusBtn.title = `Максимум: ${MAX_COUNT}`;
  dom.minusBtn.title = `Минимум: ${MIN_COUNT}`;
}

document.addEventListener('DOMContentLoaded', main);
