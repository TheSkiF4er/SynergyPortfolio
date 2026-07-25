/* eslint-disable no-use-before-define */

// --- Lightweight polyfills (old browsers) ---
(function polyfills() {
  // addEventListener fallback (very old IE)
  if (!Element.prototype.addEventListener && Element.prototype.attachEvent) {
    Element.prototype.addEventListener = function (type, listener) {
      this.attachEvent('on' + type, listener);
    };
  }
  if (!Number.parseFloat) {
    Number.parseFloat = function (s) { return parseFloat(s); };
  }
})();

// --- Constants for DOM elements (avoid repeated queries) ---
const $a = document.getElementById('a');
const $b = document.getElementById('b');
const $op = document.getElementById('op');
const $decimals = document.getElementById('decimals');
const $btnCalc = document.getElementById('btnCalc');
const $btnClear = document.getElementById('btnClear');
const $btnHistoryClear = document.getElementById('btnHistoryClear');
const $result = document.getElementById('result');
const $hint = document.getElementById('hint');
const $history = document.getElementById('history');

// --- Event bus (Observer pattern) ---
class EventBus {
  constructor() { this.listeners = new Map(); }
  on(event, fn) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(fn);
    return () => this.off(event, fn);
  }
  off(event, fn) {
    const set = this.listeners.get(event);
    if (set) set.delete(fn);
  }
  emit(event, payload) {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const fn of set) {
      try { fn(payload); } catch (_) { /* ignore */ }
    }
  }
}

// --- Calculator core (module-like class) ---
class Calculator {
  constructor(bus) {
    this.bus = bus;
    this.operations = {
      '+': (x, y) => x + y,
      '-': (x, y) => x - y,
      '*': (x, y) => x * y,
      '/': (x, y) => {
        if (y === 0) throw new Error('Деление на ноль');
        return x / y;
      },
      '^': (x, y) => {
        const r = Math.pow(x, y);
        if (!Number.isFinite(r)) throw new Error('Результат не является конечным числом');
        return r;
      },
      '%': (x, y) => (x * y) / 100
    };

    // Worker for batch mode
    this.worker = null;
    if (window.Worker) {
      try {
        this.worker = new Worker('worker.js');
      } catch (_) {
        this.worker = null;
      }
    }
  }

  /**
   * @param {number} a
   * @param {string} op
   * @param {number} b
   */
  calc(a, op, b) {
    const fn = this.operations[op];
    if (!fn) throw new Error('Неизвестная операция');
    const r = fn(a, b);
    if (!Number.isFinite(r)) throw new Error('Результат не является конечным числом');
    return r;
  }

  /**
   * Batch (arrays) via worker if available.
   * @param {number|number[]} a
   * @param {string} op
   * @param {number|number[]} b
   * @returns {Promise<number|number[]>}
   */
  calcAny(a, op, b) {
    const aIsArr = Array.isArray(a);
    const bIsArr = Array.isArray(b);

    // scalar mode
    if (!aIsArr && !bIsArr) {
      return Promise.resolve(this.calc(a, op, b));
    }

    // batch mode
    if (this.worker) {
      return new Promise((resolve, reject) => {
        const onMsg = (e) => {
          const { ok, result, error } = e.data || {};
          this.worker.removeEventListener('message', onMsg);
          if (ok) resolve(result);
          else reject(new Error(error || 'Ошибка вычисления'));
        };
        this.worker.addEventListener('message', onMsg);
        this.worker.postMessage({ a, b, op });
      });
    }

    // fallback: compute on main thread
    return Promise.resolve(calcBatchFallback(a, op, b, this));
  }
}

// --- Utils ---

/**
 * Restrict input symbols to digits, dot, comma, spaces, semicolons, and leading minus.
 * Allows pasting lists like "1,2,3" or "-1.5 2 3".
 */
function restrictInput(el) {
  el.addEventListener('beforeinput', (e) => {
    if (!e.data) return; // deletions, etc.
    const allowed = /^[0-9\-\.,;\s]+$/;
    if (!allowed.test(e.data)) e.preventDefault();
  });

  el.addEventListener('input', () => {
    // Normalize fancy minus, etc.
    el.value = el.value.replace(/−/g, '-');
  });
}

/**
 * @param {string} raw
 * @returns {{kind:'scalar', value:number} | {kind:'array', value:number[]}}
 */
function parseScalarOrArray(raw) {
  const s = String(raw || '').trim();
  if (!s) throw new Error('Пустое поле');

  const tokens = s.split(/[\s,;]+/).filter(Boolean);
  const isArray = tokens.length > 1;

  const toNum = (t) => {
    const norm = String(t).replace(',', '.');
    const n = Number.parseFloat(norm);
    if (!Number.isFinite(n)) throw new Error('Некорректное число');
    return n;
  };

  if (!isArray) return { kind: 'scalar', value: toNum(tokens[0]) };
  return { kind: 'array', value: tokens.map(toNum) };
}

