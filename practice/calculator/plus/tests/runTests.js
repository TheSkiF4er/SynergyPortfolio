import assert from "node:assert/strict";
import { parseNumber } from "../js/parser.js";
import { getOperation } from "../js/operations.js";

function test(name, fn) {
    try {
        fn();
        console.log(`✅ ${name}`);
    } catch (e) {
        console.error(`❌ ${name}`);
        throw e;
    }
}

// ---- parser ----
test("parseNumber: trims spaces", () => {
    const r = parseNumber("  12.5 ");
    assert.equal(r.ok, true);
    assert.equal(r.value, 12.5);
});

test("parseNumber: supports comma decimal", () => {
    const r = parseNumber("12,5");
    assert.equal(r.ok, true);
    assert.equal(r.value, 12.5);
});

test("parseNumber: rejects empty", () => {
    const r = parseNumber("   ");
    assert.equal(r.ok, false);
});

// ---- operations ----
test("sum", () => {
    const op = getOperation("sum");
    assert.ok(op);
    assert.equal(op.handler(2, 3), 5);
});

test("divide by zero throws", () => {
    const op = getOperation("divide");
    assert.ok(op);
    assert.throws(() => op.handler(1, 0), /ноль/i);
});

test("sqrt negative throws", () => {
    const op = getOperation("sqrt");
    assert.ok(op);
    assert.throws(() => op.handler(-1), /отрицательного/i);
});

test("log non-positive throws", () => {
    const op = getOperation("log");
    assert.ok(op);
    assert.throws(() => op.handler(0), /A > 0/);
});

console.log("\nВсе тесты прошли успешно.");
