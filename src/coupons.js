// FEAT-2: coupon codes at checkout.
import { cartSubtotal } from "./cart.js";

const COUPONS = {
  SAVE10: { percent: 10, expires: "2026-12-31" },
  WELCOME15: { percent: 15, expires: "2026-11-30" },
  SUMMER20: { percent: 20, expires: "2026-08-31" },
};

/**
 * Apply a coupon code to a cart.
 * @param {{ items: object[] }} cart
 * @param {string} code
 * @param {{ id: string, email: string }} customer
 * @param {Date} [today]
 * @returns {{ ok: true, subtotal: number, discount: number, total: number } | { ok: false, reason: "UNKNOWN_COUPON" | "EXPIRED" }}
 */
export function applyCoupon(cart, code, customer, today = new Date()) {
  const coupon = COUPONS[String(code).trim().toUpperCase()];
  if (!coupon) {
    return { ok: false, reason: "UNKNOWN_COUPON" };
  }

  // Valid through the end of the expiry date (AC-3).
  const endOfExpiryDay = new Date(`${coupon.expires}T23:59:59.999Z`);
  if (today > endOfExpiryDay) {
    return { ok: false, reason: "EXPIRED" };
  }

  const subtotal = cartSubtotal(cart.items);
  const discount = Math.round((subtotal * coupon.percent) / 100);
  return { ok: true, subtotal, discount, total: subtotal - discount };
}
