import { test } from "node:test";
import assert from "node:assert/strict";
import { applyCoupon } from "../src/coupons.js";

const cart = { items: [{ sku: "TEE", unitPriceCents: 2000, qty: 2 }] };
const customer = { id: "c-42", email: "asha@example.com" };
const oct22 = new Date("2026-10-22T10:00:00Z");

test("applies a valid percentage coupon", () => {
  const result = applyCoupon(cart, "SAVE10", customer, oct22);
  assert.equal(result.ok, true);
  assert.equal(result.discount, 400);
  assert.equal(result.total, 3600);
});

test("codes are case-insensitive", () => {
  assert.equal(applyCoupon(cart, "save10", customer, oct22).ok, true);
});

test("rejects unknown codes", () => {
  assert.deepEqual(applyCoupon(cart, "NOPE", customer, oct22), { ok: false, reason: "UNKNOWN_COUPON" });
});

test("rejects expired coupons", () => {
  assert.equal(applyCoupon(cart, "SUMMER20", customer, oct22).reason, "EXPIRED");
});
