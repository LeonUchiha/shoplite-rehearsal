import { test } from "node:test";
import assert from "node:assert/strict";
import { applyCoupon } from "../src/coupons.js";

const cart = { items: [{ sku: "TEE", unitPriceCents: 2000, qty: 2 }] };
const customer = { id: "c-42", email: "asha@example.com" };
const oct22 = new Date("2026-10-22T10:00:00Z");

test("AC-1 applies a valid percentage coupon", () => {
  const result = applyCoupon(cart, "SAVE10", customer, oct22);
  assert.equal(result.ok, true);
  assert.equal(result.discount, 400);
  assert.equal(result.total, 3600);
});

test("AC-1 rounds the discount to whole cents", () => {
  const odd = { items: [{ sku: "MUG", unitPriceCents: 1999, qty: 1 }] };
  assert.equal(applyCoupon(odd, "WELCOME15", customer, oct22).discount, 300);
});

test("AC-2 codes are case-insensitive and trimmed", () => {
  assert.equal(applyCoupon(cart, "  save10 ", customer, oct22).ok, true);
});

test("AC-3 coupon is valid on its expiry day and expired the day after", () => {
  assert.equal(applyCoupon(cart, "SAVE10", customer, new Date("2026-12-31T22:00:00Z")).ok, true);
  assert.equal(applyCoupon(cart, "SAVE10", customer, new Date("2027-01-01T00:00:01Z")).reason, "EXPIRED");
});

test("AC-3 rejects expired coupons", () => {
  assert.equal(applyCoupon(cart, "SUMMER20", customer, oct22).reason, "EXPIRED");
});

test("AC-5 rejects unknown codes", () => {
  assert.deepEqual(applyCoupon(cart, "NOPE", customer, oct22), { ok: false, reason: "UNKNOWN_COUPON" });
});
