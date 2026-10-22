import { test } from "node:test";
import assert from "node:assert/strict";
import { cartSubtotal } from "../src/cart.js";

test("sums line items in cents", () => {
  const items = [
    { sku: "TEE", unitPriceCents: 1999, qty: 2 },
    { sku: "CAP", unitPriceCents: 1250, qty: 1 },
  ];
  assert.equal(cartSubtotal(items), 5248);
});

test("rejects negative prices", () => {
  assert.throws(() => cartSubtotal([{ sku: "X", unitPriceCents: -1, qty: 1 }]), RangeError);
});

test("rejects zero quantity", () => {
  assert.throws(() => cartSubtotal([{ sku: "X", unitPriceCents: 100, qty: 0 }]), RangeError);
});
