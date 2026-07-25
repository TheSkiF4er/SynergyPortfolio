// Web Worker for batch computations (arrays).
// Kept separate so heavy loops don't block the UI thread.

/**
 * @param {number} a
 * @param {string} op
 * @param {number} b
 */
function calc(a, op, b) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/':
      if (b === 0) throw new Error('Division by zero');
      return a / b;
    case '^': {
      const r = Math.pow(a, b);
      if (!Number.isFinite(r)) throw new Error('Result is not finite');
      return r;
    }
    case '%': return (a * b) / 100;
    default: throw new Error('Unknown operation');
  }
}

self.onmessage = (e) => {
  const { a, b, op } = e.data;
  try {
    const aIsArr = Array.isArray(a);
    const bIsArr = Array.isArray(b);
    const len = aIsArr ? a.length : b.length;

    if (aIsArr && bIsArr && a.length !== b.length) {
      throw new Error('Arrays must have the same length');
    }

    const out = new Array(len);
    for (let i = 0; i < len; i++) {
      const ai = aIsArr ? a[i] : a;
      const bi = bIsArr ? b[i] : b;
      out[i] = calc(ai, op, bi);
    }

    self.postMessage({ ok: true, result: out });
  } catch (err) {
    self.postMessage({ ok: false, error: String(err && err.message ? err.message : err) });
  }
};