function formatNumber(n, decimals) {
  if (!Number.isFinite(n)) return String(n);
  const d = Math.max(0, Math.min(12, (decimals | 0)));
  const fixed = n.toFixed(d);
  return fixed.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
}

function formatAny(r, decimals) {
  return Array.isArray(r)
    ? r.map((x) => formatNumber(x, decimals)).join(', ')
    : formatNumber(r, decimals);
}

function calcBatchFallback(a, op, b, calc) {
  const aIsArr = Array.isArray(a);
  const bIsArr = Array.isArray(b);
  const len = aIsArr ? a.length : b.length;
  if (aIsArr && bIsArr && a.length !== b.length) {
    throw new Error('Массивы должны быть одинаковой длины');
  }
  const out = new Array(len);
  for (let i = 0; i < len; i++) {
    const ai = aIsArr ? a[i] : a;
    const bi = bIsArr ? b[i] : b;
    out[i] = calc.calc(ai, op, bi);
  }
  return out;
}

// --- History ---
const HISTORY_KEY = 'calc_history_v1';

/** @returns {{ts:number, expr:string, result:string}[]} */
function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (_) {
    return [];
  }
}

function saveHistory(items) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 100))); } catch (_) {}
}

// --- DOM updates: minimal + centralized ---
let lastUI = { resultText: '—', hintText: '', hintIsError: false };
function setResult(text) {
  if (text === lastUI.resultText) return;
  lastUI.resultText = text;
  $result.textContent = text;
}
function setHint(text, isError) {
  if (text === lastUI.hintText && isError === lastUI.hintIsError) return;
  lastUI.hintText = text;
  lastUI.hintIsError = isError;
  $hint.textContent = text;
  $hint.classList.toggle('error', Boolean(isError));
}
function setInvalid(el, yes) {
  el.classList.toggle('invalid', Boolean(yes));
}

function renderHistory(items) {
  // Minimal DOM churn: rebuild only if size changed or on explicit call.
  $history.textContent = '';
  const frag = document.createDocumentFragment();
  for (const it of items) {
    const li = document.createElement('li');
    li.textContent = `${new Date(it.ts).toLocaleString()} — ${it.expr} = ${it.result}`;
    frag.appendChild(li);
  }
  $history.appendChild(frag);
}

// --- App wiring ---
const bus = new EventBus();
const calculator = new Calculator(bus);
let historyItems = loadHistory();
renderHistory(historyItems);

restrictInput($a);
restrictInput($b);

$btnCalc.addEventListener('click', () => bus.emit('ui:calculate'));
$btnClear.addEventListener('click', () => bus.emit('ui:clear'));
$btnHistoryClear.addEventListener('click', () => bus.emit('ui:history:clear'));

// Enter key triggers calculation
[$a, $b, $decimals].forEach((el) => {
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') bus.emit('ui:calculate');
  });
});

bus.on('ui:clear', () => {
  $a.value = '';
  $b.value = '';
  $op.value = '+';
  $decimals.value = '6';
  setInvalid($a, false);
  setInvalid($b, false);
  setResult('—');
  setHint('', false);
});

bus.on('ui:history:clear', () => {
  historyItems = [];
  saveHistory(historyItems);
  renderHistory(historyItems);
  setHint('История очищена', false);
});

bus.on('ui:calculate', async () => {
  setHint('', false);
  setInvalid($a, false);
  setInvalid($b, false);

  const op = $op.value;
  const decimals = Number.parseInt($decimals.value, 10);

  let parsedA; let parsedB;
  try {
    parsedA = parseScalarOrArray($a.value);
  } catch (e) {
    setInvalid($a, true);
    setHint(e.message || 'Ошибка в поле A', true);
    return;
  }
  try {
    parsedB = parseScalarOrArray($b.value);
  } catch (e) {
    setInvalid($b, true);
    setHint(e.message || 'Ошибка в поле B', true);
    return;
  }

  const a = parsedA.kind === 'array' ? parsedA.value : parsedA.value;
  const b = parsedB.kind === 'array' ? parsedB.value : parsedB.value;

  // UX: show batch hint
  const isBatch = Array.isArray(a) || Array.isArray(b);
  if (isBatch) setHint('Режим массивов: вычисляю в фоне…', false);

  try {
    const r = await calculator.calcAny(a, op, b);
    const text = formatAny(r, Number.isFinite(decimals) ? decimals : 6);
    setResult(text);
    setHint(isBatch ? 'Готово (Web Worker / fallback)' : 'Готово', false);

    const expr = `${$a.value.trim()} ${op} ${$b.value.trim()}`;
    historyItems.unshift({ ts: Date.now(), expr, result: text });
    historyItems = historyItems.slice(0, 100);
    saveHistory(historyItems);
    renderHistory(historyItems);
  } catch (e) {
    setResult('—');
    setHint(e.message || 'Ошибка вычисления', true);
  }
});
